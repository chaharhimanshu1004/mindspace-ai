interface Props {
    message?: string | null;
}

export function FormError({ message }: Props) {
    if (!message) return null;
    return (
        <div
            role="alert"
            className="rounded-control border border-danger-line bg-danger-tint px-3.5 py-3 text-body-sm text-danger-fg"
        >
            {message}
        </div>
    );
}
