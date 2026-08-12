import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingCta() {
    return (
        <section className="mx-auto max-w-content px-11 pb-24 sm:px-16 lg:px-20">
            <div className="border-y border-border-strong py-16 text-center">
                <h2 className="mx-auto max-w-[22ch] ink-weight font-display text-[24px] leading-[1.16] tracking-[-0.015em] text-ink sm:text-display-md">
                    Start with one note.
                </h2>
                <p className="mx-auto mt-4 max-w-[38ch] text-body text-ink-muted">
                    Free to set up. Connect a source when you want one.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    <Link
                        href="/signup"
                        className="group inline-flex h-11 items-center gap-2 rounded-control bg-ink px-6 text-body font-semibold text-paper transition-colors duration-fast ease-standard hover:bg-ink/90 focus:outline-none focus-visible:shadow-ring"
                    >
                        Create an account
                        <ArrowRight
                            aria-hidden
                            className="h-4 w-4 transition-transform duration-fast ease-standard group-hover:translate-x-0.5"
                        />
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-control text-body font-semibold text-ink-muted transition-colors duration-fast ease-standard hover:text-ink focus:outline-none focus-visible:shadow-ring"
                    >
                        I already have one
                    </Link>
                </div>
            </div>
        </section>
    );
}
