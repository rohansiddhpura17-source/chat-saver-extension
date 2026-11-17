/** @type {import('tailwindcss').Config} */
// NOTE (2026-11-10): no longer the live config. Tailwind v4 is CSS-first;
// the tokens below now live in src/index.css (@theme) and are bundled by
// the @tailwindcss/vite plugin, so the extension works offline and under
// the Manifest V3 content security policy. Kept as a readable record.
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: "#4F46E5",
        violet: "#7C3AED",
        background: "#F8F9FF",
        surface: "#FFFFFF",
        "primary-text": "#0B1C30",
        "secondary-text": "#464555",
        success: "#10B981",
        warning: "#F59E0B",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      spacing: {
        gutter: "1rem",
        "gutter-mobile": "0.75rem",
        margin: "2rem",
        "margin-mobile": "1rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "0.75rem",
        "space-lg": "1.25rem",
        "space-xl": "2rem",
      },
    },
  },
}