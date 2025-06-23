"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

export default function SidebarLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="min-h-screen bg-muted/40">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
