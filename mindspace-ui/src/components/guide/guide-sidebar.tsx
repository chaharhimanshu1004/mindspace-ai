"use client";

import { useEffect, useState } from "react";
import { guideNav } from "./guide-nav";

const allIds = guideNav.flatMap((group) => group.items.map((item) => item.id));

export function GuideSidebar() {
    const [active, setActive] = useState(allIds[0]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActive(visible[0].target.id);
            },
            { rootMargin: "-96px 0px -65% 0px", threshold: 0 },
        );

        allIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <nav className="space-y-7">
            {guideNav.map((group) => (
                <div key={group.title}>
                    <p className="px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9CA3AF]">
                        {group.title}
                    </p>
                    <ul className="mt-2 space-y-0.5">
                        {group.items.map((item) => {
                            const isActive = active === item.id;
                            return (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        className={[
                                            "block rounded-xl px-3 py-1.5 text-sm transition-all duration-300 ease-calm",
                                            isActive
                                                ? "bg-gradient-to-r from-[#EEF0FF] to-[#F5F3FF] font-semibold text-[#6366F1]"
                                                : "font-medium text-[#6B7280] hover:bg-[#2F3441]/5 hover:text-[#2F3441]",
                                        ].join(" ")}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}
