import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

interface Props {
    title: string;
    subtitle: string;
    footer: { prompt: string; href: string; cta: string };
    children: React.ReactNode;
}

export function AuthShell({ title, subtitle, footer, children }: Props) {
    return (
        <main className="min-h-screen calm-gradient">
            <div className="grain min-h-screen">
                <header className="px-6 sm:px-10 pt-8">
                    <Wordmark />
                </header>
                <section className="flex items-center justify-center px-6 py-16 sm:py-24">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <h1 className="text-[28px] sm:text-[32px] leading-tight tracking-tight text-ink font-medium">
                                {title}
                            </h1>
                            <p className="mt-2 text-ink-muted text-[15px]">{subtitle}</p>
                        </div>
                        {children}
                        <p className="mt-6 text-center text-sm text-ink-muted">
                            {footer.prompt}{" "}
                            <Link
                                href={footer.href}
                                className="text-indigo-soft hover:text-indigo-hover transition-colors"
                            >
                                {footer.cta}
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
