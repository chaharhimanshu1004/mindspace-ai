import { Fragment } from "react";
import { Layers } from "lucide-react";

const stages = [
    {
        label: "pending",
        note: "captured & queued",
        tile: "border-2 border-dashed border-[#C9C8C0] bg-white text-[#9CA3AF]",
        label_class: "text-[#6B7280]",
    },
    {
        label: "embedded",
        note: "768-dim vector",
        tile: "bg-gradient-to-br from-[#EEF0FF] to-[#E0E3FF] text-[#6366F1] ring-1 ring-[#6366F1]/15",
        label_class: "text-[#6B7280]",
    },
    {
        label: "enriched",
        note: "linked to context",
        tile: "bg-gradient-to-br from-[#818CF8] to-[#6366F1] text-white shadow-[0_12px_28px_rgba(99,102,241,0.4)]",
        label_class: "font-semibold text-[#2F3441]",
    },
];

function StageNode({
    tile,
    label,
    note,
    labelClass,
}: {
    tile: string;
    label: string;
    note: string;
    labelClass: string;
}) {
    return (
        <div className="flex flex-col items-center text-center">
            <span
                className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ease-calm ${tile}`}
            >
                <Layers className="h-7 w-7" />
            </span>
            <p className={`mt-4 font-mono text-sm tracking-tight ${labelClass}`}>
                {label}
            </p>
            <p className="mt-1 text-xs leading-snug text-[#6B7280]">{note}</p>
        </div>
    );
}

function Connector({ vertical }: { vertical?: boolean }) {
    if (vertical) {
        return (
            <div className="my-2 ml-8 h-8 w-[3px] rounded-full bg-gradient-to-b from-[#A5B4FC] to-[#6366F1]" />
        );
    }
    return (
        <div className="mt-8 flex flex-1 items-center">
            <span className="h-[3px] w-full rounded-full bg-gradient-to-r from-[#C7CBFB] via-[#A5B4FC] to-[#6366F1]" />
            <span className="-ml-1 h-2.5 w-2.5 rounded-full bg-[#6366F1] shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
        </div>
    );
}

export function LifecycleTracker() {
    return (
        <div className="mx-auto mt-14 max-w-4xl px-2 sm:px-6">
            <div className="hidden items-start sm:flex">
                {stages.map((stage, index) => (
                    <Fragment key={stage.label}>
                        <div className="flex-1">
                            <StageNode
                                tile={stage.tile}
                                label={stage.label}
                                note={stage.note}
                                labelClass={stage.label_class}
                            />
                        </div>
                        {index < stages.length - 1 ? <Connector /> : null}
                    </Fragment>
                ))}
            </div>

            <div className="flex flex-col items-center sm:hidden">
                {stages.map((stage, index) => (
                    <Fragment key={stage.label}>
                        <StageNode
                            tile={stage.tile}
                            label={stage.label}
                            note={stage.note}
                            labelClass={stage.label_class}
                        />
                        {index < stages.length - 1 ? (
                            <Connector vertical />
                        ) : null}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}
