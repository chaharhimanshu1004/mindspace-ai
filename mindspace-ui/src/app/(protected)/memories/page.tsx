"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useMemories } from "@/features/memories/hooks/use-memories";
import { AppHeader } from "@/components/layouts/app-header";
import { MemoryGrid } from "@/features/memories/components/memory-grid";
import { MemoryEmpty } from "@/features/memories/components/memory-empty";
import { MemorySkeletonGrid } from "@/features/memories/components/memory-skeleton-grid";
import { MemoryComposer } from "@/features/memories/components/memory-composer";
import { MemorySourceFilter } from "@/features/memories/components/memory-source-filter";
import { LandingBackground } from "@/components/landing/landing-background";

export default function MemoriesPage() {
    const [sourceType, setSourceType] = useState<string | undefined>("user_text");
    const { data, isLoading, isError } = useMemories(sourceType);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("integration") === "google_calendar" && searchParams.get("status") === "connected") {
            toast.success("Google Calendar connected");
            window.history.replaceState({}, "", "/memories");
        }
        if (searchParams.get("integration") === "slack") {
            const status = searchParams.get("status");
            if (status === "connected") toast.success("Slack connected");
            if (status === "denied") toast.error("Slack connection denied");
            window.history.replaceState({}, "", "/memories");
        }
    }, [searchParams]);

    const memories = data?.items ?? [];

    return (
        <main className="relative min-h-screen bg-[#FAFAF7]">
            <LandingBackground />
            <div className="min-h-screen pb-40">
                <AppHeader />

                <section className="px-6 sm:px-10 pt-10 sm:pt-14 max-w-6xl mx-auto">
                    <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#6366F1]/15 bg-gradient-to-r from-[#EEF0FF] to-[#F5F3FF] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] shadow-soft">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1] shadow-[0_0_10px_rgba(99,102,241,0.7)]" />
                                <span className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] bg-clip-text text-transparent">
                                    memories
                                </span>
                            </span>
                            <h1 className="mt-3 text-[28px] sm:text-[36px] font-bold leading-tight tracking-tight text-[#2F3441]">
                                Your quiet garden of thoughts
                            </h1>
                        </div>
                        {memories.length > 0 && (
                            <span className="hidden sm:inline-flex items-center rounded-full border border-[#E9E8E2] bg-white px-3 py-1 text-xs font-semibold text-[#6B7280] shadow-soft">
                                {memories.length} saved
                            </span>
                        )}
                    </div>

                    <div className="mb-6">
                        <MemorySourceFilter value={sourceType} onChange={setSourceType} />
                    </div>

                    {isLoading ? (
                        <MemorySkeletonGrid />
                    ) : isError ? (
                        <div className="text-center py-20 text-ink-muted text-sm">
                            Couldn&rsquo;t load your memories — try refreshing.
                        </div>
                    ) : memories.length === 0 ? (
                        <MemoryEmpty />
                    ) : (
                        <MemoryGrid memories={memories} />
                    )}
                </section>
            </div>

            <MemoryComposer disabled={!!sourceType && sourceType !== "user_text"} disabledSource={sourceType} />
        </main>
    );
}
