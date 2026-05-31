"use client";

import { ChatSourceCard } from "./chat-source-card";
import type { ChatSource } from "../chat.types";

interface Props {
    sources: ChatSource[];
}

export function ChatSources({ sources }: Props) {
    const cited = sources.filter((s) => s.cited);

    if (cited.length === 0) return null;

    return (
        <div className="mt-4 pt-4 border-t border-border-softer">
            <div className="flex flex-col gap-2">
                <span className="text-[10px] tracking-[0.18em] uppercase text-ink-subtle">
                    from your memories
                </span>
                {cited.map((s) => (
                    <ChatSourceCard key={s.memoryId} source={s} />
                ))}
            </div>
        </div>
    );
}
