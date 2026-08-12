import { AuthShell } from "@/components/layouts/auth-shell";
import { OtpForm } from "@/features/auth/components/otp-form";

export default function VerifyOtpPage() {
    return (
        <AuthShell
            overline="verify email"
            title="Check your inbox"
            subtitle="Enter the six-digit code we just sent you."
            footer={{ prompt: "Wrong email?", href: "/signup", cta: "Start over" }}
        >
            <OtpForm />
        </AuthShell>
    );
}
