import { Input } from "./input"
import { Button } from "./button"
import { ReactNode } from "react"
import { User, Mail } from "lucide-react"

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
    searchType?: 'name' | 'email'
    setSearchType?: (type: 'name' | 'email') => void
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
    label = "Buscar",
    searchType = 'name',
    setSearchType
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
                <div className="relative flex items-center gap-2">
                    <Input
                        autoFocus
                        placeholder={placeholder}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="mb-2"
                    />
                    <Button
                        variant={searchType === 'name' ? 'default' : 'outline'}
                        size="icon"
                        className="mb-2"
                        aria-label="Buscar por nombre"
                        onClick={() => setSearchType && setSearchType('name')}
                    >
                        <User className={searchType === 'name' ? 'text-blue-600' : 'text-gray-400'} />
                    </Button>
                    <Button
                        variant={searchType === 'email' ? 'default' : 'outline'}
                        size="icon"
                        className="mb-2"
                        aria-label="Buscar por correo"
                        onClick={() => setSearchType && setSearchType('email')}
                    >
                        <Mail className={searchType === 'email' ? 'text-blue-600' : 'text-gray-400'} />
                    </Button>
                    {/* Resultados fijos debajo del input, con scroll independiente */}
                    <div className="absolute left-0 right-0 top-full mt-1 bg-background rounded shadow border max-h-64 overflow-y-auto z-10">
                        {loading && <div className="text-center text-muted-foreground py-4">Buscando...</div>}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
