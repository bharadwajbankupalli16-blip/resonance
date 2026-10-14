
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

const roles = [
  "All roles",
  "Software Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Python Developer",
  "Java Developer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Data Engineer",
  "Business Analyst",
  "Cloud Engineer",
  "DevOps Engineer",
  "Cybersecurity Analyst",
  "QA Engineer",
  "UI/UX Designer",
  "Mobile App Developer",
  "Database Administrator",
  "Network Engineer",
  "Generative AI Engineer",
  "NLP Engineer",
  "Computer Vision Engineer",
  "Site Reliability Engineer",
  "React Developer",
  "Node.js Developer",
  "JavaScript Developer",
  "Android Developer",
  "iOS Developer",
  "Software Test Engineer",
];

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid var(--jobs-border)",
  borderRadius: "12px",
  background: "var(--jobs-input)",
  color: "var(--jobs-text)",
  fontSize: "14px",
  outline: "none",
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer",
};

function normalizeJob(job, index) {
  const title =
    job.job_title ||
    job.title ||
    job.position ||
    job.role ||
    "Job title not provided";

  const company =
    job.company ||
    job.company_name ||
    job.employer ||
    "Company not specified";

  const location =
    job.location ||
    job.job_location ||
    job.city ||
    "Location not specified";

  const experience =
    job.experience ||
    job.experience_required ||
    job.experience_level ||
    "Not specified";

  const type =
    job.job_type ||
    job.employment_type ||
    job.type ||
    "Not specified";

  const description =
    job.job_description ||
    job.description ||
    job.about_job ||
    "";

  const skillsText =
    job.education_and_skills ||
    job.skills ||
    job.required_skills ||
    "";

  const skills = Array.isArray(skillsText)
    ? skillsText
    : String(skillsText)
        .split(/[,;\nâ€¢]/)
        .map((skill) => skill.trim())
        .filter(Boolean)
        .slice(0, 6);

  return {
    id: job.id ?? job.job_id ?? job.jobId ?? index,
    title,
    company,
    location,
    experience,
    type,
    description,
    skills,
    postedDate: job.posted_date || job.posted_at || job.created_at || "",
    applyLink:
      job.apply_link ||
      job.application_url ||
      job.url ||
      job.job_url ||
      "",
  };
}

