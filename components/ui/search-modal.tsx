import { Input } from "./input"
import { Button } from "./button"
import { ReactNode } from "react"

interface SearchModalProps {
    open: boolean
    onClose: () => void
    value: string
    onChange: (v: string) => void
    placeholder?: string
    loading?: boolean
    children?: ReactNode // Para resultados o acciones adicionales
    className?: string
    label?: string
}

export function SearchModal({
    open,
    onClose,
    value,
    onChange,
    placeholder = "Buscar...",
    loading = false,
    children,
    className = "",
    label = "Buscar"
}: SearchModalProps) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className={`bg-background rounded-lg shadow-xl w-full max-w-md mx-auto p-4 flex flex-col gap-2 ${className}`}
                role="dialog" aria-modal="true">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">{label}</span>
                    <Button variant="ghost" onClick={onClose} aria-label="Cerrar búsqueda">✕</Button>
                </div>
                <Input
                    autoFocus
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className="mb-2"
                />
                {loading && <div className="text-center text-muted-foreground py-4">Buscando...</div>}
                {children}
            </div>
        </div>
    )
}
