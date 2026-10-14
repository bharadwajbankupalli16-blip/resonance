
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "resonanceApplications";

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Interested");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
      setApplications(Array.isArray(saved) ? saved : []);
    } catch {
      setApplications([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(applications)
      );
    }
  }, [applications, loaded]);

  function addApplication(e) {
    e.preventDefault();

    if (!company.trim() || !role.trim()) return;

    setApplications((prev) => [
      {
        id: crypto.randomUUID(),
        company: company.trim(),
        role: role.trim(),
        status,
        date: new Date().toLocaleDateString(),
      },
      ...prev,
    ]);

    setCompany("");
    setRole("");
    setStatus("Interested");
  }

  function updateStatus(id, nextStatus) {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: nextStatus }
          : app
      )
    );
  }

  function deleteApplication(id) {
    setApplications((prev) =>
      prev.filter((app) => app.id !== id)
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "11px",
    borderRadius: 10,
    border: "1px solid var(--dash-border, #bbb)",
    background: "var(--dash-surface, transparent)",
    color: "var(--dash-text, inherit)",
    font: "inherit",
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <form
        onSubmit={addApplication}
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        <input
          placeholder="Company name"
          aria-label="Company name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          placeholder="Job role"
          aria-label="Job role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          <option>Interested</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "11px 18px",
            background: "#0d9488",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          + Add Application
        </button>
      </form>

      <p style={{ margin: 0, opacity: 0.75 }}>
        Total applications: {applications.length}
      </p>

      {applications.length === 0 ? (
        <p style={{ opacity: 0.7 }}>
          No applications yet. Add your first job above.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                padding: 16,
                border: "1px solid var(--dash-border, #bbb)",
                borderRadius: 12,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div>
                <strong>{app.role}</strong>
                <div>{app.company}</div>
                <small style={{ opacity: 0.7 }}>
                  Added: {app.date}
                </small>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <select
                  value={app.status}
                  aria-label={`Status for ${app.role}`}
                  onChange={(e) =>
                    updateStatus(app.id, e.target.value)
                  }
                  style={inputStyle}
                >
                  <option>Interested</option>
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>

                <button
                  type="button"
                  onClick={() => deleteApplication(app.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #ef4444",
                    background: "transparent",
                    color: "#ef4444",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
