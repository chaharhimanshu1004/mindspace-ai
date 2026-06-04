import { prisma } from "../db/prisma";

export class AuthModel {
    public static async findUserByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    public static async findUserById(id: number) {
        return prisma.user.findUnique({ where: { id } });
    }

    public static async createUser(args: { email: string; passwordHash: string }) {
        const name = args.email.split("@")[0]; // users by default name is their prefix of email
        return prisma.user.create({
            data: { email: args.email, password: args.passwordHash, name },
        });
    }

    public static async updateName(args: { userId: number; name: string }) {
        return prisma.user.update({
            where: { id: args.userId },
            data: { name: args.name },
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
