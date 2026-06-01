import { useState } from "react";
import { relativeTime } from "@/lib/relative-time";
import { formatIst } from "@/lib/format-date";
import { MemoryStatusBadge } from "./memory-status-badge";
import { useDeleteMemory } from "../hooks/use-delete-memory";
import type { Memory } from "../memory.types";

interface Props {
    memory: Memory;
}

export function MemoryCard({ memory }: Props) {
    const isPending = memory.status === "pending";
    const deleteMutation = useDeleteMemory();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
                {memory.content}
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

            <footer className="mt-auto pt-2 flex items-center justify-between text-xs text-ink-subtle">
                <time
                    dateTime={memory.createdAt}
                    title={formatIst(memory.createdAt)}
                >
                    {relativeTime(memory.createdAt)}
                </time>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsConfirmOpen(true);
                    }}
                    disabled={deleteMutation.isPending}
                    className={[
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        "p-1.5 rounded-lg text-ink-subtle hover:text-red-500 hover:bg-red-50 transition-colors",
                        "focus:outline-none focus-visible:opacity-100",
                    ].join(" ")}
                    aria-label="Delete thought"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                </button>
            </footer>

            {isConfirmOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/30 backdrop-blur-[4px] animate-overlay-in"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsConfirmOpen(false);
                    }}
                >
                    <div
                        className="bg-white/95 border border-border-subtle rounded-3xl p-6 shadow-lift max-w-sm w-full flex flex-col gap-4 animate-modal-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-full bg-rose-50 text-rose-500 flex-shrink-0">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                    />
                                </svg>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-ink font-semibold text-[16px] leading-snug">
                                    Delete this thought?
                                </h3>
                                <p className="text-ink-muted text-xs leading-relaxed">
                                    Are you sure to delete this memory? This action can't be undone.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2.5 justify-end mt-2">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsConfirmOpen(false);
                                }}
                                className="px-4 py-2.5 rounded-2xl text-xs font-semibold text-ink-muted hover:text-ink hover:bg-ink/5 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteMutation.mutate(memory.id, {
                                        onSuccess: () => {
                                            setIsConfirmOpen(false);
                                        },
                                    });
                                }}
                                disabled={deleteMutation.isPending}
                                className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 active:scale-[0.98]"
                            >
                                {deleteMutation.isPending ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </article>
    );
}
