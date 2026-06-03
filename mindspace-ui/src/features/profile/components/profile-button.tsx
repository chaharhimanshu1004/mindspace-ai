"use client";

import { useState } from "react";
import { ProfileModal } from "./profile-modal";
import { useAuth } from "@/features/auth/use-auth";

const initialOf = (email: string | undefined): string => {
    if (!email) return "·";
    return email.trim().charAt(0).toUpperCase() || "·";
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
                title={user?.email ?? "Profile"}
                className={[
                    "w-9 h-9 rounded-full",
                    "bg-indigo-tint border border-indigo-soft/20",
                    "text-indigo-soft text-sm font-medium",
                    "flex items-center justify-center",
                    "transition-all duration-300 ease-calm",
                    "hover:shadow-soft hover:border-indigo-soft/40",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-soft/40 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                ].join(" ")}
            >
                {initialOf(user?.email)}
            </button>

            <ProfileModal open={open} onClose={() => setOpen(false)} />
        </>
    );
}
