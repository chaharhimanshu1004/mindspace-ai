import { AuthShell } from "@/components/layouts/auth-shell";
import { SignupForm } from "@/features/auth/components/signup-form";

export default function SignupPage() {
    return (
        <AuthShell
            overline="create account"
            title="Start with one note"
            subtitle="Free to set up. Connect a source when you want one."
            footer={{ prompt: "Already have an account?", href: "/login", cta: "Log in" }}
        >
            <SignupForm />
        </AuthShell>
    );
}
