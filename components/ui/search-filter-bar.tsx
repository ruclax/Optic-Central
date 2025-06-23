import { Input } from "./input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./select"
import { ReactNode } from "react"

interface SearchFilterBarProps {
    searchValue: string
    onSearchChange: (v: string) => void
    filters: Array<{
        label: string
        value: string
        options: { value: string; label: string }[]
        onChange: (v: string) => void
    }>
    placeholder?: string
    children?: ReactNode // Para botones extra si se requiere
    className?: string
}

export function SearchFilterBar({
    searchValue,
    onSearchChange,
    filters,
    placeholder = "Buscar...",
    children,
    className = ""
}: SearchFilterBarProps) {
    return (
        <div className={`flex flex-col gap-2 sm:flex-row sm:items-center w-full ${className}`}>
            <Input
                className="flex-1 min-w-[180px] max-w-full"
                placeholder={placeholder}
                value={searchValue}
                onChange={e => onSearchChange(e.target.value)}
            />
            {filters.map((filter, idx) => (
                <Select key={filter.value + idx} value={filter.value} onValueChange={filter.onChange}>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                        {filter.options.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ))}
            {children}
        </div>
    )
}
