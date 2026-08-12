import { Fragment } from "react";
import { Overline } from "@/components/ui/overline";
import { LifecycleStage } from "./lifecycle-stage";
import { lifecycleStages } from "./lifecycle.data";

function Rule() {
    return <span aria-hidden className="mt-3 hidden h-px flex-1 bg-border-strong sm:block" />;
}

export function LifecycleTracker() {
    return (
        <figure className="mt-14 rounded-card border border-border-subtle bg-surface-1 p-6 shadow-card sm:p-8">
            <figcaption>
                <Overline>memory status</Overline>
            </figcaption>

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-4">
                {lifecycleStages.map((stage, index) => (
                    <Fragment key={stage.label}>
                        <LifecycleStage stage={stage} />
                        {index < lifecycleStages.length - 1 ? <Rule /> : null}
                    </Fragment>
                ))}
            </div>
        </figure>
    );
}
