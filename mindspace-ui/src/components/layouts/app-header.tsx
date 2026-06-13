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
        <header className="sticky top-0 z-40 border-b border-[#E9E8E2]/60 bg-[#FAFAF7]/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-10">
                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                    <BrandMark href="/memories" />
                    <nav className="flex items-center gap-1 text-sm">
                        {navItems.map((item) => {
                            const active = pathname?.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={[
                                        "px-3.5 py-1.5 rounded-xl font-semibold transition-all duration-300 ease-calm",
                                        active
                                            ? "bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white shadow-soft"
                                            : "text-[#6B7280] hover:text-[#2F3441]",
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
            </div>
        </header>
    );
}
