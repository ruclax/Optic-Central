"use client"

import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Building2 } from "lucide-react"

interface ProjectStatusBadgeProps {
    projectName?: string
    status?: "active" | "inactive" | "maintenance"
    plan?: "free" | "pro" | "enterprise"
}

export function ProjectStatusBadge({
    projectName = "OpticCentral",
    status = "active",
    plan = "pro"
}: ProjectStatusBadgeProps) {
    const statusConfig = {
        active: {
            color: "bg-green-500",
            text: "Activo",
            bgClass: "bg-green-50 border-green-200 text-green-800"
        },
        inactive: {
            color: "bg-gray-500",
            text: "Inactivo",
            bgClass: "bg-gray-50 border-gray-200 text-gray-800"
        },
        maintenance: {
            color: "bg-yellow-500",
            text: "Mantenimiento",
            bgClass: "bg-yellow-50 border-yellow-200 text-yellow-800"
        }
    }

    const planConfig = {
        free: { text: "Free", bgClass: "bg-gray-100 text-gray-800" },
        pro: { text: "Pro", bgClass: "bg-blue-100 text-blue-800" },
        enterprise: { text: "Enterprise", bgClass: "bg-purple-100 text-purple-800" }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{projectName}</span>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusConfig[status].color}`}></div>
                        <Badge variant="outline" className={`text-xs ${planConfig[plan].bgClass}`}>
                            {planConfig[plan].text}
                        </Badge>
                    </div>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
                <div className="p-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">{projectName}</span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span>Estado:</span>
                            <Badge variant="outline" className={`text-xs ${statusConfig[status].bgClass}`}>
                                {statusConfig[status].text}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Plan:</span>
                            <Badge variant="outline" className={`text-xs ${planConfig[plan].bgClass}`}>
                                {planConfig[plan].text}
                            </Badge>
                        </div>
                    </div>
                </div>
                <DropdownMenuItem>
                    Configuración del proyecto
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Gestionar organización
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
