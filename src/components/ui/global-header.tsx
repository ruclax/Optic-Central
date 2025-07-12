"use client"

import * as React from "react"
import { SidebarTrigger } from "@/components/sidebar/sidebar-trigger"
import { useSidebar } from "@/components/sidebar/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
    Search,
    Bell,
    Settings,
    User,
    LogOut,
    ChevronRight,
    Home,
    Command,
    Keyboard,
    HelpCircle,
    Moon,
    Sun,
    PanelLeft
} from "lucide-react"
import { useAuth } from "@/providers"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useTheme } from "next-themes"

interface GlobalHeaderProps {
    title?: string
    description?: string
    className?: string
    children?: React.ReactNode
    onSidebarToggle?: () => void
    sidebarCollapsed?: boolean
}

// Helper para generar breadcrumbs basado en la ruta
function generateBreadcrumbs(pathname: string) {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ label: 'Dashboard', href: '/dashboard' }]

    let currentPath = ''
    segments.forEach((segment, index) => {
        currentPath += `/${segment}`
        if (segment !== 'dashboard') {
            const label = segment.charAt(0).toUpperCase() + segment.slice(1)
            breadcrumbs.push({ label, href: currentPath })
        }
    })

    return breadcrumbs
}

export function GlobalHeader({
    title,
    description,
    className,
    children,
    onSidebarToggle,
    sidebarCollapsed
}: GlobalHeaderProps) {
    const { setOpenMobile, isMobile } = useSidebar()
    const { user, logout } = useAuth()
    const pathname = usePathname()
    const { state, toggleSidebar } = useSidebar()
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])

    const breadcrumbs = generateBreadcrumbs(pathname)
    const displayName = user?.name || user?.email || "Usuario"
    const userInitials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

    // Mock notifications
    const notifications = [
        { id: 1, title: "Nueva cita programada", time: "Hace 5 min", unread: true },
        { id: 2, title: "Examen completado", time: "Hace 1 hora", unread: true },
        { id: 3, title: "Recordatorio de seguimiento", time: "Hace 2 horas", unread: false },
    ]

    const unreadCount = notifications.filter(n => n.unread).length

    return (
        <div className={cn(
            // Fijo, sin borde ni sombra, sin padding horizontal, fondo igual al sidebar
            "sash-header flex h-16 items-center gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 p-0 border-0 shadow-none fixed top-0 left-0 right-0 z-40",
            className
        )}>
            {/* Botón de colapso/despliegue sidebar solo en desktop */}
            {!isMobile && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="mr-2 text-foreground hover:text-blue-700 hover:bg-blue-50"
                    aria-label={state === 'collapsed' ? 'Expandir menú' : 'Colapsar menú'}
                >
                    <PanelLeft className={state === 'collapsed' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </Button>
            )}

            {/* Trigger del sidebar para mobile */}
            {isMobile && (
                <>
                    <SidebarTrigger onToggle={() => setOpenMobile(true)} />
                    <Separator orientation="vertical" className="h-6 bg-gray-200" />
                </>
            )}

            {/* Breadcrumbs */}
            <nav className="hidden md:flex items-center space-x-1 text-sm text-muted-foreground">
                <Home className="h-4 w-4 text-muted-foreground" />
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                        <Link
                            href={crumb.href}
                            className={cn(
                                "hover:text-foreground transition-colors font-medium",
                                index === breadcrumbs.length - 1 ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {crumb.label}
                        </Link>
                    </React.Fragment>
                ))}
            </nav>

            {/* Spacer para empujar elementos a la derecha */}
            <div className="flex-1" />

            {/* Barra de búsqueda */}
            <div className="hidden md:flex relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    name="mainSearch"
                    id="mainSearch"
                    placeholder="Buscar pacientes, exámenes..."
                    className="pl-10 h-9 bg-accent/80 border-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder:text-muted-foreground"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-accent px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                        <Command className="h-3 w-3" />K
                    </kbd>
                </div>
            </div>

            {/* Controles del header */}
            <div className="flex items-center gap-2">
                {/* Búsqueda móvil */}
                <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent">
                    <Search className="h-4 w-4" />
                </Button>

                {/* Notificaciones */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent">
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary hover:bg-primary"
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 border-border shadow-lg">
                        <div className="flex items-center justify-between px-3 py-2">
                            <h4 className="font-semibold text-foreground">Notificaciones</h4>
                            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary hover:text-primary/80">
                                Marcar como leídas
                            </Button>
                        </div>
                        <DropdownMenuSeparator className="bg-accent" />
                        {notifications.map((notification) => (
                            <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3 hover:bg-accent">
                                <div className="flex items-center gap-2 w-full">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        notification.unread ? "bg-primary" : "bg-muted"
                                    )} />
                                    <span className="font-medium text-sm text-foreground">{notification.title}</span>
                                </div>
                                <span className="text-xs text-muted-foreground ml-4">{notification.time}</span>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className="bg-accent" />
                        <DropdownMenuItem className="justify-center text-primary hover:text-primary/80 hover:bg-accent">
                            Ver todas las notificaciones
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme toggle */}
                {mounted && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    >
                        {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                )}

                {/* Ayuda */}
                <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                    <HelpCircle className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6 bg-gray-200" />

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-gray-900 text-white text-sm font-medium">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 border-border shadow-lg" align="end" forceMount>
                        <div className="flex flex-col space-y-1 p-2">
                            <p className="text-sm font-medium leading-none text-gray-900">{displayName}</p>
                            <p className="text-xs leading-none text-gray-500">
                                {user?.email}
                            </p>
                            {user?.role && (
                                <Badge variant="secondary" className="w-fit mt-1 bg-accent text-accent-foreground border-border">
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </Badge>
                            )}
                        </div>
                        <DropdownMenuSeparator className="bg-accent" />
                        <DropdownMenuItem className="hover:bg-accent">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-accent">
                            <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">Configuración</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-accent">
                            <Keyboard className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">Atajos de teclado</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-accent" />
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
                            onClick={async () => {
                                await logout()
                                window.location.href = "/login"
                            }}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Cerrar sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {children && (
                <div className="flex items-center gap-2 ml-4">
                    {children}
                </div>
            )}
        </div>
    )
}