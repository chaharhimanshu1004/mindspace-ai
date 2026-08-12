"use client";

import { AlertTriangle } from "lucide-react";
import { ChatSources } from "./chat-sources";
import type { ChatSource } from "../chat.types";

interface Props {
    role: "user" | "assistant";
    content: string | null;
    sources?: ChatSource[];
    pending?: boolean;
    allSourcesDeleted?: boolean;
}

function RoleLabel({ children }: { children: string }) {
    return (
        <span className="mb-1.5 block font-mono text-[12px] uppercase tracking-[0.1em] text-ink-subtle">
            {children}
        </span>
    );
}

export function ChatMessage({ role, content, sources, pending, allSourcesDeleted }: Props) {
    if (role === "user") {
        return (
            <div className="flex flex-col items-end">
                <div className="max-w-[85%]">
                    <RoleLabel>you</RoleLabel>
                    <div className="rounded-card border border-border-strong bg-surface-2 px-4 py-3">
                        <p className="whitespace-pre-wrap text-body text-ink">{content}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (allSourcesDeleted) {
        return (
            <div className="w-full">
                <RoleLabel>mindspace</RoleLabel>
                <div className="flex items-start gap-3 rounded-card border border-danger-line bg-danger-tint p-4">
                    <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-danger-fg" />
                    <div className="text-body-sm text-danger-fg">
                        <span className="block font-semibold">Answer withdrawn</span>
                        The notes this answer was built from have been deleted, so it can no
                        longer be shown.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <RoleLabel>mindspace</RoleLabel>
            <div className="rounded-card border border-border-subtle bg-surface-1 p-5 shadow-card">
                {pending ? (
                    <span className="inline-flex items-center gap-1.5" aria-label="Thinking">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-subtle" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-subtle [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-subtle [animation-delay:240ms]" />
                    </span>
                ) : (
                    <div aria-live="polite">
                        <p className="whitespace-pre-wrap text-body-lg text-ink">{content}</p>
                        {sources && sources.length > 0 ? <ChatSources sources={sources} /> : null}
                    </div>
                )}
            </div>
        </div>
    );
}
