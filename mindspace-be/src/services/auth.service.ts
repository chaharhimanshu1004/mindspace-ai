import jwt, { type SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { env } from "../config/env";
import { AuthModel } from "../models/auth.model";
import { toPublicUser } from "../utils/auth.mapper";
import { parseDurationMs } from "../utils/duration";
import {
    emailTakenError,
    invalidCredentialsError,
    invalidStateError,
} from "../errors/auth-errors";
import {
    generateOtp,
    storeOtp,
    verifyOtp as verifyOtpRecord,
    getOtpRecord,
    checkResendAllowed,
    resetOtp,
} from "./otp.service";
import { sendOtpEmail } from "./mailer.service";
import {
    buildSigninUrl,
    exchangeSigninCode,
    fetchGoogleUser,
} from "../connectors/google-signin.connector";
import { redis } from "../db/redis";

import type { LoginInput, SignupInput, VerifyOtpInput, ResendOtpInput } from "../schemas/auth.schema";
import type { AuthSession, JwtPayload, OtpPending } from "../schemas/auth.types";

const STATE_TTL = 300;
const stateKey = (state: string): string => `google_signin_state:${state}`;

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

    public static async signup(input: SignupInput): Promise<OtpPending> {
        const existing = await AuthModel.findUserByEmail(input.email);
        if (existing) throw emailTakenError();

        const passwordHash = await AuthService.hashPassword(input.password);
        const tempToken = crypto.randomUUID();
        const otp = generateOtp();

        await storeOtp({ tempToken, otp, email: input.email, passwordHash });
        await sendOtpEmail({ to: input.email, otp });

        return { tempToken, email: input.email };
    }

    public static async verifyOtp(input: VerifyOtpInput): Promise<AuthSession> {
        const record = await verifyOtpRecord({ tempToken: input.tempToken, otp: input.otp });

        const existing = await AuthModel.findUserByEmail(record.email);
        if (existing) throw emailTakenError();

        const user = await AuthModel.createUser({
            email: record.email,
            passwordHash: record.passwordHash,
        });

        const { token, expiresAt } = await AuthService.issueSession(user.id);
        return { token, expiresAt, user: toPublicUser(user) };
    }

    public static async resendOtp(input: ResendOtpInput): Promise<void> {
        await checkResendAllowed(input.tempToken);
        const record = await getOtpRecord(input.tempToken);
        const otp = generateOtp();
        await resetOtp({ tempToken: input.tempToken, otp, record });
        await sendOtpEmail({ to: record.email, otp });
    }

    public static async login(input: LoginInput): Promise<AuthSession> {
        const user = await AuthModel.findUserByEmail(input.email);
        if (!user || !user.password) throw invalidCredentialsError();

        const ok = await AuthService.comparePassword(input.password, user.password);
        if (!ok) throw invalidCredentialsError();

        await AuthModel.revokeAllUserTokens(user.id);

        const { token, expiresAt } = await AuthService.issueSession(user.id);
        return { token, expiresAt, user: toPublicUser(user) };
    }

    public static async googleRedirect(): Promise<string> {
        const state = crypto.randomUUID();
        await redis.setex(stateKey(state), STATE_TTL, "1");
        return buildSigninUrl(state);
    }

    public static async googleCallback(args: { code: string; state: string }): Promise<AuthSession> {
        const valid = await redis.get(stateKey(args.state));
        if (!valid) throw invalidStateError();
        await redis.del(stateKey(args.state));

        const { accessToken } = await exchangeSigninCode(args.code);
        const googleUser = await fetchGoogleUser(accessToken);

        let user = await AuthModel.findByGoogleId(googleUser.id);

        if (!user) {
            const byEmail = await AuthModel.findUserByEmail(googleUser.email);
            if (byEmail) {
                user = await AuthModel.linkGoogleId({ userId: byEmail.id, googleId: googleUser.id });
            } else {
                user = await AuthModel.createGoogleUser({
                    email: googleUser.email,
                    googleId: googleUser.id,
                    name: googleUser.name,
                });
            }
        }

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
