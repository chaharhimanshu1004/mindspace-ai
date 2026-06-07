import { createHash, randomBytes } from "crypto";

export const generateCode = (): string => randomBytes(32).toString("hex");

export const generateToken = (): string => randomBytes(48).toString("base64url");

export const verifyCodeChallenge = (verifier: string, challenge: string): boolean => {
    const hash = createHash("sha256").update(verifier).digest("base64url");
    return hash === challenge;
};
