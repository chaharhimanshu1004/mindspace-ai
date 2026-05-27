"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext, type AuthContextValue } from "./auth.context";
import { authStorage } from "./auth.storage";
import { verifySessionApi } from "./api/verify-session.api";
import { logoutApi } from "./api/logout.api";
import type { PublicUser } from "./auth.types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<PublicUser | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = authStorage.get();
        if (!token) {
            setReady(true);
            return;
        }
        verifySessionApi()
            .then((u) => setUser(u))
            .catch(() => authStorage.clear())
            .finally(() => setReady(true));
    }, []);

    const signOut = useCallback(async (): Promise<void> => {
        try {
            await logoutApi();
        } catch {
            // ignore — we clear locally regardless
        }
        authStorage.clear();
        setUser(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({ user, ready, setUser, signOut }),
        [user, ready, signOut],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
