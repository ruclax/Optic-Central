"use client"

import React from "react"
import { useAuth } from "@/providers/auth-provider"

export function UserMenu() {
    const { user, isLoading } = useAuth()

    if (isLoading) return <span>Cargando usuario...</span>
    if (!user) return <span>No autenticado</span>

    return (
        <div className="flex items-center gap-2">
            <span className="font-medium">{user.name}</span>
        </div>
    )
}
