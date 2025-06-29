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
import { useExams } from "@/hooks/useSupabaseCRUD"
import { DeleteConfirmation } from "@/components/ui/delete-confirmation"

export default function ExamsPageModern() {
    const { data: exams, loading, error, deleteItem, fetchData } = useExams()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [showAddModal, setShowAddModal] = useState(false)
    const [deleteExam, setDeleteExam] = useState<{ id: string, patient_name: string } | null>(null)
    const NewExamForm = dynamic(() => import("./new/page"), { ssr: false })

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

    // Filtrado de exámenes
    const filteredExams = exams.filter((exam) => {
        const matchesSearch =
            (exam.patient_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exam.exam_type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exam.diagnosis || "").toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === "all" || exam.status === statusFilter
        const matchesType = typeFilter === "all" || exam.exam_type === typeFilter

        return matchesSearch && matchesStatus && matchesType
    })

    // Manejar eliminación de examen
    const handleDeleteExam = async () => {
        if (!deleteExam) return

        const success = await deleteItem(deleteExam.id)
        if (success) {
            toast({
                title: "Examen eliminado",
                description: "El examen ha sido eliminado correctamente"
            })
            setDeleteExam(null)
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
            value: exams.filter(e => e.status === "completed").length.toString(),
            change: "+20%",
            trend: "up",
            icon: CheckCircle,
            color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
        },
        {
            title: "Pendientes",
            value: exams.filter(e => e.status === "pending").length.toString(),
            change: "-10%",
            trend: "down",
            icon: Clock,
            color: "bg-gradient-to-br from-amber-500 to-amber-600"
        },
        {
            title: "En Proceso",
            value: exams.filter(e => e.status === "in_progress").length.toString(),
            change: "+5%",
            trend: "up",
            icon: Activity,
            color: "bg-gradient-to-br from-purple-500 to-purple-600"
        }
    ]

    const handleExamSuccess = () => {
        setShowAddModal(false)
        fetchData() // Refrescar la lista
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
                                            <TableHead className="font-semibold text-gray-700">Paciente</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Tipo de Examen</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Doctor</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Fecha</TableHead>
                                            <TableHead className="font-semibold text-gray-700 text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredExams.map((exam) => (
                                            <TableRow key={exam.id} className="hover:bg-indigo-50/50 transition-colors duration-200">
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                                            P
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">
                                                                Paciente
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                ID: {exam.patient_id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <Stethoscope className="h-4 w-4 text-gray-400" />
                                                        <span className="font-medium text-gray-900">{exam.exam_type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-900">{exam.doctor_id || 'Sin asignar'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            exam.status === "completed" ? "default" :
                                                                exam.status === "pending" ? "secondary" :
                                                                    "outline"
                                                        }
                                                        className={
                                                            exam.status === "completed" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                                                exam.status === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                                    exam.status === "in_progress" ? "bg-purple-100 text-purple-700 border-purple-200" :
                                                                        "bg-gray-100 text-gray-700 border-gray-200"
                                                        }
                                                    >
                                                        {exam.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                                                        {exam.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                                                        {exam.status === "in_progress" && <Activity className="w-3 h-3 mr-1" />}
                                                        {exam.status === "completed" ? "Completado" :
                                                            exam.status === "pending" ? "Pendiente" :
                                                                exam.status === "in_progress" ? "En Proceso" :
                                                                    exam.status === "cancelled" ? "Cancelado" : exam.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                                                        {exam.exam_date}
                                                    </div>
                                                </TableCell>
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
                                                                    patient_name: `Examen ${exam.exam_type}`
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

            {/* Modal de nuevo examen */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl p-0 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b px-6 py-4">
                            <h2 className="text-lg font-semibold">Nuevo Examen</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6">
                            <NewExamForm onSuccess={handleExamSuccess} onCancel={() => setShowAddModal(false)} />
                        </div>
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
