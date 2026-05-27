"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/use-auth";
import { Wordmark } from "@/components/brand/wordmark";
import { Button } from "@/components/ui/button";

export default function AppHome() {
    const { user, ready, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (ready && !user) router.replace("/login");
    }, [ready, user, router]);

    if (!ready || !user) {
        return (
            <main className="min-h-screen flex items-center justify-center calm-gradient">
                <span className="text-ink-subtle text-sm">…</span>
            </main>
        );
    }

    return (
        <main className="min-h-screen calm-gradient">
            <div className="grain min-h-screen">
                <header className="px-6 sm:px-10 pt-8 flex items-center justify-between">
                    <Wordmark href="/app" />
                    <div className="flex items-center gap-3 text-sm text-ink-muted">
                        <span>{user.email}</span>
                        <Button variant="ghost" size="md" onClick={() => signOut()}>
                            Sign out
                        </Button>
                    </div>
                </header>
                <section className="flex items-center justify-center px-6 py-24">
                    <div className="text-center max-w-lg">
                        <h1 className="text-3xl tracking-tight text-ink font-medium">
                            Hello, quiet mind.
                        </h1>
                        <p className="mt-3 text-ink-muted">
                            Your sanctuary is ready. The memory editor and graph land next.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
