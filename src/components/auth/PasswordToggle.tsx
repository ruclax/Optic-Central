import { Eye, EyeOff } from "lucide-react"

export function PasswordToggle({ show, onClick, disabled }: { show: boolean, onClick: () => void, disabled?: boolean }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="absolute inset-y-2 right-3 flex items-center text-gray-400 hover:text-gray-700 focus:outline-none p-1"
            disabled={disabled}
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
    )
}
