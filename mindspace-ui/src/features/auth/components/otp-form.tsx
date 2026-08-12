"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useVerifyOtp } from "../hooks/use-verify-otp";
import { useResendOtp } from "../hooks/use-resend-otp";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export function OtpForm() {
    const router = useRouter();
    const [tempToken, setTempToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const verifyMutation = useVerifyOtp();
    const resendMutation = useResendOtp();

    useEffect(() => {
        const token = sessionStorage.getItem("otp_temp_token");
        const em = sessionStorage.getItem("otp_email");
        if (!token || !em) {
            router.replace("/signup");
            return;
        }
        setTempToken(token);
        setEmail(em);
    }, [router]);

    const focusAt = (index: number) => {
        inputRefs.current[index]?.focus();
    };

    const handleChange = (index: number, value: string) => {
        const char = value.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[index] = char;
        setDigits(next);
        if (char && index < OTP_LENGTH - 1) focusAt(index + 1);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            focusAt(index - 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const next = [...digits];
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
        setDigits(next);
        focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
    };

    const handleVerify = () => {
        if (!tempToken) return;
        const otp = digits.join("");
        if (otp.length !== OTP_LENGTH) return;
        verifyMutation.mutate({ tempToken, otp });
    };

    const handleResend = () => {
        if (!tempToken || cooldown > 0 || resendMutation.isPending) return;
        resendMutation.mutate({ tempToken });
        setCooldown(RESEND_COOLDOWN);
        cooldownRef.current = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
        };
    }, []);

    const otp = digits.join("");
    const isComplete = otp.length === OTP_LENGTH;

    return (
        <div className="space-y-6">
            {email && (
                <p className="text-body-sm text-ink-muted">
                    Code sent to <span className="font-mono text-ink">{email}</span>
                </p>
            )}

            <div className="flex gap-2">
                {digits.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        autoFocus={i === 0}
                        aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                        className={[
                            "h-14 w-full rounded-control bg-surface-1 text-center",
                            "font-mono text-[22px] text-ink",
                            "border transition-colors duration-fast ease-standard",
                            "focus:outline-none focus-visible:shadow-ring focus:border-ink",
                            digit ? "border-ink" : "border-border-interactive",
                        ].join(" ")}
                    />
                ))}
            </div>

            <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={!isComplete}
                loading={verifyMutation.isPending}
                onClick={handleVerify}
            >
                Verify email
            </Button>

            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || resendMutation.isPending}
                    className="rounded-control text-body-sm font-semibold text-ink underline decoration-border-strong decoration-2 underline-offset-4 transition-colors duration-fast ease-standard hover:decoration-ink disabled:no-underline disabled:opacity-45 focus:outline-none focus-visible:shadow-ring"
                >
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </button>
            </div>
        </div>
    );
}
