"use client";

import { ChatSourceCard } from "./chat-source-card";
import type { ChatSource } from "../chat.types";

interface Props {
    sources: ChatSource[];
}

export function ChatSources({ sources }: Props) {
    const cited = sources.filter((s) => s.cited);
    const deletedCount = cited.filter((s) => s.deleted).length;

    if (cited.length === 0 || cited.length === deletedCount) return null;

    return (
        <div className="mt-5 border-t border-border-subtle pt-4">
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-ink-subtle">
                cited notes
            </span>
            <div className="mt-3 flex flex-col gap-2">
                {cited.map((s) => (
                    <ChatSourceCard key={s.memoryId} source={s} />
                ))}
            </div>
        </div>
    );
}
