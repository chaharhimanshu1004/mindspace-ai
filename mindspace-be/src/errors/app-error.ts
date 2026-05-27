export class AppError extends Error {
    public readonly status: number;
    public readonly code: string;
    public readonly details?: unknown;

    constructor(args: {
        message: string;
        status: number;
        code: string;
        details?: unknown;
    }) {
        super(args.message);
        this.name = "AppError";
        this.status = args.status;
        this.code = args.code;
        this.details = args.details;
    }
}
