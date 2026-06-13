import { Lightbulb } from "lucide-react";

export function GuideCallout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-[#6366F1]/15 bg-gradient-to-r from-[#EEF0FF] to-[#F5F3FF] px-4 py-3.5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#6366F1]" />
            <p className="text-[13.5px] leading-relaxed text-[#4B4F5C]">
                {children}
            </p>
        </div>
    );
}
