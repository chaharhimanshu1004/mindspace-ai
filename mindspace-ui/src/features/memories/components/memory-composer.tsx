"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";

import { useCreateMemory } from "../hooks/use-create-memory";
import { createMemorySchema } from "../memory.schemas";

const MAX_HEIGHT_PX = 180;

const SOURCE_HINTS: Record<string, string> = {
    claude_code: "Claude Code memories arrive on their own — nothing to type here",
    slack: "Slack memories arrive on their own — nothing to type here",
    telegram: "Telegram memories arrive on their own — nothing to type here",
};

interface Props {
    disabled?: boolean;
    disabledSource?: string;
}

export function MemoryComposer({ disabled = false, disabledSource }: Props) {
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
        if (disabled) return;
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
    }, [value, mutation, disabled]);

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    const canSend = !disabled && value.trim().length > 0 && !mutation.isPending;
    const hint = disabledSource ? SOURCE_HINTS[disabledSource] : undefined;

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
            <div className="pointer-events-auto mx-auto max-w-prose px-6 pb-6 sm:px-10">
                <div
                    className={[
                        "flex items-end gap-2 rounded-card border bg-surface-1 p-2 shadow-card",
                        disabled ? "border-border-subtle opacity-70" : "border-border-interactive",
                    ].join(" ")}
                >
                    <textarea
                        ref={taRef}
                        value={value}
                        onChange={(e) => !disabled && setValue(e.target.value)}
                        onKeyDown={onKeyDown}
                        disabled={disabled}
                        rows={1}
                        aria-label="Write a note"
                        placeholder={disabled ? (hint ?? "Notes are added from All or Web") : "Write a note…"}
                        className={[
                            "max-h-[180px] flex-1 resize-none bg-transparent px-3 py-2.5",
                            "text-body text-ink placeholder:text-ink-subtle focus:outline-none",
                            disabled ? "cursor-not-allowed" : "",
                        ].join(" ")}
                    />
                    <button
                        type="button"
                        onClick={send}
                        disabled={!canSend}
                        aria-label="Save note"
                        className={[
                            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control",
                            "transition-colors duration-fast ease-standard",
                            "focus:outline-none focus-visible:shadow-ring",
                            canSend
                                ? "bg-ink text-paper hover:bg-ink/90"
                                : "border border-border-subtle bg-surface-2 text-ink-subtle",
                        ].join(" ")}
                    >
                        {mutation.isPending ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <ArrowUp aria-hidden className="h-[18px] w-[18px]" />
                        )}
                    </button>
                </div>

                {disabled ? null : (
                    <p className="mt-2.5 text-center font-mono text-[12px] text-ink-subtle">
                        enter to save · shift + enter for a new line
                    </p>
                )}
            </div>
        </div>
    );
}
