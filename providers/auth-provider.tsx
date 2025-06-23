"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  name: string
  role: string
  role_id?: string // <-- Agregado para control dinámico
  default_route?: string
  email?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: Error | null
}

interface AuthContextType extends AuthState {
  // login: (username: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  interface ProfileWithRoles {
    full_name?: string
    role_id?: string
    roles?: { name: string, default_route?: string } | { name: string, default_route?: string }[] | null
  }

  const fetchUserProfile = async (userId: string): Promise<ProfileWithRoles> => {
    // Consulta el perfil y el rol real desde la tabla profiles y roles
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, role_id, roles(name, default_route)')
      .eq('id', userId)
      .single()
    if (error) throw error
    // Para depuración: muestra el resultado en consola
    console.log('Perfil obtenido:', data)
    return data as ProfileWithRoles
  }

  const mapSupabaseUserToAppUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    // Obtiene el perfil y el rol real desde la base de datos
    const profile = await fetchUserProfile(supabaseUser.id)
    let role = "user"
    let default_route: string | undefined = undefined
    let role_id: string | undefined = profile?.role_id
    if (Array.isArray(profile?.roles)) {
      role = profile.roles[0]?.name ?? "user"
      default_route = profile.roles[0]?.default_route
    } else if (profile && typeof profile.roles === "object" && profile.roles !== null && "name" in profile.roles) {
      role = (profile.roles as { name: string }).name ?? "user"
      default_route = (profile.roles as { default_route?: string }).default_route
    }
    return {
      id: supabaseUser.id,
      name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email || "Usuario",
      email: supabaseUser.email,
      role,
      role_id, // <-- Agregado
      default_route,
    }
  }

  useEffect(() => {
    setState(prev => ({ ...prev, isLoading: true }))
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        try {
          const appUser = await mapSupabaseUserToAppUser(session.user)
          setState(prev => ({ ...prev, user: appUser, isLoading: false }))
          // Log global de usuario y role_id
          console.log('[AUTH] Usuario autenticado:', appUser)
          console.log('[AUTH] role_id:', appUser.role_id)
        } catch (error) {
          setState(prev => ({ ...prev, user: null, isLoading: false, error: error as Error }))
        }
      } else {
        setState(prev => ({ ...prev, user: null, isLoading: false }))
      }
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          try {
            const appUser = await mapSupabaseUserToAppUser(session.user)
            setState({ user: appUser, isLoading: false, error: null })
            // Log global de usuario y role_id
            console.log('[AUTH] Usuario autenticado:', appUser)
            console.log('[AUTH] role_id:', appUser.role_id)
          } catch (error) {
            setState({ user: null, isLoading: false, error: error as Error })
          }
        } else {
          setState({ user: null, isLoading: false, error: null })
        }
      }
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // onAuthStateChange se encargará de actualizar el estado del usuario y isLoading
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, isLoading: false, user: null }))
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      // onAuthStateChange se encargará de actualizar el estado del usuario a null y isLoading
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, isLoading: false }))
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export type { AuthContextType };
export { AuthContext };