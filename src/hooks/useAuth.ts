"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAuth = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Error de autenticación")
        setUser(data.user)
        setRoles(data.roles)
      } catch (err: any) {
        setUser(null)
        setRoles([])
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAuth()
  }, [])

  return { user, roles, loading, error }
}
