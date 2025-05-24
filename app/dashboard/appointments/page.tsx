"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, Search, Plus, Clock, User, Phone, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Datos de ejemplo de citas
const appointments = [
  {
    id: 1,
    patientId: "001",
    patientName: "María González",
    phone: "555-0123",
    date: "2024-01-25",
    time: "10:30",
    type: "Examen de rutina",
    status: "Confirmada",
    doctor: "Dr. Ana Rodríguez",
    notes: "Revisión anual programada",
  },
  {
    id: 2,
    patientId: "002",
    patientName: "Carlos Rodríguez",
    phone: "555-0124",
    date: "2024-01-25",
    time: "14:15",
    type: "Entrega de lentes",
    status: "Pendiente",
    doctor: "Recepción",
    notes: "Lentes progresivos listos",
  },
  {
    id: 3,
    patientId: "003",
    patientName: "Ana Martínez",
    phone: "555-0125",
    date: "2024-01-26",
    time: "09:00",
    type: "Control post-cirugía",
    status: "Programada",
    doctor: "Dr. Carlos Méndez",
    notes: "Control 3 meses post-operatorio",
  },
  {
    id: 4,
    patientId: "004",
    patientName: "Luis Fernández",
    phone: "555-0126",
    date: "2024-01-26",
    time: "11:30",
    type: "Primera consulta",
    status: "Confirmada",
    doctor: "Dr. Ana Rodríguez",
    notes: "Paciente nuevo, examen completo",
  },
  {
    id: 5,
    patientId: "005",
    patientName: "Carmen López",
    phone: "555-0127",
    date: "2024-01-26",
    time: "16:00",
    type: "Ajuste de lentes",
    status: "Pendiente",
    doctor: "Técnico",
    notes: "Ajuste de montura",
  },
]

export default function AppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedDate, setSelectedDate] = useState("2024-01-25")

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.patientId.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || appointment.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesType = typeFilter === "all" || appointment.type.toLowerCase().includes(typeFilter.toLowerCase())
    const matchesDate = appointment.date === selectedDate

    return matchesSearch && matchesStatus && matchesType && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "bg-green-100 text-green-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Programada":
        return "bg-blue-100 text-blue-800"
      case "Cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Examen de rutina":
        return "bg-blue-100 text-blue-800"
      case "Primera consulta":
        return "bg-purple-100 text-purple-800"
      case "Control post-cirugía":
        return "bg-orange-100 text-orange-800"
      case "Entrega de lentes":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Citas</h1>
          <p className="text-muted-foreground">Programa y administra las citas de Óptica Central</p>
        </div>
        <Link href="/dashboard/appointments/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.filter((a) => a.date === selectedDate).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter((a) => a.status === "Confirmada" && a.date === selectedDate).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter((a) => a.status === "Pendiente" && a.date === selectedDate).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Semana</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda de Citas</CardTitle>
          <CardDescription>Visualiza y gestiona las citas programadas</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Date Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold">
                {new Date(selectedDate).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por paciente, teléfono o ID..."
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
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="programada">Programada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="examen">Examen</SelectItem>
                <SelectItem value="entrega">Entrega</SelectItem>
                <SelectItem value="control">Control</SelectItem>
                <SelectItem value="primera">Primera consulta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                  <Card key={appointment.id} className="border-l-4 border-l-blue-600">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                            <Badge variant="outline" className={getTypeColor(appointment.type)}>
                              {appointment.type}
                            </Badge>
                            <span className="text-lg font-bold">{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{appointment.patientName}</span>
                              <span className="text-sm text-muted-foreground">({appointment.patientId})</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{appointment.phone}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Doctor:</span> {appointment.doctor}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Notas:</span> {appointment.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link href={`/dashboard/records/${appointment.patientId}`}>
                            <Button variant="outline" size="sm">
                              Ver Expediente
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            Confirmar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No hay citas programadas</h3>
                <p className="text-muted-foreground">
                  No se encontraron citas para la fecha seleccionada o los filtros aplicados.
                </p>
                <Link href="/dashboard/appointments/new">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Programar Primera Cita
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
