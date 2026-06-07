import { prisma } from "../db/prisma";

export class SlackCursorModel {
    public static async findBySubscription(subscriptionId: number) {
        return prisma.slackMessageCursor.findUnique({
            where: { subscriptionId },
        });
    }

    public static async upsert(args: { subscriptionId: number; lastMessageTs: string }) {
        return prisma.slackMessageCursor.upsert({
            where: { subscriptionId: args.subscriptionId },
            create: {
                subscriptionId: args.subscriptionId,
                lastMessageTs: args.lastMessageTs,
            },
            update: {
                lastMessageTs: args.lastMessageTs,
            },
        });
    }
}
