"use client"

import { useEffect, useState } from "react"
import { useIsAdmin } from "@/hooks/useRoles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogAction, AlertDialogCancel, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import UserRoleSelector from "@/components/user-role-selector"
import { useRouter } from "next/navigation"
import { SearchFilterBar } from "@/components/ui/search-filter-bar"
import dynamic from "next/dynamic"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function UsersPage() {
    const isAdmin = useIsAdmin()
    const [users, setUsers] = useState<any[]>([])
    const [roles, setRoles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [showAddModal, setShowAddModal] = useState(false)
    const router = useRouter()
    const NewUserForm = dynamic(() => import("./new/page"), { ssr: false })

    // Mover fetchUsers fuera del useEffect para que esté disponible globalmente
    const fetchUsers = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("profiles")
            .select("id, full_name, email, active, role_id, role:roles(id, name)") // Solo usamos role_id para lógica
        if (data) setUsers(data)
        setLoading(false)
    }
    const fetchRoles = async () => {
        const { data, error } = await supabase
            .from("roles")
            .select("id, name")
        if (data) setRoles(data)
    }
    useEffect(() => {
        fetchUsers()
        fetchRoles()
    }, [])

    // Usar fetchUsers tras cada cambio relevante
    const handleRoleChange = async (userId: string, newRoleId: string) => {
        const { error } = await supabase
            .from("profiles")
            .update({ role_id: newRoleId }) // Solo actualiza role_id
            .eq("id", userId)
        if (error) {
            toast({ title: "Error", description: "No se pudo actualizar el rol", variant: "destructive" })
        } else {
            toast({ title: "Rol actualizado", description: `Nuevo rol asignado` })
            fetchUsers()
        }
    }

    const handleDeactivate = async (userId: string) => {
        const { error } = await supabase
            .from("profiles")
            .update({ active: false })
            .eq("id", userId)
        if (error) {
            toast({ title: "Error", description: "No se pudo desactivar el usuario", variant: "destructive" })
        } else {
            toast({ title: "Usuario desactivado" })
            fetchUsers()
        }
    }

    const handleDelete = async (userId: string) => {
        const { error } = await supabase
            .from("profiles")
            .delete()
            .eq("id", userId)
        if (error) {
            toast({ title: "Error", description: "No se pudo eliminar el usuario", variant: "destructive" })
        } else {
            toast({ title: "Usuario eliminado" })
            fetchUsers()
        }
    }

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold mb-2">Acceso denegado</h2>
                <p className="text-muted-foreground">Solo los administradores pueden ver los usuarios.</p>
            </div>
        )
    }

    return (
        <div className="pb-20 px-2 sm:px-4 md:px-0 md:max-w-none md:mx-0">
            {/* Acciones rápidas en desktop: parte superior derecha, responsivo */}
            <div className="hidden sm:flex justify-end gap-2 mb-4">
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all"
                    onClick={() => setShowAddModal(true)}
                >
                    Nuevo usuario
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all">Exportar</Button>
            </div>
            {/* FABs solo en móvil para acciones principales */}
            <div className="fixed bottom-6 left-0 right-0 z-50 flex flex-row justify-center gap-8 items-center pointer-events-none sm:hidden">
                <button
                    className="pointer-events-auto rounded-full bg-blue-600 text-white shadow-lg w-14 h-14 flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                    onClick={() => setShowAddModal(true)}
                    aria-label="Nuevo usuario"
                >
                    <span className="sr-only">Nuevo usuario</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>
            {/* Modal de agregar usuario */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-background rounded-lg shadow-xl p-0 w-full max-w-2xl mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b px-6 py-4">
                            <h2 className="text-lg font-semibold">Nuevo usuario</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
                        </div>
                        <div className="p-4 sm:p-6">
                            <NewUserForm />
                        </div>
                    </div>
                </div>
            )}
            <Card className="bg-background text-foreground">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Usuarios del Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Indicadores de usuarios en una sola fila, sin recuadros, títulos destacados, responsivos */}
                    <div className="flex w-full justify-center gap-8 mt-4 flex-wrap">
                        <div className="flex flex-col items-center flex-1 min-w-[120px]">
                            <span className="text-lg font-bold text-white mb-1">Total</span>
                            <span className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                                {users.length}
                            </span>
                        </div>
                        <div className="flex flex-col items-center flex-1 min-w-[120px]">
                            <span className="text-lg font-bold text-white mb-1">Activos</span>
                            <span className="flex items-center gap-2 text-2xl font-bold text-green-600">
                                {users.filter((u) => u.active).length}
                            </span>
                        </div>
                        <div className="flex flex-col items-center flex-1 min-w-[120px]">
                            <span className="text-lg font-bold text-white mb-1">Administradores</span>
                            <span className="flex items-center gap-2 text-2xl font-bold text-purple-600">
                                {users.filter((u) => u.role && u.role[0]?.name === "Administrador").length}
                            </span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <SearchFilterBar
                            searchValue={searchTerm}
                            onSearchChange={setSearchTerm}
                            filters={[
                                {
                                    label: "Rol",
                                    value: roleFilter,
                                    options: [
                                        { value: "all", label: "Todos los roles" },
                                        ...roles.map((r: any) => ({ value: r.id, label: r.name }))
                                    ],
                                    onChange: setRoleFilter,
                                },
                            ]}
                            placeholder="Buscar por nombre o email..."
                        />
                    </div>
                    {loading ? (
                        <div className="text-center py-8">Cargando usuarios...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            {/* Desktop/tablet: tabla */}
                            <div className="hidden sm:block w-full">
                                <Table className="w-full min-w-[700px] text-sm">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.filter(user => {
                                            const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
                                            const matchesRole = roleFilter === "all" || user.role_id === roleFilter;
                                            return matchesSearch && matchesRole;
                                        }).map((user) => (
                                            <TableRow key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                                                <TableCell className="font-mono text-xs max-w-[120px] truncate">{user.id}</TableCell>
                                                <TableCell className="max-w-[180px] truncate">{user.full_name}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">{user.email || <span className="text-muted-foreground">-</span>}</TableCell>
                                                <TableCell>
                                                    <Badge className="text-xs">{user.role && user.role[0]?.name}</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <UserRoleSelector
                                                        userId={user.id}
                                                        currentRoleId={user.role_id}
                                                        onRoleChanged={fetchUsers}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm" disabled={user.id === users[0]?.id}>Desactivar</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogTitle>Desactivar usuario</AlertDialogTitle>
                                                            <p>¿Seguro que deseas desactivar este usuario?</p>
                                                            <div className="flex gap-2 justify-end mt-4">
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeactivate(user.id)}>Desactivar</AlertDialogAction>
                                                            </div>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="sm" className="ml-2" disabled={user.id === users[0]?.id}>Eliminar</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                                                            <p>¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
                                                            <div className="flex gap-2 justify-end mt-4">
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(user.id)}>Eliminar</AlertDialogAction>
                                                            </div>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {/* Mobile: cards en vez de tabla */}
                            <div className="block sm:hidden">
                                {/* Indicadores en móvil */}
                                <div className="flex w-full justify-center gap-4 mb-2">
                                    <div className="flex flex-col items-center flex-1 min-w-[80px]">
                                        <span className="text-base font-bold text-white mb-0.5">Total</span>
                                        <span className="flex items-center gap-1 text-lg font-bold text-blue-600">{users.length}</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1 min-w-[80px]">
                                        <span className="text-base font-bold text-white mb-0.5">Activos</span>
                                        <span className="flex items-center gap-1 text-lg font-bold text-green-600">{users.filter((u) => u.active).length}</span>
                                    </div>
                                    <div className="flex flex-col items-center flex-1 min-w-[80px]">
                                        <span className="text-base font-bold text-white mb-0.5">Admins</span>
                                        <span className="flex items-center gap-1 text-lg font-bold text-purple-600">{users.filter((u) => u.role && u.role[0]?.name === "Administrador").length}</span>
                                    </div>
                                </div>
                                {/* Cards de usuario */}
                                <div className="space-y-3">
                                    {users.filter(u => u.visible !== false).filter(user => {
                                        const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
                                        const matchesRole = roleFilter === "all" || user.role_id === roleFilter;
                                        return matchesSearch && matchesRole;
                                    }).map((user) => (
                                        <div key={user.id} className="bg-zinc-900 rounded-lg p-3 flex flex-col gap-1 shadow-md">
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>ID: {user.id}</span>
                                                <span>{user.role && user.role[0]?.name}</span>
                                            </div>
                                            <div className="font-semibold text-white text-base">{user.full_name}</div>
                                            <div className="text-white text-xs mb-1">{user.email}</div>
                                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-1">
                                                <span>{user.active ? 'Activo' : 'Inactivo'}</span>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                <UserRoleSelector
                                                    userId={user.id}
                                                    currentRoleId={user.role_id}
                                                    onRoleChanged={fetchUsers}
                                                />
                                                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDeactivate(user.id)}>Desactivar</Button>
                                                <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(user.id)}>Eliminar</Button>
                                            </div>
                                        </div>
                                    ))}
                                    {users.length === 0 && (
                                        <div className="text-center py-8">
                                            <h3 className="text-lg font-medium">No se encontraron usuarios</h3>
                                            <p className="text-muted-foreground">
                                                Agrega un nuevo usuario para comenzar.
                                            </p>
                                            <button onClick={() => setShowAddModal(true)} className="mt-4 bg-accent text-accent-foreground px-4 py-2 rounded font-semibold">Agregar Primer Usuario</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
