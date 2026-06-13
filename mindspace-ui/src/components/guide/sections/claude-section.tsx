import { GuideSection } from "../guide-section";
import { GuideStep } from "../guide-step";
import { CodeBlock } from "../code-block";
import { IntegrationHeader } from "../integration-header";
import { AnthropicIcon } from "@/components/landing/icons/anthropic-icon";

const addCommand = `claude mcp add --transport http mindspace https://api.mindspace.ai/mcp`;

const jsonConfig = `{
  "mcpServers": {
    "mindspace": {
      "type": "http",
      "url": "https://api.mindspace.ai/mcp"
    }
  }
}`;

const usage = `> Save a memory that we decided to use Redis Streams for the
  enrichment queue, with idempotency keys on retry.

  ⮑ save_memory  ✓ stored · embedding now

> What did we decide about the enrichment queue?

  ⮑ search_memories  ✓ 3 memories found`;

export function ClaudeSection() {
    return (
        <GuideSection
            id="claude"
            eyebrow="integration"
            title="Claude Code (MCP)"
            intro="Connect MindSpace to Claude over the Model Context Protocol so Claude can save and recall memories directly inside your terminal sessions — no copy-paste, no context switch."
        >
            <div className="rounded-3xl border border-[#E9E8E2] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
                <IntegrationHeader
                    icon={AnthropicIcon}
                    brand
                    title="Model Context Protocol"
                    tagline="Secure HTTP · OAuth 2.0 + PKCE"
                />

                <div className="mt-8">
                    <GuideStep n={1} title="Add the MindSpace MCP server">
                        <p>
                            Run this once in your terminal. It registers
                            MindSpace as an HTTP MCP server for Claude Code.
                        </p>
                        <CodeBlock code={addCommand} label="terminal" />
                    </GuideStep>

                    <GuideStep n={2} title="Or configure it manually">
                        <p>
                            Prefer config files? Add MindSpace to your{" "}
                            <code className="rounded bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                                .mcp.json
                            </code>{" "}
                            instead.
                        </p>
                        <CodeBlock code={jsonConfig} label=".mcp.json" />
                    </GuideStep>

                    <GuideStep n={3} title="Authorize once in the browser">
                        <p>
                            The first call opens a browser window. Approve
                            access and Claude receives a scoped token (
                            <code className="rounded bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                                memories:read
                            </code>{" "}
                            +{" "}
                            <code className="rounded bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                                memories:write
                            </code>
                            ). Nothing leaves your machine unencrypted.
                        </p>
                    </GuideStep>

                    <GuideStep n={4} title="Use it in any session" last>
                        <p>
                            Claude now has three tools —{" "}
                            <code className="rounded bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                                save_memory
                            </code>
                            ,{" "}
                            <code className="rounded bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                                search_memories
                            </code>
                            , and{" "}
                            <code className="rounded bg-[#EEF0FF] px-1.5 py-0.5 font-mono text-[12px] text-[#6366F1]">
                                get_memory
                            </code>
                            . Just talk naturally and Claude calls them when
                            relevant.
                        </p>
                        <CodeBlock code={usage} label="claude · session" />
                    </GuideStep>
                </div>
            </div>
        </GuideSection>
    );
}
