export interface MotionDurations {
    instant: number;
    fast: number;
    base: number;
    slow: number;
    slower: number;
}

export interface MotionEasings {
    standard: string;
    exit: string;
    calm: string;
}

export interface Motion {
    duration: MotionDurations;
    easing: MotionEasings;
}
