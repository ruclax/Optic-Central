"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarTriggerProps extends React.ComponentProps<typeof Button> {
    onToggle?: () => void
}

export function SidebarTrigger({
    className,
    onToggle,
    ...props
}: SidebarTriggerProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn(
                "h-8 w-8 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "md:h-9 md:w-9 transition-colors duration-200",
                className
            )}
            onClick={onToggle}
            {...props}
        >
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    )
}
