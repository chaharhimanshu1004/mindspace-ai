"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { ProfileButton } from "@/features/profile/components/profile-button";

const navItems = [
    { href: "/memories", label: "Memories" },
    { href: "/ask", label: "Ask" },
];

export function AppHeader() {
    const pathname = usePathname();

    return (
        <header className="px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                <Wordmark href="/memories" />
                <nav className="flex items-center gap-1 text-sm">
                    {navItems.map((item) => {
                        const active = pathname?.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "px-3 py-1.5 rounded-xl transition-colors",
                                    active
                                        ? "text-indigo-soft bg-indigo-tint font-medium"
                                        : "text-ink-muted hover:text-ink",
                                ].join(" ")}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="flex items-center gap-3">
                <ProfileButton />
            </div>
        </header>
    );
}
