"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand/brand-mark";
import { ProfileButton } from "@/features/profile/components/profile-button";

const navItems = [
    { href: "/memories", label: "Memories" },
    { href: "/ask", label: "Ask" },
];

export function AppHeader() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-paper/90 backdrop-blur-md">
            <div className="mx-auto flex min-h-[4.5rem] max-w-content items-center justify-between gap-4 px-6 py-3.5 sm:px-10">
                <div className="flex min-w-0 items-center gap-4 sm:gap-8">
                    <BrandMark href="/memories" />

                    <nav
                        aria-label="Sections"
                        className="flex items-center gap-1 rounded-control border border-border-subtle bg-surface-2 p-1"
                    >
                        {navItems.map((item) => {
                            const active = pathname?.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={active ? "page" : undefined}
                                    className={[
                                        "rounded-[7px] px-3.5 py-1.5 text-body-sm font-semibold",
                                        "transition-colors duration-fast ease-standard",
                                        "focus:outline-none focus-visible:shadow-ring",
                                        active
                                            ? "bg-surface-1 text-ink shadow-xs"
                                            : "text-ink-muted hover:text-ink",
                                    ].join(" ")}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <ProfileButton />
            </div>
        </header>
    );
}
