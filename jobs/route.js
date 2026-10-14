
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const roles = [
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

const locations = [
  "Hyderabad",
  "Bengaluru",
  "Chennai",
  "Pune",
  "Mumbai",
  "Delhi NCR",
  "Noida",
  "Remote",
];

const companies = [
  "Demo Employer 01",
  "Demo Employer 02",
  "Demo Employer 03",
  "Demo Employer 04",
  "Demo Employer 05",
  "Demo Employer 06",
  "Demo Employer 07",
  "Demo Employer 08",
  "Demo Employer 09",
  "Demo Employer 10",
];

const experiences = ["Fresher", "0–2 years", "1–3 years", "3–5 years"];
const workModes = ["On-site", "Hybrid", "Remote"];
const employmentTypes = ["Full-time", "Internship", "Contract"];

const demoJobs = Array.from({ length: 120 }, (_, i) => ({
  id: i + 1,
  title: roles[i % roles.length],
  company: companies[Math.floor(i / roles.length) % companies.length],
  location: locations[i % locations.length],
  experience: experiences[i % experiences.length],
  workMode: workModes[i % workModes.length],
  type: employmentTypes[i % employmentTypes.length],
  skills: [
    ["Python", "SQL"],
    ["JavaScript", "React"],
    ["Java", "Spring Boot"],
    ["Python", "Machine Learning"],
    ["AWS", "Docker"],
    ["SQL", "Excel"],
    ["Git", "REST APIs"],
    ["Linux", "Networking"],
  ][i % 8],
}));

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

const selectStyle = { ...inputStyle, cursor: "pointer" };

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");
  const [experience, setExperience] = useState("All experience");
  const [workMode, setWorkMode] = useState("All work modes");
  const [jobType, setJobType] = useState("All job types");
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return demoJobs.filter((job) => {
      const searchable = [
        job.title,
        job.company,
        job.location,
        ...job.skills,
      ].join(" ").toLowerCase();

      return (
        (!term || searchable.includes(term)) &&
        (location === "All locations" || job.location === location) &&
        (experience === "All experience" ||
          job.experience === experience) &&
        (workMode === "All work modes" ||
          job.workMode === workMode) &&
        (jobType === "All job types" || job.type === jobType)
      );
    });
  }, [search, location, experience, workMode, jobType]);

  function resetFilters() {
    setSearch("");
    setLocation("All locations");
    setExperience("All experience");
    setWorkMode("All work modes");
    setJobType("All job types");
    setVisibleCount(12);
  }

  return (
    <main
      style={{
        "--jobs-bg": "var(--background, #f5f7f8)",
        "--jobs-card": "var(--card, #ffffff)",
        "--jobs-text": "var(--foreground, #172b35)",
        "--jobs-muted": "#71818a",
        "--jobs-border": "#dfe7e9",
        "--jobs-input": "var(--background, #ffffff)",
        minHeight: "100vh",
        background: "var(--jobs-bg)",
        color: "var(--jobs-text)",
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
            ← Back to dashboard
          </Link>
        </header>

        <section
          style={{
            padding: "clamp(24px, 5vw, 52px)",
            borderRadius: "24px",
            background:
              "linear-gradient(125deg, #153e43 0%, #246963 60%, #438779 100%)",
            color: "#ffffff",
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
            Explore software, data, AI, cloud, cybersecurity, and other
            technology career paths.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "24px",
            }}
          >
            <div
              style={{
                background: "#ffffff18",
                padding: "12px 16px",
                borderRadius: "12px",
              }}
            >
              <strong style={{ fontSize: "23px" }}>120</strong>
              <div style={{ fontSize: "12px", color: "#d8eae6" }}>
                Demo listings
              </div>
            </div>

            <div
              style={{
                background: "#ffffff18",
                padding: "12px 16px",
                borderRadius: "12px",
              }}
            >
              <strong style={{ fontSize: "23px" }}>30</strong>
              <div style={{ fontSize: "12px", color: "#d8eae6" }}>
                IT role types
              </div>
            </div>
          </div>
        </section>

        <div
          style={{
            background: "#fff5e9",
            border: "1px solid #f3d9b9",
            color: "#79532a",
            borderRadius: "12px",
            padding: "13px 16px",
            fontSize: "13px",
            lineHeight: 1.6,
            marginBottom: "24px",
          }}
        >
          <strong>Demo data:</strong> These listings are generated examples
          for testing the page and filters. Employers and vacancies are not
          verified, and these are not live job openings. We will connect
          verified job sources separately.
        </div>

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
              {locations.map((item) => (
                <option key={item}>{item}</option>
              ))}
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
              {experiences.map((item) => (
                <option key={item}>{item}</option>
              ))}
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
              {workModes.map((item) => (
                <option key={item}>{item}</option>
              ))}
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
              {employmentTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
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
              {filteredJobs.length} demo listing
              {filteredJobs.length === 1 ? "" : "s"} match your filters
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "16px",
          }}
        >
          {filteredJobs.slice(0, visibleCount).map((job) => (
            <article
              key={job.id}
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
                  {job.title.charAt(0)}
                </div>

                <div style={{ minWidth: 0 }}>
                  <h3 style={{ margin: "0 0 5px", fontSize: "17px" }}>
                    {job.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "var(--jobs-muted)",
                    }}
                  >
                    {job.company}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {[job.location, job.experience, job.workMode, job.type].map(
                  (tag) => (
                    <span
                      key={tag}
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
                  )
                )}
              </div>

              <div>
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "12px",
                    color: "var(--jobs-muted)",
                  }}
                >
                  Example skills
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
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

              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "12px",
                  borderTop: "1px solid var(--jobs-border)",
                  color: "var(--jobs-muted)",
                  fontSize: "12px",
                }}
              >
                Demo listing #{job.id} · Not a verified vacancy
              </div>
            </article>
          ))}
        </div>

        {filteredJobs.length === 0 && (
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
            <button onClick={resetFilters} style={{ ...selectStyle, width: "auto" }}>
              Clear filters
            </button>
          </div>
        )}

        {filteredJobs.length > visibleCount && (
          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <button
              onClick={() => setVisibleCount((count) => count + 12)}
              style={{
                padding: "13px 24px",
                border: 0,
                borderRadius: "12px",
                background: "#246963",
                color: "#ffffff",
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
          RESONANCE · Career discovery workspace
        </footer>
      </div>
    </main>
  );
}
