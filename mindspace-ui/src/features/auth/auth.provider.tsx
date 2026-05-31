"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext, type AuthContextValue } from "./auth.context";
import { verifySessionApi } from "./api/verify-session.api";
import { logoutApi } from "./api/logout.api";
import type { PublicUser } from "./auth.types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<PublicUser | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        verifySessionApi()
            .then((u) => setUser(u))
            .catch(() => setUser(null))
            .finally(() => setReady(true));
    }, []);

    const signOut = useCallback(async (): Promise<void> => {
        try {
            await logoutApi();
        } catch {
            // ignore
        }
        setUser(null);
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({ user, ready, setUser, signOut }),
        [user, ready, signOut],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
