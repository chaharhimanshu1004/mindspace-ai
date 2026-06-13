interface Props {
    status: string;
}

const labelMap: Record<string, string> = {
    pending: "thinking",
    embedded: "embedded",
    enriched: "enriched",
    linked: "linked",
    failed: "failed",
};

const toneMap: Record<string, string> = {
    pending: "bg-indigo-tint text-indigo-soft border-indigo-soft/20",
    embedded: "bg-indigo-tint text-indigo-soft border-indigo-soft/20",
    enriched: "bg-gradient-to-r from-[#818CF8] to-[#6366F1] text-white border-transparent",
    linked: "bg-indigo-tint text-indigo-soft border-indigo-soft/20",
    failed: "bg-rose-50 text-rose-500 border-rose-200",
};

export function MemoryStatusBadge({ status }: Props) {
    const tone = toneMap[status] ?? "bg-canvas text-ink-subtle border-border-subtle";
    const label = labelMap[status] ?? status;

    return (
        <span
            className={[
                "inline-flex items-center gap-1.5 text-[10px] tracking-wide uppercase",
                "px-2 py-0.5 rounded-full border",
                tone,
            ].join(" ")}
        >
            {status === "pending" || status === "embedded" ? (
                <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
            ) : null}
            {label}
        </span>
    );
}
