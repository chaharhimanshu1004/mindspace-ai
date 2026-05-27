import type { AuthContext } from "./schemas/auth.types";

declare global {
    namespace Express {
        interface Request {
            auth?: AuthContext;
        }
    }
}

export { };
