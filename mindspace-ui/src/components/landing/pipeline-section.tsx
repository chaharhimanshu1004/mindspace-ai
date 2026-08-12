import { Section } from "./section";
import { SectionHeader } from "./section-header";
import { PipelineStep } from "./pipeline-step";
import { LifecycleTracker } from "./lifecycle-tracker";
import { pipelineSteps } from "./pipeline.data";

export function PipelineSection() {
    return (
        <Section id="pipeline">
            <SectionHeader overline="how it works" title="One path in, one index, one answer" />

            <ol className="mt-12 grid grid-cols-1 gap-9 md:grid-cols-3 md:gap-8">
                {pipelineSteps.map((step) => (
                    <PipelineStep key={step.index} step={step} />
                ))}
            </ol>

            <LifecycleTracker />
        </Section>
    );
}
