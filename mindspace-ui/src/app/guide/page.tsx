import { LandingBackground } from "@/components/landing/landing-background";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { GuideSidebar } from "@/components/guide/guide-sidebar";
import { GettingStartedSection } from "@/components/guide/sections/getting-started-section";
import { ClaudeSection } from "@/components/guide/sections/claude-section";
import { SlackSection } from "@/components/guide/sections/slack-section";
import { TelegramSection } from "@/components/guide/sections/telegram-section";
import { CalendarSection } from "@/components/guide/sections/calendar-section";
import { UsageSection } from "@/components/guide/sections/usage-section";
import { ReferenceSection } from "@/components/guide/sections/reference-section";

export default function GuidePage() {
    return (
        <main className="relative min-h-screen bg-[#FAFAF7]">
            <LandingBackground />
            <LandingNav />

            <div className="mx-auto flex max-w-6xl gap-12 px-6 pb-24 pt-12 sm:px-10">
                <aside className="hidden w-56 shrink-0 lg:block">
                    <div className="sticky top-24">
                        <GuideSidebar />
                    </div>
                </aside>

                <article className="min-w-0 flex-1 space-y-20">
                    <header>
                        <h1 className="text-[36px] font-bold leading-[1.05] tracking-tight text-[#2F3441] sm:text-[48px]">
                            MindSpace{" "}
                            <span className="text-[#6366F1]">Guide</span>
                        </h1>
                        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#6B7280]">
                            Everything you need to capture, connect, and recall
                            your thoughts — from first sign-in to wiring up
                            Claude, Slack, Telegram, and Google Calendar.
                        </p>
                    </header>

                    <GettingStartedSection />
                    <ClaudeSection />
                    <SlackSection />
                    <TelegramSection />
                    <CalendarSection />
                    <UsageSection />
                    <ReferenceSection />
                </article>
            </div>

            <LandingFooter />
        </main>
    );
}
