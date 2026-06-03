"use client";

import { useState } from "react";
import { GoogleCalendarCard } from "./google-calendar-card";

export function IntegrationsSection() {
    const [calendarConnected, setCalendarConnected] = useState(false);

    return (
        <div>
            <h3 className="text-[15px] font-medium text-ink tracking-tight">
                Integrations
            </h3>
            <p className="mt-1 text-[13px] text-ink-muted">
                Connect the tools you use so MindSpace can quietly act on your behalf.
            </p>

            <div className="mt-6 flex flex-col gap-3">
                <GoogleCalendarCard
                    connected={calendarConnected}
                    onConnect={() => setCalendarConnected(true)}
                    onDisconnect={() => setCalendarConnected(false)}
                />
            </div>
        </div>
    );
}
