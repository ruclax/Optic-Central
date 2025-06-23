import { Button } from "./button"
import { ReactNode } from "react"

interface EmptyStateProps {
    title: string
    description: string
    actionLabel: string
    onAction: () => void
    className?: string
    children?: ReactNode
}

export function EmptyState({
    title,
    description,
    actionLabel,
    onAction,
    className = "",
    children
}: EmptyStateProps) {
    return (
        <div className={`text-center py-8 ${className}`}>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
            <Button onClick={onAction} className="mt-4 bg-accent text-accent-foreground px-4 py-2 rounded font-semibold">
                {actionLabel}
            </Button>
            {children}
        </div>
    )
}
