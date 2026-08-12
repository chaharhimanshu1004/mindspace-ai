import { Badge } from "@/components/ui/badge";
import { BrandTile } from "./brand-tile";
import type { Integration } from "./integrations.types";

interface Props {
    item: Integration;
}

export function IntegrationTile({ item }: Props) {
    return (
        <article className="flex gap-4 bg-surface-1 p-6 transition-colors duration-base ease-standard hover:bg-surface-2/70">
            <BrandTile icon={item.icon} brand={item.brand} />
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <h3 className="ink-weight font-display text-[20px] leading-none text-ink">
                        {item.title}
                    </h3>
                    {item.status === "soon" ? (
                        <Badge tone="info">soon</Badge>
                    ) : (
                        <Badge tone="success" dot>
                            live
                        </Badge>
                    )}
                </div>
                <p className="mt-2.5 text-body-sm text-ink-muted">{item.body}</p>
            </div>
        </article>
    );
}
