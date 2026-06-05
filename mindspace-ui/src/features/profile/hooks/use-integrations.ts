"use client";

import { useEffect, useState } from "react";
import { listIntegrationsApi, disconnectGoogleCalendarApi } from "../api/integrations.api";
import toast from "react-hot-toast";

export function useIntegrations() {
    const [calendarConnected, setCalendarConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [disconnecting, setDisconnecting] = useState(false);

    useEffect(() => {
        listIntegrationsApi()
            .then((list) => {
                const gcal = list.find((i) => i.provider === "google_calendar");
                setCalendarConnected(gcal?.connected ?? false);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const connectCalendar = () => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/integrations/google-calendar/connect?tz=${encodeURIComponent(tz)}`;
    };

    const disconnectCalendar = async () => {
        setDisconnecting(true);
        try {
            await disconnectGoogleCalendarApi();
            setCalendarConnected(false);
            toast.success("Google Calendar disconnected");
        } catch {
            toast.error("Failed to disconnect");
        } finally {
            setDisconnecting(false);
        }
    };

    return { calendarConnected, loading, disconnecting, connectCalendar, disconnectCalendar };
}
