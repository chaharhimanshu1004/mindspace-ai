"use client";

import { useState } from "react";
import { ProfileModal } from "./profile-modal";
import { useAuth } from "@/features/auth/use-auth";

const initialsOf = (name: string | undefined): string => {
    if (!name) return "·";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export function ProfileButton() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open profile settings"
                title={user?.name ?? user?.email ?? "Profile"}
                className={[
                    "w-9 h-9 rounded-full",
                    "bg-surface-2 border border-border-strong/20",
                    "text-ink text-sm font-medium",
                    "flex items-center justify-center",
                    "transition-all duration-base ease-standard",
                    "hover:shadow-card hover:border-border-strong/40",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                ].join(" ")}
            >
                {initialsOf(user?.name ?? undefined)}
            </button>

            <ProfileModal open={open} onClose={() => setOpen(false)} />
        </>
    );
}
