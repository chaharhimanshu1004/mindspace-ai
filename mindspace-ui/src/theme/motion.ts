import type { Motion } from "./motion.types";

export const motion: Motion = {
    duration: {
        instant: 0,
        fast: 120,
        base: 180,
        slow: 240,
        slower: 320,
    },
    easing: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
        exit: "cubic-bezier(0.4, 0, 1, 1)",
        calm: "cubic-bezier(0.22, 1, 0.36, 1)",
    },
};
