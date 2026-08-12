import type { Config } from "tailwindcss";

const c = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                paper: c("--paper"),
                surface: {
                    1: c("--surface-1"),
                    2: c("--surface-2"),
                    3: c("--surface-3"),
                },
                ink: {
                    DEFAULT: c("--ink"),
                    muted: c("--ink-muted"),
                    subtle: c("--ink-subtle"),
                    disabled: c("--ink-disabled"),
                },
                border: {
                    subtle: c("--line-subtle"),
                    strong: c("--line-strong"),
                    interactive: c("--line-interactive"),
                    softer: c("--line-subtle"),
                },
                accent: {
                    50: c("--accent-50"),
                    100: c("--accent-100"),
                    200: c("--accent-200"),
                    400: c("--accent-400"),
                    500: c("--accent-500"),
                    600: c("--accent-600"),
                    700: c("--accent-700"),
                },
                success: {
                    fg: c("--success-fg"),
                    tint: c("--success-tint"),
                    line: c("--success-line"),
                },
                progress: {
                    fg: c("--progress-fg"),
                    tint: c("--progress-tint"),
                    line: c("--progress-line"),
                },
                danger: {
                    fg: c("--danger-fg"),
                    tint: c("--danger-tint"),
                    line: c("--danger-line"),
                },
                src: {
                    user: c("--src-user"),
                    "user-tint": c("--src-user-tint"),
                    claude: c("--src-claude"),
                    "claude-tint": c("--src-claude-tint"),
                    slack: c("--src-slack"),
                    "slack-tint": c("--src-slack-tint"),
                    telegram: c("--src-telegram"),
                    "telegram-tint": c("--src-telegram-tint"),
                },
                canvas: c("--paper"),
                indigo: {
                    soft: c("--accent-500"),
                    hover: c("--accent-600"),
                    tint: c("--accent-50"),
                },
                sage: {
                    DEFAULT: c("--success-fg"),
                    tint: c("--success-tint"),
                },
            },
            fontFamily: {
                sans: ["var(--font-sans)", "system-ui", "sans-serif"],
                mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
                display: ["var(--font-display)", "Georgia", "serif"],
            },
            fontSize: {
                "display-xl": ["2.875rem", { lineHeight: "1.06", letterSpacing: "-0.022em" }],
                "display-md": ["1.75rem", { lineHeight: "1.16", letterSpacing: "-0.015em" }],
                "display-sm": ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
                "body-lg": ["1.125rem", { lineHeight: "1.55", letterSpacing: "-0.005em" }],
                body: ["1rem", { lineHeight: "1.6" }],
                "body-sm": ["0.9375rem", { lineHeight: "1.6" }],
                meta: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.005em" }],
                overline: ["0.75rem", { lineHeight: "1", letterSpacing: "0.13em" }],
            },
            spacing: {
                15: "3.75rem",
                18: "4.5rem",
                30: "7.5rem",
            },
            maxWidth: {
                content: "80rem",
                prose: "46rem",
                measure: "68ch",
            },
            borderRadius: {
                chip: "8px",
                control: "10px",
                card: "18px",
                panel: "24px",
                xl: "16px",
                "2xl": "20px",
                "3xl": "24px",
            },
            boxShadow: {
                xs: "0 1px 2px rgb(35 38 46 / 0.05)",
                sm: "0 1px 2px rgb(35 38 46 / 0.04), 0 2px 6px rgb(35 38 46 / 0.04)",
                md: "0 2px 4px rgb(35 38 46 / 0.04), 0 8px 20px -4px rgb(35 38 46 / 0.07)",
                lg: "0 4px 8px rgb(35 38 46 / 0.04), 0 18px 40px -8px rgb(35 38 46 / 0.10)",
                ring: "0 0 0 3px rgb(36 35 31 / 0.20)",
                edge: "inset 0 1px 0 rgb(255 255 255 / 0.65)",
                card: "inset 0 1px 0 rgb(255 255 255 / 0.65), 0 1px 2px rgb(35 38 46 / 0.04), 0 2px 6px rgb(35 38 46 / 0.04)",
                "card-hover": "inset 0 1px 0 rgb(255 255 255 / 0.65), 0 2px 4px rgb(35 38 46 / 0.04), 0 8px 20px -4px rgb(35 38 46 / 0.07)",
                soft: "0 1px 2px rgb(35 38 46 / 0.04), 0 2px 6px rgb(35 38 46 / 0.04)",
                lift: "0 2px 4px rgb(35 38 46 / 0.04), 0 8px 20px -4px rgb(35 38 46 / 0.07)",
            },
            transitionDuration: {
                fast: "120ms",
                base: "180ms",
                slow: "240ms",
                slower: "320ms",
            },
            transitionTimingFunction: {
                standard: "cubic-bezier(0.2, 0, 0, 1)",
                exit: "cubic-bezier(0.4, 0, 1, 1)",
                calm: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
        },
    },
    plugins: [],
};

export default config;
