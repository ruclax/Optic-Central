import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { GlobalHeader } from "@/components/ui/global-header"
import { SidebarProvider } from "@/components/ui/sidebar"

/**
 * MenuLayout: layout de dashboard con sidebar avanzado, header y main content.
 */
export default function MenuLayout({ children }: { children: ReactNode }) {
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
