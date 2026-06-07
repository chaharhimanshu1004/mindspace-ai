"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlackChannelPicker } from "./slack-channel-picker";
import { useSlackSubscriptions } from "../hooks/use-slack-subscriptions";

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
                    "bg-[#F9F9F5] border border-ink/8 rounded-2xl",
                    "p-5 flex flex-col gap-4",
                    "transition-all duration-300 ease-calm",
                    "hover:border-ink/12 hover:shadow-soft",
                ].join(" ")}
            >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div
                        className={[
                            "w-12 h-12 shrink-0 rounded-xl",
                            "bg-indigo-tint border border-indigo-soft/25",
                            "flex items-center justify-center",
                        ].join(" ")}
                        aria-hidden
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-indigo-soft"
                        >
                            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
                        </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-ink text-[14px] font-medium">Slack</h4>
                            {loading ? (
                                <span className="text-[11px] text-ink-subtle">Checking…</span>
                            ) : connected ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-sage bg-sage/10 border border-sage/25 rounded-full px-2 py-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sage" />
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
                    <div className="flex items-center justify-between pt-3 border-t border-ink/6">
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
