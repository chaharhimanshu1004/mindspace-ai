import { prisma } from "../db/prisma";

interface CreateArgs {
    userId: number;
    content: string;
}

interface CreateWithSourceArgs {
    userId: number;
    content: string;
    sourceType: string;
    sourceRef: string | null;
    sourceMeta: object | null;
}

interface ListArgs {
    userId: number;
    limit: number;
    cursor?: string;
    sourceType?: string;
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

    public static async createWithSource(args: CreateWithSourceArgs) {
        return prisma.memory.create({
            data: {
                userId: args.userId,
                content: args.content,
                status: "pending",
                sourceType: args.sourceType,
                sourceRef: args.sourceRef,
                sourceMeta: args.sourceMeta ?? undefined,
            },
        });
    }

    public static async upsertContentBySource(args: CreateWithSourceArgs) {
        const existing = await prisma.memory.findFirst({
            where: {
                userId: args.userId,
                sourceType: args.sourceType,
                sourceRef: args.sourceRef ?? undefined,
            },
            select: { id: true, content: true },
        });

        if (!existing) {
            const created = await prisma.memory.create({
                data: {
                    userId: args.userId,
                    content: args.content,
                    status: "pending",
                    sourceType: args.sourceType,
                    sourceRef: args.sourceRef,
                    sourceMeta: args.sourceMeta ?? undefined,
                },
            });
            return { id: created.id, changed: true, created: true };
        }

        if (existing.content === args.content) {
            return { id: existing.id, changed: false, created: false };
        }

        const updated = await prisma.memory.update({
            where: { id: existing.id },
            data: {
                content: args.content,
                sourceMeta: args.sourceMeta ?? undefined,
                status: "pending",
            },
        });
        return { id: updated.id, changed: true, created: false };
    }

    public static async countForUser(userId: number): Promise<number> {
        return prisma.memory.count({ where: { userId } });
    }

    public static async findManyByIds(args: { userId: number; ids: string[] }) {
        return prisma.memory.findMany({
            where: { userId: args.userId, id: { in: args.ids } },
            orderBy: { createdAt: "desc" },
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
            where: {
                userId: args.userId,
                ...(args.sourceType ? { sourceType: args.sourceType } : {}),
            },
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
