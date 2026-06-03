"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ProfileModalNav } from "./profile-modal-nav";
import { ProfileSection } from "./profile-section";
import { IntegrationsSection } from "./integrations-section";
import { useAuth } from "@/features/auth/use-auth";
import toast from "react-hot-toast";
import type { ProfileSectionId } from "../profile.types";

interface Props {
    open: boolean;
    onClose: () => void;
}

const renderSection = (id: ProfileSectionId) => {
    switch (id) {
        case "profile":
            return <ProfileSection />;
        case "integrations":
            return <IntegrationsSection />;
    }
};

export function ProfileModal({ open, onClose }: Props) {
    const [active, setActive] = useState<ProfileSectionId>("profile");
    const { signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        onClose();
        toast.success("Signed out successfully");
        setTimeout(() => {
            window.location.href = "/";
        }, 750);
    };

    return (
        <Modal open={open} onClose={onClose} labelledBy="profile-modal-title">
            <header className="flex items-center justify-between px-6 sm:px-7 h-14 border-b border-ink/8 bg-[#F0F0EC]/70 backdrop-blur-sm shrink-0">
                <h2
                    id="profile-modal-title"
                    className="text-ink font-medium text-[15px] tracking-tight"
                >
                    Settings
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close settings"
                    className={[
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        "text-ink-muted hover:text-ink hover:bg-ink/5",
                        "transition-colors duration-200 ease-calm",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-soft/40",
                    ].join(" ")}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </header>

            <div className="flex-1 min-h-0 flex flex-col sm:flex-row">
                <ProfileModalNav active={active} onChange={setActive} onSignOut={handleSignOut} />
                <section className="flex-1 min-w-0 overflow-y-auto px-6 sm:px-8 py-6 sm:py-7">
                    {renderSection(active)}
                </section>
            </div>
        </Modal>
    );
}
