"use client"

import * as React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar-trigger"
import { useSidebar } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
    title?: string
    description?: string
    className?: string
    children?: React.ReactNode
}

export function DashboardHeader({
    title,
    description,
    className,
    children
}: DashboardHeaderProps) {
    const { setOpenMobile, isMobile } = useSidebar()

    return (
        <header className={cn(
            "sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm",
            "border-border",
            className
        )}>
            <div className="container flex h-14 items-center max-w-none px-4 md:px-6">
                {isMobile && (
                    <>
                        <SidebarTrigger onToggle={() => setOpenMobile(true)} />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                    </>
                )}

                <div className="flex flex-1 items-center justify-between">
                    <div className="flex flex-col">
                        {title && (
                            <h1 className="text-xl font-bold tracking-tight md:text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                {title}
                            </h1>
                        )}
                        {description && (
                            <p className="text-sm text-muted-foreground font-medium">
                                {description}
                            </p>
                        )}
                    </div>

                    {children && (
                        <div className="flex items-center gap-2">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
