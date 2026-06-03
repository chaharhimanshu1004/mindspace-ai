"use client";

import { useAuth } from "@/features/auth/use-auth";
import { ProfileField } from "./profile-field";

const initialOf = (email: string | undefined): string => {
    if (!email) return "·";
    return email.trim().charAt(0).toUpperCase() || "·";
};

const derivedName = (email: string | undefined): string => {
    if (!email) return "—";
    const local = email.split("@")[0] ?? "";
    if (!local) return "—";
    return local.charAt(0).toUpperCase() + local.slice(1);
};

export function ProfileSection() {
    const { user } = useAuth();

    return (
        <div>
            <h3 className="text-[15px] font-medium text-ink tracking-tight">
                Profile
            </h3>
            <p className="mt-1 text-[13px] text-ink-muted">
                Your identity inside MindSpace.
            </p>

            <div className="mt-6 flex items-center gap-4">
                <div
                    className={[
                        "w-14 h-14 rounded-full",
                        "bg-gradient-to-br from-indigo-soft to-indigo-hover",
                        "flex items-center justify-center",
                        "text-white text-xl font-medium",
                        "shadow-[0_4px_14px_-4px_rgba(99,102,241,0.45)]",
                    ].join(" ")}
                    aria-hidden
                >
                    {initialOf(user?.email)}
                </div>
                <div className="min-w-0">
                    <p className="text-ink font-medium text-[15px] leading-tight truncate">
                        {derivedName(user?.email)}
                    </p>
                    <p className="text-ink-muted text-[13px] truncate">
                        {user?.email ?? "—"}
                    </p>
                </div>
            </div>

            <div className="mt-6 bg-[#F9F9F5] border border-ink/8 rounded-2xl px-4">
                <ProfileField label="Name" value={derivedName(user?.email)} />
                <ProfileField label="Email" value={user?.email ?? "—"} />
            </div>
        </div>
    );
}
