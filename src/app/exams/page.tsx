"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Eye,
    Search,
    Plus,
    User,
    Calendar,
    FileText,
    Download,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    Activity,
    Users,
    MoreHorizontal,
    Stethoscope,
    UserPlus,
    Trash2
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { EmptyState } from "@/components/ui/empty-state"
import dynamic from "next/dynamic"
import { PageHeader } from "@/components/ui/PageHeader"
import { toast } from "@/hooks/use-toast"
import { useExamsContext } from "@/providers/exams-provider"
import { DeleteConfirmation } from "@/components/ui/delete-confirmation"
import { useAuth } from "@/providers/auth-provider"

export default function ExamsPageModern() {
    const { getAll, create, update, remove, loading, error } = useExamsContext()
    const { user } = useAuth();
    const [exams, setExams] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [showAddModal, setShowAddModal] = useState(false)
    const [deleteExam, setDeleteExam] = useState<{ id: string, patient_name: string } | null>(null)
    const NewExamForm = dynamic(() => import("./new/page"), { ssr: false })

    // Redirigir a /login si no hay usuario autenticado
    if (!user) {
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
        return null;
    }

    // Cargar exámenes al montar el componente
    useEffect(() => {
        const fetchExams = async () => {
            const data = await getAll()
            if (data) setExams(data)
        }
        fetchExams()
    }, []) // Solo al montar, evitar loop infinito

    // Mostrar error si existe
    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive"
            })
        }
    }, [error])

    // Filtrado de exámenes adaptado a los campos reales de la tabla examenes
    const filteredExams = exams.filter((exam: any) => {
        // Buscar por ID de paciente, tipo de examen, diagnóstico subjetivo o retinoscopia
        const matchesSearch =
            (exam.paciente_id ? String(exam.paciente_id) : "").includes(searchTerm) ||
            (exam.diagnostico_subjetivo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exam.diagnostico_retinoscopia || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exam.id ? String(exam.id) : "").includes(searchTerm)

        // Si tienes un campo de estado, usa exam.estado, si no, omite el filtro
        const matchesStatus = statusFilter === "all" || (exam.estado || "").toLowerCase() === statusFilter.toLowerCase()
        // Si tienes un campo de tipo, usa exam.tipo_examen, si no, omite el filtro
        const matchesType = typeFilter === "all" || (exam.tipo_examen || "").toLowerCase() === typeFilter.toLowerCase()

        return matchesSearch && matchesStatus && matchesType
    })

    // Manejar eliminación de examen
    const handleDeleteExam = async () => {
        if (!deleteExam) return
        const res = await remove(deleteExam.id)
        if (res) {
            toast({
                title: "Examen eliminado",
                description: "El examen ha sido eliminado correctamente"
            })
            setDeleteExam(null)
            // Refrescar lista
            const data = await getAll()
            if (data) setExams(data)
        } else {
            toast({
                title: "Error",
                description: "No se pudo eliminar el examen",
                variant: "destructive"
            })
        }
    }

    // Estadísticas dinámicas basadas en datos reales
    const stats = [
        {
            title: "Total Exámenes",
            value: exams.length.toString(),
            change: "+15%",
            trend: "up",
            icon: Stethoscope,
            color: "bg-gradient-to-br from-blue-500 to-blue-600"
        },
        {
            title: "Completados",
            value: exams.filter((e: any) => e.status === "completed").length.toString(),
            change: "+20%",
            trend: "up",
            icon: CheckCircle,
            color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
        },
        {
            title: "Pendientes",
            value: exams.filter((e: any) => e.status === "pending").length.toString(),
            change: "-10%",
            trend: "down",
            icon: Clock,
            color: "bg-gradient-to-br from-amber-500 to-amber-600"
        },
        {
            title: "En Proceso",
            value: exams.filter((e: any) => e.status === "in_progress").length.toString(),
            change: "+5%",
            trend: "up",
            icon: Activity,
            color: "bg-gradient-to-br from-purple-500 to-purple-600"
        }
    ]

    const handleExamSuccess = async () => {
        setShowAddModal(false)
        // Refrescar la lista
        const data = await getAll()
        if (data) setExams(data)
        toast({
            title: "Examen creado",
            description: "El examen ha sido creado correctamente"
        })
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <PageHeader
                icon={<Stethoscope className="h-6 w-6" />}
                title="Gestión de Exámenes"
                subtitle="Administra y consulta los exámenes médicos"
                badgeText={`${exams.length} exámenes`}
                badgeClassName="bg-indigo-100 text-indigo-700 border-indigo-200 px-3 py-1"
                actions={
                    <Button
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => setShowAddModal(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Examen
                    </Button>
                }
            />
            <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background">
                            <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${stat.color}`} />
                            <CardContent className="p-6 relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${stat.color} text-white shadow-lg`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-amber-600'
                                        }`}>
                                        <TrendingUp className={`h-3 w-3 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                                        {stat.change}
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                <p className="text-sm text-muted-foreground">{stat.title}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Barra de búsqueda y filtros */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Buscar exámenes por paciente, doctor o tipo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[180px] border-gray-200">
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los estados</SelectItem>
                                        <SelectItem value="pending">Pendiente</SelectItem>
                                        <SelectItem value="completed">Completado</SelectItem>
                                        <SelectItem value="in_progress">En Proceso</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-[180px] border-gray-200">
                                        <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los tipos</SelectItem>
                                        <SelectItem value="Examen General">Examen General</SelectItem>
                                        <SelectItem value="Revisión">Revisión</SelectItem>
                                        <SelectItem value="Examen Inicial">Examen Inicial</SelectItem>
                                        <SelectItem value="Control">Control</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de exámenes */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-gray-900">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                                <FileText className="h-5 w-5" />
                            </div>
                            <span>Lista de Exámenes</span>
                            <Badge className="bg-gray-100 text-gray-700 ml-auto">
                                {filteredExams.length} resultados
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <Activity className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
                                    <p className="text-gray-600">Cargando exámenes...</p>
                                </div>
                            </div>
                        ) : filteredExams.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay exámenes registrados</h3>
                                    <p className="text-gray-600 mb-6">Comienza agregando un nuevo examen médico</p>
                                    <Link href="/exams/new">
                                        <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Nuevo Examen
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead className="font-semibold text-gray-700">ID</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Paciente</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Optometrista</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Fecha</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Diagnóstico</TableHead>
                                            <TableHead className="font-semibold text-gray-700 text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredExams.map((exam: any) => (
                                            <TableRow key={exam.id} className="hover:bg-indigo-50/50 transition-colors duration-200">
                                                <TableCell>{exam.id}</TableCell>
                                                <TableCell>{exam.paciente_id}</TableCell>
                                                <TableCell>{exam.usuario_id || 'Sin asignar'}</TableCell>
                                                <TableCell>{exam.fecha_examen}</TableCell>
                                                <TableCell>{exam.diagnostico_subjetivo || exam.diagnostico_retinoscopia || '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-indigo-100">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/exams/${exam.id}`} className="flex items-center">
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Ver detalles
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/exams/${exam.id}/edit`} className="flex items-center">
                                                                    <FileText className="mr-2 h-4 w-4" />
                                                                    Editar
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Descargar PDF
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeleteExam({
                                                                    id: exam.id,
                                                                    patient_name: `Examen ${exam.id}`
                                                                })}
                                                                className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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

            {/* Modal de nuevo examen: ahora fuera del header/main para overlay global y con diseño responsivo unificado */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl lg:max-w-2xl mx-2 sm:mx-0 p-4 sm:p-6 relative animate-fade-in max-h-[98vh] overflow-y-auto">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                            onClick={() => setShowAddModal(false)}
                        >
                            ×
                        </button>
                        <NewExamForm onSuccess={handleExamSuccess} onCancel={() => setShowAddModal(false)} />
                    </div>
                </div>
            )}

            {/* Modal de confirmación para eliminar */}
            <DeleteConfirmation
                open={!!deleteExam}
                onOpenChange={(open: boolean) => !open && setDeleteExam(null)}
                onConfirm={handleDeleteExam}
                entityName={deleteExam?.patient_name}
                entityType="examen"
            />
        </div>
    )
}
