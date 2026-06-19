interface Props {
    n: number;
    title: string;
    children?: React.ReactNode;
    last?: boolean;
}

export function GuideStep({ n, title, children, last }: Props) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#818CF8] to-[#6366F1] text-[13px] font-bold text-white shadow-soft">
                    {n}
                </span>
                {!last ? (
                    <span className="mt-1 w-px flex-1 bg-gradient-to-b from-[#6366F1]/30 to-transparent" />
                ) : null}
            </div>
            <div className={`min-w-0 flex-1 ${last ? "pb-0" : "pb-8"}`}>
                <h4 className="text-[15px] font-semibold tracking-tight text-[#2F3441]">
                    {title}
                </h4>
                <div className="mt-2 space-y-3 text-[14px] leading-relaxed text-[#6B7280]">
                    {children}
                </div>
            </div>
        </div>
    );
}
