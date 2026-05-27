import Link from "next/link";

export function Wordmark({ href = "/" }: { href?: string }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2.5 group"
            aria-label="MindSpace home"
        >
            <span
                aria-hidden
                className="w-2.5 h-2.5 rounded-full bg-indigo-soft shadow-[0_0_18px_rgba(99,102,241,0.55)] transition-transform duration-500 ease-calm group-hover:scale-110"
            />
            <span className="text-ink tracking-tight font-medium text-[15px]">
                mindspace
            </span>
        </Link>
    );
}
