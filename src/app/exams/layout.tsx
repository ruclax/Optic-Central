import React, { ReactNode } from "react";
import MenuLayout from "@/components/layouts/menu-layout";
import { AuthGuard } from "@/components/AuthGuard";


export default function PatientsLayout({ children }: { children: ReactNode }) {
    return (
        <MenuLayout>
            <AuthGuard>
                <div className="flex-1 flex flex-col w-full min-h-0 p-2 pt-2 bg-background">
                    {children}
                </div>
            </AuthGuard>
        </MenuLayout>
    );
}

