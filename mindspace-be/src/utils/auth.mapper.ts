import type { User } from "@prisma/client";
import type { PublicUser } from "../schemas/auth.types";

export const toPublicUser = (user: User): PublicUser => ({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
});
