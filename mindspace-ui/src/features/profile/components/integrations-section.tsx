"use client";

import { GoogleCalendarCard } from "./google-calendar-card";
import { useIntegrations } from "../hooks/use-integrations";

export function IntegrationsSection() {
    const { calendarConnected, loading, disconnecting, connectCalendar, disconnectCalendar } = useIntegrations();

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
                    loading={loading}
                    disconnecting={disconnecting}
                    onConnect={connectCalendar}
                    onDisconnect={disconnectCalendar}
                />
            </div>
        </div>
    );
}
