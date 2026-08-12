import { Overline } from "@/components/ui/overline";
import type { SectionHeaderProps } from "./section.types";

export function SectionHeader({ overline, title }: SectionHeaderProps) {
    return (
        <div className="max-w-xl">
            <Overline>{overline}</Overline>
            <h2 className="mt-5 ink-weight font-display text-[24px] leading-[1.16] tracking-[-0.015em] text-ink sm:text-display-md">
                {title}
            </h2>
        </div>
    );
}
