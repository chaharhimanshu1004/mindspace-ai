import { Card } from "@/components/ui/card";
import { AuthShell } from "@/components/layouts/auth-shell";
import { SignupForm } from "@/features/auth/components/signup-form";

export default function SignupPage() {
    return (
        <AuthShell
            title="Begin your MindSpace"
            subtitle="A calm home for the thoughts you don't want to lose."
            footer={{
                prompt: "Already have one?",
                href: "/login",
                cta: "Log in",
            }}
        >
            <Card>
                <SignupForm />
            </Card>
        </AuthShell>
    );
}
