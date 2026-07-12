import { AuthShell } from "@/components/layouts/auth-shell";
import { OtpForm } from "@/features/auth/components/otp-form";

export default function VerifyOtpPage() {
    return (
        <AuthShell
            title="Check your inbox"
            subtitle="Enter the 6-digit code we sent to your email."
            footer={{ prompt: "Wrong email?", href: "/signup", cta: "Start over" }}
        >
            <OtpForm />
        </AuthShell>
    );
}
