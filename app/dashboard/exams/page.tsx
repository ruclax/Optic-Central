"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search, Plus, User, Calendar, FileText, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Datos de ejemplo de exámenes
const exams = [
  {
    id: 1,
    patientId: "001",
    patientName: "María González",
    date: "2024-01-15",
    type: "Examen completo",
    doctor: "Dr. Ana Rodríguez",
    status: "Completado",
    results: {
      rightEye: { sphere: "-2.50", cylinder: "-1.75", axis: "180", vision: "20/20" },
      leftEye: { sphere: "-2.25", cylinder: "-1.50", axis: "175", vision: "20/20" },
      pressure: { right: "14", left: "15" },
    },
    notes: "Revisión anual. Cambio menor en prescripción OD.",
  },
  {
    id: 2,
    patientId: "002",
    patientName: "Carlos Rodríguez",
    date: "2024-01-14",
    type: "Examen de seguimiento",
    doctor: "Dr. Ana Rodríguez",
    status: "Pendiente",
    results: null,
    notes: "Control post-entrega de lentes progresivos.",
  },
  {
    id: 3,
    patientId: "003",
    patientName: "Ana Martínez",
    date: "2024-01-13",
    type: "Examen post-operatorio",
    doctor: "Dr. Carlos Méndez",
    status: "Completado",
    results: {
      rightEye: { sphere: "+1.00", cylinder: "+0.75", axis: "90", vision: "20/25" },
      leftEye: { sphere: "+0.75", cylinder: "+0.50", axis: "85", vision: "20/20" },
      pressure: { right: "12", left: "13" },
    },
    notes: "Control 3 meses post-cirugía. Evolución favorable.",
  },
]

export default function ExamsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.patientId.includes(searchTerm) ||
      exam.doctor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || exam.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesType = typeFilter === "all" || exam.type.toLowerCase().includes(typeFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "En Proceso":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Exámenes</h1>
          <p className="text-muted-foreground">Administra los exámenes de vista y sus resultados</p>
        </div>
        <Link href="/dashboard/exams/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Examen
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exámenes</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.filter((e) => e.status === "Completado").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Eye className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exams.filter((e) => e.status === "Pendiente").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Exámenes</CardTitle>
          <CardDescription>Busca y filtra exámenes por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por paciente, ID o doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en proceso">En Proceso</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="completo">Examen completo</SelectItem>
                <SelectItem value="seguimiento">Seguimiento</SelectItem>
                <SelectItem value="post-operatorio">Post-operatorio</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Resultados</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">#{exam.id.toString().padStart(3, "0")}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{exam.patientName}</div>
                        <div className="text-sm text-muted-foreground">ID: {exam.patientId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{exam.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{exam.type}</Badge>
                    </TableCell>
                    <TableCell>{exam.doctor}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(exam.status)}>{exam.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {exam.results ? (
                        <div className="text-sm">
                          <div>
                            OD: {exam.results.rightEye.sphere}/{exam.results.rightEye.cylinder}
                          </div>
                          <div>
                            OI: {exam.results.leftEye.sphere}/{exam.results.leftEye.cylinder}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Pendiente</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/dashboard/exams/${exam.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/records/${exam.patientId}`}>
                          <Button variant="outline" size="sm">
                            <User className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredExams.length === 0 && (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No se encontraron exámenes</h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros de búsqueda o realiza un nuevo examen.
              </p>
              <Link href="/dashboard/exams/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Realizar Primer Examen
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
