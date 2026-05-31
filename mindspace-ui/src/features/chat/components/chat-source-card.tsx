import { formatIst } from "@/lib/format-date";
import type { ChatSource } from "../chat.types";

interface Props {
    source: ChatSource;
}

export function ChatSourceCard({ source }: Props) {
    const accentDot = source.cited ? "bg-indigo-soft" : "bg-ink-subtle/40";

    return (
        <article
            className={[
                "bg-white/90 backdrop-blur-sm rounded-2xl shadow-soft",
                "p-4 transition-all duration-300 ease-calm",
                "hover:shadow-lift",
                source.cited
                    ? "border border-indigo-soft/25"
                    : "border border-border-subtle",
            ].join(" ")}
        >
            <header className="flex items-center gap-2 mb-1.5">
                <span className={["w-1.5 h-1.5 rounded-full", accentDot].join(" ")} />
                <h4 className="text-ink text-[13px] font-medium leading-snug flex-1 line-clamp-1">
                    {source.title?.trim() || "Untitled thought"}
                </h4>
                <span className="text-[10px] text-ink-subtle whitespace-nowrap">
                    {formatIst(source.createdAt)}
                </span>
            </header>

            <p className="text-ink-muted text-[13px] leading-relaxed whitespace-pre-wrap">
                {source.content}
            </p>
        </article>
    );
}
