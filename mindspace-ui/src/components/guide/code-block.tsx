"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
    code: string;
    label?: string;
}

export function CodeBlock({ code, label }: Props) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        });
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-border-softer bg-[#2F3441] shadow-soft">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    {label ? (
                        <span className="ml-2 font-mono text-[11px] text-white/40">
                            {label}
                        </span>
                    ) : null}
                </div>
                <button
                    type="button"
                    onClick={copy}
                    aria-label="Copy to clipboard"
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-medium text-white/60 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-[#A3B18A]" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <pre className="overflow-x-auto px-4 py-4">
                <code className="font-mono text-[12.5px] leading-relaxed text-white/85 whitespace-pre">
                    {code}
                </code>
            </pre>
        </div>
    );
}
