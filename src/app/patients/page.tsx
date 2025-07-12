"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Phone,
  Mail,
  Calendar,
  Users,
  Download,
  MoreHorizontal,
  UserPlus,
  TrendingUp,
  ArrowRight,
  Trash2
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"
import dynamic from "next/dynamic"
import { PageHeader } from "@/components/ui/PageHeader"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { DeleteConfirmation } from "@/components/ui/delete-confirmation"
import { usePatients } from "@/providers/patients-provider"
import { toast } from "@/hooks/use-toast"
import NewPatientPage from "@/app/patients/new/page"
import { Patient } from "@/types/patient"

// Eliminar datos estáticos ya que usamos datos reales de la BD

export default function PatientsPage() {
  const { user } = useAuth();
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  const { data: patients, loading, error, deleteItem, fetchData } = usePatients()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletePatient, setDeletePatient] = useState<{ id: string, name: string } | null>(null)

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

  // Filtrado de pacientes
  const filteredPatients = patients.filter((patient: Patient) => {
    const matchesSearch =
      patient.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.telefono?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.ocupacion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.otras_actividades?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGender = genderFilter === "all" || patient.sexo === genderFilter
    return matchesSearch && matchesGender
  })

  const handleDeletePatient = async () => {
    if (!deletePatient) return

    const success = await deleteItem(deletePatient.id)
    if (success) {
      toast({
        title: "Paciente eliminado",
        description: `El expediente de ${deletePatient.name} ha sido marcado como inactivo.`
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudo eliminar el paciente. Intente nuevamente.",
        variant: "destructive"
      })
    }
    setDeletePatient(null)
  }

  // Estadísticas dinámicas basadas en datos reales
  const stats = [
    {
      title: "Total Pacientes",
      value: patients.length.toString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Masculino",
      value: patients.filter((p: Patient) => p.sexo === "M").length.toString(),
      change: "",
      trend: "up",
      icon: Users,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    },
    {
      title: "Femenino",
      value: patients.filter((p: Patient) => p.sexo === "F").length.toString(),
      change: "",
      trend: "up",
      icon: Users,
      color: "bg-gradient-to-br from-pink-500 to-pink-600"
    },
    {
      title: "Nuevos (30d)",
      value: patients.filter((p: Patient) => {
        if (!p.fecha_registro) return false;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(p.fecha_registro) > thirtyDaysAgo;
      }).length.toString(),
      change: "+24%",
      trend: "up",
      icon: UserPlus,
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        icon={<Users className="h-6 w-6" />}
        title="Gestión de Pacientes"
        subtitle="Administra y consulta la información de tus pacientes"
        badgeText={`${patients.length} pacientes`}
        badgeClassName="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1"
        actions={
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" onClick={() => setShowAddModal(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Nuevo Paciente
          </Button>
        }
      />
      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Cargando pacientes...</span>
            </div>
          </div>
        ) : (
          <>
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
                        name="searchPatient"
                        id="searchPatient"
                        placeholder="Buscar pacientes por nombre, teléfono o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
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
                        <SelectItem value="active">Activos</SelectItem>
                        <SelectItem value="inactive">Inactivos</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                      <SelectTrigger className="w-[180px] border-gray-200">
                        <SelectValue placeholder="Género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de pacientes */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-gray-900">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <span>Lista de Pacientes</span>
                  <Badge className="bg-gray-100 text-gray-700 ml-auto">
                    {filteredPatients.length} resultados
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
                        <TableHead className="font-semibold text-gray-700">Correo electrónico</TableHead>
                        <TableHead className="font-semibold text-gray-700">Edad</TableHead>
                        <TableHead className="font-semibold text-gray-700">Sexo</TableHead>
                        <TableHead className="font-semibold text-gray-700">Teléfono</TableHead>
                        <TableHead className="font-semibold text-gray-700">Ocupación</TableHead>
                        <TableHead className="font-semibold text-gray-700">Fecha Registro</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.slice(0, 10).map((patient: Patient) => (
                        <TableRow key={patient.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                {patient.nombre ? patient.nombre[0] : "-"}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {patient.nombre}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{patient.email ?? "-"}</TableCell>
                          <TableCell>{patient.edad ?? "-"}</TableCell>
                          <TableCell>{patient.sexo ?? "-"}</TableCell>
                          <TableCell>{patient.telefono ?? "-"}</TableCell>
                          <TableCell>{patient.ocupacion ?? "-"}</TableCell>
                          <TableCell>{patient.fecha_registro ? new Date(patient.fecha_registro).toLocaleDateString() : "-"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                  <Link href={`/patients/${patient.id}`} className="flex items-center">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/patients/${patient.id}/edit`} className="flex items-center">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeletePatient({
                                    id: patient.id.toString(),
                                    name: patient.nombre
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
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Modal de agregar paciente: ahora fuera del header/main para overlay global */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl lg:max-w-2xl mx-2 sm:mx-0 p-4 sm:p-6 relative animate-fade-in max-h-[98vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowAddModal(false)}
            >
              ×
            </button>
            <NewPatientPage onSuccess={() => setShowAddModal(false)} onCancel={() => setShowAddModal(false)} />
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmation
        open={!!deletePatient}
        onOpenChange={(open: boolean) => !open && setDeletePatient(null)}
        onConfirm={handleDeletePatient}
        entityName={deletePatient?.name}
        entityType="paciente"
      />
    </div>
  )
}
