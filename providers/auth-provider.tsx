"use client"

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { setupSessionCleanup, setupWindowCleanup } from "@/lib/session-utils"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  name: string
  email?: string
  role: string
  role_id?: string
  default_route?: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: Error | null
}

interface AuthContextType extends AuthState {
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

  const [fetchingUsers, setFetchingUsers] = useState(new Set())

  const fetchUserProfile = async (userId: string) => {
    if (fetchingUsers.has(userId)) {
      return null
    }

    setFetchingUsers(prev => new Set(prev).add(userId))

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, role_id')
        .eq('id', userId)
        .single()

      if (profileError || !profile) {
        throw new Error('Profile not found')
      }

      return {
        full_name: profile.full_name,
        role_id: profile.role_id,
        role_name: 'admin',
        default_route: '/dashboard'
      }
    } catch (error) {
      throw error
    } finally {
      setFetchingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const mapSupabaseUserToAppUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      const profileData = await fetchUserProfile(supabaseUser.id)

      if (!profileData) {
        return null
      }

      const appUser: User = {
        id: supabaseUser.id,
        name: profileData.full_name || supabaseUser.email || "Usuario",
        email: supabaseUser.email,
        role: profileData.role_name,
        role_id: profileData.role_id,
        default_route: profileData.default_route,
      }

      return appUser
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const appUser = await mapSupabaseUserToAppUser(session.user)
          if (appUser) {
            setState({ user: appUser, isLoading: false, error: null })
          } else {
            setState({ user: null, isLoading: false, error: new Error('Failed to map user') })
          }
        } else {
          setState({ user: null, isLoading: false, error: null })
        }
      } catch (error) {
        setState({ user: null, isLoading: false, error: error as Error })
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            const appUser = await mapSupabaseUserToAppUser(session.user)
            if (appUser) {
              setState({ user: appUser, isLoading: false, error: null })
            } else {
              setState({ user: null, isLoading: false, error: new Error('Failed to map user') })
            }
          } else {
            setState({ user: null, isLoading: false, error: null })
          }
        } catch (error) {
          setState({ user: null, isLoading: false, error: error as Error })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Configurar limpieza automática de sesiones
  useEffect(() => {
    const cleanupSession = setupSessionCleanup()
    const cleanupWindow = setupWindowCleanup()

    return () => {
      cleanupSession()
      cleanupWindow()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setState(prev => ({ ...prev, error: error as Error, isLoading: false }))
        throw error
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, isLoading: false }))
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      setState(prev => ({ ...prev, error: error as Error }))
      throw error
    }
  }, [])

  // Función para verificar si la sesión sigue siendo válida
  const verifySession = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        // Si hay error o no hay usuario, limpiar estado
        setState({ user: null, isLoading: false, error: null })
        return false
      }

      return true
    } catch (error) {
      setState({ user: null, isLoading: false, error: error as Error })
      return false
    }
  }, [])

  // Verificar sesión cuando la ventana recupera el foco
  useEffect(() => {
    const handleFocus = () => {
      if (state.user) {
        verifySession()
      }
    }

    const handleOnline = () => {
      if (state.user) {
        verifySession()
      }
    }

    // Verificar sesión cuando se recupera el foco
    window.addEventListener('focus', handleFocus)
    // Verificar sesión cuando se recupera la conexión
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('online', handleOnline)
    }
  }, [state.user, verifySession])

  const contextValue = useMemo(() => ({
    ...state,
    login,
    logout
  }), [state, login, logout])

  return (
    <AuthContext.Provider value={contextValue}>
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
