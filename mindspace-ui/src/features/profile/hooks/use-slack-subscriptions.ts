"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    listSlackSubscriptionsApi,
    subscribeSlackChannelApi,
    unsubscribeSlackChannelApi,
} from "../api/slack.api";
import { slackKeys } from "../slack.keys";

export const useSlackSubscriptions = (enabled: boolean) =>
    useQuery({
        queryKey: slackKeys.subscriptions(),
        queryFn: listSlackSubscriptionsApi,
        enabled,
        staleTime: 30_000,
    });

export const useSubscribeSlackChannel = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: subscribeSlackChannelApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: slackKeys.channels() });
            qc.invalidateQueries({ queryKey: slackKeys.subscriptions() });
            toast.success("Channel added");
        },
        onError: () => toast.error("Failed to subscribe"),
    });
};

export const useUnsubscribeSlackChannel = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: unsubscribeSlackChannelApi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: slackKeys.channels() });
            qc.invalidateQueries({ queryKey: slackKeys.subscriptions() });
            toast.success("Channel removed");
        },
        onError: () => toast.error("Failed to unsubscribe"),
    });
};
