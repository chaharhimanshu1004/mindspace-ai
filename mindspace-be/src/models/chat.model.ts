import { prisma } from "../db/prisma";

interface AppendMessageArgs {
    conversationId: string;
    role: "user" | "assistant";
    content: string;
    retrievedIds?: string[];
}

interface ListMessagesArgs {
    conversationId: string;
    limit: number;
    cursor?: string;
}

export class ChatModel {
    public static async findOrCreateConversation(userId: number) {
        const existing = await prisma.conversation.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        if (existing) return existing;

        return prisma.conversation.create({
            data: { userId },
        });
    }

    public static async appendMessage(args: AppendMessageArgs) {
        return prisma.message.create({
            data: {
                conversationId: args.conversationId,
                role: args.role,
                content: args.content,
                retrievedIds: args.retrievedIds ?? [],
            },
        });
    }

    public static async listMessages(args: ListMessagesArgs) {
        const items = await prisma.message.findMany({
            where: { conversationId: args.conversationId },
            orderBy: { createdAt: "desc" },
            take: args.limit + 1,
            ...(args.cursor ? { cursor: { id: args.cursor }, skip: 1 } : {}),
        });

        const hasMore = items.length > args.limit;
        const page = hasMore ? items.slice(0, args.limit) : items;
        const nextCursor = hasMore ? page[page.length - 1].id : null;

        return { items: page, nextCursor };
    }

    public static async listRecentForContext(args: { conversationId: string; limit: number }) {
        return prisma.message.findMany({
            where: { conversationId: args.conversationId },
            orderBy: { createdAt: "desc" },
            take: args.limit,
        });
    }
}
