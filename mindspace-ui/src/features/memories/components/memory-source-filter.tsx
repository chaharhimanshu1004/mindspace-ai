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
            "px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-300 ease-calm",
            active
                ? "bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white shadow-soft"
                : "border border-[#E9E8E2] bg-white/70 text-[#6B7280] backdrop-blur hover:border-[#6366F1]/30 hover:text-[#2F3441]",
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
