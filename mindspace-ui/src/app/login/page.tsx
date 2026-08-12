import { AuthShell } from "@/components/layouts/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
    return (
        <AuthShell
            overline="sign in"
            title="Welcome back"
            subtitle="Your index is where you left it."
            graphSide="left"
            footer={{ prompt: "New here?", href: "/signup", cta: "Create an account" }}
        >
            <LoginForm />
        </AuthShell>
    );
}
