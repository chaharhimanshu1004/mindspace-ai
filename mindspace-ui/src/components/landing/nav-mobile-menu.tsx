"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "./nav-links";
import { NavMobileCta } from "./nav-mobile-cta";

export function NavMobileMenu() {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <div className="sm:hidden">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-border-interactive bg-surface-1 text-ink transition-colors duration-fast ease-standard hover:bg-surface-3 focus:outline-none focus-visible:shadow-ring"
            >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            {open ? (
                <div className="absolute inset-x-0 top-full border-b border-border-subtle bg-paper/95 backdrop-blur-md">
                    <nav aria-label="Primary" className="mx-auto flex max-w-content flex-col px-11 py-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={close}
                                className="rounded-control px-3 py-3 text-body font-semibold text-ink transition-colors duration-fast ease-standard hover:bg-surface-3 focus:outline-none focus-visible:shadow-ring"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <NavMobileCta onNavigate={close} />
                    </nav>
                </div>
            ) : null}
        </div>
    );
}
