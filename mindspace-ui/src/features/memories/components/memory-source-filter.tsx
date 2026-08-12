"use client";

import { useMemorySources } from "../hooks/use-memory-sources";

interface Props {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
}

const tab = (active: boolean) =>
    [
        "rounded-[7px] px-3 py-1.5 text-body-sm font-semibold whitespace-nowrap",
        "transition-colors duration-fast ease-standard",
        "focus:outline-none focus-visible:shadow-ring",
        active ? "bg-surface-1 text-ink shadow-xs" : "text-ink-muted hover:text-ink",
    ].join(" ");

export function MemorySourceFilter({ value, onChange }: Props) {
    const { data: sources = [] } = useMemorySources();

    return (
        <div
            role="tablist"
            aria-label="Filter by source"
            className="flex w-full items-center gap-1 overflow-x-auto rounded-control border border-border-subtle bg-surface-2 p-1 sm:w-auto"
        >
            <button
                type="button"
                role="tab"
                aria-selected={!value}
                onClick={() => onChange(undefined)}
                className={tab(!value)}
            >
                All
            </button>
            {sources.map((s) => (
                <button
                    key={s.key}
                    type="button"
                    role="tab"
                    aria-selected={value === s.key}
                    onClick={() => onChange(value === s.key ? undefined : s.key)}
                    className={tab(value === s.key)}
                >
                    {s.label}
                </button>
            ))}
        </div>
    );
}
