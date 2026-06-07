import { z } from "zod";

export const subscribeChannelSchema = z.object({
    channelId: z.string().trim().min(1).max(64),
    channelName: z.string().trim().min(1).max(128),
});

export const channelIdParamSchema = z.object({
    channelId: z.string().trim().min(1).max(64),
});

export type SubscribeChannelInput = z.infer<typeof subscribeChannelSchema>;
export type ChannelIdParam = z.infer<typeof channelIdParamSchema>;
