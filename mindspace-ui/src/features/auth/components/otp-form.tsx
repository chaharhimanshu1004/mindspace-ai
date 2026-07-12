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
                <p className="text-[14px] text-[#6B7280]">
                    We sent a 6-digit code to{" "}
                    <span className="font-semibold text-[#2F3441]">{email}</span>
                </p>
            )}

            <div className="flex gap-2.5">
                {digits.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        autoFocus={i === 0}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                        className={[
                            "w-full h-14 text-center text-2xl font-bold rounded-xl bg-white",
                            "border border-[#E5E7EB] text-[#2F3441]",
                            "transition-all duration-200",
                            "focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20",
                            digit ? "border-[#6366F1] bg-[#F5F3FF]" : "",
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

            <div className="text-center">
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || resendMutation.isPending}
                    className="text-sm text-[#6366F1] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
                </button>
            </div>
        </div>
    );
}
