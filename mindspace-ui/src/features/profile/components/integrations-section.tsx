"use client";

import { GoogleCalendarCard } from "./google-calendar-card";
import { SlackCard } from "./slack-card";
import { TelegramCard } from "./telegram-card";
import { useIntegrations } from "../hooks/use-integrations";

export function IntegrationsSection() {
    const {
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
    } = useIntegrations();

    return (
        <div>
            <h3 className="text-[16px] font-bold tracking-tight text-[#2F3441]">
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
                <SlackCard
                    connected={slackConnected}
                    loading={loading}
                    disconnecting={slackDisconnecting}
                    onConnect={connectSlack}
                    onDisconnect={disconnectSlack}
                />
                <TelegramCard
                    connected={telegramConnected}
                    loading={loading}
                    disconnecting={telegramDisconnecting}
                    onConnect={connectTelegram}
                    onDisconnect={disconnectTelegram}
                />
            </div>
        </div>
    );
}
