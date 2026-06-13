import { GuideSection } from "../guide-section";
import { GuideStep } from "../guide-step";
import { GuideCallout } from "../guide-callout";
import { CodeBlock } from "../code-block";
import { IntegrationHeader } from "../integration-header";
import { TelegramIcon } from "@/components/landing/icons/telegram-icon";

const saveCmd = `/save Vendor SLA breach — follow up on credits by Friday`;
const askCmd = `/ask what did I owe the vendor?`;

export function TelegramSection() {
    return (
        <GuideSection
            id="telegram"
            eyebrow="integration"
            title="Telegram"
            intro="Capture and recall on the move. Pair the MindSpace bot once, then save thoughts and query your brain with two simple commands."
        >
            <div className="rounded-3xl border border-[#E9E8E2] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
                <IntegrationHeader
                    icon={TelegramIcon}
                    brand
                    title="Quick capture bot"
                    tagline="/save and /ask from your pocket"
                />

                <div className="mt-8">
                    <GuideStep n={1} title="Connect from Settings">
                        <p>
                            Open Settings → Integrations → Telegram and press
                            Connect. MindSpace opens the bot with a one-time
                            pairing link (
                            <code className="rounded bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                                /start pair_…
                            </code>
                            ).
                        </p>
                    </GuideStep>

                    <GuideStep n={2} title="Confirm the pairing">
                        <p>
                            The bot replies{" "}
                            <span className="italic">
                                “Connection successful 🎉”
                            </span>{" "}
                            once your Telegram account is linked. You only do
                            this once.
                        </p>
                    </GuideStep>

                    <GuideStep n={3} title="Save a thought">
                        <p>
                            Send <strong>/save</strong> followed by your note.
                            It lands in your memory store and starts embedding
                            immediately.
                        </p>
                        <CodeBlock code={saveCmd} label="telegram" />
                    </GuideStep>

                    <GuideStep n={4} title="Ask a question" last>
                        <p>
                            Send <strong>/ask</strong> followed by your
                            question. The bot answers from your saved memories
                            and cites what it used.
                        </p>
                        <CodeBlock code={askCmd} label="telegram" />
                    </GuideStep>
                </div>

                <div className="mt-2">
                    <GuideCallout>
                        Plain messages without a command aren&rsquo;t saved — the
                        bot will remind you to start with{" "}
                        <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                            /save
                        </code>{" "}
                        or{" "}
                        <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                            /ask
                        </code>
                        .
                    </GuideCallout>
                </div>
            </div>
        </GuideSection>
    );
}
