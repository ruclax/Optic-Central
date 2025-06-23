import type { Session } from "@supabase/supabase-js"
// User de Supabase podría no exponerse directamente si usamos AppUser
import { createContext } from "react"

// Definición del tipo AppUser para tu aplicación
// Puedes mantenerla aquí o moverla a un archivo de tipos compartido si lo prefieres.
export interface AppUser {
    id: string
    name: string // Asumimos que tendrás un nombre para el usuario
    role: string // Podrías definir roles como 'admin', 'user', etc.
    email?: string
}

export interface AuthContextType {
    user: AppUser | null
    // Usamos el tipo AppUser definido arriba
    isLoading: boolean
    // Renombrado de 'loading' para mayor claridad y consistencia
    error: Error | null
    // Añadido para manejar errores de autenticación
    // session?: Session | null // Opcional: Descomenta si necesitas exponer la sesión completa de Supabase
    login: (email: string, password: string) => Promise<void>
    // Añadida función de login
    logout: () => Promise<void>
    // Renombrado de 'signOut' para consistencia
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
)

if (process.env.NODE_ENV !== "production") {
    AuthContext.displayName = "AuthContext"
}

// Elimina este archivo si no es usado en ningún otro lado
// Si algún import apunta a '@/contexts/auth-context', debe cambiarse a '@/providers/auth-provider'
