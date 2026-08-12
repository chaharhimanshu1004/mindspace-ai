import { PenLine, CalendarDays } from "lucide-react";
import { SlackIcon } from "./icons/slack-icon";
import { TelegramIcon } from "./icons/telegram-icon";
import { AnthropicIcon } from "./icons/anthropic-icon";
import type { RecallItem } from "./recall.types";

export const recallRowOne: RecallItem[] = [
    {
        icon: PenLine,
        brand: false,
        context: "note · 12 Jun",
        question: "What did I decide about the pricing page?",
    },
    {
        icon: SlackIcon,
        brand: true,
        context: "slack · #infra",
        question: "Who suggested Redis Streams over BullMQ?",
    },
    {
        icon: AnthropicIcon,
        brand: true,
        context: "claude code",
        question: "What was the rollback command we used?",
    },
    {
        icon: TelegramIcon,
        brand: true,
        context: "telegram · /save",
        question: "Which Postgres index did I add last week?",
    },
    {
        icon: PenLine,
        brand: false,
        context: "note · 4 May",
        question: "What were the three auth options I compared?",
    },
];

export const recallRowTwo: RecallItem[] = [
    {
        icon: SlackIcon,
        brand: true,
        context: "slack · #product",
        question: "Where did the schema discussion land?",
    },
    {
        icon: CalendarDays,
        brand: false,
        context: "calendar · deadline",
        question: "When is the client review due?",
    },
    {
        icon: PenLine,
        brand: false,
        context: "note · 28 Apr",
        question: "Why did we drop polling for webhooks?",
    },
    {
        icon: AnthropicIcon,
        brand: true,
        context: "claude code",
        question: "What did I change in the enrichment prompt?",
    },
    {
        icon: TelegramIcon,
        brand: true,
        context: "telegram",
        question: "What did I note after Tuesday's call?",
    },
];
