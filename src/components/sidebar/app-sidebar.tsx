"use client"

import React from "react";
import { Glasses, Bell, Shield } from "lucide-react";
import {
  mainNavigationItems,
  businessNavigationItems,
  systemNavigationItems,
} from "@/lib/navigation"
import { useAuth } from "@/providers"
import { usePathname } from "next/navigation"

import * as SidebarKit from "@/components/sidebar/sidebar"
import { SidebarStats } from "@/components/sidebar/sidebar-stats"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function AppSidebar({ ...props }: React.ComponentProps<typeof SidebarKit.Sidebar>) {
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const { setOpenMobile, isMobile, state, toggleSidebar } = SidebarKit.useSidebar();

  const displayName = user?.name || user?.email || "Usuario";
  const displayRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Sin rol";
  const userInitials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const isAdmin = user?.role === 'admin';
  const isCollapsed = state === 'collapsed';

  // Función para verificar si un item está activo
  const isActiveItem = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };

  // Función para manejar clics en enlaces del sidebar
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Simulamos notificaciones para demostrar la funcionalidad
  const hasNotifications = {
    exams: true,
    patients: false,
    users: isAdmin ? true : false,
  };

  return (
    <SidebarKit.Sidebar
      variant="inset"
      className="sash-sidebar group/sidebar bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 border-r border-gray-200/80 shadow-sm p-0"
      collapsible="icon"
      {...props}
    >
      {/* Header del Sidebar */}
      <SidebarKit.SidebarHeader className="sash-sidebar-header flex items-center justify-center border-0 h-16 px-4 py-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95">
        <SidebarKit.SidebarMenu>
          <SidebarKit.SidebarMenuItem>
            <SidebarKit.SidebarMenuButton
              size="lg"
              asChild
              className="data-[state=open]:bg-background/10 data-[state=open]:text-primary hover:bg-background/10 text-primary border-0 relative z-10 flex items-center justify-center"
            >
              <Link href="/dashboard" onClick={handleLinkClick} className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-background/80 text-primary logo-glow backdrop-blur-sm">
                  <Glasses className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-primary">Óptica Central</span>
                  <span className="truncate text-xs text-primary/80">Sistema de Gestión</span>
                </div>
                <div className="relative group-data-[collapsible=icon]:hidden">
                  <Bell className="size-4 text-blue-400" />
                  <div className="notification-badge bg-primary border-2 border-white"></div>
                </div>
              </Link>
            </SidebarKit.SidebarMenuButton>
          </SidebarKit.SidebarMenuItem>
        </SidebarKit.SidebarMenu>
      </SidebarKit.SidebarHeader>

      {/* Contenido del Sidebar */}
      <SidebarKit.SidebarContent className="sash-sidebar-content flex flex-col gap-0 overflow-auto px-2 py-4 bg-background">
        {/* Navegación Principal */}
        <SidebarKit.SidebarGroup>
          <SidebarKit.SidebarGroupLabel className="sash-nav-label px-2 mb-2 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wide group-data-[collapsible=icon]:sr-only">
            Principal
          </SidebarKit.SidebarGroupLabel>
          <SidebarKit.SidebarGroupContent>
            <SidebarKit.SidebarMenu className="gap-1">
              {mainNavigationItems.map((item) => {
                const hasNotif = hasNotifications[item.title.toLowerCase() as keyof typeof hasNotifications];
                return (
                  <SidebarKit.SidebarMenuItem key={item.title} className="relative">
                    {/* Indicador de notificación azul */}
                    {hasNotif && (
                      <div className="absolute top-2 right-2 z-10 h-2 w-2 rounded-full bg-primary border-2 border-white animate-pulse-notification group-data-[collapsible=icon]:top-1 group-data-[collapsible=icon]:right-1" />
                    )}
                    <SidebarKit.SidebarMenuButton
                      asChild
                      data-active={isActiveItem(item.url)}
                      tooltip={item.title}
                      className={cn(
                        "sash-nav-item h-9 px-3 text-sm font-medium rounded-lg",
                        "text-foreground hover:text-primary hover:bg-primary/60",
                        "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-medium data-[active=true]:border data-[active=true]:border-blue-200",
                        "transition-all duration-200 ease-in-out",
                        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
                      )}
                    >
                      <Link href={item.url} onClick={handleLinkClick}>
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate group-data-[collapsible=icon]:sr-only">{item.title}</span>
                      </Link>
                    </SidebarKit.SidebarMenuButton>
                  </SidebarKit.SidebarMenuItem>
                );
              })}
            </SidebarKit.SidebarMenu>
          </SidebarKit.SidebarGroupContent>
        </SidebarKit.SidebarGroup>

        {/* Separador */}
        <Separator className="my-4 bg-sidebar-border/50 group-data-[collapsible=icon]:mx-2" />

        {/* Navegación de Negocio */}
        {businessNavigationItems.length > 0 && (
          <SidebarKit.SidebarGroup>
            <SidebarKit.SidebarGroupLabel className="sash-nav-label px-2 mb-2 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wide group-data-[collapsible=icon]:sr-only">
              Gestión
            </SidebarKit.SidebarGroupLabel>
            <SidebarKit.SidebarGroupContent>
              <SidebarKit.SidebarMenu className="gap-1">
                {businessNavigationItems.map((item) => (
                  <SidebarKit.SidebarMenuItem key={item.title}>
                    <SidebarKit.SidebarMenuButton
                      asChild
                      data-active={isActiveItem(item.url)}
                      tooltip={item.title}
                      className={cn(
                        "sash-nav-item h-9 px-3 text-sm font-medium rounded-lg",
                        "text-foreground hover:text-primary hover:bg-primary/60",
                        "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-medium data-[active=true]:border data-[active=true]:border-blue-200",
                        "transition-all duration-200 ease-in-out",
                        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
                      )}
                    >
                      <Link href={item.url} onClick={handleLinkClick}>
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate group-data-[collapsible=icon]:sr-only">{item.title}</span>
                      </Link>
                    </SidebarKit.SidebarMenuButton>
                  </SidebarKit.SidebarMenuItem>
                ))}
              </SidebarKit.SidebarMenu>
            </SidebarKit.SidebarGroupContent>
          </SidebarKit.SidebarGroup>
        )}

        {/* Separador para admin */}
        {isAdmin && systemNavigationItems.length > 0 && (
          <Separator className="my-4 bg-sidebar-border/50 group-data-[collapsible=icon]:mx-2" />
        )}

        {/* Navegación de Sistema (Solo Admin) */}
        {isAdmin && systemNavigationItems.length > 0 && (
          <SidebarKit.SidebarGroup>
            <SidebarKit.SidebarGroupLabel className="sash-nav-label px-2 mb-2 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wide group-data-[collapsible=icon]:sr-only">
              <Shield className="size-3 inline mr-1" />
              Sistema
            </SidebarKit.SidebarGroupLabel>
            <SidebarKit.SidebarGroupContent>
              <SidebarKit.SidebarMenu className="gap-1">
                {systemNavigationItems.map((item) => {
                  const hasNotif = hasNotifications[item.title.toLowerCase() as keyof typeof hasNotifications];
                  return (
                    <SidebarKit.SidebarMenuItem key={item.title} className="relative">
                      {/* Indicador de notificación azul */}
                      {hasNotif && (
                        <div className="absolute top-2 right-2 z-10 h-2 w-2 rounded-full bg-primary border-2 border-white animate-pulse-notification group-data-[collapsible=icon]:top-1 group-data-[collapsible=icon]:right-1" />
                      )}
                      <SidebarKit.SidebarMenuButton
                        asChild
                        data-active={isActiveItem(item.url)}
                        tooltip={item.title}
                        className={cn(
                          "sash-nav-item h-9 px-3 text-sm font-medium rounded-lg",
                          "text-foreground hover:text-primary hover:bg-primary/60",
                          "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-medium data-[active=true]:border data-[active=true]:border-blue-200",
                          "transition-all duration-200 ease-in-out",
                          "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
                        )}
                      >
                        <Link href={item.url} onClick={handleLinkClick}>
                          <item.icon className="size-4 shrink-0" />
                          <span className="truncate group-data-[collapsible=icon]:sr-only">{item.title}</span>
                        </Link>
                      </SidebarKit.SidebarMenuButton>
                    </SidebarKit.SidebarMenuItem>
                  );
                })}
              </SidebarKit.SidebarMenu>
            </SidebarKit.SidebarGroupContent>
          </SidebarKit.SidebarGroup>
        )}

        {/* Estadísticas del Sistema - Solo para administradores */}
        {isAdmin && (
          <SidebarKit.SidebarGroup className="mt-auto group-data-[collapsible=icon]:hidden">
            <SidebarStats />
          </SidebarKit.SidebarGroup>
        )}
      </SidebarKit.SidebarContent>

      {/* Footer del Sidebar */}
      <SidebarKit.SidebarFooter className="sash-sidebar-footer border-0 p-2">
        <SidebarKit.SidebarMenu>
          {/* Usuario */}
          <SidebarKit.SidebarMenuItem>

          </SidebarKit.SidebarMenuItem>
        </SidebarKit.SidebarMenu>
      </SidebarKit.SidebarFooter>
    </SidebarKit.Sidebar>
  )
}