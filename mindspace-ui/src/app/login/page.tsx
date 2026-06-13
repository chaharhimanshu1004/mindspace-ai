import { AuthShell } from "@/components/layouts/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
    return (
        <AuthShell
            title="Welcome back"
            subtitle="Step back into your quiet space."
            artSide="left"
            footer={{
                prompt: "New here?",
                href: "/signup",
                cta: "Create an account",
            }}
        >
            <LoginForm />
        </AuthShell>
    );
}
