interface Props {
    eyebrow: string;
    title: string;
    description: string;
}

export function SectionHeading({ eyebrow, title, description }: Props) {
    return (
        <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6366F1]/15 bg-gradient-to-r from-[#EEF0FF] to-[#F5F3FF] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] shadow-soft backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#6366F1] shadow-[0_0_10px_rgba(99,102,241,0.7)]" />
                <span className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] bg-clip-text text-transparent">
                    {eyebrow}
                </span>
            </span>
            <h2 className="mt-5 text-[30px] font-bold leading-tight tracking-tight text-[#2F3441] sm:text-[40px]">
                {title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
                {description}
            </p>
        </div>
    );
}
