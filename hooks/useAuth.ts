"use client"

import { useContext } from "react"
import { AuthContext, type AuthContextType } from "@/providers/auth-provider"

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
