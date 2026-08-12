import Link from "next/link";
import { Hash, PenLine, Plug, Send, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { MemoryEmptyProps } from "./memory-empty.types";

function SlackEmpty({ slack }: Required<Pick<MemoryEmptyProps, "slack">>) {
    if (!slack.connected) {
        return (
            <EmptyState
                icon={Plug}
                title="Slack isn't connected"
                body="Connect your workspace and MindSpace will roll up the channels you pick."
                action={<Button onClick={slack.onConnect}>Connect Slack</Button>}
                note="profile → integrations → slack"
            />
        );
    }

    if (!slack.hasSubscriptions) {
        return (
            <EmptyState
                icon={Hash}
                title="No channels picked yet"
                body="Slack is connected. Choose which channels MindSpace should watch."
                action={
                    <Button variant="secondary" onClick={slack.onOpenPicker}>
                        Select channels
                    </Button>
                }
                note="rollups run on the hour"
            />
        );
    }

    return (
        <EmptyState
            icon={Hash}
            title="Nothing rolled up yet"
            body="Your channels are subscribed. Memories appear after the next rollup."
            note="rollups run on the hour"
        />
    );
}

function TelegramEmpty({ telegram }: Required<Pick<MemoryEmptyProps, "telegram">>) {
    if (!telegram.connected) {
        return (
            <EmptyState
                icon={Plug}
                title="Telegram isn't connected"
                body="Pair the bot once, then save thoughts and ask questions from the chat."
                action={<Button onClick={telegram.onConnect}>Connect Telegram</Button>}
                note="profile → integrations → telegram"
            />
        );
    }

    return (
        <EmptyState
            icon={Send}
            title="Nothing saved from Telegram yet"
            body="Send the bot a message to save your first thought from your phone."
            note="/save your thought"
        />
    );
}

function ClaudeEmpty() {
    return (
        <EmptyState
            icon={Terminal}
            title="Claude Code isn't connected"
            body="Add MindSpace as an MCP server and your terminal sessions can read and write here."
            action={
                <Link
                    href="/guide"
                    className="inline-flex h-11 items-center rounded-control border border-border-interactive bg-surface-1 px-5 text-body font-semibold text-ink transition-colors duration-fast ease-standard hover:bg-surface-3 focus:outline-none focus-visible:shadow-ring"
                >
                    Read the guide
                </Link>
            }
            note="oauth 2.0 · pkce"
        />
    );
}

export function MemoryEmpty({ sourceType, slack, telegram }: MemoryEmptyProps) {
    if (sourceType === "slack" && slack) return <SlackEmpty slack={slack} />;
    if (sourceType === "telegram" && telegram) return <TelegramEmpty telegram={telegram} />;
    if (sourceType === "claude_code") return <ClaudeEmpty />;

    return (
        <EmptyState
            icon={PenLine}
            title="Nothing here yet"
            body="Write your first thought below. Everything you save lands in one index."
            note="enter to save"
        />
    );
}
