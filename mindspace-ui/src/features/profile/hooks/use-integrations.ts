"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    listIntegrationsApi,
    disconnectGoogleCalendarApi,
    disconnectSlackApi,
    disconnectTelegramApi,
    getTelegramPairingLinkApi,
} from "../api/integrations.api";

export function useIntegrations() {
    const [calendarConnected, setCalendarConnected] = useState(false);
    const [slackConnected, setSlackConnected] = useState(false);
    const [telegramConnected, setTelegramConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [disconnecting, setDisconnecting] = useState(false);
    const [slackDisconnecting, setSlackDisconnecting] = useState(false);
    const [telegramDisconnecting, setTelegramDisconnecting] = useState(false);

    useEffect(() => {
        listIntegrationsApi()
            .then((list) => {
                setCalendarConnected(
                    list.find((i) => i.provider === "google_calendar")?.connected ?? false,
                );
                setSlackConnected(
                    list.find((i) => i.provider === "slack")?.connected ?? false,
                );
                setTelegramConnected(
                    list.find((i) => i.provider === "telegram")?.connected ?? false,
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

    const connectTelegram = async () => {
        try {
            const res = await getTelegramPairingLinkApi();
            window.open(res.link, "_blank");
        } catch {
            toast.error("Failed to generate Telegram link");
        }
    };

    const disconnectTelegram = async () => {
        setTelegramDisconnecting(true);
        try {
            await disconnectTelegramApi();
            setTelegramConnected(false);
            toast.success("Telegram disconnected");
        } catch {
            toast.error("Failed to disconnect");
        } finally {
            setTelegramDisconnecting(false);
        }
    };

    return {
        calendarConnected,
        slackConnected,
        telegramConnected,
        loading,
        disconnecting,
        slackDisconnecting,
        telegramDisconnecting,
        connectCalendar,
        disconnectCalendar,
        connectSlack,
        disconnectSlack,
        connectTelegram,
        disconnectTelegram,
    };
}
