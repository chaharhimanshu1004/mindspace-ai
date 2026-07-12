import { randomInt } from "crypto";
import { redis } from "../db/redis";
import { otpExpiredError, invalidOtpError } from "../errors/auth-errors";
import { AppError } from "../errors/app-error";

const OTP_TTL = 600;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_TTL = 60;

const otpKey = (tempToken: string): string => `otp:${tempToken}`;
const resendKey = (tempToken: string): string => `otp_resend:${tempToken}`;

export interface OtpRecord {
    otp: string;
    email: string;
    passwordHash: string;
    attempts: number;
}

export const generateOtp = (): string =>
    String(randomInt(0, 1_000_000)).padStart(6, "0");

export const storeOtp = async (args: {
    tempToken: string;
    otp: string;
    email: string;
    passwordHash: string;
}): Promise<void> => {
    const value: OtpRecord = {
        otp: args.otp,
        email: args.email,
        passwordHash: args.passwordHash,
        attempts: 0,
    };
    await redis.setex(otpKey(args.tempToken), OTP_TTL, JSON.stringify(value));
};

export const verifyOtp = async (args: {
    tempToken: string;
    otp: string;
}): Promise<OtpRecord> => {
    const raw = await redis.get(otpKey(args.tempToken));
    if (!raw) throw otpExpiredError();

    const record: OtpRecord = JSON.parse(raw);

    if (record.attempts >= MAX_ATTEMPTS) {
        await redis.del(otpKey(args.tempToken));
        throw otpExpiredError();
    }

    if (record.otp !== args.otp) {
        record.attempts += 1;
        await redis.setex(otpKey(args.tempToken), OTP_TTL, JSON.stringify(record));
        throw invalidOtpError();
    }

    await redis.del(otpKey(args.tempToken));
    return record;
};

export const getOtpRecord = async (tempToken: string): Promise<OtpRecord> => {
    const raw = await redis.get(otpKey(tempToken));
    if (!raw) throw otpExpiredError();
    return JSON.parse(raw) as OtpRecord;
};

export const checkResendAllowed = async (tempToken: string): Promise<void> => {
    const exists = await redis.get(resendKey(tempToken));
    if (exists) {
        throw new AppError({
            message: "Please wait before requesting another code.",
            status: 429,
            code: "RESEND_TOO_SOON",
        });
    }
    await redis.setex(resendKey(tempToken), RESEND_COOLDOWN_TTL, "1");
};

export const resetOtp = async (args: {
    tempToken: string;
    otp: string;
    record: OtpRecord;
}): Promise<void> => {
    const updated: OtpRecord = { ...args.record, otp: args.otp, attempts: 0 };
    await redis.setex(otpKey(args.tempToken), OTP_TTL, JSON.stringify(updated));
};
