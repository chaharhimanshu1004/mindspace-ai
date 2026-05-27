import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { env } from "../config/env";
import { AuthModel } from "../models/auth.model";
import { toPublicUser } from "../utils/auth.mapper";
import { parseDurationMs } from "../utils/duration";
import { emailTakenError, invalidCredentialsError } from "../errors/auth-errors";

import type { LoginInput } from "../schemas/login.schema";
import type { SignupInput } from "../schemas/signup.schema";
import type { AuthSession, JwtPayload } from "../schemas/auth.types";

export class AuthService {

    private static get expiresIn() {
        return env.JWT_EXPIRES_IN as SignOptions["expiresIn"];
    }

    public static signToken(args: { userId: number; tokenId: number }): string {
        const payload: JwtPayload = { sub: args.userId, jti: args.tokenId };
        return jwt.sign(payload, env.JWT_SECRET, { expiresIn: AuthService.expiresIn });
    }

    public static verifyToken(token: string): JwtPayload {
        return jwt.verify(token, env.JWT_SECRET) as unknown as JwtPayload;
    }

    public static computeExpiry(): Date {
        const ms = parseDurationMs(env.JWT_EXPIRES_IN);
        return new Date(Date.now() + ms);
    }


    private static async hashPassword(plain: string): Promise<string> {
        return bcrypt.hash(plain, env.BCRYPT_ROUNDS);
    }

    private static async comparePassword(plain: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(plain, hashed);
    }


    private static async issueSession(userId: number): Promise<{ token: string; expiresAt: Date }> {
        const expiresAt = AuthService.computeExpiry();

        const placeholder = await AuthModel.createToken({ userId, expiresAt });
        const token = AuthService.signToken({ userId, tokenId: placeholder.id });

        await AuthModel.setToken(placeholder.id, token);

        return { token, expiresAt };
    }

    public static async signup(input: SignupInput): Promise<AuthSession> {
        const existing = await AuthModel.findUserByEmail(input.email);
        if (existing) throw emailTakenError();

        const passwordHash = await AuthService.hashPassword(input.password);
        const user = await AuthModel.createUser({ email: input.email, passwordHash });

        const { token, expiresAt } = await AuthService.issueSession(user.id);

        return { token, expiresAt, user: toPublicUser(user) };
    }

    public static async login(input: LoginInput): Promise<AuthSession> {
        const user = await AuthModel.findUserByEmail(input.email);
        if (!user) throw invalidCredentialsError();

        const ok = await AuthService.comparePassword(input.password, user.password);
        if (!ok) throw invalidCredentialsError();

        await AuthModel.revokeAllUserTokens(user.id);

        const { token, expiresAt } = await AuthService.issueSession(user.id);

        return { token, expiresAt, user: toPublicUser(user) };
    }

    public static async logout(tokenId: number): Promise<void> {
        await AuthModel.revokeTokenById(tokenId);
    }

    public static async findActiveToken(id: number) {
        return AuthModel.findActiveTokenById(id);
    }
}
