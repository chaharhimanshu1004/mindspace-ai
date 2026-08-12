import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { HeroArt } from "./hero-art";
import { HeroSources } from "./hero-sources";
import { InlineBrand } from "./inline-brand";
import { ScrollCue } from "./scroll-cue";
import { SlackIcon } from "./icons/slack-icon";
import { TelegramIcon } from "./icons/telegram-icon";
import { AnthropicIcon } from "./icons/anthropic-icon";

export function LandingHero() {
    return (
        <section className="relative mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-content flex-col justify-center px-11 pb-24 pt-12 sm:px-16 lg:px-20">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-14">
                <div className="w-full lg:flex-1">
                    <h1 className="ink-weight max-w-[17ch] font-display text-[38px] leading-[1.08] tracking-[-0.022em] text-ink sm:text-display-xl">
                        Never lose a thought again.
                    </h1>

                    <p className="mt-6 max-w-[48ch] text-body-lg text-ink-muted">
                        Thoughts from{" "}
                        <InlineBrand icon={Globe} label="the web" />,{" "}
                        <InlineBrand icon={SlackIcon} label="Slack" />,{" "}
                        <InlineBrand icon={TelegramIcon} label="Telegram" /> and{" "}
                        <InlineBrand icon={AnthropicIcon} label="Claude Code" />, embedded
                        into one index you can question.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link
                            href="/signup"
                            className="group inline-flex h-11 items-center gap-2 rounded-control bg-ink px-6 text-body font-semibold text-paper transition-colors duration-fast ease-standard hover:bg-ink/90 focus:outline-none focus-visible:shadow-ring"
                        >
                            Get started
                            <ArrowRight
                                aria-hidden
                                className="h-4 w-4 transition-transform duration-fast ease-standard group-hover:translate-x-0.5"
                            />
                        </Link>
                        <Link
                            href="/guide"
                            className="rounded-control text-body font-semibold text-ink underline decoration-border-strong decoration-2 underline-offset-4 transition-colors duration-fast ease-standard hover:decoration-ink focus:outline-none focus-visible:shadow-ring"
                        >
                            Read the guide
                        </Link>
                    </div>

                    <div className="mt-10 border-t border-border-subtle pt-5">
                        <HeroSources />
                    </div>
                </div>

                <div className="w-full lg:flex-1">
                    <HeroArt />
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-7 flex justify-center px-11 sm:px-16">
                <ScrollCue href="#pipeline" label="how it works" />
            </div>
        </section>
    );
}
