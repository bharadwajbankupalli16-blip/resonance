
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "resonanceApplications";

const STATUSES = [
  "Interested",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Interested");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  
useEffect(() => {
  let cancelled = false;

  async function loadApplications() {
    try {
      let response = await fetch("/api/applications", {
        cache: "no-store",
      });

      let data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load applications.");
      }

      let records = Array.isArray(data.applications)
        ? data.applications
        : [];

      // Import existing browser records only when the database is empty.
      if (records.length === 0) {
        let saved = [];

        try {
          saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch {
          saved = [];
        }

        if (Array.isArray(saved) && saved.length > 0) {
          for (const item of saved) {
            if (
              typeof item.company !== "string" ||
              !item.company.trim() ||
              typeof item.role !== "string" ||
              !item.role.trim()
            ) {
              continue;
            }

            const payload = {
              company: item.company.trim(),
              role: item.role.trim(),
              location:
                typeof item.location === "string" ? item.location : "",
              status: STATUSES.includes(item.status)
                ? item.status
                : "Interested",
              date:
                typeof item.date === "string" &&
                /^\d{4}-\d{2}-\d{2}$/.test(item.date)
                  ? item.date
                  : undefined,
            };

            const importResponse = await fetch("/api/applications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (!importResponse.ok) {
              const errorData = await importResponse.json();
              throw new Error(
                errorData.error || "Unable to import saved applications."
              );
            }
          }

          response = await fetch("/api/applications", {
            cache: "no-store",
          });

          data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Unable to reload applications.");
          }

          records = Array.isArray(data.applications)
            ? data.applications
            : [];
        }
      }

      if (!cancelled) {
        setApplications(
          records.map((item) => ({
            ...item,
            id: String(item.id),
            date: String(item.date || "").slice(0, 10),
          }))
        );
      }
    } catch (error) {
      if (!cancelled) {
        setMessage(error.message || "Unable to load applications.");
      }
    } finally {
      if (!cancelled) setLoaded(true);
    }
  }

  loadApplications();

  return () => {
    cancelled = true;
  };
}, []);

  [applications, loaded];

    

async function addApplication(e) {
  e.preventDefault();

  if (!company.trim() || !role.trim()) {
    setMessage("Enter a company name and job role.");
    return;
  }

  try {
    setMessage("Saving application...");

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: company.trim(),
        role: role.trim(),
        location: location.trim(),
        status,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to save the application."
      );
    }

    const savedApplication = {
      ...data.application,
      id: String(data.application.id),
      date: String(data.application.date).slice(0, 10),
    };

    setApplications((previous) => [
      savedApplication,
      ...previous,
    ]);

    setCompany("");
    setRole("");
    setLocation("");
    setStatus("Interested");
    setShowForm(false);
    setMessage("Application saved successfully to PostgreSQL.");
  } catch (error) {
    setMessage(
      error.message || "Unable to save the application."
    );
  }
}


