import crypto from "crypto";
import { redis } from "../db/redis";
import { env } from "../config/env";
import { IntegrationModel } from "../models/integration.model";
import { MemoryModel } from "../models/memory.model";
import { MemoryQueueService } from "./memoryQueue.service";
import { ChatService } from "./chat.service";
import { AppError } from "../errors/app-error";
import { encryptCredentials, decryptCredentials } from "../utils/credentials.cipher";
import type { TelegramCredentials } from "../schemas/integration.types";

const PROVIDER = "telegram";
const PAIRING_KEY_PREFIX = "telegram:pair:";
const USER_KEY_PREFIX = "telegram:user:";
const PAIRING_TTL = 300; // 5 minutes

export class TelegramIntegrationService {
    public static async generatePairingToken(userId: number): Promise<{ token: string; link: string }> {
        const token = crypto.randomBytes(16).toString("hex");
        const redisKey = `${PAIRING_KEY_PREFIX}${token}`;
        
        await redis.set(redisKey, userId.toString(), "EX", PAIRING_TTL);
        
        const link = `https://t.me/${env.TELEGRAM_BOT_USERNAME}?start=pair_${token}`;
        return { token, link };
    }

    public static async linkAccount(args: { telegramUserId: string; token: string }): Promise<{ success: boolean; userId: number }> {
        const redisKey = `${PAIRING_KEY_PREFIX}${args.token}`;
        const userIdStr = await redis.get(redisKey);
        
        if (!userIdStr) {
            throw new AppError({
                message: "Invalid or expired pairing token",
                status: 400,
                code: "TELEGRAM_PAIR_EXPIRED",
            });
        }
        
        const userId = parseInt(userIdStr, 10);
        const plain: TelegramCredentials = {
            telegramUserId: args.telegramUserId,
        };
        const credentials = encryptCredentials(plain);
        
        await IntegrationModel.upsert({ userId, provider: PROVIDER, credentials });
        
        // Cache the telegramUserId -> userId mapping
        await redis.set(`${USER_KEY_PREFIX}${args.telegramUserId}`, userId.toString());
        
        // Clean up pairing key
        await redis.del(redisKey);
        
        return { success: true, userId };
    }

    public static async disconnect(userId: number): Promise<void> {
        const integration = await IntegrationModel.findByUserAndProvider({ userId, provider: PROVIDER });
        if (!integration) {
            throw new AppError({
                message: "Telegram integration not found",
                status: 404,
                code: "TELEGRAM_NOT_FOUND",
            });
        }
        
        const creds = decryptCredentials<TelegramCredentials>(integration.credentials);
        
        // Delete cache
        await redis.del(`${USER_KEY_PREFIX}${creds.telegramUserId}`);
        
        // Delete db record
        await IntegrationModel.delete({ userId, provider: PROVIDER });
    }

    public static async resolveUserByTelegramId(telegramUserId: string): Promise<number | null> {
        const cacheKey = `${USER_KEY_PREFIX}${telegramUserId}`;
        const cachedUserId = await redis.get(cacheKey);
        if (cachedUserId) {
            return parseInt(cachedUserId, 10);
        }
        
        const rows = await IntegrationModel.findAllByProvider(PROVIDER);
        for (const row of rows) {
            try {
                const creds = decryptCredentials<TelegramCredentials>(row.credentials);
                if (creds.telegramUserId === telegramUserId) {
                    await redis.set(cacheKey, row.userId.toString());
                    return row.userId;
                }
            } catch {
                continue;
            }
        }
        
        return null;
    }

    public static async handleIncomingMessage(args: { telegramUserId: string; text: string }): Promise<{ memoryId: string }> {
        const userId = await this.resolveUserByTelegramId(args.telegramUserId);
        if (!userId) {
            throw new AppError({
                message: "Unauthorized: Telegram account not linked to any user.",
                status: 401,
                code: "TELEGRAM_UNLINKED",
            });
        }
        
        const memory = await MemoryModel.createWithSource({
            userId,
            content: args.text,
            sourceType: "telegram",
            sourceRef: `telegram:msg:${Date.now()}`,
            sourceMeta: null,
        });
        
        await MemoryQueueService.enqueueForEnrichment({
            memoryId: memory.id,
            userId: memory.userId,
        });
        
        return { memoryId: memory.id };
    }

    public static async handleIncomingQuery(args: { telegramUserId: string; text: string }): Promise<{ answer: string }> {
        const userId = await this.resolveUserByTelegramId(args.telegramUserId);
        if (!userId) {
            throw new AppError({
                message: "Unauthorized: Telegram account not linked to any user.",
                status: 401,
                code: "TELEGRAM_UNLINKED",
            });
        }
        
        try {
            const result = await ChatService.ask({
                userId,
                message: args.text,
            });
            return { answer: result.answer };
        } catch (error) {
            if (error instanceof AppError && error.code === "NO_MEMORIES") {
                return { answer: "I couldn't find any memories in your MindSpace to answer this. Try sending me some notes first!" };
            }
            throw error;
        }
    }
}
