"use client";
import { useAuth } from "@/providers/auth-provider";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    if (!user) {
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        return null;
    }
    return <>{children}</>;
}
