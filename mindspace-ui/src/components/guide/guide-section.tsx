interface Props {
    id: string;
    eyebrow?: string;
    title: string;
    intro?: string;
    children: React.ReactNode;
}

export function GuideSection({ id, eyebrow, title, intro, children }: Props) {
    return (
        <section id={id} className="scroll-mt-24 pt-4">
            {eyebrow ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#24231F]/15 bg-gradient-to-r from-[#F1EEE6] to-[#F1EEE6] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] shadow-soft">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#24231F] shadow-[0_0_10px_rgba(36,35,31,0.7)]" />
                    <span className="bg-gradient-to-r from-[#24231F] to-[#57524A] bg-clip-text text-transparent">
                        {eyebrow}
                    </span>
                </span>
            ) : null}
            <h2 className="mt-4 text-[26px] font-bold leading-tight tracking-tight text-[#24231F] sm:text-[30px]">
                {title}
            </h2>
            {intro ? (
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#57524A]">
                    {intro}
                </p>
            ) : null}
            <div className="mt-6">{children}</div>
        </section>
    );
}
