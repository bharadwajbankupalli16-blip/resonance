"use client";

import Link from "next/link";
import WeatherLayer from "./weather-layer";

const features = [
  {
    icon: "✦",
    title: "AI Resume Builder",
    description: "Build a polished, job-specific resume with guided content and professional layouts.",
    href: "/resume-builder",
  },
  {
    icon: "◎",
    title: "ATS Compatibility",
    description: "Review your resume structure, discover missing keywords, and improve readability.",
    href: "/resume-analyzer",
  },
  {
    icon: "↗",
    title: "Job Match Insights",
    description: "Compare your experience with a target role and identify relevant skills to develop.",
    href: "/jobs",
  },
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <header className="topbar">
        <Link href="/" className="wordmark">
          RESONANCE<span className="brand-dot">.</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#features">Features</a>
          <Link href="/resume-builder">Resume Builder</Link>
          <Link href="/jobs">Explore Jobs</Link>
          <Link href="/resources">Resources</Link>
        </nav>

        <div className="nav-actions">
          <Link className="signin-link" href="/login">
            Sign in
          </Link>
          <Link className="button button-teal nav-cta" href="/dashboard">
            Get started <span>→</span>
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="sky-glow" />
        <div className="sun-disc" />
        <div className="distant-mountains mountain-one" />
        <div className="distant-mountains mountain-two" />
        <div className="mist mist-one" />
        <div className="mist mist-two" />

        <div className="cliff cliff-left">
          <i />
          <i />
          <i />
        </div>
        <div className="cliff cliff-right">
          <i />
          <i />
          <i />
        </div>

        <div className="valley-arch">
          <div className="arch-opening">
            <div className="river-line" />
          </div>
        </div>

        <WeatherLayer />

        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-star">✳</span>
            YOUR CAREER, WITH CLARITY
          </div>

          <h1>
            Your next chapter
            <br />
            starts <em>with Resonance.</em>
          </h1>

          <p>
            Turn your skills and ambitions into a career plan
            <br />
            with AI-powered resume and job insights.
          </p>
<div className="hero-actions">
  <Link className="button button-teal" href="/login">
    Build my resume <span>→</span>
  </Link>

  <a className="text-link" href="#features">
    Explore features <span>↗</span>
  </a>
</div>
        </div>

        <div className="hero-person" aria-hidden="true">
          <span className="person-head" />
          <span className="person-body" />
          <span className="person-pack" />
          <span className="person-leg leg-left" />
          <span className="person-leg leg-right" />
        </div>

        <article className="hero-card career-card">
          <div className="card-spark">✳</div>
          <div>
            <strong>Your next opportunity</strong>
            <p>Make every application a step forward.</p>
            <Link href="/jobs">
              Explore career paths <span>→</span>
            </Link>
          </div>
        </article>

        <article className="hero-card match-card">
          <div className="match-heading">YOUR CAREER TOOLKIT</div>
          <div className="match-content">
            <div className="match-ring">
              <span>AI</span>
            </div>
            <div className="match-checks">
              <span>Resume insights</span>
              <span>Skill discovery</span>
              <span>Career direction</span>
            </div>
          </div>
        </article>

        <div className="landscape-caption">
          A NEW PERSPECTIVE ON YOUR CAREER
          <span>✦</span>
        </div>
      </section>

      <section className="intro-section" id="features">
        <span className="section-kicker">A SMARTER WAY FORWARD</span>
        <h2>
          Find your direction.
          <br />
          Build your <em>next chapter.</em>
        </h2>
        <p className="section-intro">
          Everything you need to understand your strengths, improve your
          resume, and take your next career step.
        </p>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <Link href={feature.href}>
                Explore tool <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-cta">
        <div>
          <span className="section-kicker">YOUR NEXT STEP STARTS HERE</span>
          <h2>
            Make your potential
            <br />
            <em>visible.</em>
          </h2>
        </div>
        <Link className="button button-coral" href="/dashboard">
          Explore your dashboard <span>→</span>
        </Link>
      </section>

      <footer className="footer">
        <Link href="/" className="wordmark">
          RESONANCE<span className="brand-dot">.</span>
        </Link>
        <span>Build with purpose. Move forward with confidence.</span>
        <Link href="/login">Get started →</Link>
      </footer>
    </main>
  );
}