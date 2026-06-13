import { LandingBackground } from "@/components/landing/landing-background";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { IntegrationsGrid } from "@/components/landing/integrations-grid";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
    return (
        <main className="relative min-h-screen bg-[#FAFAF7]">
            <LandingBackground />
            <LandingNav />
            <div id="features">
                <LandingHero />
                <HowItWorks />
            </div>
            <IntegrationsGrid />
            <LandingFooter />
        </main>
    );
}
