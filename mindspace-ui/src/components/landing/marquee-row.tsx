import { RecallCard } from "./recall-card";
import type { RecallItem } from "./recall.types";

interface Props {
    items: RecallItem[];
    reverse?: boolean;
}

export function MarqueeRow({ items, reverse = false }: Props) {
    const track = reverse ? "marquee-track marquee-reverse" : "marquee-track";

    return (
        <div className="marquee-mask overflow-hidden">
            <div className={`${track} flex w-max gap-4 py-2`}>
                {[0, 1].map((copy) => (
                    <div key={copy} className="flex gap-4" aria-hidden={copy === 1}>
                        {items.map((item) => (
                            <RecallCard key={`${copy}-${item.question}`} item={item} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
