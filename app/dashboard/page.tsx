"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Calendar,
  Eye,
  Search,
  Plus,
  UserPlus,
  FileText,
  Clock,
  DollarSign,
  Package,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

// Datos de ejemplo
const stats = [
  {
    title: "Total Pacientes",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
    href: "/dashboard/patients",
  },
  {
    title: "Citas Hoy",
    value: "23",
    change: "+5%",
    icon: Calendar,
    color: "text-green-600",
    href: "/dashboard/appointments",
  },
  {
    title: "Exámenes Pendientes",
    value: "8",
    change: "-2%",
    icon: Eye,
    color: "text-orange-600",
    href: "/dashboard/exams",
  },
  {
    title: "Ventas del Mes",
    value: "$45,230",
    change: "+18%",
    icon: DollarSign,
    color: "text-purple-600",
    href: "/dashboard/sales",
  },
]

const quickActions = [
  {
    title: "Nuevo Paciente",
    description: "Registrar un nuevo paciente en el sistema",
    icon: UserPlus,
    color: "text-blue-600",
    href: "/dashboard/patients/new",
  },
  {
    title: "Agendar Cita",
    description: "Programar una nueva cita para examen",
    icon: Calendar,
    color: "text-green-600",
    href: "/dashboard/appointments/new",
  },
  {
    title: "Nuevo Examen",
    description: "Realizar examen de vista a paciente",
    icon: Eye,
    color: "text-purple-600",
    href: "/dashboard/exams/new",
  },
  {
    title: "Gestionar Inventario",
    description: "Actualizar stock de monturas y lentes",
    icon: Package,
    color: "text-orange-600",
    href: "/dashboard/inventory",
  },
]

const recentPatients = [
  {
    id: "001",
    name: "María González",
    age: 45,
    lastVisit: "2024-01-15",
    status: "Activo",
    prescription: "-2.50 / -1.75",
    phone: "555-0123",
  },
  {
    id: "002",
    name: "Carlos Rodríguez",
    age: 32,
    lastVisit: "2024-01-14",
    status: "Pendiente",
    prescription: "-1.25 / -0.50",
    phone: "555-0124",
  },
  {
    id: "003",
    name: "Ana Martínez",
    age: 28,
    lastVisit: "2024-01-13",
    status: "Activo",
    prescription: "+1.00 / +0.75",
    phone: "555-0125",
  },
  {
    id: "004",
    name: "Luis Fernández",
    age: 55,
    lastVisit: "2024-01-12",
    status: "Revisión",
    prescription: "-3.00 / -2.25",
    phone: "555-0126",
  },
  {
    id: "005",
    name: "Carmen López",
    age: 38,
    lastVisit: "2024-01-11",
    status: "Activo",
    prescription: "-0.75 / -1.00",
    phone: "555-0127",
  },
]

const todayAppointments = [
  {
    id: 1,
    patient: "María González",
    time: "10:30 AM",
    type: "Examen de rutina",
    status: "Confirmada",
  },
  {
    id: 2,
    patient: "Carlos Rodríguez",
    time: "2:15 PM",
    type: "Entrega de lentes",
    status: "Pendiente",
  },
  {
    id: 3,
    patient: "Ana Martínez",
    time: "4:00 PM",
    type: "Control post-cirugía",
    status: "Programada",
  },
]

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = recentPatients.filter(
    (patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.id.includes(searchTerm),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Revisión":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case "Confirmada":
        return "bg-green-100 text-green-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Programada":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido a Óptica Central</h1>
        <p className="text-muted-foreground">
          Gestiona expedientes, citas y operaciones de tu óptica desde un solo lugar.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Link key={index} href={stat.href}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-base">{action.title}</span>
                  </CardTitle>
                  <CardDescription className="text-sm">{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Patients */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pacientes Recientes</CardTitle>
                  <CardDescription>Últimos pacientes registrados y sus expedientes</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar paciente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Link href="/dashboard/patients/new">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.slice(0, 5).map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age} años</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link href={`/dashboard/records/${patient.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/patients/${patient.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Link href="/dashboard/patients">
                  <Button variant="outline" className="w-full">
                    Ver todos los pacientes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Citas de Hoy</span>
              </CardTitle>
              <CardDescription>Próximas citas programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{appointment.patient}</p>
                      <p className="text-xs text-gray-600">{appointment.type}</p>
                      <p className="text-xs font-medium">{appointment.time}</p>
                    </div>
                    <Badge className={getAppointmentStatusColor(appointment.status)}>{appointment.status}</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href="/dashboard/appointments">
                  <Button variant="outline" className="w-full">
                    Ver todas las citas
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span>Alertas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Stock bajo</p>
                    <p className="text-xs text-gray-600">Monturas modelo XY-123</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Recordatorio</p>
                    <p className="text-xs text-gray-600">Mantenimiento de equipos mañana</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
