"use client";

import { useState } from "react";
import { relativeTime } from "@/lib/relative-time";
import { formatIst } from "@/lib/format-date";
import { MemoryStatusBadge } from "./memory-status-badge";
import { MemoryModal } from "./memory-modal";
import { useDeleteMemory } from "../hooks/use-delete-memory";
import type { Memory } from "../memory.types";

interface Props {
    memory: Memory;
}

export function MemoryCard({ memory }: Props) {
    const [open, setOpen] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const deleteMutation = useDeleteMemory();
    const isPending = memory.status === "pending";

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteMutation.mutate(memory.id, {
            onSuccess: () => setConfirming(false),
        });
    };

    return (
        <>
            <article
                role="button"
                tabIndex={0}
                onClick={() => setOpen(true)}
                onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
                className={[
                    "group bg-white/80 backdrop-blur-sm cursor-pointer",
                    "border border-border-subtle rounded-3xl shadow-soft",
                    "p-5 sm:p-6 flex flex-col gap-3",
                    "transition-all duration-300 ease-calm",
                    "hover:shadow-lift hover:border-ink/10",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-soft/40",
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
                    {memory.content}
                </p>

                {memory.topics.length > 0 && (
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
                )}

                <footer className="mt-auto pt-2 flex items-center justify-between text-xs text-ink-subtle">
                    <time dateTime={memory.createdAt} title={formatIst(memory.createdAt)}>
                        {relativeTime(memory.createdAt)}
                    </time>

                    {confirming ? (
                        <div
                            className="flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setConfirming(false); }}
                                className="px-2 py-1 rounded-lg text-[11px] text-ink-muted hover:text-ink transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="px-2 py-1 rounded-lg text-[11px] font-medium text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? "…" : "Delete"}
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setConfirming(true); }}
                            aria-label="Delete"
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-ink-subtle hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        </button>
                    )}
                </footer>
            </article>

            {open && <MemoryModal memory={memory} onClose={() => setOpen(false)} />}
        </>
    );
}
