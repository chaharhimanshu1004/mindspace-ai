import { listPublicChannels, type SlackChannelRaw } from "../connectors/slack-api.connector";
import { SlackIntegrationService } from "./slack-integration.service";
import { SlackSubscriptionService } from "./slack-subscription.service";
import type { SlackChannelListing } from "../schemas/slack.types";

const toListing = (raw: SlackChannelRaw, subscribed: boolean): SlackChannelListing => ({
    channelId: raw.id,
    channelName: raw.name,
    memberCount: raw.num_members ?? null,
    topic: raw.topic?.value || null,
    purpose: raw.purpose?.value || null,
    isMember: raw.is_member,
    subscribed,
});

const sortListings = (listings: SlackChannelListing[]): SlackChannelListing[] =>
    listings.slice().sort((a, b) => {
        if (a.subscribed !== b.subscribed) return a.subscribed ? -1 : 1;
        return a.channelName.localeCompare(b.channelName);
    });

export class SlackChannelsService {
    public static async listForUser(userId: number): Promise<SlackChannelListing[]> {
        const [token, subscribedIds] = await Promise.all([
            SlackIntegrationService.getAccessToken(userId),
            SlackSubscriptionService.listActiveChannelIds(userId),
        ]);

        const raw = await listPublicChannels(token);
        const listings = raw.map((r) => toListing(r, subscribedIds.has(r.id)));
        return sortListings(listings);
    }
}
