import { Section } from "./section";
import { SectionHeader } from "./section-header";
import { SurfaceCard } from "./surface-card";
import { surfaceItems } from "./surfaces.data";

export function SurfacesSection() {
    return (
        <Section id="surfaces">
            <SectionHeader overline="surfaces" title="Ask from wherever you are" />

            <div className="mt-10 overflow-hidden rounded-card border border-border-subtle shadow-sm">
                <div className="grid grid-cols-1 gap-px bg-border-subtle md:grid-cols-3">
                    {surfaceItems.map((item) => (
                        <SurfaceCard key={item.title} item={item} />
                    ))}
                </div>
            </div>
        </Section>
    );
}
