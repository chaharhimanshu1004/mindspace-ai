"use client";

import { Fragment, useMemo } from "react";
import { parseAnswer } from "../utils/parse-answer";
import type { ChatSource } from "../chat.types";

interface Props {
    text: string;
    sources: ChatSource[];
}

export function ChatAnswer({ text, sources }: Props) {
    const sourceMap = useMemo(() => {
        const m = new Map<string, ChatSource>();
        for (const s of sources) m.set(s.memoryId, s);
        return m;
    }, [sources]);

    const segments = useMemo(() => parseAnswer(text), [text]);

    return (
        <div className="whitespace-pre-wrap text-body-lg text-ink">
            {segments.map((seg, idx) => {
                if (seg.kind === "prose") {
                    return <Fragment key={idx}>{seg.text}</Fragment>;
                }
                const source = sourceMap.get(seg.memoryId);
                const exact = source?.content ?? seg.fallback;
                return (
                    <span
                        key={idx}
                        className="font-medium text-ink underline decoration-border-strong decoration-2 underline-offset-2"
                        title={
                            source
                                ? `Your saved memory · ${new Date(
                                      source.createdAt,
                                  ).toLocaleString("en-IN", {
                                      timeZone: "Asia/Kolkata",
                                  })}`
                                : "Your saved memory"
                        }
                    >
                        {exact}
                    </span>
                );
            })}
        </div>
    );
}
