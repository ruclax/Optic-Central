import React, { ReactNode } from "react";
import MenuLayout from "@/components/menu-layout";

export default function UsersLayout({ children }: { children: ReactNode }) {
    return (
        <MenuLayout>
            {children}
        </MenuLayout>
    );
}
