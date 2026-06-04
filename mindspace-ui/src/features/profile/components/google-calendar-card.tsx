"use client";

import { Button } from "@/components/ui/button";

interface Props {
    connected: boolean;
    loading: boolean;
    disconnecting: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
}

export function GoogleCalendarCard({ connected, loading, disconnecting, onConnect, onDisconnect }: Props) {
    return (
        <article
            className={[
                "bg-[#F9F9F5] border border-ink/8 rounded-2xl",
                "p-5 flex flex-col sm:flex-row sm:items-center gap-4",
                "transition-all duration-300 ease-calm",
                "hover:border-ink/12 hover:shadow-soft",
            ].join(" ")}
        >
            <div
                className={[
                    "w-12 h-12 shrink-0 rounded-xl",
                    "bg-sage/15 border border-sage/25",
                    "flex items-center justify-center",
                ].join(" ")}
                aria-hidden
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-sage"
                >
                    <rect x="3" y="4" width="18" height="18" rx="3" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                    <path d="M9 14h.01M13 14h.01M17 14h.01M9 18h.01M13 18h.01" />
                </svg>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-ink text-[14px] font-medium">Google Calendar</h4>
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
                    Let MindSpace add deadlines and reminders from your memories straight into your calendar.
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
        </article>
    );
}
