import { Overline } from "@/components/ui/overline";
import { MarqueeRow } from "./marquee-row";
import { recallRowOne, recallRowTwo } from "./recall.data";

export function RecallSection() {
    return (
        <section id="recall" className="scroll-mt-20 py-16 lg:py-20">
            <div className="mx-auto max-w-content px-11 sm:px-16 lg:px-20">
                <div className="max-w-xl">
                    <span aria-hidden className="mb-5 block text-[40px] leading-none">
                        🤦
                    </span>
                    <Overline>recall</Overline>
                    <h2 className="ink-weight mt-5 font-display text-[24px] leading-[1.16] tracking-[-0.015em] text-ink sm:text-display-md">
                        Questions you stop hunting for
                    </h2>
                </div>
            </div>

            <div className="mt-12 flex flex-col gap-4">
                <MarqueeRow items={recallRowOne} />
                <MarqueeRow items={recallRowTwo} reverse />
            </div>
        </section>
    );
}
