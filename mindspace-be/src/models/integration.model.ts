import { prisma } from "../db/prisma";
import type { IntegrationProvider } from "../schemas/integration.types";

export class IntegrationModel {
    public static async upsert(args: { userId: number; provider: IntegrationProvider; credentials: string }) {
        return prisma.userIntegration.upsert({
            where: { userId_provider: { userId: args.userId, provider: args.provider } },
            create: { userId: args.userId, provider: args.provider, credentials: args.credentials },
            update: { credentials: args.credentials },
        });
    }

    public static async findByUserAndProvider(args: { userId: number; provider: IntegrationProvider }) {
        return prisma.userIntegration.findUnique({
            where: { userId_provider: { userId: args.userId, provider: args.provider } },
        });
    }

    public static async findAllByUser(userId: number) {
        return prisma.userIntegration.findMany({ where: { userId } });
    }

    public static async findAllByProvider(provider: IntegrationProvider) {
        return prisma.userIntegration.findMany({ where: { provider } });
    }

    public static async findUserIdsByProvider(provider: IntegrationProvider): Promise<number[]> {
        const rows = await prisma.userIntegration.findMany({
            where: { provider },
            select: { userId: true },
        });
        return rows.map((r) => r.userId);
    }

    public static async delete(args: { userId: number; provider: IntegrationProvider }) {
        return prisma.userIntegration.delete({
            where: { userId_provider: { userId: args.userId, provider: args.provider } },
        });
    }

    public static async updateCredentials(args: { userId: number; provider: IntegrationProvider; credentials: string }) {
        return prisma.userIntegration.update({
            where: { userId_provider: { userId: args.userId, provider: args.provider } },
            data: { credentials: args.credentials },
        });
    }
}
