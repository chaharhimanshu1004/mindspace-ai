import Link from "next/link";
import { BrandGlyph } from "./brand-glyph";

interface Props {
    href?: string;
}

export function BrandMark({ href = "/" }: Props) {
    return (
        <Link
            href={href}
            aria-label="MindSpace AI home"
            className="group inline-flex items-center gap-2.5 rounded-control text-ink focus:outline-none focus-visible:shadow-ring"
        >
            <BrandGlyph className="h-[19px] w-[19px] shrink-0 transition-transform duration-fast ease-standard group-hover:-translate-y-px" />
            <span className="ink-weight font-display text-[20px] leading-none tracking-[-0.015em]">
                MindSpace
            </span>
        </Link>
    );
}
