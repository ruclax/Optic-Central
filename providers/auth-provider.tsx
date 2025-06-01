"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  role: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: Error | null
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // Simulate auth check
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          setState(prev => ({ ...prev, user: JSON.parse(savedUser), isLoading: false }))
        } else {
          setState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        setState(prev => ({ ...prev, error: error as Error, isLoading: false }))
      }
    }
    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      // Simulate API call
      const user = { id: "1", name: username, role: "admin" }
      localStorage.setItem("user", JSON.stringify(user))
      setState(prev => ({ ...prev, user, isLoading: false }))
    } catch (error) {
      setState(prev => ({ ...prev, error: error as Error, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      localStorage.removeItem("user")
      setState(prev => ({ ...prev, user: null, isLoading: false }))
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