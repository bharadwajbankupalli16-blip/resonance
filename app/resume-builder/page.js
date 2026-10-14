
"use client";

import { useState } from "react";
import Link from "next/link";


const defaultSectionOrder = [
  "summary",
  "skills",
  "experience",
  "education",
  "projects",
];

const sectionLabels = {
  summary: "Professional Summary",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
};


const initial = {
  name: "",
  email: "",
  phone: "",
  location: "",
  role: "",
  summary: "",
  skills: "",
  education: "",
  experience: "",
  projects: "",
};

const fieldStyle = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid var(--border, #dce5e2)",
  borderRadius: "10px",
  background: "var(--background, #fff)",
  color: "var(--foreground, #183b35)",
  font: "inherit",
  boxSizing: "border-box",
};

export default function ResumeBuilderPage() {
  const [data, setData] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [template, setTemplate] = useState("classic");
  
const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);
const [draggedSection, setDraggedSection] = useState(null);

  

  function update(field, value) {
    setData((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function loadExample() {
    setData({
      name: "Alex Morgan",
      email: "alex@example.com",
      phone: "+91 90000 00000",
      location: "Hyderabad, India",
      role: "Junior Data Analyst",
      summary:
        "Aspiring data analyst with a foundation in Python, SQL, Excel, and data visualization. Interested in turning data into clear, actionable insights.",
      skills: "Python, SQL, Excel, Power BI, Pandas, Data Visualization",
      education:
        "B.Sc. / B.Tech — Your University\nGraduation year: 2026",
      experience:
        "Academic Project — Data Analysis\nCleaned and analyzed a sample dataset and presented key findings using visualizations.",
      projects:
        "Sales Dashboard\nCreated a sample dashboard to explore sales trends and summarize key performance indicators.",
    });
    setSaved(false);
  }

  function saveDraft() {
    try {
      localStorage.setItem("resonance-resume-draft", JSON.stringify(data));
      setSaved(true);
    } catch {
      setSaved(false);
      alert("Could not save this draft in your browser.");
    }
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem("resonance-resume-draft");
      if (!raw) {
        alert("No saved draft was found in this browser.");
        return;
      }
      setData({ ...initial, ...JSON.parse(raw) });
      setSaved(true);
    } catch {
      alert("Could not load the saved draft.");
    }
  }

  function printResume() {
    window.print();
  }

  const sections = [
    ["Professional Summary", data.summary],
    ["Skills", data.skills],
    ["Education", data.education],
    ["Experience", data.experience],
    ["Projects", data.projects],
  ];

  return (
<main
  className="rb-page"
  style={{
    minHeight: "100vh",
    padding: "24px",
    background: "var(--background)",
    color: "var(--foreground)",
    transition: "background 0.25s ease, color 0.25s ease",
  }}
>

    
    
      <style>{`
        .rb-layout {
          display: grid;
          grid-template-columns: minmax(300px, 1fr) minmax(320px, 1fr);
          gap: 24px;
          max-width: 1450px;
          margin: 24px auto;
          align-items: start;
        }
        .rb-panel {
          border: 1px solid var(--border, #dce5e2);
          background: var(--card, var(--background, #fff));
          color: var(--foreground, #183b35);
          border-radius: 18px;
          padding: 22px;
          min-width: 0;
        }
        .rb-field { display: grid; gap: 7px; margin-bottom: 16px; }
        .rb-field label { font-size: 13px; font-weight: 650; }
        .rb-field textarea { resize: vertical; min-height: 85px; }
        .rb-actions { display: flex; flex-wrap: wrap; gap: 9px; }
        .rb-button {
          padding: 10px 14px; border: 1px solid var(--border, #dce5e2);
          border-radius: 10px; cursor: pointer; font-weight: 650;
          background: var(--card, #fff); color: var(--foreground, #183b35);
        }
        .rb-primary { background: #246963; border-color: #246963; color: white; }
       
/* Theme-aware editor and form */
.rb-panel {
  border: 1px solid var(--border, #dce5e2);
  background: var(--card, var(--background, #fff));
  color: var(--foreground, #183b35);
  border-radius: 18px;
  padding: 22px;
  min-width: 0;
  transition: background 0.25s ease, color 0.25s ease,
    border-color 0.25s ease;
}

.rb-field input,
.rb-field textarea {
  background: var(--background, #fff);
  color: var(--foreground, #183b35);
  border: 1px solid var(--border, #dce5e2);
}

.rb-field input::placeholder,
.rb-field textarea::placeholder {
  color: var(--muted-foreground, #84918d);
}

/* Printable resume paper */
.rb-resume {
  background: #ffffff;
  color: #20352f;
  padding: 34px;
  min-height: 700px;
  border: 1px solid #d7e1dc;
  box-shadow: 0 12px 35px #0000000a;
  font-family: Arial, Helvetica, sans-serif;
}

.rb-resume h1 {
  margin: 0 0 7px;
  font-size: 30px;
  overflow-wrap: anywhere;
}

.rb-resume h2 {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #cfd9d4;
  padding-bottom: 6px;
  margin-top: 24px;
}

.rb-resume p {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  line-height: 1.6;
  font-size: 13px;
}

.rb-contact {
  font-size: 12px;
  color: #5c7068;
  overflow-wrap: anywhere;
}

/* Template 1: Classic */
.rb-template-classic h1 {
  color: #20352f;
  border-bottom: 3px solid #246963;
  padding-bottom: 12px;
}

.rb-template-classic h2 {
  color: #246963;
}

/* Template 2: Modern */
.rb-template-modern {
  border-top: 9px solid #246963;
}

.rb-template-modern h1 {
  color: #246963;
  font-size: 36px;
}

.rb-template-modern h2 {
  color: #246963;
  border-bottom: 2px solid #a8d4c6;
}

/* Template 3: Minimal */
.rb-template-minimal {
  font-family: Georgia, "Times New Roman", serif;
  padding: 42px;
}

.rb-template-minimal h1 {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.rb-template-minimal h2 {
  font-family: Arial, Helvetica, sans-serif;
  color: #444444;
  border-bottom: 1px solid #bdbdbd;
}

/* Template 4: Executive */
.rb-template-executive {
  border-left: 8px solid #c18a51;
}

.rb-template-executive h1 {
  color: #354b5c;
  font-size: 34px;
}

.rb-template-executive h2 {
  color: #9b6b37;
  border-bottom: 1px solid #d9bd9c;
}

/* Template buttons */
.rb-template-button {
  border: 1px solid var(--border, #dce5e2);
  background: var(--card, var(--background, #fff));
  color: var(--foreground, #183b35);
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 650;
}

.rb-template-button.active {
  background: #246963;
  color: #ffffff;
  border-color: #246963;
}

@media (max-width: 850px) {
  .rb-resume {
    padding: 24px;
  }
}

        }
        @media print {
          body * { visibility: hidden !important; }
          .rb-resume, .rb-resume * { visibility: visible !important; }
          .rb-resume {
            position: absolute; inset: 0; width: 100%; min-height: 0;
            box-sizing: border-box; padding: 10mm; border: 0;
          }
          .rb-no-print { display: none !important; }
          @page { size: A4; margin: 10mm; }
        }
      `}</style>

      <header
        className="rb-no-print"
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <Link
          href="/dashboard"
          style={{ color: "inherit", textDecoration: "none", fontWeight: 800, fontSize: 22 }}
        >
          ← RESONANCE<span style={{ color: "#ef795f" }}>.</span>
        </Link>
        <div className="rb-actions">
          <button className="rb-button" onClick={loadExample}>Load example</button>
          <button className="rb-button" onClick={loadDraft}>Load draft</button>
          <button className="rb-button" onClick={saveDraft}>
            {saved ? "Draft saved ✓" : "Save draft"}
          </button>
          <button className="rb-button rb-primary" onClick={printResume}>
            Print / Save PDF
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1450px", margin: "22px auto 0" }}>
        <div className="rb-no-print">
          <p style={{ color: "#41877a", fontSize: 12, fontWeight: 800, letterSpacing: 2 }}>
            RESUME STUDIO
          </p>
          <h1 style={{ margin: "0 0 8px", fontSize: "clamp(28px, 4vw, 40px)" }}>
            Build your professional resume.
          </h1>
          <p style={{ margin: 0, opacity: 0.75 }}>
            Enter your real details. Your resume preview updates as you type.
          </p>
        </div>

        <div className="rb-layout">
          <section className="rb-panel rb-no-print">
            <h2 style={{ marginTop: 0 }}>Your information</h2>

            {[
              ["name", "Full name", "e.g. Alex Morgan", "input"],
              ["email", "Email address", "you@example.com", "input"],
              ["phone", "Phone number", "+91 ...", "input"],
              ["location", "Location", "City, Country", "input"],
              ["role", "Target job title", "e.g. Data Analyst", "input"],
              ["summary", "Professional summary", "Write 2–4 sentences about your actual strengths and goals.", "textarea"],
              ["skills", "Skills", "Separate skills with commas", "textarea"],
              ["education", "Education", "Degree, institution, graduation year", "textarea"],
              ["experience", "Experience", "Role, organization, dates, contributions and results", "textarea"],
              ["projects", "Projects", "Project name, tools used, what you built and the outcome", "textarea"],
            ].map(([key, label, placeholder, type]) => (
              <div className="rb-field" key={key}>
                <label htmlFor={`rb-${key}`}>{label}</label>
                {type === "textarea" ? (
                  <textarea
                    id={`rb-${key}`}
                    style={fieldStyle}
                    value={data[key]}
                    placeholder={placeholder}
                    rows={3}
                    onChange={(e) => update(key, e.target.value)}
                  />
                ) : (
                  <input
                    id={`rb-${key}`}
                    style={fieldStyle}
                    value={data[key]}
                    placeholder={placeholder}
                    onChange={(e) => update(key, e.target.value)}
                  />
                )}
              </div>
            ))}

           


           <button
              className="rb-button"
              onClick={() => {
                setData(initial);
                setSaved(false);
              }}
            >
              Clear all fields
            </button>
          </section>

          <section>
            
<div className="rb-no-print" style={{ marginBottom: 14 }}>
  <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
    LIVE PREVIEW · A4 DOCUMENT
  </div>

  <div
    style={{
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 12,
    }}
  >
    {[
      ["classic", "Classic"],
      ["modern", "Modern"],
      ["minimal", "Minimal"],
      ["executive", "Executive"],
    ].map(([value, label]) => (
      <button
        key={value}
        type="button"
        className={`rb-template-button ${
          template === value ? "active" : ""
        }`}
        aria-pressed={template === value}
        onClick={() => setTemplate(value)}
      >
        {label}
      </button>
    ))}
  </div>
</div>


            <article className={`rb-panel rb-resume rb-template-${template}`}>
              <h1>{data.name || "Your Name"}</h1>
              <div style={{ fontWeight: 650, marginBottom: 10 }}>
                {data.role || "Your Target Role"}
              </div>
              <div className="rb-contact">
                {[data.email, data.phone, data.location].filter(Boolean).join("  ·  ") ||
                  "Email · Phone · Location"}
              </div>

              {sections.map(([title, content]) => (
                <section key={title}>
                  <h2>{title}</h2>
                  <p>
                    {content ||
                      (title === "Skills"
                        ? "Add relevant skills."
                        : `Add your ${title.toLowerCase()} details here.`)}
                  </p>
                </section>
              ))}

              <p style={{ fontSize: 10, color: "#74847d", marginTop: 35 }}>
                Review all details for accuracy before submitting your resume.
              </p>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
}
