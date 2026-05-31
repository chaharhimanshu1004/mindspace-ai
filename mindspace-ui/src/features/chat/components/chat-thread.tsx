"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api-error";
import { FormError } from "@/components/ui/form-error";
import { ChatComposer } from "./chat-composer";
import { ChatEmpty } from "./chat-empty";
import { ChatMessage } from "./chat-message";
import { useAsk } from "../hooks/use-ask";
import { useChatHistory } from "../hooks/use-chat-history";
import type { ChatHistoryItem, ChatSource } from "../chat.types";

interface OptimisticTurn {
    id: string;
    question: string;
    pending: boolean;
}

const sortAsc = (items: ChatHistoryItem[]): ChatHistoryItem[] =>
    items
        .slice()
        .sort(
            (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );

export function ChatThread() {
    const history = useChatHistory();
    const ask = useAsk();
    const bottomRef = useRef<HTMLDivElement>(null);

    const [optimistic, setOptimistic] = useState<OptimisticTurn | null>(null);
    const [sourcesByMessage, setSourcesByMessage] = useState<
        Record<string, ChatSource[]>
    >({});

    const messages = useMemo(
        () => sortAsc(history.data?.items ?? []),
        [history.data?.items],
    );

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length, optimistic]);

    const onSubmit = (message: string) => {
        const turn: OptimisticTurn = {
            id: crypto.randomUUID(),
            question: message,
            pending: true,
        };
        setOptimistic(turn);

        ask.mutate(message, {
            onSuccess: (answer) => {
                setSourcesByMessage((prev) => ({
                    ...prev,
                    [answer.messageId]: answer.sources,
                }));
                setOptimistic(null);
            },
            onError: () => setOptimistic(null),
        });
    };

    const apiMessage =
        ask.error instanceof ApiError ? ask.error.message : null;

    const isEmpty =
        !history.isLoading && messages.length === 0 && !optimistic && !apiMessage;

    return (
        <div className="flex flex-col h-full min-h-0">
            <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-10 py-8">
                {isEmpty ? (
                    <ChatEmpty />
                ) : (
                    <div className="mx-auto max-w-3xl flex flex-col gap-6">
                        {messages.map((m) => (
                            <ChatMessage
                                key={m.id}
                                role={m.role}
                                content={m.content}
                                sources={
                                    m.role === "assistant"
                                        ? (sourcesByMessage[m.id] || m.sources)
                                        : undefined
                                }
                            />
                        ))}
                        {optimistic ? (
                            <>
                                <ChatMessage
                                    role="user"
                                    content={optimistic.question}
                                />
                                <ChatMessage
                                    role="assistant"
                                    content=""
                                    pending
                                />
                            </>
                        ) : null}
                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            <div className="px-6 sm:px-10 pb-6">
                <div className="mx-auto max-w-3xl flex flex-col gap-2">
                    <FormError message={apiMessage} />
                    <ChatComposer
                        pending={ask.isPending}
                        onSubmit={onSubmit}
                    />
                    <p className="text-center text-xs text-ink-subtle">
                        answers come only from your saved memories
                    </p>
                </div>
            </div>
        </div>
    );
}
