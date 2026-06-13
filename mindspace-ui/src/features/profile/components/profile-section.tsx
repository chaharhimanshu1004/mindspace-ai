"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/use-auth";
import { useUpdateProfile } from "../hooks/use-update-profile";

const initialsOf = (name: string | undefined): string => {
    if (!name) return "·";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export function ProfileSection() {
    const { user } = useAuth();
    const { update, saving } = useUpdateProfile();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name ?? "");

    const handleSave = async () => {
        const trimmed = name.trim();
        if (!trimmed || trimmed === user?.name) {
            setEditing(false);
            return;
        }
        await update(trimmed);
        setEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") {
            setName(user?.name ?? "");
            setEditing(false);
        }
    };

    return (
        <div>
            <h3 className="text-[16px] font-bold tracking-tight text-[#2F3441]">Profile</h3>
            <p className="mt-1 text-[13px] text-ink-muted">Your identity inside MindSpace.</p>

            <div className="mt-6 flex items-center gap-4">
                <div
                    className={[
                        "w-14 h-14 rounded-full shrink-0",
                        "bg-gradient-to-br from-indigo-soft to-indigo-hover",
                        "flex items-center justify-center",
                        "text-white text-xl font-medium",
                        "shadow-[0_4px_14px_-4px_rgba(99,102,241,0.45)]",
                    ].join(" ")}
                    aria-hidden
                >
                    {initialsOf(user?.name)}
                </div>
                <div className="min-w-0">
                    <p className="text-ink font-medium text-[15px] leading-tight truncate">
                        {user?.name ?? "—"}
                    </p>
                    <p className="text-ink-muted text-[13px] truncate">{user?.email ?? "—"}</p>
                </div>
            </div>

            <div className="mt-6 bg-white border border-[#E9E8E2] rounded-2xl px-4 shadow-soft">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-3 border-b border-[#F1F0EB]">
                    <span className="text-[13px] text-ink-muted shrink-0">Name</span>
                    {editing ? (
                        <div className="flex items-center gap-2 min-w-0">
                            <input
                                autoFocus
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={saving}
                                className={[
                                    "flex-1 min-w-0 text-sm text-ink bg-transparent",
                                    "border-b border-indigo-soft/40 focus:border-indigo-soft",
                                    "outline-none pb-0.5 transition-colors",
                                ].join(" ")}
                            />
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="text-[12px] text-indigo-soft hover:text-indigo-hover font-medium shrink-0 disabled:opacity-50"
                            >
                                {saving ? "Saving…" : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setName(user?.name ?? ""); setEditing(false); }}
                                className="text-[12px] text-ink-muted hover:text-ink shrink-0"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm text-ink text-left sm:text-right break-all">
                                {user?.name ?? "—"}
                            </span>
                            <button
                                type="button"
                                onClick={() => { setName(user?.name ?? ""); setEditing(true); }}
                                className="text-[12px] text-ink-muted hover:text-indigo-soft shrink-0 transition-colors"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-3">
                    <span className="text-[13px] text-ink-muted">Email</span>
                    <span className="text-sm text-ink text-left sm:text-right break-all">
                        {user?.email ?? "—"}
                    </span>
                </div>
            </div>
        </div>
    );
}
