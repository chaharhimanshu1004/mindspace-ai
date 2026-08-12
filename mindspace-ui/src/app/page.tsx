import { LandingBackground } from "@/components/landing/landing-background";
import { PageRules } from "@/components/layouts/page-rules";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { PipelineSection } from "@/components/landing/pipeline-section";
import { SurfacesSection } from "@/components/landing/surfaces-section";
import { RecallSection } from "@/components/landing/recall-section";
import { IntegrationsGrid } from "@/components/landing/integrations-grid";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
    return (
        <main className="relative min-h-screen">
            <LandingBackground />
            <PageRules />
            <LandingNav />
            <LandingHero />
            <PipelineSection />
            <SurfacesSection />
            <RecallSection />
            <IntegrationsGrid />
            <LandingCta />
            <LandingFooter />
        </main>
    );
}
