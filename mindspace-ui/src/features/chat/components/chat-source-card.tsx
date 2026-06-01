import { formatIst } from "@/lib/format-date";
import type { ChatSource } from "../chat.types";

interface Props {
    source: ChatSource;
}

export function ChatSourceCard({ source }: Props) {
    const accentDot = source.cited ? "bg-indigo-soft" : "bg-ink-subtle/40";

    if (source.deleted) {
        return (
            <article
                className={[
                    "bg-ink-tint/10 backdrop-blur-sm rounded-2xl border border-dashed border-border-subtle",
                    "p-4 opacity-70 select-none",
                ].join(" ")}
            >
                <header className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink-subtle/50" />
                    <h4 className="text-ink-subtle text-[13px] font-medium leading-snug flex-1 line-clamp-1 italic">
                        {source.title || "Deleted Memory"}
                    </h4>
                    <span className="text-[10px] text-ink-subtle whitespace-nowrap">
                        {formatIst(source.createdAt)}
                    </span>
                </header>

                <p className="text-ink-subtle text-[13px] leading-relaxed italic flex items-center gap-1.5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3.5 h-3.5 flex-shrink-0 text-ink-subtle/70"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                    {source.content || "This memory has been deleted."}
                </p>
            </article>
        );
    }

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