function formatDate(dateString) {
  if (!dateString) return "Date not provided";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Date not provided";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function locationMatches(jobLocation, selectedLocation) {
  if (selectedLocation === "All locations") return true;

  const job = jobLocation.toLowerCase();
  const selected = selectedLocation.toLowerCase();

  if (selected === "bengaluru") {
    return job.includes("bengaluru") || job.includes("bangalore");
  }

  if (selected === "delhi ncr") {
    return (
      job.includes("delhi") ||
      job.includes("gurugram") ||
      job.includes("gurgaon") ||
      job.includes("noida")
    );
  }

  if (selected === "remote") {
    return job.includes("remote");
  }

  return job.includes(selected);
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");
  const [experience, setExperience] = useState("All experience");
  const [workMode, setWorkMode] = useState("All work modes");
  const [jobType, setJobType] = useState("All job types");
  const [preferredRole, setPreferredRole] = useState("All roles");
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/jobs?limit=10", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            `Unable to load jobs (HTTP ${response.status}).`
        );
      }

      const rawJobs = Array.isArray(data)
        ? data
        : Array.isArray(data.jobs)
          ? data.jobs
          : Array.isArray(data.data)
            ? data.data
            : [];

      setJobs(rawJobs.map(normalizeJob));
    } catch (err) {
      console.error("Loading jobs failed:", err);
      setError(err.message || "Unable to load jobs. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();

    setPreferredRole("All roles");
  }, [loadJobs]);

  const availableLocations = useMemo(() => {
    const values = jobs
      .map((job) => job.location)
      .filter((value) => value && value !== "Location not specified");

    return [...new Set(values)].sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchable = [
        job.title,
        job.company,
        job.location,
        job.experience,
        job.type,
        job.description,
        ...job.skills,
      ]
        .join(" ")
        .toLowerCase();

      const roleMatches =
        preferredRole === "All roles" ||
        job.title.toLowerCase().includes(preferredRole.toLowerCase()) ||
        searchable.includes(preferredRole.toLowerCase());

      const experienceMatches =
        experience === "All experience" ||
        job.experience.toLowerCase().includes(experience.toLowerCase()) ||
        (experience === "Fresher" &&
          /fresher|entry.?level|0\s*[-â€“to]*\s*2\s*years?/i.test(
            job.experience
          ));

      const modeMatches =
        workMode === "All work modes" ||
        job.location.toLowerCase().includes(workMode.toLowerCase()) ||
        searchable.includes(workMode.toLowerCase());

      const typeMatches =
        jobType === "All job types" ||
        job.type.toLowerCase().includes(jobType.toLowerCase());

      return (
        (!term || searchable.includes(term)) &&
        roleMatches &&
        locationMatches(job.location, location) &&
        experienceMatches &&
        modeMatches &&
        typeMatches
      );
    });
  }, [jobs, search, preferredRole, location, experience, workMode, jobType]);

  function resetFilters() {
    setSearch("");
    setPreferredRole("All roles");
    setLocation("All locations");
    setExperience("All experience");
    setWorkMode("All work modes");
    setJobType("All job types");
    setVisibleCount(12);
  }

  return (
    <main
      className="jobs-page"
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--foreground)",
        padding: "28px 20px 60px",
      }}
    >
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "32px",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              color: "inherit",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: "23px",
              letterSpacing: "-1px",
            }}
          >
            RESONANCE<span style={{ color: "#ef795f" }}>.</span>
          </Link>

          <Link
            href="/dashboard"
            style={{
              color: "inherit",
              textDecoration: "none",
              border: "1px solid var(--jobs-border)",
              padding: "10px 16px",
              borderRadius: "12px",
              fontSize: "14px",
            }}
          >
            Back to dashboard
          </Link>
        </header>

        <section
          style={{
            padding: "clamp(24px, 5vw, 52px)",
            borderRadius: "24px",
            background:
              "linear-gradient(125deg, #153e43 0%, #246963 60%, #438779 100%)",
            color: "#fff",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "2px",
              fontWeight: 700,
              marginBottom: "14px",
              color: "#b8e6d9",
            }}
          >
            YOUR NEXT OPPORTUNITY
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 48px)",
              letterSpacing: "-1.8px",
              lineHeight: 1.12,
              margin: "0 0 14px",
            }}
          >
            Find your next
            <br />
            <span style={{ color: "#ffc2a9" }}>IT opportunity.</span>
          </h1>

          <p
            style={{
              maxWidth: "570px",
              lineHeight: 1.7,
              color: "#e0efec",
              margin: 0,
            }}
          >
            Discover job opportunities from our connected jobs provider.
            Search by role, skills, company, and location.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
            <div style={{ background: "#ffffff18", padding: "12px 16px", borderRadius: "12px" }}>
              <strong style={{ fontSize: "23px" }}>
                {loading ? "â€¦" : jobs.length}
              </strong>
              <div style={{ fontSize: "12px", color: "#d8eae6" }}>
                Jobs loaded
              </div>
            </div>

            <div style={{ background: "#ffffff18", padding: "12px 16px", borderRadius: "12px" }}>
              <strong style={{ fontSize: "23px" }}>
                {loading ? "â€¦" : availableLocations.length}
              </strong>
              <div style={{ fontSize: "12px", color: "#d8eae6" }}>
                Locations
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            background: "var(--jobs-card)",
            border: "1px solid var(--jobs-border)",
            borderRadius: "20px",
            padding: "22px",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", margin: "0 0 18px" }}>
            Search IT jobs
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
              gap: "12px",
            }}
          >
            <select
              style={selectStyle}
              value={preferredRole}
              onChange={(e) => {
                setPreferredRole(e.target.value);
                setVisibleCount(12);
              }}
              aria-label="Filter by target job role"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <input
              style={inputStyle}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(12);
              }}
              placeholder="Search role, skill or company..."
              aria-label="Search jobs"
            />

            <select
              style={selectStyle}
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setVisibleCount(12);
              }}
              aria-label="Filter by location"
            >
              <option>All locations</option>
              {availableLocations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              {!availableLocations.some((item) =>
                item.toLowerCase().includes("remote")
              ) && <option>Remote</option>}
            </select>

            <select
              style={selectStyle}
              value={experience}
              onChange={(e) => {
                setExperience(e.target.value);
                setVisibleCount(12);
              }}
              aria-label="Filter by experience"
            >
              <option>All experience</option>
              <option>Fresher</option>
              <option>0â€“2 years</option>
              <option>1â€“3 years</option>
              <option>3â€“5 years</option>
            </select>

            <select
              style={selectStyle}
              value={workMode}
              onChange={(e) => {
                setWorkMode(e.target.value);
                setVisibleCount(12);
              }}
              aria-label="Filter by work mode"
            >
              <option>All work modes</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>

            <select
              style={selectStyle}
              value={jobType}
              onChange={(e) => {
                setJobType(e.target.value);
                setVisibleCount(12);
              }}
              aria-label="Filter by employment type"
            >
              <option>All job types</option>
              <option>Full Time</option>
              <option>Full-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>

            <button
              onClick={resetFilters}
              style={{
                border: "1px solid var(--jobs-border)",
                borderRadius: "12px",
                background: "transparent",
                color: "inherit",
                padding: "12px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Reset filters
            </button>

            <button
              onClick={loadJobs}
              disabled={loading}
              style={{
                border: 0,
                borderRadius: "12px",
                background: "#246963",
                color: "#fff",
                padding: "12px",
                cursor: loading ? "wait" : "pointer",
                fontWeight: 600,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Loadingâ€¦" : "Refresh jobs"}
            </button>
          </div>
        </section>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 5px", fontSize: "24px" }}>
              Explore opportunities
            </h2>
            <p style={{ margin: 0, color: "var(--jobs-muted)", fontSize: "14px" }}>
              {loading
                ? "Fetching jobsâ€¦"
                : `${filteredJobs.length} job${filteredJobs.length === 1 ? "" : "s"} match your filters`}
            </p>
          </div>
        </div>

        {loading && (
          <div
            role="status"
            style={{
              padding: "35px 20px",
              textAlign: "center",
              background: "var(--jobs-card)",
              border: "1px solid var(--jobs-border)",
              borderRadius: "18px",
            }}
          >
            Loading job opportunitiesâ€¦
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            style={{
              padding: "24px",
              background: "var(--jobs-card)",
              border: "1px solid var(--jobs-border)",
              borderRadius: "18px",
              marginBottom: "20px",
            }}
          >
            <h3>Unable to load jobs</h3>
            <p style={{ color: "var(--jobs-muted)" }}>{error}</p>
            <button
              onClick={loadJobs}
              style={{
                padding: "11px 18px",
                border: 0,
                borderRadius: "10px",
                background: "#246963",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
              gap: "16px",
            }}
          >
            {filteredJobs.slice(0, visibleCount).map((job) => (
              <article
                key={`${job.id}-${job.title}-${job.company}`}
                style={{
                  background: "var(--jobs-card)",
                  border: "1px solid var(--jobs-border)",
                  borderRadius: "18px",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  minWidth: 0,
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      flexShrink: 0,
                      borderRadius: "14px",
                      background: "#e4f2ed",
                      color: "#21685c",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: "20px",
                    }}
                  >
                    {job.company.charAt(0).toUpperCase()}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: "0 0 5px", fontSize: "17px" }}>
                      {job.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--jobs-muted)" }}>
                      {job.company}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  {[job.location, job.experience, job.type]
                    .filter(Boolean)
                    .map((tag, index) => (
                      <span
                        key={`${job.id}-${tag}-${index}`}
                        style={{
                          fontSize: "11px",
                          padding: "6px 9px",
                          borderRadius: "8px",
                          background: "#edf4f2",
                          color: "#315f58",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                {job.description && (
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.7,
                      color: "var(--jobs-muted)",
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {job.description}
                  </p>
                )}

                {job.skills.length > 0 && (
                  <div>
                    <p
                      style={{
                        margin: "0 0 8px",
                        fontSize: "12px",
                        color: "var(--jobs-muted)",
                      }}
                    >
                      Skills and requirements
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                      {job.skills.map((skill, index) => (
                        <span
                          key={`${job.id}-skill-${index}`}
                          style={{
                            fontSize: "12px",
                            border: "1px solid var(--jobs-border)",
                            borderRadius: "7px",
                            padding: "5px 8px",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--jobs-border)",
                    color: "var(--jobs-muted)",
                    fontSize: "12px",
                  }}
                >
                  Posted: {formatDate(job.postedDate)}
                </div>

                {job.applyLink && /^https?:\/\//i.test(job.applyLink) ? (
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "12px 16px",
                      background: "#246963",
                      color: "#fff",
                      borderRadius: "11px",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: "14px",
                    }}
                  >
                    View and apply
                  </a>
                ) : (
                  <div
                    style={{
                      padding: "11px",
                      borderRadius: "10px",
                      border: "1px solid var(--jobs-border)",
                      textAlign: "center",
                      fontSize: "13px",
                      color: "var(--jobs-muted)",
                    }}
                  >
                    Application link unavailable
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
              background: "var(--jobs-card)",
              borderRadius: "18px",
              marginTop: "16px",
            }}
          >
            <h3>No matching jobs found</h3>
            <p style={{ color: "var(--jobs-muted)" }}>
              Try another search term or reset your filters.
            </p>
            <button
              onClick={resetFilters}
              style={{ ...selectStyle, width: "auto" }}
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && !error && filteredJobs.length > visibleCount && (
          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <button
              onClick={() => setVisibleCount((count) => count + 12)}
              style={{
                padding: "13px 24px",
                border: 0,
                borderRadius: "12px",
                background: "#246963",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Load more jobs
            </button>
          </div>
        )}

        <footer
          style={{
            textAlign: "center",
            marginTop: "45px",
            color: "var(--jobs-muted)",
            fontSize: "12px",
          }}
        >
          RESONANCE Â· Career discovery workspace Â· Job listings provided by an external service
        </footer>
      </div>
    </main>
  );
}



