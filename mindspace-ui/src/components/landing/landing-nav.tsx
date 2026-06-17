import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { NavActions } from "./nav-actions";

const links = [
    { label: "Features", href: "#features" },
    { label: "Integrations", href: "#integrations" },
    { label: "Pricing", href: "#pricing" },
];

export function LandingNav() {
    return (
        <header className="sticky top-0 z-50 border-b border-[#E9E8E2] bg-[#FAFAF7]/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10">
                <BrandMark href="/" />

                <nav className="hidden items-center gap-1 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="rounded-xl px-3 py-2 text-sm font-semibold text-[#6B7280] transition-colors duration-300 ease-calm hover:text-[#2F3441]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <NavActions />
            </div>
        </header>
    );
}
