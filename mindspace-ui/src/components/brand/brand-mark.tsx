import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function BrandMark({ href = "/" }: { href?: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2.5"
            aria-label="MindSpace AI home"
        >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#6366F1] text-white shadow-soft">
                <BrainCircuit className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[15px] font-bold tracking-tight text-[#2F3441]">
                MindSpace AI
            </span>
        </Link>
    );
}
