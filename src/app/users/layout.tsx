import React, { ReactNode } from "react";
import MenuLayout from "@/components/layouts/menu-layout";
import { AuthGuard } from "@/components/AuthGuard";

export default function UsersLayout({ children }: { children: ReactNode }) {
    return (
        <MenuLayout>
            <AuthGuard>
                {children}
            </AuthGuard>
        </MenuLayout>
    );
}
