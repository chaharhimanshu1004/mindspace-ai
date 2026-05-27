import { prisma } from "../db/prisma";

export class AuthModel {
    public static async findUserByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    public static async findUserById(id: number) {
        return prisma.user.findUnique({ where: { id } });
    }

    public static async createUser(args: { email: string; passwordHash: string }) {
        return prisma.user.create({
            data: { email: args.email, password: args.passwordHash },
        });
    }

    public static async createToken(args: { userId: number; expiresAt: Date }) {
        return prisma.authToken.create({
            data: {
                userId: args.userId,
                token: `pending-${crypto.randomUUID()}`,
                expiresAt: args.expiresAt,
                status: "active",
            },
        });
    }

    public static async setToken(id: number, token: string) {
        return prisma.authToken.update({
            where: { id },
            data: { token },
        });
    }

    public static async findActiveTokenById(id: number) {
        return prisma.authToken.findFirst({
            where: { id, status: "active" },
        });
    }

    public static async revokeAllUserTokens(userId: number) {
        return prisma.authToken.updateMany({
            where: { userId, status: "active" },
            data: { status: "revoked" },
        });
    }

    public static async revokeTokenById(id: number) {
        return prisma.authToken.update({
            where: { id },
            data: { status: "revoked" },
        });
    }
}
