import { Scan } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { LifecycleTracker } from "./lifecycle-tracker";
import { BrandTile } from "./brand-tile";
import { SlackIcon } from "./icons/slack-icon";
import { TelegramIcon } from "./icons/telegram-icon";
import { AnthropicIcon } from "./icons/anthropic-icon";

const steps = [
    {
        icon: SlackIcon,
        brand: true,
        title: "Slack",
        body: "Real-time channel webhooks gather ambient text into clean, event-sourced daily rollups.",
    },
    {
        icon: TelegramIcon,
        brand: true,
        title: "Telegram",
        body: "Save a thought or question context instantly with simple /save and /ask commands.",
    },
    {
        icon: AnthropicIcon,
        brand: true,
        title: "Claude Code (MCP)",
        body: "A Model Context Protocol client reaches your memory graph directly from terminal sessions.",
    },
    {
        icon: Scan,
        brand: false,
        title: "UI Capture",
        body: "Type thoughts straight into the web app for quick, direct capture whenever inspiration strikes.",
    },
];

export function HowItWorks() {
    return (
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:px-10">
            <SectionHeading
                eyebrow="how it works"
                title="One mind, many on-ramps"
                description="Every source feeds the same memory store through generously rounded, low-friction capture cards."
            />

            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                {steps.map((step) => (
                    <article
                        key={step.title}
                        className="flex flex-col rounded-3xl border border-[#E9E8E2] bg-white/70 p-6 shadow-soft backdrop-blur transition-all duration-300 ease-calm hover:shadow-lift"
                    >
                        <BrandTile icon={step.icon} brand={step.brand} />
                        <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-[#2F3441]">
                            {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                            {step.body}
                        </p>
                    </article>
                ))}
            </div>

            <LifecycleTracker />
        </section>
    );
}
