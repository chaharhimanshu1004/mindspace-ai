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
        <main className="min-h-screen calm-gradient">
            <div className="grain min-h-screen pb-40">
                <AppHeader />

                <section className="px-6 sm:px-10 pt-10 sm:pt-14 max-w-6xl mx-auto">
                    <div className="flex items-end justify-between gap-4 mb-5 sm:mb-6">
                        <div>
                            <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-ink-subtle">
                                <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                                memories
                            </span>
                            <h1 className="mt-2 text-[28px] sm:text-[34px] leading-tight tracking-tight text-ink font-medium">
                                Your quiet garden of thoughts
                            </h1>
                        </div>
                        {memories.length > 0 && (
                            <span className="hidden sm:inline text-xs text-ink-subtle">
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
