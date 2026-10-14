
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const roleOptions = [
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Python Developer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Java Developer",
  "Cloud Engineer",
  "DevOps Engineer",
  "Cybersecurity Analyst",
  "Database Administrator",
  "Business Analyst",
  "Software Engineer",
  "Data Engineer",
  "QA Engineer",
  "UI/UX Designer",
];

export default function JobAlertsPage() {
  const [role, setRole] = useState("Data Analyst");
  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState("Daily");
  const [notice, setNotice] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
const [roleLoaded, setRoleLoaded] = useState(false);

useEffect(() => {
  const savedRole = localStorage.getItem("resonanceTargetRole");

  if (savedRole) {
    setPreferredRole(savedRole);
  }

  setRoleLoaded(true);
}, []);

  useEffect(() => {
    setRole(localStorage.getItem("resonanceTargetRole") || "Data Analyst");
    setEnabled(localStorage.getItem("resonanceAlertsEnabled") !== "false");
    setFrequency(localStorage.getItem("resonanceAlertFrequency") || "Daily");
  }, []);

  function savePreferences() {
    localStorage.setItem("resonanceTargetRole", role);
    localStorage.setItem("resonanceAlertsEnabled", String(enabled));
    localStorage.setItem("resonanceAlertFrequency", frequency);
    setNotice("Your notification preferences have been saved in this browser.");
  }

  return (
    <main className="job-alerts">
      <style>{`
        .job-alerts {
          --a-bg: #f3f7f5;
          --a-card: #fff;
          --a-text: #17332f;
          --a-muted: #71847e;
          --a-border: #dce7e2;
          min-height: 100vh;
          padding: 32px 20px 55px;
          box-sizing: border-box;
          background: var(--a-bg);
          color: var(--a-text);
          font-family: Helvetica, Arial, sans-serif;
        }
        html[data-theme="dark"] .job-alerts {
          --a-bg: #0b1e1c;
          --a-card: #142d29;
          --a-text: #edf6f2;
          --a-muted: #b1c5bd;
          --a-border: #29453f;
        }
        .a-wrap { max-width: 900px; margin: auto; }
        .a-back { color: #329888; text-decoration: none; font-size: 13px; }
        .a-kicker { margin-top: 30px; color: #329888; font-size: 11px; font-weight: 800; letter-spacing: 2px; }
        .a-wrap h1 { font-size: clamp(28px, 5vw, 40px); margin: 9px 0; }
        .a-intro { color: var(--a-muted); line-height: 1.7; }
        .a-card { margin-top: 18px; padding: 23px; border: 1px solid var(--a-border); border-radius: 17px; background: var(--a-card); }
        .a-card h2 { margin: 0 0 16px; font-size: 19px; }
        .a-field { display: block; width: 100%; box-sizing: border-box; padding: 12px; margin: 8px 0 19px; border: 1px solid var(--a-border); border-radius: 9px; background: var(--a-card); color: var(--a-text); font: inherit; color-scheme: light dark; }
        .a-label { font-size: 13px; font-weight: 700; }
        .a-toggle { display: flex; align-items: center; gap: 11px; margin: 18px 0; }
        .a-toggle input { accent-color: #329888; width: 18px; height: 18px; }
        .a-button { border: 0; border-radius: 9px; padding: 12px 17px; background: #258d7d; color: white; font-weight: 700; cursor: pointer; }
        .a-notice { color: #329888; font-size: 13px; }
        .a-item { padding: 15px 0; border-bottom: 1px solid var(--a-border); }
        .a-item:last-child { border-bottom: 0; }
        .a-item h3 { margin: 0 0 7px; font-size: 15px; }
        .a-item p { margin: 0; color: var(--a-muted); font-size: 13px; line-height: 1.7; }
        .a-link { display: inline-block; margin-top: 16px; color: #329888; font-size: 13px; font-weight: 700; text-decoration: none; }
      `}</style>

      <div className="a-wrap">
        <Link className="a-back" href="/dashboard">← Back to Overview</Link>
        <p className="a-kicker">CAREER OPPORTUNITIES</p>
        <h1>Job Notifications</h1>
        <p className="a-intro">
          Choose a target role and configure your preferred alert settings.
        </p>

        <section className="a-card">
          <h2>Notification preferences</h2>

          <label className="a-label" htmlFor="alert-role">Target job role</label>
          <select
            id="alert-role"
            className="a-field"
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setNotice("");
            }}
          >
            {roleOptions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <label className="a-label" htmlFor="alert-frequency">Preferred frequency</label>
          <select
            id="alert-frequency"
            className="a-field"
            value={frequency}
            onChange={(event) => setFrequency(event.target.value)}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </select>

          <label className="a-toggle">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
            />
            <span>Enable job alert preferences</span>
          </label>

          <button className="a-button" type="button" onClick={savePreferences}>
            Save preferences
          </button>

          {notice && <p className="a-notice" role="status">{notice}</p>}
        </section>

        <section className="a-card">
          <h2>{enabled ? `Opportunities for ${role}` : "Alerts are paused"}</h2>
          {enabled ? (
            <>
              <div className="a-item">
                <h3>{role} — Search matching listings</h3>
                <p>
                  Browse the site's IT job listings and look for roles that
                  match your selected career direction.
                </p>
              </div>
              <div className="a-item">
                <h3>Prepare for your target role</h3>
                <p>
                  Review the role-specific skills and project ideas in your
                  learning resources before applying.
                </p>
              </div>
              <Link className="a-link" href="/jobs">Browse IT Jobs ↗</Link>
            </>
          ) : (
            <p className="a-intro">
              Your saved alert preference is paused. Re-enable it whenever
              you want to resume using this page.
            </p>
          )}
          <p className="a-intro" style={{ fontSize: 12, marginTop: 18 }}>
            These are in-app prompts, not live vacancy notifications. No email
            or push alerts are sent by this demo.
          </p>
        </section>
      </div>
    </main>
  );
}
