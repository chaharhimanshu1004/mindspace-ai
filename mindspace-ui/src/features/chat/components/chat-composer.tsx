"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { askSchema } from "../chat.schemas";

interface Props {
    pending: boolean;
    onSubmit: (message: string) => void;
}

export function ChatComposer({ pending, onSubmit }: Props) {
    const [value, setValue] = useState("");
    const taRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const ta = taRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }, [value]);

    const send = () => {
        const parsed = askSchema.safeParse({ message: value });
        if (!parsed.success || pending) return;
        onSubmit(parsed.data.message);
        setValue("");
    };

    const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    return (
        <div
            className={[
                "bg-white/80 backdrop-blur-sm",
                "border border-border-subtle rounded-3xl shadow-soft",
                "p-3 flex items-end gap-2",
                "transition-all duration-300 ease-calm",
                "focus-within:shadow-lift focus-within:border-ink/10",
            ].join(" ")}
        >
            <textarea
                ref={taRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder="Ask anything from your memories…"
                disabled={pending}
                className={[
                    "flex-1 resize-none bg-transparent",
                    "text-ink placeholder-ink-subtle",
                    "px-3 py-2 text-[15px] leading-relaxed",
                    "focus:outline-none disabled:opacity-50",
                    "max-h-[200px]",
                ].join(" ")}
            />
            <Button
                size="md"
                onClick={send}
                loading={pending}
                disabled={pending || value.trim().length === 0}
            >
                Ask
            </Button>
        </div>
    );
}
