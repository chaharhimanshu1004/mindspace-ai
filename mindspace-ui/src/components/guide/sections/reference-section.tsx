import { GuideSection } from "../guide-section";
import { LifecycleTracker } from "@/components/landing/lifecycle-tracker";

const faqs = [
    {
        q: "Where do answers come from?",
        a: "Only your saved memories. MindSpace performs semantic search over your own vectors — it never answers from the open web or model training data.",
    },
    {
        q: "Can I edit Slack or Telegram memories in the app?",
        a: "Synced sources are read-only inside the app. You can add typed notes manually, but integration memories flow in automatically.",
    },
    {
        q: "Is my data isolated?",
        a: "Yes. Every memory is scoped to your account, and MCP access uses per-client OAuth tokens with explicit read/write scopes.",
    },
    {
        q: "What does “enriched” mean on a card?",
        a: "It means the memory has been embedded, given a title and topics, and linked to related entities — the final state in the lifecycle below.",
    },
];

export function ReferenceSection() {
    return (
        <div className="space-y-20">
            <GuideSection
                id="lifecycle"
                eyebrow="reference"
                title="The memory lifecycle"
                intro="Every memory moves through the same pipeline, no matter where it came from."
            >
                <LifecycleTracker />
            </GuideSection>

            <GuideSection
                id="faq"
                eyebrow="reference"
                title="Frequently asked"
            >
                <div className="space-y-3">
                    {faqs.map((f) => (
                        <div
                            key={f.q}
                            className="rounded-2xl border border-[#E9E8E2] bg-white/70 p-5 shadow-soft backdrop-blur"
                        >
                            <h4 className="text-[15px] font-semibold tracking-tight text-[#2F3441]">
                                {f.q}
                            </h4>
                            <p className="mt-1.5 text-[14px] leading-relaxed text-[#6B7280]">
                                {f.a}
                            </p>
                        </div>
                    ))}
                </div>
            </GuideSection>
        </div>
    );
}
