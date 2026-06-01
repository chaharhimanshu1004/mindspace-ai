import { prisma } from "../db/prisma";

interface CreateArgs {
    userId: number;
    content: string;
}

interface ListArgs {
    userId: number;
    limit: number;
    cursor?: string;
}

export class MemoryModel {
    public static async create(args: CreateArgs) {
        return prisma.memory.create({
            data: {
                userId: args.userId,
                content: args.content,
                status: "pending",
            },
        });
    }

    public static async findByIdForUser(args: { id: string; userId: number }) {
        return prisma.memory.findFirst({
            where: { id: args.id, userId: args.userId },
        });
    }

    public static async delete(args: { id: string; userId: number }) {
        return prisma.memory.delete({
            where: { id: args.id, userId: args.userId },
        });
    }

    public static async listForUser(args: ListArgs) {
        const items = await prisma.memory.findMany({
            where: { userId: args.userId },
            orderBy: { createdAt: "desc" },
            take: args.limit + 1,
            ...(args.cursor ? { cursor: { id: args.cursor }, skip: 1 } : {}),
        });

        const hasMore = items.length > args.limit;
        const page = hasMore ? items.slice(0, args.limit) : items;
        const nextCursor = hasMore ? page[page.length - 1].id : null;

        return { items: page, nextCursor };
    }
}
