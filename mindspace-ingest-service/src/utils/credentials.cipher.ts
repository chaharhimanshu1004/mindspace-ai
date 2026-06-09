import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { env } from "../config/env";

const ALGO = "aes-256-gcm";
const KEY = Buffer.from(env.CREDENTIALS_SECRET, "hex");
const IV_LEN = 12;
const TAG_LEN = 16;

export const encryptCredentials = (plain: object): string => {
    const iv = randomBytes(IV_LEN);
    const cipher = createCipheriv(ALGO, KEY, iv);
    const json = JSON.stringify(plain);
    const encrypted = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString("base64");
};

export const decryptCredentials = <T = Record<string, unknown>>(ciphertext: string): T => {
    const buf = Buffer.from(ciphertext, "base64");
    const iv = buf.subarray(0, IV_LEN);
    const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
    const encrypted = buf.subarray(IV_LEN + TAG_LEN);
    const decipher = createDecipheriv(ALGO, KEY, iv);
    decipher.setAuthTag(tag);
    const json = decipher.update(encrypted) + decipher.final("utf8");
    return JSON.parse(json) as T;
};
