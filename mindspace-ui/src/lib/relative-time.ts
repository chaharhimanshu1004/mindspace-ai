const UNITS: Array<{ label: string; ms: number }> = [
    { label: "y", ms: 365 * 24 * 60 * 60 * 1000 },
    { label: "mo", ms: 30 * 24 * 60 * 60 * 1000 },
    { label: "d", ms: 24 * 60 * 60 * 1000 },
    { label: "h", ms: 60 * 60 * 1000 },
    { label: "m", ms: 60 * 1000 },
];

export const relativeTime = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 45_000) return "just now";

    for (const u of UNITS) {
        const value = Math.floor(diff / u.ms);
        if (value >= 1) return `${value}${u.label} ago`;
    }
    return "just now";
};
