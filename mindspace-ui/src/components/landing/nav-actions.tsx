"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/use-auth";

export function NavActions() {
    const { user, ready } = useAuth();

    if (!ready) {
        return <div className="h-9 w-32" aria-hidden />;
    }

    if (user) {
        return (
            <Link
                href="/memories"
                className="inline-flex items-center rounded-xl bg-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 ease-calm hover:bg-[#5457E0] hover:shadow-lift"
            >
                Memories
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-sm font-semibold text-[#6B7280] transition-colors duration-300 ease-calm hover:text-[#2F3441]"
            >
                Log in
            </Link>
            <Link
                href="/signup"
                className="inline-flex items-center rounded-xl bg-[#6366F1] px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 ease-calm hover:bg-[#5457E0] hover:shadow-lift"
            >
                Sign up
            </Link>
        </div>
    );
}
