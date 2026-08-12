import { Lightbulb } from "lucide-react";

export function GuideCallout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-[#24231F]/15 bg-gradient-to-r from-[#F1EEE6] to-[#F1EEE6] px-4 py-3.5">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#24231F]" />
            <p className="text-[13.5px] leading-relaxed text-[#4B4F5C]">
                {children}
            </p>
        </div>
    );
}
