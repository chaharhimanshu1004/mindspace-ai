"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/use-auth";

const primary =
    "inline-flex h-11 items-center whitespace-nowrap rounded-control bg-ink px-5 text-body font-semibold text-paper transition-colors duration-fast ease-standard hover:bg-ink/90 focus:outline-none focus-visible:shadow-ring";

export function NavActions() {
    const { user, ready } = useAuth();

    if (!ready) {
        return <div className="hidden h-11 w-36 sm:block" aria-hidden />;
    }

    if (user) {
        return (
            <Link href="/memories" className={`hidden sm:inline-flex ${primary}`}>
                Open memories
            </Link>
        );
    }

    return (
        <div className="hidden items-center gap-2 sm:flex">
            <Link
                href="/login"
                className="inline-flex h-11 items-center whitespace-nowrap rounded-control px-3.5 text-body font-semibold text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-3 hover:text-ink focus:outline-none focus-visible:shadow-ring"
            >
                Log in
            </Link>
            <Link href="/signup" className={primary}>
                Get started
            </Link>
        </div>
    );
}
