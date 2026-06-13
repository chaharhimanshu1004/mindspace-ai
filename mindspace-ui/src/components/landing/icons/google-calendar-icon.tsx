export function GoogleCalendarIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 200"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <path d="M152 47H48v106h104z" fill="#fff" />
            <path d="M152 200l48-48h-48z" fill="#EA4335" />
            <path d="M200 47h-48v105h48z" fill="#FBBC04" />
            <path d="M152 152H48v48h104z" fill="#34A853" />
            <path d="M0 152v33a15 15 0 0 0 15 15h33v-48z" fill="#188038" />
            <path d="M200 47V15a15 15 0 0 0-15-15h-33v47z" fill="#1967D2" />
            <path
                d="M152 0H15A15 15 0 0 0 0 15v137h48V47h104z"
                fill="#4285F4"
            />
            <text
                x="100"
                y="130"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontSize="68"
                fontWeight="bold"
                fill="#4285F4"
            >
                31
            </text>
        </svg>
    );
}
