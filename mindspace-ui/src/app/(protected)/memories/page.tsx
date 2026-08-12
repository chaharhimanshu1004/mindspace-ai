"use client";

import { Suspense, useEffect, useState } from "react";
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
import { Overline } from "@/components/ui/overline";
import { SlackChannelPicker } from "@/features/profile/components/slack-channel-picker";
import { useIntegrations } from "@/features/profile/hooks/use-integrations";
import { useSlackSubscriptions } from "@/features/profile/hooks/use-slack-subscriptions";

function IntegrationToastHandler() {
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

    return null;
}

export default function MemoriesPage() {
    const [sourceType, setSourceType] = useState<string | undefined>("user_text");
    const [slackPickerOpen, setSlackPickerOpen] = useState(false);

    const { data, isLoading, isError } = useMemories(sourceType);
    const { slackConnected, connectSlack, telegramConnected, connectTelegram } =
        useIntegrations();
    const { data: slackSubs } = useSlackSubscriptions(slackConnected && sourceType === "slack");

    const memories = data?.items ?? [];

    const isSlackTab = sourceType === "slack";
    const slackEmpty = isSlackTab
        ? {
              connected: slackConnected,
              hasSubscriptions: (slackSubs?.length ?? 0) > 0,
              onConnect: connectSlack,
              onOpenPicker: () => setSlackPickerOpen(true),
          }
        : undefined;

    const telegramEmpty =
        sourceType === "telegram"
            ? { connected: telegramConnected, onConnect: connectTelegram }
            : undefined;

    return (
        <main className="relative min-h-screen">
            <Suspense>
                <IntegrationToastHandler />
            </Suspense>
            <LandingBackground />
            <div className="min-h-screen pb-40">
                <AppHeader />

                <section className="mx-auto max-w-content px-6 pb-16 pt-10 sm:px-10 sm:pt-14">
                    <div className="flex flex-col gap-6 border-b border-border-subtle pb-6">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <Overline>memories</Overline>
                                <h1 className="ink-weight mt-4 font-display text-[26px] leading-[1.14] tracking-[-0.015em] text-ink sm:text-display-md">
                                    Everything you kept
                                </h1>
                            </div>
                            {memories.length > 0 && (
                                <span className="tnum font-mono text-[13px] text-ink-subtle">
                                    {memories.length} saved
                                </span>
                            )}
                        </div>

                        <MemorySourceFilter value={sourceType} onChange={setSourceType} />
                    </div>

                    <div className="mt-8">
                        {isLoading ? (
                            <MemorySkeletonGrid />
                        ) : isError ? (
                            <div className="rounded-card border border-border-subtle bg-surface-1 p-8 text-center text-body-sm text-ink-muted">
                                Couldn&rsquo;t load your memories — try refreshing.
                            </div>
                        ) : memories.length === 0 ? (
                            <MemoryEmpty
                                sourceType={sourceType}
                                slack={slackEmpty}
                                telegram={telegramEmpty}
                            />
                        ) : (
                            <MemoryGrid memories={memories} />
                        )}
                    </div>
                </section>
            </div>

            <MemoryComposer disabled={!!sourceType && sourceType !== "user_text"} disabledSource={sourceType} />
            <SlackChannelPicker open={slackPickerOpen} onClose={() => setSlackPickerOpen(false)} />
        </main>
    );
}
