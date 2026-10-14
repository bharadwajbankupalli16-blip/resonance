"use client";
import { useEffect, useState } from "react";

const choices = ["light", "dark", "system"];
const labels = { light: "Light", dark: "Dark", system: "System" };

export default function ThemeToggle() {
  const [theme, setTheme] = useState("system");
  useEffect(() => {
    const saved = window.localStorage.getItem("resonance-theme") || "system";
    setTheme(saved);
    applyTheme(saved);
  }, []);
  function applyTheme(value) {
    const resolved = value === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : value;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themeChoice = value;
  }
  function cycleTheme() {
    const next = choices[(choices.indexOf(theme) + 1) % choices.length];
    setTheme(next);
    window.localStorage.setItem("resonance-theme", next);
    applyTheme(next);
  }
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system");
    media.addEventListener?.("change", listener);
    return () => media.removeEventListener?.("change", listener);
  }, [theme]);
  return <button type="button" className="theme-toggle" onClick={cycleTheme} aria-label={`Theme: ${labels[theme]}. Click to change theme`} title={`Theme: ${labels[theme]} · click to change`}>
    <span className="theme-toggle-icon" aria-hidden="true">{theme === "light" ? "☼" : theme === "dark" ? "☾" : "◐"}</span>
    <span>{labels[theme]}</span>
  </button>;
}
