"use client";

import { AppHeader } from "@/components/layouts/app-header";
import { ChatThread } from "@/features/chat/components/chat-thread";

export default function AskPage() {
    return (
        <main className="h-screen flex flex-col calm-gradient">
            <div className="grain flex flex-col h-full">
                <AppHeader />

                <section className="px-6 sm:px-10 pt-8 pb-4 max-w-3xl mx-auto w-full">
                    <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-ink-subtle">
                        <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                        ask your second brain
                    </span>
                    <h1 className="mt-2 text-[28px] sm:text-[34px] leading-tight tracking-tight text-ink font-medium">
                        What were you thinking about?
                    </h1>
                </section>

                <div className="flex-1 min-h-0">
                    <ChatThread />
                </div>
            </div>
        </main>
    );
}
