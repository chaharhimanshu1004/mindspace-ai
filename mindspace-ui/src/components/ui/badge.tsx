import type { BadgeProps, BadgeTone } from "./badge.types";

const tones: Record<BadgeTone, string> = {
    info: "bg-surface-2 text-ink-muted border-border-subtle",
    accent: "bg-accent-50 text-accent-700 border-accent-100",
    success: "bg-success-tint text-success-fg border-success-line",
    progress: "bg-progress-tint text-progress-fg border-progress-line",
    danger: "bg-danger-tint text-danger-fg border-danger-line",
};

export function Badge({ tone = "info", dot = false, title, children }: BadgeProps) {
    return (
        <span
            title={title}
            className={`inline-flex items-center gap-1.5 rounded-chip border px-2 py-0.5 text-meta font-medium ${tones[tone]}`}
        >
            {dot ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
            {children}
        </span>
    );
}
