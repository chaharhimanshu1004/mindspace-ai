import type { ComponentType } from "react";
import { BrandTile } from "@/components/landing/brand-tile";

interface Props {
    icon: ComponentType<{ className?: string }>;
    brand: boolean;
    title: string;
    tagline: string;
}

export function IntegrationHeader({ icon, brand, title, tagline }: Props) {
    return (
        <div className="flex items-center gap-4">
            <BrandTile icon={icon} brand={brand} />
            <div>
                <h3 className="text-[19px] font-bold tracking-tight text-[#2F3441]">
                    {title}
                </h3>
                <p className="text-[13.5px] text-[#6B7280]">{tagline}</p>
            </div>
        </div>
    );
}
