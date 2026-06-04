import { AuthModel } from "../models/auth.model";
import { toPublicUser } from "../utils/auth.mapper";
import type { UpdateProfileInput } from "../schemas/profile.schema";
import type { PublicUser } from "../schemas/auth.types";

export class ProfileService {
    public static async update(args: { userId: number; input: UpdateProfileInput }): Promise<PublicUser> {
        const user = await AuthModel.updateName({ userId: args.userId, name: args.input.name });
        return toPublicUser(user);
    }
}