async function updateStatus(id, nextStatus) {
  try {
    setMessage("Updating application status...");

    const response = await fetch("/api/applications", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        status: nextStatus,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to update application status."
      );
    }

    setApplications((previous) =>
      previous.map((app) =>
        String(app.id) === String(id)
          ? {
              ...app,
              status: data.application.status,
            }
          : app
      )
    );

    setMessage("Application status saved successfully.");
  } catch (error) {
    setMessage(
      error.message || "Unable to update application status."
    );
  }
}

        

      
async function deleteApplication(id) {
  if (!window.confirm("Delete this application?")) return;

  try {
    setMessage("Deleting application...");

    const response = await fetch(
      `/api/applications?id=${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to delete application."
      );
    }

    setApplications((previous) =>
      previous.filter(
        (app) => String(app.id) !== String(id)
      )
    );

    setMessage("Application deleted successfully.");
  } catch (error) {
    setMessage(
      error.message || "Unable to delete application."
    );
  }
}




  const filteredApplications = useMemo(() => {
    const term = search.trim().toLowerCase();
  

    return applications.filter((app) => {
      const matchesStatus =
        filter === "All" || app.status === filter;

      const matchesSearch =
        !term ||
        app.company.toLowerCase().includes(term) ||
        app.role.toLowerCase().includes(term) ||
        (app.location || "").toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [applications, filter, search]);

  const countFor = (value) =>
    value === "All"
      ? applications.length
      : applications.filter((app) => app.status === value).length;

  const styles = {
    input: {
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      padding: "12px 13px",
      border: "1px solid var(--app-border)",
      borderRadius: 10,
      background: "var(--app-bg)",
      color: "var(--app-text)",
      font: "inherit",
    },
    button: {
      padding: "12px 16px",
      border: 0,
      borderRadius: 10,
      background: "#258f80",
      color: "#fff",
      fontWeight: 700,
      cursor: "pointer",
    },
  };

  if (!loaded) {
    return (
      <main style={{ padding: 30, color: "#edf6f2" }}>
        Loading your applications...
      </main>
    );
  }

  return (
    <main className="applications-page">
      <style>{`
        .applications-page {
          --app-bg: #f4f8f6;
          --app-panel: #ffffff;
          --app-text: #17312f;
          --app-muted: #728582;
          --app-border: #dce8e3;
          --app-coral: #ff897b;
          min-height: 100vh;
          box-sizing: border-box;
          padding: clamp(20px, 4vw, 48px);
          background: var(--app-bg);
          color: var(--app-text);
          font-family: Helvetica, Arial, sans-serif;
        }

        html[data-theme="dark"] .applications-page {
          --app-bg: #0b1e1c;
          --app-panel: #142d29;
          --app-text: #edf6f2;
          --app-muted: #aec2bb;
          --app-border: #29453f;
          --app-coral: #ff9788;
        }

        .app-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 28px;
        }

        .app-eyebrow {
          margin: 0 0 9px;
          color: #329888;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .app-header h1 {
          margin: 0;
          font-size: clamp(28px, 4vw, 38px);
          letter-spacing: -1px;
        }

        .app-back {
          color: var(--app-text);
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }

        .app-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 25px;
        }

        .app-stat, .app-panel {
          min-width: 0;
          padding: 20px;
          border: 1px solid var(--app-border);
          border-radius: 18px;
          background: var(--app-panel);
        }

        .app-stat span {
          display: block;
          color: var(--app-muted);
          font-size: 13px;
        }

        .app-stat strong {
          display: block;
          margin-top: 10px;
          font-size: 28px;
        }

        .app-panel {
          margin-bottom: 20px;
        }

        .app-panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 18px;
        }

        .app-panel-heading h2 {
          margin: 0;
          font-size: 19px;
        }

        .app-filters {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .app-filter {
          padding: 9px 12px;
          border: 1px solid var(--app-border);
          border-radius: 9px;
          background: transparent;
          color: var(--app-text);
          cursor: pointer;
          font: inherit;
          font-size: 12px;
        }

        .app-filter.selected {
          background: #21453f;
          color: white;
          border-color: #21453f;
        }

        .app-list {
          display: grid;
          gap: 12px;
        }

        .app-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 15px;
          padding: 16px;
          border: 1px solid var(--app-border);
          border-radius: 13px;
        }

        .app-row h3 {
          margin: 0 0 6px;
          font-size: 16px;
          overflow-wrap: anywhere;
        }

        .app-row p {
          margin: 0 0 7px;
          color: var(--app-muted);
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .app-row small {
          color: var(--app-muted);
        }

        .app-row-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 9px;
          flex-wrap: wrap;
        }

        .app-status {
          max-width: 160px;
          padding: 10px;
          border: 1px solid var(--app-border);
          border-radius: 9px;
          background: var(--app-bg);
          color: var(--app-text);
          font: inherit;
          font-size: 12px;
        }

        .app-delete {
          padding: 9px 11px;
          border: 1px solid #e87870;
          border-radius: 9px;
          background: transparent;
          color: #e87870;
          cursor: pointer;
        }

        .app-empty {
          padding: 32px 15px;
          text-align: center;
          color: var(--app-muted);
          line-height: 1.8;
        }

        @media (max-width: 760px) {
          .app-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .app-row {
            grid-template-columns: 1fr;
          }

          .app-row-actions {
            justify-content: flex-start;
          }

          .app-status {
            max-width: none;
          }
        }
      `}</style>

      <header className="app-header">
        <div>
          <p className="app-eyebrow">RESONANCE WORKSPACE</p>
          <h1>Application Tracker</h1>
          <p style={{ color: "var(--app-muted)", lineHeight: 1.6 }}>
            Organize your job search and follow every opportunity.
          </p>
        </div>

        <Link className="app-back" href="/dashboard">
          ← Back to dashboard
        </Link>
      </header>

      <section className="app-stats">
        {[
          { label: "Total applications", value: countFor("All") },
          { label: "Applied", value: countFor("Applied") },
          { label: "Interviews", value: countFor("Interview") },
          { label: "Offers", value: countFor("Offer") },
        ].map((stat) => (
          <div className="app-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </section>

      <section className="app-panel">
        <div className="app-panel-heading">
          <h2>Your applications</h2>
          <button
            style={styles.button}
            type="button"
            onClick={() => {
              setShowForm((value) => !value);
              setMessage("");
            }}
          >
            {showForm ? "Cancel" : "+ Add application"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={addApplication}
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 12,
              marginBottom: 22,
            }}
          >
            <input
              style={styles.input}
              placeholder="Company name *"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            <input
              style={styles.input}
              placeholder="Job role *"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />

            <input
              style={styles.input}
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <select
              style={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <button style={styles.button} type="submit">
              Save application
            </button>
          </form>
        )}

        {message && (
          <p role="status" style={{ color: "#329888", fontSize: 13 }}>
            {message}
          </p>
        )}

        <input
          style={{ ...styles.input, marginBottom: 16 }}
          placeholder="Search by company, role, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search applications"
        />

        <div className="app-filters">
          {["All", ...STATUSES].map((item) => (
            <button
              type="button"
              key={item}
              className={`app-filter ${filter === item ? "selected" : ""}`}
              onClick={() => setFilter(item)}
            >
              {item} ({countFor(item)})
            </button>
          ))}
        </div>

        {filteredApplications.length === 0 ? (
          <div className="app-empty">
            <div style={{ fontSize: 35, marginBottom: 10 }}>▤</div>
            <strong>
              {applications.length === 0
                ? "Your tracker is ready."
                : "No matching applications found."}
            </strong>
            <div>
              {applications.length === 0
                ? "Select “Add application” to record your first opportunity."
                : "Try another search term or status filter."}
            </div>
          </div>
        ) : (
          <div className="app-list">
            {filteredApplications.map((app) => (
              <article className="app-row" key={app.id}>
                <div>
                  <h3>{app.role}</h3>
                  <p>
                    {app.company}
                    {app.location ? ` · ${app.location}` : ""}
                  </p>
                  <small>
                    Added on {app.date}
                  </small>
                </div>

                <div className="app-row-actions">
                  <select
                    className="app-status"
                    aria-label={`Status for ${app.role} at ${app.company}`}
                    value={app.status}
                    onChange={(e) =>
                      updateStatus(app.id, e.target.value)
                    }
                  >
                    {STATUSES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <button
                    className="app-delete"
                    type="button"
                    onClick={() => deleteApplication(app.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
