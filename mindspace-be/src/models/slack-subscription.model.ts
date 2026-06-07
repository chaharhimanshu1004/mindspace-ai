import { prisma } from "../db/prisma";

interface UpsertArgs {
    userId: number;
    channelId: string;
    channelName: string;
}

export class SlackSubscriptionModel {
    public static async upsert(args: UpsertArgs) {
        return prisma.slackChannelSubscription.upsert({
            where: {
                userId_channelId: { userId: args.userId, channelId: args.channelId },
            },
            create: {
                userId: args.userId,
                channelId: args.channelId,
                channelName: args.channelName,
                active: true,
            },
            update: {
                channelName: args.channelName,
                active: true,
            },
        });
    }

    public static async findActiveForUser(userId: number) {
        return prisma.slackChannelSubscription.findMany({
            where: { userId, active: true },
            orderBy: { channelName: "asc" },
        });
    }

    public static async findByUserAndChannel(args: { userId: number; channelId: string }) {
        return prisma.slackChannelSubscription.findUnique({
            where: {
                userId_channelId: { userId: args.userId, channelId: args.channelId },
            },
        });
    }

    public static async deactivate(args: { userId: number; channelId: string }) {
        return prisma.slackChannelSubscription.update({
            where: {
                userId_channelId: { userId: args.userId, channelId: args.channelId },
            },
            data: { active: false },
        });
    }

    public static async deleteAllForUser(userId: number) {
        return prisma.slackChannelSubscription.deleteMany({ where: { userId } });
    }
}
