"use client"

import React from "react"
import { Activity, Users, Calendar, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SidebarStatsProps {
    className?: string
}

export function SidebarStats({ className }: SidebarStatsProps) {
    // Datos simulados - en una aplicación real vendrían de una API o estado global
    const stats = [
        {
            label: "Sistema",
            value: "Online",
            icon: Activity,
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
        },
        {
            label: "Usuarios Activos",
            value: "12",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
        },
        {
            label: "Citas Hoy",
            value: "8",
            icon: Calendar,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
        }
    ]

    return (
        <div className={cn("space-y-2", className)}>
            <div className="px-3 mb-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Estado del Sistema
                </h4>
            </div>

            <div className="space-y-2 px-2">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex items-center justify-between p-2.5 rounded-lg border transition-all duration-200 bg-accent border-border hover:shadow-sm"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <div className={cn("p-1 rounded-md bg-background/80 text-primary-foreground", stat.color)}>
                                <stat.icon className="size-3" />
                            </div>
                            <span className="text-xs font-medium text-foreground truncate">
                                {stat.label}
                            </span>
                        </div>

                        <Badge
                            variant="secondary"
                            className={cn(
                                "text-xs font-semibold px-2 py-0.5 bg-accent text-accent-foreground border border-border"
                            )}
                        >
                            {stat.value}
                        </Badge>
                    </div>
                ))}
            </div>

            {/* Indicador de conexión */}
            <div className="px-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Conectado a la base de datos</span>
                </div>
            </div>
        </div>
    )
}
