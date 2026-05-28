import { relativeTime } from "@/lib/relative-time";
import { MemoryStatusBadge } from "./memory-status-badge";
import type { Memory } from "../memory.types";

interface Props {
    memory: Memory;
}

export function MemoryCard({ memory }: Props) {
    const isPending = memory.status === "pending";

    return (
        <article
            className={[
                "group bg-white/80 backdrop-blur-sm",
                "border border-border-subtle rounded-3xl shadow-soft",
                "p-5 sm:p-6 flex flex-col gap-3",
                "transition-all duration-300 ease-calm",
                "hover:shadow-lift hover:border-ink/10",
                isPending ? "opacity-70" : "opacity-100",
            ].join(" ")}
        >
            <header className="flex items-start justify-between gap-3">
                <h3 className="text-ink font-medium text-[15px] leading-snug line-clamp-2">
                    {memory.title ?? "Untitled thought"}
                </h3>
                <MemoryStatusBadge status={memory.status} />
            </header>

            <p className="text-ink-muted text-sm leading-relaxed whitespace-pre-wrap line-clamp-6">
                {memory.summary ?? memory.content}
            </p>

            {memory.topics.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {memory.topics.slice(0, 4).map((t) => (
                        <span
                            key={t}
                            className="text-[11px] px-2 py-0.5 rounded-full bg-sage-tint text-ink-muted border border-sage/20"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            ) : null}

            <footer className="mt-auto pt-2 text-xs text-ink-subtle">
                {relativeTime(memory.createdAt)}
            </footer>
        </article>
    );
}
