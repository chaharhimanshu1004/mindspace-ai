import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { MemoryGraph } from "@/components/graph/memory-graph";
import { Overline } from "@/components/ui/overline";
import { PageRules } from "./page-rules";

interface Props {
    overline: string;
    title: string;
    subtitle: string;
    footer: { prompt: string; href: string; cta: string };
    graphSide?: "left" | "right";
    children: React.ReactNode;
}

export function AuthShell({
    overline,
    title,
    subtitle,
    footer,
    graphSide = "right",
    children,
}: Props) {
    return (
        <main className="relative grain min-h-svh bg-paper">
            <PageRules />

            <header className="border-b border-border-subtle">
                <div className="mx-auto flex min-h-[4.5rem] w-full max-w-content items-center px-11 py-3.5 sm:px-16 lg:px-20">
                    <BrandMark href="/" />
                </div>
            </header>

            <div className={`mx-auto flex w-full max-w-content flex-col gap-14 px-11 pb-20 pt-6 sm:px-16 sm:pt-10 lg:items-center lg:gap-16 lg:px-20 ${graphSide === "left" ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
                <section className="w-full lg:flex-1">
                    <div className="w-full max-w-[26rem]">
                        <Overline>{overline}</Overline>

                        <h1 className="ink-weight mt-5 font-display text-[26px] leading-[1.14] tracking-[-0.015em] text-ink sm:text-display-md">
                            {title}
                        </h1>
                        <p className="mt-3 text-body text-ink-muted">{subtitle}</p>

                        <div className="mt-9">{children}</div>

                        <p className="mt-9 border-t border-border-subtle pt-6 text-body-sm text-ink-muted">
                            {footer.prompt}{" "}
                            <Link
                                href={footer.href}
                                className="rounded-control font-semibold text-ink underline decoration-border-strong decoration-2 underline-offset-4 transition-colors duration-fast ease-standard hover:decoration-ink focus:outline-none focus-visible:shadow-ring"
                            >
                                {footer.cta}
                            </Link>
                        </p>
                    </div>
                </section>

                <aside className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
                    <MemoryGraph />
                </aside>
            </div>
        </main>
    );
}
