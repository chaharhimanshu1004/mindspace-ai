import type { SectionProps } from "./section.types";

export function Section({ id, children, className }: SectionProps) {
    return (
        <section
            id={id}
            className={`mx-auto max-w-content scroll-mt-20 px-11 py-16 sm:px-16 lg:px-20 lg:py-20 ${className ?? ""}`}
        >
            {children}
        </section>
    );
}
