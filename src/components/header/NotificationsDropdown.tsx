"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react"

export function NotificationsDropdown() {
    const notifications = [
        {
            id: 1,
            type: "info",
            title: "Nueva cita programada",
            message: "Juan Pérez - 15:30",
            time: "hace 5 min",
            unread: true
        },
        {
            id: 2,
            type: "warning",
            title: "Examen pendiente",
            message: "María González necesita revisión",
            time: "hace 1 hora",
            unread: true
        },
        {
            id: 3,
            type: "success",
            title: "Reporte generado",
            message: "Reporte mensual completado",
            time: "hace 2 horas",
            unread: false
        }
    ]

    const unreadCount = notifications.filter(n => n.unread).length

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle className="h-4 w-4 text-green-500" />
            case "warning": return <AlertCircle className="h-4 w-4 text-yellow-500" />
            default: return <Info className="h-4 w-4 text-blue-500" />
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1 relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                                {unreadCount}
                            </span>
                        </div>
                    )}
                    <span className="hidden sm:inline">Notificaciones</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">Notificaciones</h4>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                {unreadCount} nuevas
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                        <DropdownMenuItem
                            key={notification.id}
                            className="p-3 flex items-start gap-3 cursor-pointer"
                        >
                            {getIcon(notification.type)}
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{notification.title}</p>
                                    {notification.unread && (
                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {notification.time}
                                </p>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-3 justify-center text-sm">
                    Ver todas las notificaciones
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
