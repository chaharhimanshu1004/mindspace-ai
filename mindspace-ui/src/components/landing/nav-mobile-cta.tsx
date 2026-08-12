"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/use-auth";

interface Props {
    onNavigate: () => void;
}

export function NavMobileCta({ onNavigate }: Props) {
    const { user, ready } = useAuth();

    if (!ready) return null;

    return (
        <div className="mt-3 flex flex-col gap-2 border-t border-border-subtle pt-4">
            {user ? null : (
                <Link
                    href="/login"
                    onClick={onNavigate}
                    className="flex h-11 items-center rounded-control px-3 text-body font-semibold text-ink-muted transition-colors duration-fast ease-standard hover:bg-surface-3 hover:text-ink focus:outline-none focus-visible:shadow-ring"
                >
                    Log in
                </Link>
            )}
            <Link
                href={user ? "/memories" : "/signup"}
                onClick={onNavigate}
                className="flex h-11 items-center justify-center rounded-control bg-ink text-body font-semibold text-paper transition-colors duration-fast ease-standard hover:bg-ink/90 focus:outline-none focus-visible:shadow-ring"
            >
                {user ? "Open memories" : "Get started"}
            </Link>
        </div>
    );
}
