"use client";

import { PROFILE_SECTIONS, type ProfileSectionId } from "../profile.types";

const SIGNOUT_ICON = "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1";

interface Props {
    active: ProfileSectionId;
    onChange: (id: ProfileSectionId) => void;
    onSignOut: () => void;
}

export function ProfileModalNav({ active, onChange, onSignOut }: Props) {
    return (
        <nav
            className={[
                "shrink-0",
                "border-b sm:border-b-0 sm:border-r border-[#E9E8E2]",
                "bg-white/50",
                "px-3 sm:px-3 py-3 sm:py-5",
                "sm:w-52",
                "overflow-x-auto sm:overflow-y-auto",
                "flex flex-col",
            ].join(" ")}
        >
            <span className="hidden sm:block text-[10px] tracking-[0.18em] uppercase text-[#2F3441] px-3 mb-3 font-bold">
                Settings
            </span>
            <ul className="flex sm:flex-col gap-1">
                {PROFILE_SECTIONS.map((s) => {
                    const isActive = s.id === active;
                    return (
                        <li key={s.id} className="shrink-0">
                            <button
                                type="button"
                                onClick={() => onChange(s.id)}
                                className={[
                                    "w-full text-left px-3 py-2 rounded-xl text-sm font-bold",
                                    "flex items-center gap-2.5",
                                    "transition-all duration-300 ease-calm",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-soft/40",
                                    isActive
                                        ? "bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white shadow-soft"
                                        : "text-[#2F3441] hover:bg-[#2F3441]/5",
                                ].join(" ")}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                                    <path d={s.icon} />
                                </svg>
                                {s.label}
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className="hidden sm:block mt-auto pt-3 border-t border-[#E9E8E2]">
                <button
                    type="button"
                    onClick={onSignOut}
                    className={[
                        "w-full text-left px-3 py-2 rounded-xl text-sm font-semibold",
                        "flex items-center gap-2.5",
                        "text-rose-500 hover:bg-rose-50",
                        "transition-all duration-200 ease-calm",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300/40",
                    ].join(" ")}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
                        <path d={SIGNOUT_ICON} />
                    </svg>
                    Sign out
                </button>
            </div>
        </nav>
    );
}
