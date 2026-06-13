import { GuideSection } from "../guide-section";
import { GuideStep } from "../guide-step";
import { GuideCallout } from "../guide-callout";
import { IntegrationHeader } from "../integration-header";
import { SlackIcon } from "@/components/landing/icons/slack-icon";

export function SlackSection() {
    return (
        <GuideSection
            id="slack"
            eyebrow="integration"
            title="Slack"
            intro="Turn ambient team chatter into clean, recallable memory. MindSpace listens to the channels you choose and rolls them up — without flooding your memory store."
        >
            <div className="rounded-3xl border border-[#E9E8E2] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
                <IntegrationHeader
                    icon={SlackIcon}
                    brand
                    title="Workspace rollup"
                    tagline="Real-time webhooks · hourly digests"
                />

                <div className="mt-8">
                    <GuideStep n={1} title="Connect your workspace">
                        <p>
                            Open Settings → Integrations → Slack and press
                            Connect. You&rsquo;ll approve a standard Slack OAuth
                            consent for read-only channel access.
                        </p>
                    </GuideStep>

                    <GuideStep n={2} title="Choose your channels">
                        <p>
                            Back in the Slack card, pick which channels to
                            subscribe to. Only those are ever read — everything
                            else stays untouched.
                        </p>
                    </GuideStep>

                    <GuideStep n={3} title="Let the rollups flow" last>
                        <p>
                            Messages are collected in real time and distilled
                            into event-sourced daily and thread rollups — so a
                            busy channel becomes a handful of meaningful
                            memories, not noise.
                        </p>
                    </GuideStep>
                </div>

                <div className="mt-2">
                    <GuideCallout>
                        Slack memories are synced automatically — you
                        can&rsquo;t add them by hand. Disconnect any time from
                        the same screen.
                    </GuideCallout>
                </div>
            </div>
        </GuideSection>
    );
}
