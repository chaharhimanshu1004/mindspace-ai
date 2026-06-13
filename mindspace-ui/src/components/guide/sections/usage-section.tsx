import { GuideSection } from "../guide-section";
import { GuideCallout } from "../guide-callout";

export function UsageSection() {
    return (
        <div className="space-y-20">
            <GuideSection
                id="capturing"
                eyebrow="using mindspace"
                title="Capturing memories"
                intro="There's no single right way to save — use whichever surface is closest to the thought."
            >
                <ul className="space-y-3">
                    {[
                        ["Web app", "Type into the composer on the Memories page. Best for considered notes."],
                        ["Claude Code", "Let Claude call save_memory mid-session — decisions and insights captured as you work."],
                        ["Telegram", "Fire /save from your phone the moment something occurs to you."],
                        ["Slack", "Subscribed channels roll up on their own — zero effort."],
                    ].map(([k, v]) => (
                        <li
                            key={k}
                            className="flex gap-3 rounded-2xl border border-[#E9E8E2] bg-white/70 px-4 py-3 shadow-soft backdrop-blur"
                        >
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]" />
                            <p className="text-[14px] leading-relaxed text-[#6B7280]">
                                <span className="font-semibold text-[#2F3441]">
                                    {k}
                                </span>{" "}
                                — {v}
                            </p>
                        </li>
                    ))}
                </ul>
            </GuideSection>

            <GuideSection
                id="asking"
                eyebrow="using mindspace"
                title="Asking questions"
                intro="Recall is semantic — ask the way you think, not the way you filed it."
            >
                <div className="space-y-4">
                    <p className="text-[14.5px] leading-relaxed text-[#6B7280]">
                        From the Ask page (or Telegram&rsquo;s{" "}
                        <code className="rounded bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                            /ask
                        </code>
                        ), pose a question in plain language. MindSpace embeds
                        your query, finds the closest memories by meaning, and
                        composes an answer grounded only in what you&rsquo;ve
                        saved — with sources you can open.
                    </p>
                    <GuideCallout>
                        Answers never invent facts. If nothing relevant is
                        stored, MindSpace tells you rather than guessing.
                    </GuideCallout>
                </div>
            </GuideSection>
        </div>
    );
}
