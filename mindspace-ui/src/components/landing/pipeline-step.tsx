import type { PipelineStep as Step } from "./pipeline.types";

interface Props {
    step: Step;
}

export function PipelineStep({ step }: Props) {
    return (
        <li className="border-t border-border-strong pt-5">
            <span className="font-mono text-overline font-semibold tracking-[0.14em] text-ink-subtle">
                {step.index}
            </span>
            <h3 className="mt-4 ink-weight font-display text-display-sm text-ink">
                {step.title}
            </h3>
            <p className="mt-2.5 max-w-[34ch] text-body text-ink-muted">{step.body}</p>
            <p className="mt-5 font-mono text-[11px] text-ink-subtle">{step.detail}</p>
        </li>
    );
}
