import { prisma } from "../db/prisma";

export class OAuthModel {
    public static async findClient(clientId: string) {
        return prisma.oAuthClient.findUnique({ where: { clientId } });
    }

    public static async createAuthCode(args: {
        code: string;
        clientId: string;
        userId: number;
        redirectUri: string;
        scopes: string[];
        codeChallenge: string;
        expiresAt: Date;
    }) {
        return prisma.oAuthAuthCode.create({ data: args });
    }

    public static async consumeAuthCode(code: string) {
        const result = await prisma.oAuthAuthCode.updateMany({
            where: { code, consumedAt: null },
            data: { consumedAt: new Date() },
        });
        if (result.count === 0) return null;
        return prisma.oAuthAuthCode.findUnique({ where: { code } });
    }

    public static async upsertToken(args: {
        userId: number;
        clientId: string;
        accessToken: string;
        refreshToken: string;
        scopes: string[];
        expiresAt: Date;
    }) {
        const existing = await prisma.oAuthToken.findFirst({
            where: { userId: args.userId, clientId: args.clientId, revokedAt: null },
        });

        if (existing) {
            return prisma.oAuthToken.update({
                where: { id: existing.id },
                data: {
                    accessToken: args.accessToken,
                    refreshToken: args.refreshToken,
                    expiresAt: args.expiresAt,
                    lastUsedAt: new Date(),
                },
            });
        }

        return prisma.oAuthToken.create({ data: args });
    }

    public static async findByAccessToken(token: string) {
        return prisma.oAuthToken.findUnique({ where: { accessToken: token } });
    }

    public static async findByRefreshToken(token: string) {
        return prisma.oAuthToken.findUnique({ where: { refreshToken: token } });
    }

    public static async touchLastUsed(id: number) {
        return prisma.oAuthToken.update({
            where: { id },
            data: { lastUsedAt: new Date() },
        });
    }

    public static async revokeToken(id: number) {
        return prisma.oAuthToken.update({
            where: { id },
            data: { revokedAt: new Date() },
        });
    }

    public static async listActiveTokensForUser(userId: number) {
        return prisma.oAuthToken.findMany({
            where: { userId, revokedAt: null },
            include: { client: { select: { name: true, clientId: true } } },
            orderBy: { createdAt: "desc" },
        });
    }
}
