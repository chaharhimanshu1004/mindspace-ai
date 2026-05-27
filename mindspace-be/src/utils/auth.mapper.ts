import type { User } from "@prisma/client";
import type { PublicUser } from "../schemas/auth.types";

export const toPublicUser = (user: User): PublicUser => ({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
});
