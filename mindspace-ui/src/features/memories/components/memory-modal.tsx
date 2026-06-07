"use client";

import { useEffect, useRef, useState } from "react";
import { formatIst } from "@/lib/format-date";
import { useDeleteMemory } from "../hooks/use-delete-memory";
import type { Memory } from "../memory.types";

interface Props {
    memory: Memory;
    onClose: () => void;
}

export function MemoryModal({ memory, onClose }: Props) {
    const deleteMutation = useDeleteMemory();
    const [confirming, setConfirming] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const isEnriched = memory.status === "enriched" || memory.status === "linked";

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = overflow;
        };
    }, [onClose]);

    const handleDelete = () => {
        deleteMutation.mutate(memory.id, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        >
            <button
                aria-label="Close"
                tabIndex={-1}
                onClick={onClose}
                className="absolute inset-0 w-full h-full bg-ink/30 backdrop-blur-md"
            />

            <div
                ref={panelRef}
                className={[
                    "relative w-full max-w-2xl",
                    "max-h-[85vh] flex flex-col",
                    "bg-[#F5F5F2] rounded-3xl overflow-hidden",
                    "border border-ink/10",
                    "shadow-[0_24px_80px_-20px_rgba(47,52,65,0.35)]",
                ].join(" ")}
            >
                <header className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 shrink-0">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-[15px] font-semibold text-ink shrink-0">Topic:</span>
                            <h2 className="text-ink font-medium text-[15px] leading-snug tracking-tight">
                                {memory.title ?? "Untitled thought"}
                            </h2>
                        </div>
                        {isEnriched && memory.topics.length > 0 && (
                            <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                                <span className="text-[15px] font-semibold text-ink shrink-0">Tags:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {memory.topics.map((t) => (
                                        <span
                                            key={t}
                                            className="text-[13px] px-2 py-0.5 rounded-full bg-sage/15 text-ink border border-sage/20"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-ink/8 transition-colors"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 pb-2">
                    <p className="text-ink-muted text-[14px] leading-relaxed whitespace-pre-wrap">
                        {memory.content}
                    </p>
                </div>

                <footer className="flex items-center justify-between px-6 py-4 border-t border-ink/8 shrink-0">
                    <time className="text-[12px] text-ink-subtle">
                        {formatIst(memory.createdAt)}
                    </time>

                    {confirming ? (
                        <div className="flex items-center gap-2">
                            <span className="text-[12px] text-ink-muted">Delete this memory?</span>
                            <button
                                type="button"
                                onClick={() => setConfirming(false)}
                                className="px-3 py-1.5 rounded-xl text-[12px] text-ink-muted hover:text-ink hover:bg-ink/6 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="px-3 py-1.5 rounded-xl text-[12px] font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConfirming(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] text-ink-muted hover:text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            Delete
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
}
