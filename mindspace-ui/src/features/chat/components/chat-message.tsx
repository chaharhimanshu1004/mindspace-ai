"use client";

import { ChatSources } from "./chat-sources";
import type { ChatSource } from "../chat.types";

interface Props {
    role: "user" | "assistant";
    content: string;
    sources?: ChatSource[];
    pending?: boolean;
}

const userBubble =
    "self-end bg-indigo-soft text-white rounded-3xl rounded-br-md px-5 py-3 shadow-soft max-w-[80%]";
const assistantBubble =
    "self-start bg-white/85 backdrop-blur-sm border border-border-subtle text-ink rounded-3xl rounded-bl-md p-5 shadow-soft max-w-[85%] w-full";

export function ChatMessage({ role, content, sources, pending }: Props) {
    if (role === "user") {
        return (
            <div className="flex flex-col">
                <div className={userBubble}>
                    <p className="text-[15px] whitespace-pre-wrap leading-relaxed">
                        {content}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className={assistantBubble}>
                {pending ? (
                    <span className="inline-flex gap-1 items-center text-ink-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-ink-subtle animate-pulse" />
                        <span className="w-1.5 h-1.5 rounded-full bg-ink-subtle animate-pulse [animation-delay:120ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-ink-subtle animate-pulse [animation-delay:240ms]" />
                    </span>
                ) : (
                    <>
                        <p className="text-[15px] whitespace-pre-wrap leading-relaxed text-ink">
                            {content}
                        </p>
                        {sources && sources.length > 0 ? (
                            <ChatSources sources={sources} />
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
}
