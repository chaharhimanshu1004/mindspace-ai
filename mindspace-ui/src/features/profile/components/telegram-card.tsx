"use client";

import { Button } from "@/components/ui/button";
import { TelegramIcon } from "@/components/landing/icons/telegram-icon";

interface Props {
    connected: boolean;
    loading: boolean;
    disconnecting: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
}

export function TelegramCard({ connected, loading, disconnecting, onConnect, onDisconnect }: Props) {
    return (
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
                    <TelegramIcon className="w-7 h-7" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-[#2F3441] text-[14px] font-semibold tracking-tight">Telegram Bot</h4>
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
                        Pair your account to send text notes or ask questions directly to your MindSpace bot on the go.
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
        </article>
    );
}
