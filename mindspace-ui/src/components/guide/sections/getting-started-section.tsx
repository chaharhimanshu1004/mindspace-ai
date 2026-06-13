import { Brain, Network, Search, Inbox } from "lucide-react";
import { GuideSection } from "../guide-section";
import { GuideStep } from "../guide-step";

const pillars = [
    {
        icon: Inbox,
        title: "Capture",
        body: "Type in the app, post in Slack, message the Telegram bot, or let Claude save from your terminal.",
    },
    {
        icon: Brain,
        title: "Embed",
        body: "Every memory is chunked and encoded into a 768-dim vector the moment it lands.",
    },
    {
        icon: Network,
        title: "Enrich",
        body: "Titles, topics, and entities are extracted and linked to related memories automatically.",
    },
    {
        icon: Search,
        title: "Recall",
        body: "Ask in natural language from the web app, Telegram, or any MCP-connected AI client.",
    },
];

export function GettingStartedSection() {
    return (
        <div className="space-y-20">
            <GuideSection
                id="overview"
                eyebrow="getting started"
                title="What is MindSpace?"
                intro="MindSpace is a continuous personal memory layer. It captures the thoughts you scatter across tools, embeds and connects them, then lets you recall everything in one place — by meaning, not keywords."
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {pillars.map((p) => {
                        const Icon = p.icon;
                        return (
                            <div
                                key={p.title}
                                className="rounded-2xl border border-[#E9E8E2] bg-white/70 p-5 shadow-soft backdrop-blur"
                            >
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#6366F1]">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <h4 className="mt-4 text-[15px] font-semibold tracking-tight text-[#2F3441]">
                                    {p.title}
                                </h4>
                                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#6B7280]">
                                    {p.body}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </GuideSection>

            <GuideSection
                id="quickstart"
                eyebrow="quickstart"
                title="Up and running in minutes"
                intro="Four steps from empty to a connected, queryable second brain."
            >
                <div>
                    <GuideStep n={1} title="Create your account">
                        <p>
                            Sign up, then sign in. You land on your Memories
                            workspace — the home for everything you capture.
                        </p>
                    </GuideStep>
                    <GuideStep n={2} title="Capture your first thought">
                        <p>
                            Use the composer at the bottom of the Memories page.
                            Within seconds it moves from{" "}
                            <code className="rounded bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                                pending
                            </code>{" "}
                            to{" "}
                            <code className="rounded bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                                enriched
                            </code>
                            .
                        </p>
                    </GuideStep>
                    <GuideStep n={3} title="Connect an integration">
                        <p>
                            Open Settings → Integrations and connect Claude
                            Code, Slack, Telegram, or Google Calendar. Each one
                            feeds the same memory store.
                        </p>
                    </GuideStep>
                    <GuideStep n={4} title="Ask your brain" last>
                        <p>
                            Head to the Ask page and query in plain language.
                            Answers are grounded only in your saved memories.
                        </p>
                    </GuideStep>
                </div>
            </GuideSection>
        </div>
    );
}
