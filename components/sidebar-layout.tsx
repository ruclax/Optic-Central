"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { GlobalHeader } from "@/components/ui/global-header";

/**
 * Layout principal tipo Sash: Sidebar, Header y Main Content.
 * Listo para insertar menú avanzado y zonas de contenido.
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Si estamos en la página de login, no aplicar protección
    if (pathname === '/login') {
        return <>{children}</>;
    }

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner className="w-12 h-12" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="sash-layout min-h-screen flex w-full bg-gray-50">
                {/* Sidebar alineado con header */}
                <AppSidebar />

                {/* Contenedor principal */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header alineado con el sidebar */}
                    <header className="sash-header sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 h-16 flex items-center">
                        {/* Logo opcional en el header */}
                        {/* <img src="/logo.svg" alt="Logo" className="h-8 w-auto mr-4" /> */}
                        <GlobalHeader title="Óptica Central" description="Sistema de gestión" />
                    </header>

                    {/* Main content: aquí va el contenido de cada página */}
                    <main className="sash-main flex-1 overflow-auto p-6">
                        {/* Puedes quitar el max-w-7xl si quieres full width */}
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
