import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

export default function LandingPage() {
    return (
        <main className="min-h-screen calm-gradient">
            <div className="grain min-h-screen flex flex-col">
                <header className="px-6 sm:px-10 pt-8 flex items-center justify-between">
                    <Wordmark />
                    <nav className="flex items-center gap-2 text-sm">
                        <Link
                            href="/login"
                            className="text-ink-muted hover:text-ink transition-colors px-3 py-2 rounded-xl"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            className="text-white bg-indigo-soft hover:bg-indigo-hover transition-all px-4 py-2 rounded-xl shadow-soft hover:shadow-lift"
                        >
                            Get started
                        </Link>
                    </nav>
                </header>

                <section className="flex-1 flex items-center justify-center px-6">
                    <div className="max-w-2xl text-center">
                        <span className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-ink-subtle">
                            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                            a quiet second brain
                        </span>
                        <h1 className="mt-5 text-[40px] sm:text-[56px] leading-[1.05] tracking-tight text-ink font-medium">
                            Watch your thoughts <br className="hidden sm:block" />
                            <span className="text-indigo-soft">find each other.</span>
                        </h1>
                        <p className="mt-6 text-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
                            MindSpace is a calm sanctuary for the notes, reflections, and
                            half-formed ideas you carry. Save a thought — and watch it quietly
                            connect to everything else you&rsquo;ve ever written.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-3">
                            <Link
                                href="/signup"
                                className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-indigo-soft text-white font-medium shadow-soft hover:bg-indigo-hover hover:shadow-lift transition-all duration-300 ease-calm"
                            >
                                Begin
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center h-12 px-6 rounded-2xl bg-white/70 backdrop-blur border border-border-subtle text-ink hover:border-ink/20 transition-all duration-300 ease-calm"
                            >
                                I have an account
                            </Link>
                        </div>
                    </div>
                </section>

                <footer className="px-6 sm:px-10 py-8 text-center text-xs text-ink-subtle">
                    made with care · v0.1
                </footer>
            </div>
        </main>
    );
}
