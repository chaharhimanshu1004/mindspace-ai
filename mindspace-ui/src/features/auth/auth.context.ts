"use client";

import { createContext } from "react";
import type { PublicUser } from "./auth.types";

export interface AuthContextValue {
    user: PublicUser | null;
    ready: boolean;
    setUser: (user: PublicUser | null) => void;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
