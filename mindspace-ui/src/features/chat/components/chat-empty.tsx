import { Overline } from "@/components/ui/overline";

const examples = [
    "what did I decide about pricing?",
    "why did we drop polling for webhooks?",
    "what's still open on the memory graph?",
];

export function ChatEmpty() {
    return (
        <div className="mx-auto flex min-h-[40vh] max-w-prose flex-col justify-center">
            <Overline>ask</Overline>
            <h1 className="ink-weight mt-4 font-display text-[26px] leading-[1.14] tracking-[-0.015em] text-ink sm:text-display-md">
                Ask your own notes
            </h1>
            <p className="mt-3 text-body text-ink-muted">
                Answers come only from what you have saved, with the notes cited.
            </p>

            <ul className="mt-8 flex flex-col gap-px overflow-hidden rounded-card border border-border-subtle bg-border-subtle">
                {examples.map((q) => (
                    <li key={q} className="bg-surface-1 px-4 py-3 font-mono text-[13px] text-ink-muted">
                        {q}
                    </li>
                ))}
            </ul>
        </div>
    );
}
