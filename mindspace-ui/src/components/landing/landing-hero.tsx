import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MemoryNetwork } from "./memory-network";

export function LandingHero() {
    return (
        <section className="mx-auto max-w-6xl px-6 pb-10 pt-16 sm:px-10 lg:pt-20">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-8">
                <div className="w-full max-w-xl text-center lg:flex-1 lg:text-left">
                    <h1 className="text-[40px] font-bold leading-[1.05] tracking-tight text-[#2F3441] sm:text-[56px]">
                        MindSpace AI.
                        <span className="mt-1 block font-semibold text-[#2F3441]">
                            Your Personal{" "}
                            <span className="text-[#6366F1]">
                                Memory Infrastructure.
                            </span>
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-[#6B7280] lg:mx-0">
                        An animated, ever-running memory network that captures
                        your thoughts and interconnects them into one
                        intelligent, searchable mind.
                    </p>

                    <div className="mt-9 flex justify-center lg:justify-start">
                        <Link
                            href="/signup"
                            className="group inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-8 py-3.5 font-medium text-white shadow-soft transition-all duration-300 ease-calm hover:bg-[#5457E0] hover:shadow-lift"
                        >
                            Get Started
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-calm group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>

                <div className="w-full lg:flex-1">
                    <MemoryNetwork />
                </div>
            </div>
        </section>
    );
}
