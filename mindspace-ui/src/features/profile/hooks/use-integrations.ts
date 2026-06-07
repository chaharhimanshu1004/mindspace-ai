"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    listIntegrationsApi,
    disconnectGoogleCalendarApi,
    disconnectSlackApi,
} from "../api/integrations.api";

export function useIntegrations() {
    const [calendarConnected, setCalendarConnected] = useState(false);
    const [slackConnected, setSlackConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [disconnecting, setDisconnecting] = useState(false);
    const [slackDisconnecting, setSlackDisconnecting] = useState(false);

    useEffect(() => {
        listIntegrationsApi()
            .then((list) => {
                setCalendarConnected(
                    list.find((i) => i.provider === "google_calendar")?.connected ?? false,
                );
                setSlackConnected(
                    list.find((i) => i.provider === "slack")?.connected ?? false,
                );
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

    const connectSlack = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/integrations/slack/connect`;
    };

    const disconnectSlack = async () => {
        setSlackDisconnecting(true);
        try {
            await disconnectSlackApi();
            setSlackConnected(false);
            toast.success("Slack disconnected");
        } catch {
            toast.error("Failed to disconnect");
        } finally {
            setSlackDisconnecting(false);
        }
    };

    return {
        calendarConnected,
        slackConnected,
        loading,
        disconnecting,
        slackDisconnecting,
        connectCalendar,
        disconnectCalendar,
        connectSlack,
        disconnectSlack,
    };
}
