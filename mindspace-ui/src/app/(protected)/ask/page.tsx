"use client";

import { AppHeader } from "@/components/layouts/app-header";
import { ChatThread } from "@/features/chat/components/chat-thread";
import { LandingBackground } from "@/components/landing/landing-background";

export default function AskPage() {
    return (
        <main className="relative flex h-screen flex-col bg-[#FAFAF7]">
            <LandingBackground />
            <AppHeader />
            <div className="min-h-0 flex-1">
                <ChatThread />
            </div>
        </main>
    );
}
