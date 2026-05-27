import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAF7",
        ink: {
          DEFAULT: "#2F3441",
          muted: "#6B7280",
          subtle: "#9CA3AF",
        },
        indigo: {
          soft: "#6366F1",
          hover: "#5457E0",
          tint: "#EEF0FF",
        },
        sage: {
          DEFAULT: "#A3B18A",
          tint: "#EEF1E6",
        },
        border: {
          subtle: "#E9E8E2",
          softer: "#F1F0EB",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(47,52,65,0.04), 0 8px 24px rgba(47,52,65,0.06)",
        lift: "0 2px 4px rgba(47,52,65,0.05), 0 16px 40px rgba(47,52,65,0.08)",
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
