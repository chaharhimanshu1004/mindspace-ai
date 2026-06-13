import type { ComponentType } from "react";

interface Props {
    icon: ComponentType<{ className?: string }>;
    brand: boolean;
}

export function BrandTile({ icon: Icon, brand }: Props) {
    if (brand) {
        return (
            <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-[#E9E8E2] bg-white shadow-soft">
                <Icon className="h-7 w-7" />
            </span>
        );
    }

    return (
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF0FF] text-[#6366F1]">
            <Icon className="h-5 w-5" />
        </span>
    );
}
