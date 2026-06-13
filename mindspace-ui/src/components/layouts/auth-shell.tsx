import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { AuthArt } from "./auth-art";

interface Props {
    title: string;
    subtitle: string;
    footer: { prompt: string; href: string; cta: string };
    artSide?: "left" | "right";
    children: React.ReactNode;
}

export function AuthShell({
    title,
    subtitle,
    footer,
    artSide = "right",
    children,
}: Props) {
    return (
        <main
            className={`flex min-h-screen bg-[#FAFAF7] ${
                artSide === "left" ? "lg:flex-row-reverse" : ""
            }`}
        >
            <div className="relative flex w-full flex-col lg:w-[48%]">
                <header className="px-6 pt-8 sm:px-12">
                    <Wordmark />
                </header>

                <section className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
                    <div className="w-full max-w-sm">
                        <h1 className="text-[30px] font-bold leading-tight tracking-tight text-[#2F3441] sm:text-[34px]">
                            {title}
                        </h1>
                        <p className="mt-2 text-[15px] leading-relaxed text-[#6B7280]">
                            {subtitle}
                        </p>

                        <div className="mt-8">{children}</div>

                        <p className="mt-7 text-sm text-[#6B7280]">
                            {footer.prompt}{" "}
                            <Link
                                href={footer.href}
                                className="font-semibold text-[#6366F1] transition-colors duration-300 ease-calm hover:text-[#5457E0]"
                            >
                                {footer.cta}
                            </Link>
                        </p>
                    </div>
                </section>
            </div>

            <aside className="hidden lg:block lg:w-[52%]">
                <AuthArt />
            </aside>
        </main>
    );
}
