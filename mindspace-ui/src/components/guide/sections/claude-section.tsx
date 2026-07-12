import { Monitor, Terminal } from "lucide-react";

import { GuideSection } from "../guide-section";
import { GuideStep } from "../guide-step";
import { CodeBlock } from "../code-block";
import { IntegrationHeader } from "../integration-header";
import { AnthropicIcon } from "@/components/landing/icons/anthropic-icon";

const addCommand = `claude mcp add --transport http mindspace https://api.mindspaceai.online/mcp`;

const usage = `> Save a memory that we decided to use Redis Streams for the
  enrichment queue, with idempotency keys on retry.

  ⮑ save_memory  ✓ stored · embedding now

> What did we decide about the enrichment queue?

  ⮑ search_memories  ✓ 3 memories found`;

const uiFields = [
    { label: "Name", value: "mindspace" },
    { label: "MCP URL", value: "https://api.mindspaceai.online/mcp" },
    { label: "OAuth Client ID", value: "claude" },
];

const Chip = ({ children }: { children: React.ReactNode }) => (
    <code className="rounded-md bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
        {children}
    </code>
);

export function ClaudeSection() {
    return (
        <GuideSection
            id="claude"
            eyebrow="integration"
            title="Claude (MCP)"
            intro="Connect MindSpace to Claude over the Model Context Protocol so Claude can save and recall memories directly — no copy-paste, no context switch."
        >
            <div className="rounded-3xl border border-[#E9E8E2] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
                <IntegrationHeader
                    icon={AnthropicIcon}
                    brand
                    title="Model Context Protocol"
                    tagline="Secure HTTP · OAuth 2.0 + PKCE"
                />

                <div className="mt-8 space-y-8">
                    <GuideStep n={1} title="Connect MindSpace — pick one method">
                        <div className="mt-1 overflow-hidden rounded-2xl border border-[#E9E8E2] bg-white">
                            <div className="p-5">
                                <div className="mb-4 flex items-center gap-2.5">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/10">
                                        <Monitor className="h-4 w-4 text-[#6366F1]" />
                                    </span>
                                    <div>
                                        <p className="text-[13px] font-semibold text-[#2F3441]">Via Claude UI</p>
                                        <p className="text-[11px] text-[#9CA3AF]">Recommended · claude.ai desktop or web</p>
                                    </div>
                                </div>

                                <p className="mb-3 text-[13px] text-[#6B7280]">
                                    Go to{" "}
                                    <span className="font-medium text-[#2F3441]">Settings → Customize → Connectors → Add</span>
                                    {" "}→ click{" "}
                                    <span className="font-medium text-[#2F3441]">Add custom connector</span>
                                    , then fill in:
                                </p>

                                <div className="overflow-hidden rounded-xl border border-[#E9E8E2] divide-y divide-[#E9E8E2]">
                                    {uiFields.map(({ label, value }) => (
                                        <div key={label} className="flex items-center bg-[#FAFAF7] px-4 py-3">
                                            <span className="w-32 shrink-0 text-[12px] font-medium text-[#9CA3AF]">{label}</span>
                                            <span className="font-mono text-[13px] text-[#2F3441]">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative flex items-center px-5">
                                <div className="flex-1 border-t border-dashed border-[#D1D5DB]" />
                                <span className="mx-4 rounded-full border border-[#E9E8E2] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                                    or
                                </span>
                                <div className="flex-1 border-t border-dashed border-[#D1D5DB]" />
                            </div>

                            <div className="p-5">
                                <div className="mb-4 flex items-center gap-2.5">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2F3441]/8">
                                        <Terminal className="h-4 w-4 text-[#4B5563]" />
                                    </span>
                                    <div>
                                        <p className="text-[13px] font-semibold text-[#2F3441]">Via Terminal</p>
                                        <p className="text-[11px] text-[#9CA3AF]">Claude Code CLI users</p>
                                    </div>
                                </div>

                                <p className="mb-3 text-[13px] text-[#6B7280]">
                                    Run this once in your terminal — registers MindSpace as an HTTP MCP server.
                                </p>

                                <CodeBlock code={addCommand} label="terminal" />
                            </div>
                        </div>
                    </GuideStep>

                    <GuideStep n={2} title="Authorize once in the browser">
                        <p>
                            On first use Claude opens a browser tab. Approve access and
                            Claude receives a scoped token (
                            <Chip>memories:read</Chip> + <Chip>memories:write</Chip>
                            ). Nothing leaves your machine unencrypted.
                        </p>
                    </GuideStep>

                    <GuideStep n={3} title="Use it in any session" last>
                        <p>
                            Claude now has three tools —{" "}
                            <Chip>save_memory</Chip>, <Chip>search_memories</Chip>, and{" "}
                            <Chip>get_memory</Chip>. Just talk naturally and Claude calls
                            them when relevant.
                        </p>
                        <CodeBlock code={usage} label="claude · session" />
                    </GuideStep>
                </div>
            </div>
        </GuideSection>
    );
}
