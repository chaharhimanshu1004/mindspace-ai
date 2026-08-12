import { Plus } from "lucide-react";
import { SlackIcon } from "./icons/slack-icon";
import { TelegramIcon } from "./icons/telegram-icon";
import { AnthropicIcon } from "./icons/anthropic-icon";
import { GmailIcon } from "./icons/gmail-icon";
import { GoogleCalendarIcon } from "./icons/google-calendar-icon";
import type { Integration } from "./integrations.types";

export const integrations: Integration[] = [
    {
        icon: SlackIcon,
        brand: true,
        title: "Slack",
        body: "Channel and thread rollups, rebuilt on every pass.",
        status: "live",
    },
    {
        icon: TelegramIcon,
        brand: true,
        title: "Telegram",
        body: "Pair once with a deep link.",
        status: "live",
    },
    {
        icon: AnthropicIcon,
        brand: true,
        title: "Claude Code",
        body: "MCP over OAuth 2.0 with PKCE.",
        status: "live",
    },
    {
        icon: GoogleCalendarIcon,
        brand: true,
        title: "Google Calendar",
        body: "A deadline in a note becomes an event.",
        status: "live",
    },
    {
        icon: GmailIcon,
        brand: true,
        title: "Gmail",
        body: "Thread context as notes. Not wired up yet.",
        status: "soon",
    },
    {
        icon: Plus,
        brand: false,
        title: "Bring your own",
        body: "A new source is a service and a source type.",
        status: "soon",
    },
];
