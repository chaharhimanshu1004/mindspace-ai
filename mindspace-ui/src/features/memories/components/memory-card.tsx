"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
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
                    "hover:-translate-y-0.5 hover:shadow-lift hover:border-[#6366F1]/20",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-soft/40",
                    isPending ? "opacity-70" : "opacity-100",
                ].join(" ")}
            >
                <header className="flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-[#2F3441] line-clamp-2">
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
                                className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-tint text-indigo-soft border border-indigo-soft/15 font-medium"
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
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </footer>
            </article>

            {open && <MemoryModal memory={memory} onClose={() => setOpen(false)} />}
        </>
    );
}
