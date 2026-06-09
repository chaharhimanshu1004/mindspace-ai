"use client";

import { useQuery } from "@tanstack/react-query";
import { listSlackChannelsApi } from "../api/slack.api";
import { slackKeys } from "../slack.keys";

export const useSlackChannels = (enabled: boolean) =>
    useQuery({
        queryKey: slackKeys.channels(),
        queryFn: listSlackChannelsApi,
        enabled,
        staleTime: 60_000,
    });
