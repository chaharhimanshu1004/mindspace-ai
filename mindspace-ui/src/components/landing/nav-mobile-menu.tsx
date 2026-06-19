"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "./nav-links";

export function NavMobileMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div className="md:hidden">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={open}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E9E8E2] bg-white/70 text-[#2F3441] transition-colors duration-300 ease-calm hover:border-[#6366F1]/30"
            >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            {open ? (
                <div className="absolute inset-x-0 top-16 border-b border-[#E9E8E2] bg-[#FAFAF7]/95 backdrop-blur-md">
                    <nav className="mx-auto flex max-w-6xl flex-col px-6 py-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#2F3441] transition-colors duration-300 ease-calm hover:bg-[#2F3441]/5"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            ) : null}
        </div>
    );
}
