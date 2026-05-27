export function FormError({ message }: { message?: string | null }) {
    if (!message) return null;
    return (
        <div
            role="alert"
            className="rounded-xl border border-rose-200/70 bg-rose-50/70 text-rose-700 text-sm px-3.5 py-2.5"
        >
            {message}
        </div>
    );
}
