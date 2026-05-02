/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "rgb(var(--brand) / <alpha-value>)",
        bg0: "rgb(var(--bg-0) / <alpha-value>)",
        bg1: "rgb(var(--bg-1) / <alpha-value>)",
        bg2: "rgb(var(--bg-2) / <alpha-value>)",
        bg3: "rgb(var(--bg-3) / <alpha-value>)",
        fg0: "rgb(var(--fg-0) / <alpha-value>)",
        fg1: "rgb(var(--fg-1) / <alpha-value>)",
        fg2: "rgb(var(--fg-2) / <alpha-value>)",
        bd0: "rgb(var(--bd-0) / <alpha-value>)",
        bd1: "rgb(var(--bd-1) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
      },
    },
  },
  plugins: [],
}