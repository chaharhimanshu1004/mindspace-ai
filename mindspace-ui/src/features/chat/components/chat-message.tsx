"use client";

import { ChatSources } from "./chat-sources";
import type { ChatSource } from "../chat.types";

interface Props {
    role: "user" | "assistant";
    content: string | null;
    sources?: ChatSource[];
    pending?: boolean;
    allSourcesDeleted?: boolean;
}

const userBubble =
    "self-end bg-indigo-soft text-white rounded-3xl rounded-br-md px-5 py-3 shadow-soft max-w-[80%]";
const assistantBubble =
    "self-start bg-white/85 backdrop-blur-sm border border-border-subtle text-ink rounded-3xl rounded-bl-md p-5 shadow-soft max-w-[85%] w-full";

export function ChatMessage({ role, content, sources, pending, allSourcesDeleted }: Props) {
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

    if (role === "assistant" && allSourcesDeleted) {
        return (
            <div className="flex flex-col">
                <div className={[
                    assistantBubble,
                    "border-dashed border-red-200 bg-red-50/50 shadow-none"
                ].join(" ")}>
                    <div className="flex items-start gap-2.5 text-red-600/95 leading-relaxed text-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                            />
                        </svg>
                        <div>
                            <span className="font-semibold block mb-0.5 text-[14px]">Response Unavailable</span>
                            The source memories supporting this answer have been deleted from your mindspace. To preserve accuracy, this response is no longer available.
                        </div>
                    </div>
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
