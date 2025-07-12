"use client"

import { getUsers, getRoles, update, remove } from "@/lib/services/usersApi"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogContent, AlertDialogCancel, AlertDialogTitle, AlertDialogAction } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import dynamic from "next/dynamic"
import { User as UserIcon, Trash2, UserCog, UserX, Shield, UserCheck, Stethoscope, BriefcaseMedical, Glasses, User2, Phone, Plus, Lock, Unlock, Eye } from "lucide-react"
import type { User, Role } from "@/types/user"
import { PageHeader } from "@/components/ui/PageHeader"
import { useAuth } from "@/providers/auth-provider"

const NewUserForm = dynamic(() => import("./new/page"), { ssr: false })

export default function UsersPage() {
    const { user } = useAuth();
    const isAdmin = (user as any)?.role === "admin";
    const [users, setUsers] = useState<User[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [showAddModal, setShowAddModal] = useState(false)
    const [userRoleModal, setUserRoleModal] = useState<User | null>(null)
    const [lockedUsers, setLockedUsers] = useState<string[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);

    // Redirigir a /login si no hay usuario autenticado
    if (!user) {
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        return null;
    }

    // Obtener usuarios
    const fetchUsers = async () => {
        setLoading(true)
        try {
            const data = await getUsers()
            setUsers(data)
        } catch (error: any) {
            toast({ title: "Error", description: error?.message || JSON.stringify(error), variant: "destructive" })
            console.error("Error real al obtener usuarios:", error)
        }
        setLoading(false)
    }
    // Obtener roles
    const fetchRoles = async () => {
        try {
            const data = await getRoles()
            setRoles(data)
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        }
    }
    useEffect(() => {
        fetchUsers()
        fetchRoles()
    }, [])

    // Cambiar rol
    const handleRoleChange = async (userId: string, newRoleId: string) => {
        try {
            await update("profiles", userId, { role_id: newRoleId })
            toast({ title: "Rol actualizado", description: `Nuevo rol asignado` })
            fetchUsers()
        } catch (error: any) {
            toast({ title: "Error", description: "No se pudo actualizar el rol", variant: "destructive" })
        }
    }
    // Desactivar o activar usuario
    const handleDeactivate = async (userId: string, currentActive: boolean) => {
        try {
            await update("profiles", userId, { active: !currentActive });
            toast({ title: currentActive ? "Usuario desactivado" : "Usuario activado" });
            fetchUsers();
        } catch (error: any) {
            toast({ title: "Error", description: `No se pudo ${currentActive ? 'desactivar' : 'activar'} el usuario`, variant: "destructive" });
        }
    }
    // Eliminar usuario
    const handleDelete = async (userId: string) => {
        try {
            await remove("profiles", userId)
            toast({ title: "Usuario eliminado" })
            fetchUsers()
        } catch (error: any) {
            toast({ title: "Error", description: "No se pudo eliminar el usuario", variant: "destructive" })
        }
    }

    // Control extra: Bloquear/desbloquear usuario
    const handleLockToggle = (userId: string) => {
        setLockedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        )
        toast({ title: "Estado de bloqueo cambiado", description: "El usuario ha sido bloqueado/desbloqueado para login." })
    }

    // Utilidad para obtener el icono según el nombre del rol
    const getRoleIcon = (roleName: string) => {
        const name = roleName.toLowerCase();
        if (name.includes("doctor")) return <Stethoscope className="w-6 h-6 md:w-8 md:h-8" />;
        if (name.includes("técnico")) return <Glasses className="w-6 h-6 md:w-8 md:h-8" />;
        if (name.includes("recepción")) return <User2 className="w-6 h-6 md:w-8 md:h-8" />; // Alternativa: icono de usuario
        // Si quieres un icono de teléfono, puedes usar Phone
        if (name.includes("telefono") || name.includes("operador")) return <Phone className="w-6 h-6 md:w-8 md:h-8" />;
        if (name.includes("admin")) return <Shield className="w-6 h-6 md:w-8 md:h-8" />;
        if (name.includes("medico")) return <BriefcaseMedical className="w-6 h-6 md:w-8 md:h-8" />;
        return <UserCog className="w-6 h-6 md:w-8 md:h-8" />;
    };

    // Definición de tipo para columna exportable
    interface ExportColumn<T> {
        header: string;
        accessor: (row: T) => string | number | null | undefined;
    }

    // Hook reutilizable para exportar a CSV con confirmación
    function useExportCSV<T>({ data, columns, filename = 'export.csv', previewRows = 10 }: {
        data: T[];
        columns: ExportColumn<T>[];
        filename?: string;
        previewRows?: number;
    }) {
        const [showDialog, setShowDialog] = useState(false);
        const [exportLoading, setExportLoading] = useState(false);
        const [preview, setPreview] = useState<T[]>([]);
        const handlePreview = () => {
            setPreview(data.slice(0, previewRows));
            setShowDialog(true);
        };
        const handleExport = () => {
            setExportLoading(true);
            const headers = columns.map((c) => c.header);
            const rows = data.map((row) => columns.map((c) => c.accessor(row)));
            let csv = headers.join(",") + "\n" + rows.map((r) => r.map((val) => `"${(val ?? '').toString().replace(/"/g, '""')}"`).join(",")).join("\n");
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            setExportLoading(false);
            setShowDialog(false);
            toast({ title: "Exportación completada", description: `Se descargó el archivo ${filename}` });
        };
        const ExportDialog = () => (
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent className="max-w-5xl w-full">
                    <AlertDialogTitle>¿Exportar {data.length} registros?</AlertDialogTitle>
                    <div className="mb-2 text-sm text-muted-foreground">
                        Se exportarán <b>{data.length}</b> registros. Vista previa:
                    </div>
                    <div className="overflow-x-auto max-h-80 border rounded bg-gray-50 text-xs mb-2 w-full">
                        <div className="inline-block min-w-full align-middle">
                            <table className="w-auto border-separate border-spacing-0 min-w-max">
                                <thead>
                                    <tr>
                                        {columns.map((col: ExportColumn<T>) => (
                                            <th
                                                key={col.header}
                                                className="px-3 py-1 whitespace-nowrap font-semibold text-left bg-gray-100 border-b border-gray-200"
                                            >
                                                {col.header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((row, i) => (
                                        <tr key={i}>
                                            {columns.map((col: ExportColumn<T>, j: number) => (
                                                <td
                                                    key={j}
                                                    className="px-3 py-1 whitespace-nowrap border-b border-gray-100"
                                                >
                                                    {col.accessor(row)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <AlertDialogCancel onClick={() => setShowDialog(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleExport} disabled={exportLoading} className="bg-green-600 text-white hover:bg-green-700">
                            {exportLoading ? "Exportando..." : "Confirmar y exportar"}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        );
        return { handlePreview, ExportDialog };
    }

    // Columnas a exportar (reutilizable)
    const exportColumns: ExportColumn<User>[] = [
        { header: "ID", accessor: (u: User) => u.id },
        { header: "Nombre", accessor: (u: User) => u.nombre },
        { header: "Email", accessor: (u: User) => u.email },
        { header: "Rol", accessor: (u: User) => u.roles?.nombre || roles.find((r: Role) => r.id === u.rol_id)?.nombre || "Sin rol" },
        { header: "Estado", accessor: (u: User) => u.activo ? "Activo" : "Inactivo" },
    ];
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role_id === roleFilter;
        return matchesSearch && matchesRole;
    });
    const { handlePreview: handleExportPreview, ExportDialog } = useExportCSV({
        data: filteredUsers,
        columns: exportColumns,
        filename: 'usuarios-visible.csv',
        previewRows: 10
    });

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold mb-2">Acceso denegado</h2>
                <p className="text-muted-foreground">Solo los administradores pueden ver los usuarios.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
            <PageHeader
                icon={<UserCog className="h-6 w-6" />}
                title="Gestión de Usuarios"
                subtitle="Administra los usuarios y sus roles en la plataforma"
                badgeText={`${users.length} usuarios`}
                badgeClassName="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1"
                actions={
                    <div className="flex gap-2">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all"
                            onClick={() => setShowAddModal(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo usuario
                        </Button>
                        <Button
                            variant="outline"
                            className="border-green-600 text-green-700 hover:bg-green-50"
                            onClick={handleExportPreview}
                        >
                            Exportar CSV
                        </Button>
                    </div>
                }
            />
            <main className="flex-1 w-full p-2">
                {/* Indicadores principales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-card text-card-foreground border-border shadow-md">
                        <CardContent className="p-6 flex flex-col items-center">
                            <UserCheck className="h-8 w-8 text-emerald-600 mb-2" />
                            <div className="text-3xl font-bold text-foreground mb-1">{users.filter((u) => u.active).length}</div>
                            <div className="text-sm text-muted-foreground">Activos</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card text-card-foreground border-border shadow-md">
                        <CardContent className="p-6 flex flex-col items-center">
                            <UserX className="h-8 w-8 text-red-500 mb-2" />
                            <div className="text-3xl font-bold text-foreground mb-1">{users.filter((u) => u.active === false).length}</div>
                            <div className="text-sm text-muted-foreground">Inactivos</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card text-card-foreground border-border shadow-md">
                        <CardContent className="p-6 flex flex-col items-center">
                            <UserIcon className="h-8 w-8 text-blue-500 mb-2" />
                            <div className="text-3xl font-bold text-foreground mb-1">{users.length}</div>
                            <div className="text-sm text-muted-foreground">Total</div>
                        </CardContent>
                    </Card>
                </div>
                {/* Filtros y búsqueda */}
                <Card className="bg-card text-card-foreground border-border shadow-md mb-6">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                        <input
                            type="text"
                            name="searchTerm"
                            id="searchTerm"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="flex-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[200px] border-gray-200">
                                <SelectValue placeholder="Rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los roles</SelectItem>
                                {roles.map((r: Role) => (
                                    <SelectItem key={r.id} value={r.id.toString()}>{r.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
                {/* Tabla de usuarios */}
                <Card className="bg-card text-card-foreground border-border shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Usuarios del Sistema</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8">Cargando usuarios...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table className="w-full min-w-[700px] text-sm">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Rol</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.filter(user => {
                                            const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
                                            const matchesRole = roleFilter === "all" || user.role_id === roleFilter;
                                            return matchesSearch && matchesRole;
                                        }).map((user) => (
                                            <TableRow key={user.id} className="border-b last:border-0 hover:bg-blue-50/50 transition-colors duration-200">
                                                <TableCell className="font-mono text-xs max-w-[120px] truncate">{user.id}</TableCell>
                                                <TableCell className="max-w-[180px] truncate">{user.full_name}</TableCell>
                                                <TableCell className="max-w-[200px] truncate">{user.email || <span className="text-muted-foreground">-</span>}</TableCell>
                                                <TableCell>
                                                    <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                                                        {user.roles?.nombre || roles.find(r => r.id === user.rol_id)?.nombre || "Sin rol"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.active ? (
                                                        <span className="text-emerald-600 font-medium">Activo</span>
                                                    ) : (
                                                        <span className="text-red-500 font-medium">Inactivo</span>
                                                    )}
                                                    {lockedUsers.includes(user.id) && (
                                                        <span className="ml-2 text-xs text-yellow-600 font-semibold">Bloqueado</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1 items-center">
                                                        <button
                                                            title="Ver detalles"
                                                            className="flex items-center justify-center flex-1 gap-1 p-2 rounded bg-gray-200/50 hover:bg-gray-300/70 transition-colors"
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setShowDetailModal(true);
                                                            }}
                                                        >
                                                            <Eye className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            title="Cambiar rol"
                                                            className="flex items-center justify-center flex-1 gap-1 p-2 rounded bg-blue-500/10 hover:bg-blue-500/20 active:bg-blue-500/30 transition-colors"
                                                            onClick={() => setUserRoleModal(user)}
                                                        >
                                                            <UserCog className="w-4 h-4 text-blue-400" />
                                                        </button>
                                                        <button
                                                            title={user.active ? "Desactivar usuario" : "Activar usuario"}
                                                            className="flex items-center justify-center flex-1 gap-1 p-2 rounded bg-yellow-500/10 hover:bg-yellow-500/20 active:bg-yellow-500/30 transition-colors"
                                                            onClick={() => handleDeactivate(user.id, user.active)}
                                                        >
                                                            {user.active ? <UserX className="w-4 h-4 text-yellow-400" /> : <UserCheck className="w-4 h-4 text-emerald-400" />}
                                                        </button>
                                                        <button
                                                            title={lockedUsers.includes(user.id) ? "Desbloquear usuario" : "Bloquear usuario"}
                                                            className="flex items-center justify-center flex-1 gap-1 p-2 rounded bg-orange-500/10 hover:bg-orange-500/20 active:bg-orange-500/30 transition-colors"
                                                            onClick={() => handleLockToggle(user.id)}
                                                        >
                                                            {lockedUsers.includes(user.id) ? <Unlock className="w-4 h-4 text-orange-400" /> : <Lock className="w-4 h-4 text-orange-400" />}
                                                        </button>
                                                        <button
                                                            title="Eliminar usuario"
                                                            className="flex items-center justify-center flex-1 gap-1 p-2 rounded bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 transition-colors"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-400" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
            {/* Modal de agregar usuario */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-background rounded-lg shadow-xl p-0 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b px-6 py-4">
                            <h2 className="text-lg font-semibold">Nuevo usuario</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
                        </div>
                        <div className="p-4 sm:p-6">
                            <NewUserForm
                                onSuccess={() => {
                                    setShowAddModal(false);
                                    fetchUsers();
                                }}
                                onCancel={() => setShowAddModal(false)}
                                isModal={true}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* Modal para cambiar rol */}
            {userRoleModal && (
                <AlertDialog open={!!userRoleModal} onOpenChange={() => setUserRoleModal(null)}>
                    <AlertDialogContent>
                        <AlertDialogTitle>Cambiar rol de usuario</AlertDialogTitle>
                        <div className="mb-4">
                            <span className="font-semibold">{userRoleModal.full_name}</span> ({userRoleModal.email})
                        </div>
                        <Select
                            value={userRoleModal.role_id}
                            onValueChange={value => handleRoleChange(userRoleModal.id, value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map(role => (
                                    <SelectItem key={role.id} value={role.id.toString()}>{role.nombre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex justify-end gap-2 mt-4">
                            <AlertDialogCancel onClick={() => setUserRoleModal(null)}>Cerrar</AlertDialogCancel>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {/* Modal de detalles de usuario */}
            {showDetailModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto border border-gray-200">
                        {/* Header estilo card grande */}
                        <div className="flex flex-col md:flex-row items-center gap-6 p-8 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                            <div className="flex-shrink-0">
                                {selectedUser.avatar_url ? (
                                    <img src={selectedUser.avatar_url} alt="Avatar" className="w-28 h-28 rounded-full border-4 border-blue-200 shadow" />
                                ) : (
                                    <UserIcon className="w-28 h-28 text-blue-300 bg-white rounded-full border-4 border-blue-200 p-4" />
                                )}
                            </div>
                            <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-blue-900">{selectedUser.full_name}</span>
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-1">
                                        {roles.find(r => r.id === selectedUser.role_id)?.nombre || "Sin rol"}
                                    </Badge>
                                    {selectedUser.active ? (
                                        <span className="ml-2 text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">Activo</span>
                                    ) : (
                                        <span className="ml-2 text-xs px-2 py-1 rounded bg-red-100 text-red-700 border border-red-200">Inactivo</span>
                                    )}
                                </div>
                                <div className="text-gray-600 text-sm">{selectedUser.email}</div>
                                <div className="text-gray-500 text-xs">ID: <span className="font-mono">{selectedUser.id}</span></div>
                            </div>
                        </div>
                        {/* Info principal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                            <div className="space-y-3">
                                <div>
                                    <span className="font-semibold">Teléfono:</span> {selectedUser.phone || <span className="text-muted-foreground">-</span>}
                                </div>
                                <div>
                                    <span className="font-semibold">Rol:</span> {roles.find(r => r.id === selectedUser.role_id)?.nombre || "Sin rol"}
                                </div>
                                <div>
                                    <span className="font-semibold">Descripción del rol:</span> {roles.find(r => r.id === selectedUser.role_id)?.descripcion || <span className="text-muted-foreground">-</span>}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="font-semibold">Creado:</span> {selectedUser.created_at}
                                </div>
                                <div>
                                    <span className="font-semibold">Actualizado:</span> {selectedUser.updated_at}
                                </div>
                            </div>
                        </div>
                        {/* Metadatos */}
                        {selectedUser.metadata && (
                            <div className="px-8 pb-8">
                                <span className="font-semibold">Metadatos:</span>
                                <pre className="bg-gray-100 rounded p-2 text-xs mt-1 overflow-x-auto">{JSON.stringify(selectedUser.metadata, null, 2)}</pre>
                            </div>
                        )}
                        {/* Acciones rápidas (puedes agregar más aquí) */}
                        <div className="flex justify-end gap-2 px-8 pb-8">
                            <button onClick={() => setShowDetailModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Diálogo de confirmación de exportación */}
            {ExportDialog()}
        </div>
    )
}
