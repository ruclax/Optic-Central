"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"

interface AuthContextType {
    user: any
    roles: string[]
    loading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null)
    const [roles, setRoles] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Escucha cambios de sesión en tiempo real
    useEffect(() => {
        const { data: listener } = supabaseBrowser.auth.onAuthStateChange(async () => {
            await fetchAuth()
        })
        fetchAuth()
        return () => {
            listener?.subscription.unsubscribe()
        }
    }, [])

    // Normaliza el usuario recibido del backend para que siempre tenga las propiedades esperadas
    const mapUser = (rawUser: any) => {
        if (!rawUser) return null
        return {
            id: rawUser.id || rawUser.user_id || rawUser.uid || null,
            name: rawUser.name || rawUser.full_name || rawUser.nombre || rawUser.email || "Usuario",
            email: rawUser.email || rawUser.correo || null,
            role: rawUser.role || rawUser.rol || (rawUser.roles ? rawUser.roles[0] : null) || null,
            // Puedes agregar aquí más campos si tu backend los provee
            ...rawUser
        }
    }

    const fetchAuth = async () => {
        setLoading(true)
        setError(null)
        try {
            // Importante: incluir credentials para enviar cookies en fetch
            const res = await fetch("/api/auth/me", { credentials: "include" })
            if (res.status === 401) {
                setUser(null)
                setRoles([])
                // No setea error, es un estado esperado
                return
            }
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Error de autenticación")
            setUser(mapUser(data.user))
            setRoles(data.roles || (data.user?.roles ? data.user.roles : []))
        } catch (err: any) {
            setUser(null)
            setRoles([])
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        setLoading(true)
        setError(null)
        try {
            // Login directo con Supabase en el frontend
            const { error: loginError } = await supabaseBrowser.auth.signInWithPassword({ email, password })
            if (loginError) throw new Error(loginError.message || "Error al iniciar sesión")
            await fetchAuth()
        } catch (err: any) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }
    const logout = async () => {
        setLoading(true)
        setError(null)
        try {
            await supabaseBrowser.auth.signOut()
            await fetchAuth()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthContext.Provider value={{ user, roles, loading, error, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider")
    return context
}
