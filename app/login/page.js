
"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginIllustration() {
  return (
    <div className="login-art animated-career-scene">
      <div className="scene-glow glow-one" />
      <div className="scene-glow glow-two" />

      <div className="career-orbit orbit-outer" />
      <div className="career-orbit orbit-inner" />

      <div className="orbit-badge badge-skills">
        <span>✦</span>
        <small>Skills</small>
      </div>

      <div className="orbit-badge badge-match">
        <span>↗</span>
        <small>92% match</small>
      </div>

      <div className="orbit-badge badge-ai">
        <span>AI</span>
        <small>Smart insights</small>
      </div>

      <div className="animated-resume">
        <div className="resume-window-bar">
          <i />
          <i />
          <i />
          <span>RESUME PREVIEW</span>
        </div>

        <div className="resume-profile">
          <div className="resume-avatar">✦</div>
          <div className="resume-profile-lines">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="resume-label">PROFESSIONAL SUMMARY</div>
        <div className="resume-text-line long" />
        <div className="resume-text-line" />
        <div className="resume-text-line short" />

        <div className="resume-label">CORE SKILLS</div>

        <div className="resume-chips">
          <span>Analysis</span>
          <span>Creative</span>
          <span>Growth</span>
        </div>

        <div className="resume-progress">
          <span />
        </div>

        <div className="resume-complete">
          <span>✓</span> Resume improved
        </div>
      </div>

      <div className="ai-orb">
        <div className="ai-orb-ring ring-one" />
        <div className="ai-orb-ring ring-two" />
        <div className="ai-orb-core">✦</div>
        <span className="ai-spark spark-one">✧</span>
        <span className="ai-spark spark-two">✦</span>
        <span className="ai-spark spark-three">·</span>
      </div>

      <div className="career-chart">
        <div className="chart-heading">
          <span>Career growth</span>
          <b>↗</b>
        </div>

        <div className="chart-bars">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>

        <div className="chart-caption">
          <span>Potential</span>
          <b>Growing</b>
        </div>
      </div>

      <div className="animated-plant">
        <i />
        <i />
        <i />
        <i />
        <b />
      </div>

      <span className="scene-star star-one">✦</span>
      <span className="scene-star star-two">✧</span>
      <span className="scene-star star-three">✦</span>

      <div className="scene-caption">
        <span className="caption-pulse" />
        Your next chapter starts here
      </div>
    </div>
  );
}

export default function LoginPage() {
 const [mode, setMode] = useState("signin");
const [showPassword, setShowPassword] = useState(false);
const [notice, setNotice] = useState("");
const [loading, setLoading] = useState(false);

const [otpSent, setOtpSent] = useState(false);
const [otp, setOtp] = useState("");
const [signupDetails, setSignupDetails] = useState(null);
const [resending, setResending] = useState(false);

  const router = useRouter();
  const isSignup = mode === "signup";

  async function submit(e) {
    e.preventDefault();
    if (loading) return;

    setNotice("");
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      const name = String(form.get("name") || signupDetails?.name || "").trim();
      const email = String(form.get("email") || signupDetails?.email || "").trim().toLowerCase();
      const password = String(form.get("password") || signupDetails?.password || "");

      if (isSignup && !otpSent) {
        if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 128) {
          setNotice("Enter your name, a valid email, and a password between 8 and 128 characters.");
          return;
        }

        const response = await fetch("/api/otp/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) {
          setNotice(data.error || "Unable to send the verification code.");
          return;
        }

        setSignupDetails({ name, email, password });
        setOtpSent(true);
        setNotice(data.message || "Check your email for the six-digit verification code.");
        return;
      }

      if (isSignup && otpSent) {
        if (!signupDetails || !/^\d{6}$/.test(otp)) {
          setNotice("Enter the six-digit verification code.");
          return;
        }

        const response = await fetch("/api/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...signupDetails, code: otp }),
        });
        const data = await response.json();

        if (!response.ok) {
          setNotice(data.error || "Verification failed.");
          return;
        }

        setMode("signin");
        setOtpSent(false);
        setOtp("");
        setSignupDetails(null);
        setNotice("Email verified and account created. Please sign in.");
        return;
      }

       
const result = await signIn("credentials", {
  redirect: false,
  callbackUrl: "https://resonance-ai-resume.vercel.app/dashboard",
});

