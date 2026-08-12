import Link from "next/link";
import { ArrowDown } from "lucide-react";

interface Props {
    href: string;
    label: string;
}

export function ScrollCue({ href, label }: Props) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-control py-2 text-overline font-semibold uppercase text-ink-subtle transition-colors duration-fast ease-standard hover:text-ink focus:outline-none focus-visible:shadow-ring"
        >
            <ArrowDown
                aria-hidden
                className="animate-float h-3.5 w-3.5 transition-transform duration-fast ease-standard group-hover:translate-y-0.5"
            />
            {label}
        </Link>
    );
}
