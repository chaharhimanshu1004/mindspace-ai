import { Plus } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { BrandTile } from "./brand-tile";
import { SlackIcon } from "./icons/slack-icon";
import { TelegramIcon } from "./icons/telegram-icon";
import { AnthropicIcon } from "./icons/anthropic-icon";
import { GmailIcon } from "./icons/gmail-icon";
import { GoogleCalendarIcon } from "./icons/google-calendar-icon";

const items = [
    { icon: SlackIcon, brand: true, title: "Slack", body: "Channel rollups from live webhooks." },
    { icon: TelegramIcon, brand: true, title: "Telegram", body: "Capture & recall via chat commands." },
    {
        icon: AnthropicIcon,
        brand: true,
        title: "Claude Code (MCP)",
        body: "Memory graph access in the terminal.",
    },
    {
        icon: GoogleCalendarIcon,
        brand: true,
        title: "Google Calendar",
        body: "Events become time-anchored memories.",
    },
    { icon: GmailIcon, brand: true, title: "Gmail", body: "Thread context distilled into notes." },
    { icon: Plus, brand: false, title: "More", body: "New sources land here continuously." },
];

export function IntegrationsGrid() {
    return (
        <section
            id="integrations"
            className="mx-auto max-w-6xl scroll-mt-20 px-6 pb-24 pt-12 sm:px-10"
        >
            <SectionHeading
                eyebrow="integrations"
                title="Everything you touch, remembered"
                description="A growing surface of native connectors, each feeding the same searchable memory store."
            />

            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <article
                        key={item.title}
                        className="flex items-start gap-4 rounded-3xl border border-[#E9E8E2] bg-white/70 p-6 shadow-soft backdrop-blur transition-all duration-300 ease-calm hover:shadow-lift"
                    >
                        <BrandTile icon={item.icon} brand={item.brand} />
                        <div className="min-w-0">
                            <h3 className="text-[15px] font-semibold tracking-tight text-[#2F3441]">
                                {item.title}
                            </h3>
                            <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">
                                {item.body}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
