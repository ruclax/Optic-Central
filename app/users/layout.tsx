import SidebarLayout from "@/components/sidebar-layout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function UsersLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarLayout>
            <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-2 sm:px-4 border-b border-muted bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <SidebarTrigger className="md:hidden mr-2" />
                <div className="font-semibold text-base sm:text-lg truncate">Usuarios</div>
            </header>
            <main className="w-full max-w-full overflow-x-auto px-1 sm:px-4 py-2 sm:py-4">
                {children}
            </main>
        </SidebarLayout>
    );
}
