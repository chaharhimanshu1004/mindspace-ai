export function AnthropicIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 64 64"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <rect width="64" height="64" rx="14" fill="#CC9B7A" />
            <g transform="translate(16 21) scale(0.7)" fill="#1A1A18">
                <path d="M32.73 0h-6.945L38.45 32h6.945L32.73 0Z" />
                <path d="M12.665 0 0 32h7.082l2.59-6.72h13.25l2.59 6.72h7.082L19.929 0h-7.264Zm-.702 19.337 4.334-11.246 4.334 11.246h-8.668Z" />
            </g>
        </svg>
    );
}
