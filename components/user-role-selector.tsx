"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Select, SelectItem } from "@/components/ui/select"

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

    useEffect(() => {
        supabase.from("roles").select("id, name, default_route").then(({ data, error }) => {
            if (error) setError(error.message)
            else setRoles(data || [])
        })
    }, [])

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
        else if (onRoleChanged) onRoleChanged()
    }

    return (
        <div className="space-y-2">
            <Select value={selectedRole} onValueChange={handleChange} disabled={loading}>
                {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                        {role.name} {role.default_route && <span className="text-xs text-muted-foreground">({role.default_route})</span>}
                    </SelectItem>
                ))}
            </Select>
            {error && <div className="text-red-500 text-xs">{error}</div>}
        </div>
    )
}
