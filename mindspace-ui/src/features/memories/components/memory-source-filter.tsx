"use client";

import { useMemorySources } from "../hooks/use-memory-sources";

interface Props {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
}

export function MemorySourceFilter({ value, onChange }: Props) {
    const { data: sources = [] } = useMemorySources();

    const btnClass = (active: boolean) =>
        [
            "px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200",
            active
                ? "bg-ink text-canvas"
                : "bg-ink/6 text-ink-muted hover:bg-ink/10 hover:text-ink",
        ].join(" ");

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {sources.map((s) => (
                <button
                    key={s.key}
                    type="button"
                    onClick={() => onChange(value === s.key ? undefined : s.key)}
                    className={btnClass(value === s.key)}
                >
                    {s.label}
                </button>
            ))}
            <button
                type="button"
                onClick={() => onChange(undefined)}
                className={btnClass(!value)}
            >
                All Memories
            </button>
        </div>
    );
}
