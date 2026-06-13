"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlackChannelPicker } from "./slack-channel-picker";
import { useSlackSubscriptions } from "../hooks/use-slack-subscriptions";
import { SlackIcon } from "@/components/landing/icons/slack-icon";

interface Props {
    connected: boolean;
    loading: boolean;
    disconnecting: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
}

export function SlackCard({ connected, loading, disconnecting, onConnect, onDisconnect }: Props) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const { data: subs } = useSlackSubscriptions(connected);
    const subCount = subs?.length ?? 0;

    return (
        <>
            <article
                className={[
                    "bg-white border border-[#E9E8E2] rounded-2xl",
                    "p-5 flex flex-col gap-4",
                    "transition-all duration-300 ease-calm",
                    "hover:border-[#6366F1]/20 hover:shadow-soft",
                ].join(" ")}
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div
                        className={[
                            "w-12 h-12 shrink-0 rounded-xl overflow-hidden",
                            "bg-white border border-[#E9E8E2] shadow-soft",
                            "flex items-center justify-center",
                        ].join(" ")}
                        aria-hidden
                    >
                        <SlackIcon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-[#2F3441] text-[14px] font-semibold tracking-tight">Slack</h4>
                            {loading ? (
                                <span className="text-[11px] text-ink-subtle">Checking…</span>
                            ) : connected ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-indigo-soft bg-indigo-tint border border-indigo-soft/25 rounded-full px-2 py-0.5 font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-soft" />
                                    Connected
                                </span>
                            ) : (
                                <span className="text-[11px] text-ink-subtle">Not connected</span>
                            )}
                        </div>
                        <p className="mt-1 text-[13px] text-ink-muted leading-relaxed">
                            Quietly bring your team conversations into MindSpace, so you can recall what was discussed and when.
                        </p>
                    </div>

                    <div className="shrink-0">
                        {connected ? (
                            <Button variant="secondary" size="md" onClick={onDisconnect} disabled={disconnecting}>
                                {disconnecting ? "Disconnecting…" : "Disconnect"}
                            </Button>
                        ) : (
                            <Button variant="primary" size="md" onClick={onConnect} disabled={loading}>
                                Connect
                            </Button>
                        )}
                    </div>
                </div>

                {connected ? (
                    <div className="flex items-center justify-between pt-3 border-t border-[#F1F0EB]">
                        <span className="text-[12px] text-ink-muted">
                            {subCount === 0
                                ? "No channels selected yet"
                                : `${subCount} channel${subCount === 1 ? "" : "s"} subscribed`}
                        </span>
                        <button
                            type="button"
                            onClick={() => setPickerOpen(true)}
                            className={[
                                "text-[12px] font-medium text-indigo-soft",
                                "px-3 py-1.5 rounded-lg",
                                "hover:bg-indigo-tint transition-colors",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-soft/30",
                            ].join(" ")}
                        >
                            Choose channels
                        </button>
                    </div>
                ) : null}
            </article>

            <SlackChannelPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
        </>
    );
}
