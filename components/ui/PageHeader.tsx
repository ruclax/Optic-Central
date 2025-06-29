import { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
    icon: ReactNode
    title: string
    subtitle?: string
    badgeText?: string
    badgeClassName?: string
    actions?: ReactNode
    className?: string
}

export function PageHeader({
    icon,
    title,
    subtitle,
    badgeText,
    badgeClassName = "",
    actions,
    className = "",
}: PageHeaderProps) {
    return (
        <div className={`bg-background/80 backdrop-blur-lg border-b border-border shadow-sm static top-0 z-10 ${className}`}>
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                            {icon}
                        </div>
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                            {subtitle && (
                                <p className="text-muted-foreground text-sm lg:text-base font-medium">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {badgeText && (
                            <Badge className={badgeClassName}>{badgeText}</Badge>
                        )}
                        {actions}
                    </div>
                </div>
            </div>
        </div>
    )
}
