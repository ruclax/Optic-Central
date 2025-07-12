"use client"

import type { ReactNode } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { GlobalHeader } from "@/components/ui/global-header"
import { SidebarProvider } from "@/components/sidebar/sidebar"
import { useAuth } from "@/providers"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Spinner } from "@/components/ui/spinner"

/**
 * MenuLayout: layout de dashboard con sidebar avanzado, header y main content.
 * Ahora incluye protección de acceso.
 */
export default function MenuLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Si estamos en la página de login, no aplicar protección
  if (pathname === '/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
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
      <div className="sash-layout min-h-screen flex w-full bg-background">
        {/* Sidebar avanzado */}
        <AppSidebar />
        {/* Contenedor principal */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 h-screen">
          {/* Header */}
          <header className="sash-header h-16">
            <GlobalHeader title="Óptica Central" description="Sistema de gestión" />
          </header>
          {/* Main content */}
          <main className="sash-main flex-1 flex flex-col min-h-0 overflow-auto p-2 pt-2 bg-background">
            <div className="flex-1 flex flex-col w-full min-h-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