if (result?.ok) {
  window.location.href =
    "https://resonance-ai-resume.vercel.app/dashboard";
}

  window.location.href =
  "https://resonance-ai-resume.vercel.app/dashboard";
      
      
    } catch (error) {
      console.error("Authentication error:", error);
      setNotice("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-art-panel">
          <Link href="/" className="login-brand">
            <span className="brand-mark">R</span>
            <span>RESONANCE</span>
          </Link>

          <div className="login-visual-content">
            <div className="login-eyebrow">
              <span className="caption-pulse" />
              YOUR CAREER, REIMAGINED
            </div>

            <h1>
              Make your
              <br />
              next move
              <br />
              <span>your best one.</span>
            </h1>

            <p className="login-visual-description">
              Turn your experience into opportunity with AI-powered
              resumes, career insights, and smarter job matching.
            </p>
          </div>

          {/* Keep the illustration separate from the text container. */}
          <LoginIllustration />

          <div className="login-visual-footer">
            <span>Designed for your next chapter.</span>
            <span>✦</span>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="login-form-top">
            <Link href="/" className="login-back-link">
              ← Back to home
            </Link>

            <span className="login-secure-label">
              <span aria-hidden="true">●</span> Secure account
            </span>
          </div>

          <div className="auth-form-inner">
            <div className="login-heading">
              <div className="login-mini-icon">✦</div>

              <h2>
                {isSignup ? "Create your account" : "Welcome back"}
              </h2>

              <p>
                {isSignup
                  ? "Start building a career that moves you forward."
                  : "Sign in to continue your career journey."}
              </p>
            </div>

            <div className="login-mode-switch">
              <button
                type="button"
                className={!isSignup ? "active" : ""}
                onClick={() => {
                  setMode("signin");
                  setNotice("");
                }}
              >
                Sign in
              </button>

              <button
                type="button"
                className={isSignup ? "active" : ""}
                onClick={() => {
                  setMode("signup");
                  setNotice("");
                }}
              >
                Create account
              </button>
            </div>

            <form onSubmit={submit} className="login-form">
              {isSignup && (
                <label>
                  Full name

                  <div className="input-wrap">
                    <span aria-hidden="true">♙</span>

                    <input
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      autoComplete="name"
                      maxLength={120}
                      required
                    />
                  </div>
                </label>
              )}

              <label>
                Email address

                <div className="input-wrap">
                  <span aria-hidden="true">✉</span>

                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={255}
                    required
                  />
                </div>
              </label>

              <label>
                Password

                <div className="input-wrap">
                  <span aria-hidden="true">▣</span>

                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      isSignup
                        ? "Create a password"
                        : "Enter your password"
                    }
                    autoComplete={
                      isSignup ? "new-password" : "current-password"
                    }
                    minLength={isSignup ? 8 : undefined}
                    maxLength={128}
                    required
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {isSignup && (
                  <small className="password-hint">
                    Use at least 8 characters.
                  </small>
                )}
              </label>              {isSignup && otpSent && (
                <label>
                  Email verification code
                  <div className="input-wrap">
                    <span aria-hidden="true">✉</span>
                    <input
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                    />
                  </div>
                  <small className="password-hint">Check your inbox. The code expires in 10 minutes.</small>
                </label>
              )}


              {notice && (
                <div
                  className="login-notice"
                  role="status"
                  aria-live="polite"
                >
                  {notice}
                </div>
              )}

              <button
                type="submit"
                className="button button-coral auth-submit"
                disabled={loading}
              >
                {loading ? "Please wait..." : isSignup ? (otpSent ? "Verify Email & Create Account ->" : "Send Verification Code ->") : "Sign In ->"}
              </button>
            </form>

            <div className="login-divider">
              <span>YOUR CAREER STARTS HERE</span>
            </div>

            <p className="login-switch-copy">
              {isSignup
                ? "Already have an account?"
                : "New to RESONANCE?"}{" "}

              <button
                type="button"
                onClick={() => {
                  setMode(isSignup ? "signin" : "signup");
                  setNotice("");
                }}
              >
                {isSignup ? "Sign in" : "Create an account"}
              </button>
            </p>

            <p className="login-terms">
              By continuing, you agree to use RESONANCE responsibly.
            </p>
          </div>

          <div className="login-form-footer">
            <span>
              © {new Date().getFullYear()} RESONANCE
            </span>
            <span>Built for what comes next ✦</span>
          </div>
        </section>
      </div>
    </main>
  );
}

