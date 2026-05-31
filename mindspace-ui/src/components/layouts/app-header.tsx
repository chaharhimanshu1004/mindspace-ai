"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/use-auth";

const navItems = [
    { href: "/memories", label: "Memories" },
    { href: "/ask", label: "Ask" },
];

export function AppHeader() {
    const { user, signOut } = useAuth();
    const pathname = usePathname();

    return (
        <header className="px-6 sm:px-10 pt-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
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
                                        ? "text-ink bg-indigo-tint"
                                        : "text-ink-muted hover:text-ink",
                                ].join(" ")}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="flex items-center gap-3 text-sm text-ink-muted">
                <span className="hidden sm:inline">{user?.email}</span>
                <Button variant="ghost" size="md" onClick={() => signOut()}>
                    Sign out
                </Button>
            </div>
        </header>
    );
}
