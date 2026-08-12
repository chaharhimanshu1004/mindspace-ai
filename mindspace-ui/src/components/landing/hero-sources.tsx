import { PenLine, Hash, Send, Terminal } from "lucide-react";

const sources = [
    { icon: PenLine, label: "Web" },
    { icon: Hash, label: "Slack" },
    { icon: Send, label: "Telegram" },
    { icon: Terminal, label: "Claude Code" },
];

export function HeroSources() {
    return (
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {sources.map((source) => (
                <li
                    key={source.label}
                    className="inline-flex items-center gap-1.5 text-body-sm text-ink-subtle"
                >
                    <source.icon aria-hidden className="h-3.5 w-3.5" />
                    {source.label}
                </li>
            ))}
        </ul>
    );
}
