import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

const groups = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/#features" },
            { label: "Integrations", href: "/#integrations" },
            { label: "Guide", href: "/guide" },
            { label: "Pricing", href: "/#pricing" },
        ],
    },
    {
        title: "Capture",
        links: [
            { label: "Claude Code", href: "#integrations" },
            { label: "Slack", href: "#integrations" },
            { label: "Telegram", href: "#integrations" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "Sign in", href: "/login" },
            { label: "Get started", href: "/signup" },
        ],
    },
];

export function LandingFooter() {
    return (
        <footer className="border-t border-border-subtle">
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 sm:px-10 md:grid-cols-4">
                <div className="col-span-2 md:col-span-1">
                    <Wordmark />
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
                        A continuous second brain that captures, embeds, and
                        connects everything you think.
                    </p>
                </div>

                {groups.map((group) => (
                    <div key={group.title}>
                        <h4 className="text-xs uppercase tracking-[0.16em] text-ink-subtle">
                            {group.title}
                        </h4>
                        <ul className="mt-4 space-y-2.5">
                            {group.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-ink-muted transition-colors duration-300 ease-calm hover:text-ink"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="border-t border-border-softer">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-ink-subtle sm:flex-row sm:px-10">
                    <span>© 2026 MindSpace · made with care</span>
                    <span>v1.0</span>
                </div>
            </div>
        </footer>
    );
}
