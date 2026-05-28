"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import { useCreateMemory } from "../hooks/use-create-memory";
import { createMemorySchema } from "../memory.schemas";

const MAX_HEIGHT_PX = 180;

export function MemoryComposer() {
    const [value, setValue] = useState("");
    const taRef = useRef<HTMLTextAreaElement | null>(null);
    const mutation = useCreateMemory();

    const autosize = useCallback(() => {
        const el = taRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
    }, []);

    useEffect(() => {
        autosize();
    }, [value, autosize]);

    const send = useCallback(() => {
        const parsed = createMemorySchema.safeParse({ content: value });
        if (!parsed.success) return;

        mutation.mutate(
            { content: parsed.data.content },
            {
                onSuccess: () => {
                    setValue("");
                    requestAnimationFrame(() => taRef.current?.focus());
                },
            },
        );
    }, [value, mutation]);

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    const canSend = value.trim().length > 0 && !mutation.isPending;

    return (
        <div className="fixed inset-x-0 bottom-0 z-30 pointer-events-none">
            <div className="pointer-events-auto mx-auto max-w-3xl px-4 sm:px-6 pb-5 sm:pb-7">
                <div
                    className={[
                        "flex items-end gap-2 p-2",
                        "bg-white/85 backdrop-blur-xl",
                        "border border-border-subtle rounded-3xl shadow-lift",
                    ].join(" ")}
                >
                    <textarea
                        ref={taRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={onKeyDown}
                        rows={1}
                        placeholder="Add a thought…"
                        className={[
                            "flex-1 resize-none bg-transparent",
                            "px-3 py-2.5 text-[15px] leading-relaxed",
                            "text-ink placeholder-ink-subtle",
                            "focus:outline-none",
                            "max-h-[180px]",
                        ].join(" ")}
                    />
                    <button
                        type="button"
                        onClick={send}
                        disabled={!canSend}
                        aria-label="Save memory"
                        className={[
                            "inline-flex items-center justify-center",
                            "w-11 h-11 rounded-2xl shrink-0",
                            "transition-all duration-300 ease-calm",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-soft/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                            canSend
                                ? "bg-indigo-soft text-white shadow-soft hover:bg-indigo-hover hover:shadow-lift"
                                : "bg-canvas text-ink-subtle border border-border-subtle",
                        ].join(" ")}
                    >
                        {mutation.isPending ? (
                            <span className="text-sm">…</span>
                        ) : (
                            <SendIcon />
                        )}
                    </button>
                </div>
                <p className="mt-2 text-center text-[11px] text-ink-subtle">
                    enter to save · shift + enter for a new line
                </p>
            </div>
        </div>
    );
}

function SendIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M5 12l14-7-5 14-3-6-6-1z" />
        </svg>
    );
}
