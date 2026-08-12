import { Section } from "./section";
import { SectionHeader } from "./section-header";
import { IntegrationTile } from "./integration-tile";
import { integrations } from "./integrations.data";

export function IntegrationsGrid() {
    return (
        <Section id="integrations">
            <SectionHeader overline="integrations" title="Connectors, not screenshots" />

            <div className="mt-12 overflow-hidden rounded-card border border-border-subtle shadow-sm">
                <div className="grid grid-cols-1 gap-px bg-border-subtle sm:grid-cols-2 lg:grid-cols-3">
                    {integrations.map((item) => (
                        <IntegrationTile key={item.title} item={item} />
                    ))}
                </div>
            </div>
        </Section>
    );
}
