import "./globals.css";
import ThemeToggle from "./theme-toggle";

export const metadata = {
  title: "RESONANCE â€” Your next chapter starts here",
  description: "AI-powered resume insights, job matching, and career guidance in one place."
};

export default function RootLayout({ children }) {
  return <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning><body><ThemeToggle />{children}</body></html>;
}

