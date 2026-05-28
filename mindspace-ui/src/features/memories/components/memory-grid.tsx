import { MemoryCard } from "./memory-card";
import type { Memory } from "../memory.types";

interface Props {
    memories: Memory[];
}

export function MemoryGrid({ memories }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {memories.map((m) => (
                <MemoryCard key={m.id} memory={m} />
            ))}
        </div>
    );
}
