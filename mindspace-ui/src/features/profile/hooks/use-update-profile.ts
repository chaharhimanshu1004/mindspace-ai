"use client";

import { useState } from "react";
import { updateProfileApi } from "../api/update-profile.api";
import { useAuth } from "@/features/auth/use-auth";
import toast from "react-hot-toast";

export function useUpdateProfile() {
    const { setUser } = useAuth();
    const [saving, setSaving] = useState(false);

    const update = async (name: string) => {
        setSaving(true);
        try {
            const updated = await updateProfileApi(name);
            setUser(updated);
            toast.success("Name updated");
        } catch {
            toast.error("Failed to update name");
        } finally {
            setSaving(false);
        }
    };

    return { update, saving };
}
