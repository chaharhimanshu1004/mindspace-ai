import { Sparkles } from "lucide-react";

export function MemoryEmpty() {
    return (
        <div className="text-center py-20 sm:py-28">
            <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#818CF8] to-[#6366F1] text-white shadow-[0_12px_28px_rgba(99,102,241,0.35)]">
                <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-[#6366F1]/25" />
                <Sparkles className="relative h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#2F3441]">
                A quiet beginning
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#6B7280]">
                Write your first thought below. It&rsquo;ll quietly find its
                place among everything else you save.
            </p>
        </div>
    );
}
