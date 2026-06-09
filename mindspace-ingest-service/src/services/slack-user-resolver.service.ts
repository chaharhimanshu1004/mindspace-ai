import { listWorkspaceUsers, type SlackUserRaw } from "../connectors/slack-api.connector";

interface ResolvedUser {
    id: string;
    displayName: string;
    isBot: boolean;
}

const pickDisplayName = (u: SlackUserRaw): string => {
    const profile = u.profile;
    if (profile?.display_name && profile.display_name.trim()) return profile.display_name;
    if (profile?.real_name && profile.real_name.trim()) return profile.real_name;
    return u.name;
};

const decodeUserMentions = (text: string, byId: Map<string, ResolvedUser>): string =>
    text.replace(/<@(U[A-Z0-9]+)(?:\|[^>]+)?>/g, (_match, id: string) => {
        const u = byId.get(id);
        return u ? `@${u.displayName}` : "@unknown";
    });

const decodeChannelRefs = (text: string): string =>
    text.replace(/<#C[A-Z0-9]+\|([^>]+)>/g, (_m, name: string) => `#${name}`);

const decodeLinks = (text: string): string =>
    text.replace(/<(https?:\/\/[^|>]+)(?:\|([^>]+))?>/g, (_m, url: string, label?: string) =>
        label ? `${label} (${url})` : url,
    );

const decodeSpecial = (text: string): string =>
    text
        .replace(/<!channel>/g, "@channel")
        .replace(/<!here>/g, "@here")
        .replace(/<!everyone>/g, "@everyone");

export class SlackUserResolver {
    private constructor(private readonly byId: Map<string, ResolvedUser>) {}

    public static async load(accessToken: string): Promise<SlackUserResolver> {
        const users = await listWorkspaceUsers(accessToken);
        const byId = new Map<string, ResolvedUser>();
        for (const u of users) {
            if (u.deleted) continue;
            byId.set(u.id, {
                id: u.id,
                displayName: pickDisplayName(u),
                isBot: Boolean(u.is_bot),
            });
        }
        return new SlackUserResolver(byId);
    }

    public displayNameFor(userId: string | undefined): string {
        if (!userId) return "unknown";
        const u = this.byId.get(userId);
        return u ? u.displayName : "unknown";
    }

    public isBot(userId: string | undefined): boolean {
        if (!userId) return false;
        return this.byId.get(userId)?.isBot ?? false;
    }

    public decode(text: string): string {
        let out = decodeUserMentions(text, this.byId);
        out = decodeChannelRefs(out);
        out = decodeLinks(out);
        out = decodeSpecial(out);
        return out;
    }
}
