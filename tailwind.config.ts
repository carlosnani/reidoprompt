import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === SHADCN/UI TOKENS (sem HSL pois usamos hex direto) ===
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // === CORES IDENTIDADE DO PROJETO ===
        cream: "#fbf7eb",
        "green-neon": "#48ff24",
        "green-dark": "#018442",
        "green-deep": "#164c3f",
        "green-muted": "#314840",

        // === ADMIN TOKENS ===
        "admin-bg": "var(--admin-bg-main)",
        "admin-surface": "var(--admin-bg-surface)",
        "admin-muted": "var(--admin-bg-muted)",

        "admin-primary": "var(--admin-primary)",
        "admin-primary-hover": "var(--admin-primary-hover)",
        "admin-primary-soft": "var(--admin-primary-soft)",

        "admin-text": "var(--admin-text-primary)",
        "admin-text-secondary": "var(--admin-text-secondary)",
        "admin-text-muted": "var(--admin-text-muted)",

        "admin-border": "var(--admin-border-default)",
        "admin-border-light": "var(--admin-border-light)",
        "admin-border-strong": "var(--admin-border-strong)",

        "admin-success": "var(--admin-success)",
        "admin-success-hover": "var(--admin-success-hover)",
        "admin-danger": "var(--admin-danger)",
        "admin-warning": "var(--admin-warning)",
        "admin-info": "var(--admin-info)",
        "admin-info-soft": "var(--admin-info-soft)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
