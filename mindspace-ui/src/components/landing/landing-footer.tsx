import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { footerGroups } from "./footer.data";

export function LandingFooter() {
    return (
        <footer className="border-t border-border-subtle bg-surface-1">
            <div className="mx-auto grid max-w-content grid-cols-2 gap-10 px-11 py-14 sm:px-16 lg:px-20 lg:grid-cols-4">
                <div className="col-span-2 lg:col-span-1">
                    <BrandMark href="/" />
                    <p className="mt-4 max-w-[34ch] text-body-sm text-ink-muted">
                        Captured, embedded, handed back when you ask.
                    </p>
                </div>

                {footerGroups.map((group) => (
                    <nav key={group.title} aria-label={group.title}>
                        <h4 className="text-overline font-semibold uppercase text-ink-subtle">
                            {group.title}
                        </h4>
                        <ul className="mt-4 space-y-2.5">
                            {group.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="rounded-control text-body-sm text-ink-muted transition-colors duration-fast ease-standard hover:text-ink focus:outline-none focus-visible:shadow-ring"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>

            <div className="border-t border-border-subtle">
                <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-11 py-6 text-meta text-ink-subtle sm:flex-row sm:px-16 lg:px-20">
                    <span>© 2026 MindSpace AI</span>
                    <span className="font-mono tnum">v1.0</span>
                </div>
            </div>
        </footer>
    );
}
