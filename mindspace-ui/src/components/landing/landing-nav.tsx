import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { NavActions } from "./nav-actions";
import { NavMobileMenu } from "./nav-mobile-menu";
import { navLinks } from "./nav-links";

export function LandingNav() {
    return (
        <header className="sticky top-0 z-50 border-b border-border-subtle bg-paper/90 backdrop-blur-md">
            <div className="mx-auto flex min-h-[4.5rem] max-w-content items-center justify-between gap-6 px-11 py-3.5 sm:px-16 lg:px-20">
                <BrandMark href="/" />

                <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="rounded-control px-3.5 py-2 text-body font-semibold text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-3 hover:text-ink focus:outline-none focus-visible:shadow-ring"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <NavActions />
                    <NavMobileMenu />
                </div>
            </div>
        </header>
    );
}
