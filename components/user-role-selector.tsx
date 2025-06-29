"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/providers/auth-provider"

interface Role {
    id: string
    name: string
    default_route?: string
}

interface Props {
    userId: string
    currentRoleId: string
    onRoleChanged?: () => void
}

export default function UserRoleSelector({ userId, currentRoleId, onRoleChanged }: Props) {
    const [roles, setRoles] = useState<Role[]>([])
    const [selectedRole, setSelectedRole] = useState<string>(currentRoleId)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { logout } = useAuth(); // Para forzar refresco si el usuario actual cambia su propio rol

    useEffect(() => {
        supabase.from("roles").select("id, name, default_route").then(({ data, error }) => {
            if (error) setError(error.message)
            else setRoles(data || [])
        })
    }, [])

    // El cambio de rol se realiza por UUID (role_id), pero el control de acceso en frontend es por nombre de rol
    const handleChange = async (roleId: string) => {
        setSelectedRole(roleId)
        setLoading(true)
        setError("")
        const { error } = await supabase
            .from("profiles")
            .update({ role_id: roleId })
            .eq("id", userId)
        setLoading(false)
        if (error) setError(error.message)
        else {
            if (onRoleChanged) onRoleChanged();
            // Recargar la página para asegurar que el contexto y el perfil estén actualizados
            window.location.reload();
        }
    }

    return (
        <div className="space-y-2">
            <Select value={selectedRole} onValueChange={handleChange} disabled={loading}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                    {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                            {role.name} {role.default_route && <span className="text-xs text-muted-foreground">({role.default_route})</span>}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <div className="text-red-500 text-xs">{error}</div>}
        </div>
    )
}
