"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/use-auth";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";

const SCOPE_LABELS: Record<string, string> = {
    "memories:read": "Read your memories",
    "memories:write": "Save new memories on your behalf",
};

export default function OAuthAuthorizePage() {
    const params = useSearchParams();
    const router = useRouter();
    const { user, ready } = useAuth();

    const clientName = params.get("client_name") ?? "An MCP client";
    const scopes = (params.get("scope") ?? "").split(" ").filter(Boolean);

    if (!ready) return null;

    if (!user) {
        const returnTo = encodeURIComponent(`/oauth/authorize?${params.toString()}`);
        router.replace(`/login?returnTo=${returnTo}`);
        return null;
    }

    const submit = (action: "allow" | "deny") => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = `${env.apiUrl}/oauth/authorize`;

        const fields: Record<string, string> = {
            action,
            client_id: params.get("client_id") ?? "",
            redirect_uri: params.get("redirect_uri") ?? "",
            scope: params.get("scope") ?? "",
            state: params.get("state") ?? "",
            code_challenge: params.get("code_challenge") ?? "",
            code_challenge_method: params.get("code_challenge_method") ?? "S256",
        };

        for (const [k, v] of Object.entries(fields)) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = k;
            input.value = v;
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <main className="min-h-screen calm-gradient">
            <div className="grain min-h-screen flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-8">
                        <Wordmark />
                    </div>

                    <div className="bg-white/70 backdrop-blur border border-border-subtle rounded-3xl p-8 shadow-soft">
                        <h1 className="text-[18px] font-medium text-ink tracking-tight text-center">
                            {clientName} wants to access your MindSpace
                        </h1>
                        <p className="mt-2 text-[13px] text-ink-muted text-center">
                            Signed in as <span className="text-ink">{user.email}</span>
                        </p>

                        {scopes.length > 0 && (
                            <ul className="mt-6 space-y-2">
                                {scopes.map((s) => (
                                    <li key={s} className="flex items-center gap-3 text-[13px] text-ink-muted">
                                        <span className="w-1.5 h-1.5 rounded-full bg-sage shrink-0" />
                                        {SCOPE_LABELS[s] ?? s}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="mt-8 flex flex-col gap-3">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => submit("allow")}
                            >
                                Allow
                            </Button>
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => submit("deny")}
                            >
                                Deny
                            </Button>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-[12px] text-ink-subtle">
                        You can revoke access at any time from Settings → Integrations.
                    </p>
                </div>
            </div>
        </main>
    );
}
