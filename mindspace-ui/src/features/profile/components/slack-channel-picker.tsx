"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useSlackChannels } from "../hooks/use-slack-channels";
import {
    useSubscribeSlackChannel,
    useUnsubscribeSlackChannel,
} from "../hooks/use-slack-subscriptions";
import type { SlackChannelListing } from "../api/slack.api";

interface Props {
    open: boolean;
    onClose: () => void;
}

const filterChannels = (
    channels: SlackChannelListing[],
    query: string,
): SlackChannelListing[] => {
    const q = query.trim().toLowerCase();
    if (!q) return channels;
    return channels.filter((c) => c.channelName.toLowerCase().includes(q));
};

export function SlackChannelPicker({ open, onClose }: Props) {
    const { data: channels, isLoading, isError, refetch } = useSlackChannels(open);
    const subscribe = useSubscribeSlackChannel();
    const unsubscribe = useUnsubscribeSlackChannel();
    const [query, setQuery] = useState("");

    const list = filterChannels(channels ?? [], query);
    const pending = subscribe.isPending || unsubscribe.isPending;

    const handleToggle = (ch: SlackChannelListing) => {
        if (pending) return;
        if (ch.subscribed) {
            unsubscribe.mutate(ch.channelId);
        } else {
            subscribe.mutate({ channelId: ch.channelId, channelName: ch.channelName });
        }
    };

    return (
        <Modal open={open} onClose={onClose} labelledBy="slack-picker-title">
            <header className="flex items-center justify-between px-6 sm:px-7 h-14 border-b border-ink/8 bg-[#F0F0EC]/70 backdrop-blur-sm shrink-0">
                <h2
                    id="slack-picker-title"
                    className="text-ink font-medium text-[15px] tracking-tight"
                >
                    Choose Slack channels
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </header>

            <div className="px-6 sm:px-7 pt-4 pb-3 shrink-0 border-b border-ink/5">
                <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search channels"
                    className={[
                        "w-full bg-white/70 border border-ink/10 rounded-xl",
                        "px-3.5 py-2 text-[13px] text-ink placeholder:text-ink-subtle",
                        "focus:outline-none focus:ring-2 focus:ring-indigo-soft/30 focus:border-indigo-soft/30",
                        "transition-all",
                    ].join(" ")}
                />
            </div>

            <section className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-3">
                {isLoading ? (
                    <div className="text-center py-12 text-[13px] text-ink-subtle">
                        Loading channels…
                    </div>
                ) : isError ? (
                    <div className="text-center py-12">
                        <p className="text-[13px] text-ink-muted">Couldn&rsquo;t load channels.</p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-2 text-[12px] text-indigo-soft hover:underline"
                        >
                            Try again
                        </button>
                    </div>
                ) : list.length === 0 ? (
                    <div className="text-center py-12 text-[13px] text-ink-subtle">
                        {query ? "No channels match." : "No public channels found."}
                    </div>
                ) : (
                    <ul className="flex flex-col gap-1">
                        {list.map((ch) => (
                            <li key={ch.channelId}>
                                <ChannelRow
                                    channel={ch}
                                    disabled={pending}
                                    onToggle={() => handleToggle(ch)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </Modal>
    );
}

interface RowProps {
    channel: SlackChannelListing;
    disabled: boolean;
    onToggle: () => void;
}

function ChannelRow({ channel, disabled, onToggle }: RowProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onToggle}
            className={[
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "text-left transition-colors duration-200 ease-calm",
                "hover:bg-ink/4 disabled:opacity-60 disabled:cursor-not-allowed",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-soft/30",
            ].join(" ")}
        >
            <span className="text-ink-subtle text-[13px] font-medium w-3 shrink-0">#</span>
            <span className="flex-1 min-w-0">
                <span className="block text-[13px] text-ink truncate">{channel.channelName}</span>
                {channel.topic ? (
                    <span className="block text-[11px] text-ink-subtle truncate">
                        {channel.topic}
                    </span>
                ) : null}
            </span>

            <span
                aria-hidden
                className={[
                    "shrink-0 w-9 h-5 rounded-full relative transition-colors",
                    channel.subscribed ? "bg-indigo-soft" : "bg-ink/15",
                ].join(" ")}
            >
                <span
                    className={[
                        "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-soft",
                        "transition-all duration-200 ease-calm",
                        channel.subscribed ? "left-[18px]" : "left-0.5",
                    ].join(" ")}
                />
            </span>
        </button>
    );
}
