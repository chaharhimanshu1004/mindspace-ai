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

    return (
        <>
            <article className="group flex flex-col gap-3 rounded-card border border-border-subtle bg-surface-1 p-5 shadow-card transition-[box-shadow,border-color,transform] duration-base ease-standard hover:-translate-y-px hover:border-border-strong hover:shadow-card-hover">
                <header className="flex items-start justify-between gap-3">
                    <MemoryStatusBadge status={memory.status} />
                    <time
                        dateTime={memory.createdAt}
                        title={formatIst(memory.createdAt)}
                        className="tnum shrink-0 font-mono text-[12px] text-ink-subtle"
                    >
                        {relativeTime(memory.createdAt)}
                    </time>
                </header>

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="rounded-control text-left focus:outline-none focus-visible:shadow-ring"
                >
                    <h3 className="ink-weight line-clamp-2 font-display text-[19px] leading-snug text-ink">
                        {memory.title ?? "Untitled note"}
                    </h3>
                </button>

                <p className="line-clamp-4 whitespace-pre-wrap text-body-sm text-ink-muted">
                    {memory.content}
                </p>

                {memory.topics.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                        {memory.topics.slice(0, 3).map((t) => (
                            <li
                                key={t}
                                className="rounded-chip bg-surface-2 px-2 py-0.5 font-mono text-[12px] text-ink-muted"
                            >
                                {t}
                            </li>
                        ))}
                        {memory.topics.length > 3 && (
                            <li className="rounded-chip px-1 py-0.5 font-mono text-[12px] text-ink-subtle">
                                +{memory.topics.length - 3}
                            </li>
                        )}
                    </ul>
                )}

                <footer className="mt-auto flex items-center justify-between gap-2 border-t border-border-subtle pt-3">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="rounded-control font-mono text-[12px] text-ink-subtle underline decoration-border-strong decoration-2 underline-offset-4 transition-colors duration-fast ease-standard hover:text-ink focus:outline-none focus-visible:shadow-ring"
                    >
                        open
                    </button>

                    {confirming ? (
                        <span className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setConfirming(false)}
                                className="rounded-control px-2 py-1 text-[13px] text-ink-muted transition-colors duration-fast ease-standard hover:text-ink focus:outline-none focus-visible:shadow-ring"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    deleteMutation.mutate(memory.id, {
                                        onSuccess: () => setConfirming(false),
                                    })
                                }
                                disabled={deleteMutation.isPending}
                                className="rounded-control px-2 py-1 text-[13px] font-semibold text-danger-fg transition-colors duration-fast ease-standard hover:bg-danger-tint disabled:opacity-45 focus:outline-none focus-visible:shadow-ring"
                            >
                                Delete
                            </button>
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConfirming(true)}
                            aria-label={`Delete ${memory.title ?? "note"}`}
                            className="rounded-control p-1.5 text-ink-subtle transition-colors duration-fast ease-standard hover:bg-danger-tint hover:text-danger-fg focus:outline-none focus-visible:shadow-ring"
                        >
                            <Trash2 aria-hidden className="h-4 w-4" />
                        </button>
                    )}
                </footer>
            </article>

            {open && <MemoryModal memory={memory} onClose={() => setOpen(false)} />}
        </>
    );
}
