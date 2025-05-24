"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Edit, Phone, Mail, Calendar, Users, Download, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Datos de ejemplo expandidos
const patients = [
  {
    id: "001",
    name: "María González",
    age: 45,
    gender: "Femenino",
    phone: "555-0123",
    email: "maria.gonzalez@email.com",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-02-15",
    status: "Activo",
    prescription: "-2.50 / -1.75",
    address: "Calle Principal 123",
  },
  {
    id: "002",
    name: "Carlos Rodríguez",
    age: 32,
    gender: "Masculino",
    phone: "555-0124",
    email: "carlos.rodriguez@email.com",
    lastVisit: "2024-01-14",
    nextAppointment: "2024-01-28",
    status: "Pendiente",
    prescription: "-1.25 / -0.50",
    address: "Avenida Central 456",
  },
  {
    id: "003",
    name: "Ana Martínez",
    age: 28,
    gender: "Femenino",
    phone: "555-0125",
    email: "ana.martinez@email.com",
    lastVisit: "2024-01-13",
    nextAppointment: null,
    status: "Activo",
    prescription: "+1.00 / +0.75",
    address: "Plaza Mayor 789",
  },
  {
    id: "004",
    name: "Luis Fernández",
    age: 55,
    gender: "Masculino",
    phone: "555-0126",
    email: "luis.fernandez@email.com",
    lastVisit: "2024-01-12",
    nextAppointment: "2024-02-01",
    status: "Revisión",
    prescription: "-3.00 / -2.25",
    address: "Barrio Norte 321",
  },
  {
    id: "005",
    name: "Carmen López",
    age: 38,
    gender: "Femenino",
    phone: "555-0127",
    email: "carmen.lopez@email.com",
    lastVisit: "2024-01-11",
    nextAppointment: "2024-02-10",
    status: "Activo",
    prescription: "-0.75 / -1.00",
    address: "Sector Sur 654",
  },
  {
    id: "006",
    name: "Roberto Silva",
    age: 42,
    gender: "Masculino",
    phone: "555-0128",
    email: "roberto.silva@email.com",
    lastVisit: "2024-01-10",
    nextAppointment: null,
    status: "Inactivo",
    prescription: "-1.50 / -0.75",
    address: "Zona Este 987",
  },
  {
    id: "007",
    name: "Patricia Morales",
    age: 29,
    gender: "Femenino",
    phone: "555-0129",
    email: "patricia.morales@email.com",
    lastVisit: "2024-01-09",
    nextAppointment: "2024-01-30",
    status: "Activo",
    prescription: "+0.50 / +1.25",
    address: "Colonia Centro 147",
  },
  {
    id: "008",
    name: "Diego Herrera",
    age: 51,
    gender: "Masculino",
    phone: "555-0130",
    email: "diego.herrera@email.com",
    lastVisit: "2024-01-08",
    nextAppointment: "2024-02-05",
    status: "Revisión",
    prescription: "-2.75 / -1.50",
    address: "Residencial Norte 258",
  },
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.includes(searchTerm) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || patient.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesGender = genderFilter === "all" || patient.gender.toLowerCase() === genderFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesGender
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Revisión":
        return "bg-blue-100 text-blue-800"
      case "Inactivo":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Pacientes</h1>
          <p className="text-muted-foreground">Administra la información de todos los pacientes de Óptica Central</p>
        </div>
        <Link href="/dashboard/patients/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Paciente
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.filter((p) => p.status === "Activo").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.filter((p) => p.status === "Pendiente").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.filter((p) => p.status === "Revisión").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>Busca y filtra pacientes por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, ID, teléfono o email..."
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
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="revisión">Revisión</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="femenino">Femenino</SelectItem>
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
                  <TableHead>Contacto</TableHead>
                  <TableHead>Edad/Género</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prescripción</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">{patient.address}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          {patient.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{patient.age} años</div>
                        <div className="text-sm text-muted-foreground">{patient.gender}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{patient.lastVisit}</div>
                        {patient.nextAppointment && (
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Próx: {patient.nextAppointment}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{patient.prescription}</code>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/dashboard/records/${patient.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/patients/${patient.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Agendar Cita
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Nuevo Examen
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Exportar Expediente
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No se encontraron pacientes</h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros de búsqueda o agrega un nuevo paciente.
              </p>
              <Link href="/dashboard/patients/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Paciente
                </Button>
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredPatients.length} de {patients.length} pacientes
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled>
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
