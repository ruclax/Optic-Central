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
    ArrowRight
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"
import { supabase } from '@/lib/supabase'
import dynamic from "next/dynamic"
import { PageHeader } from "@/components/ui/PageHeader"

// Datos de ejemplo expandidos
const initialPatients = [
    {
        id: "001",
        first_name: "María",
        last_name: "González",
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
        first_name: "Carlos",
        last_name: "Rodríguez",
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
        first_name: "Ana",
        last_name: "Martínez",
        age: 28,
        gender: "Femenino",
        phone: "555-0125",
        email: "ana.martinez@email.com",
        lastVisit: "2024-01-13",
        nextAppointment: "2024-02-10",
        status: "Activo",
        prescription: "+1.00 / +0.75",
        address: "Barrio Norte 789",
    },
    // Más pacientes...
]

export default function PatientsPageModern() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [genderFilter, setGenderFilter] = useState("all")
    const [patients, setPatients] = useState<any[]>(initialPatients)
    const [showSearchModal, setShowSearchModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [searchDbTerm, setSearchDbTerm] = useState("")
    const [searchDbResults, setSearchDbResults] = useState<any[]>([])
    const [searching, setSearching] = useState(false)
    const PatientForm = dynamic(() => import("@/components/patients/PatientForm"), { ssr: false })

    // Filtrado de pacientes
    const filteredPatients = patients.filter((patient) => {
        const matchesSearch =
            patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm)

        const matchesStatus = statusFilter === "all" || patient.status === statusFilter
        const matchesGender = genderFilter === "all" || patient.gender === genderFilter

        return matchesSearch && matchesStatus && matchesGender
    })

    // Estadísticas dinámicas
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
            title: "Activos",
            value: patients.filter(p => p.status === "Activo").length.toString(),
            change: "+8%",
            trend: "up",
            icon: Users,
            color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
        },
        {
            title: "Pendientes",
            value: patients.filter(p => p.status === "Pendiente").length.toString(),
            change: "-5%",
            trend: "down",
            icon: Users,
            color: "bg-gradient-to-br from-amber-500 to-amber-600"
        },
        {
            title: "Nuevos (30d)",
            value: "12",
            change: "+24%",
            trend: "up",
            icon: UserPlus,
            color: "bg-gradient-to-br from-purple-500 to-purple-600"
        }
    ]

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
            <PageHeader
                icon={<Users className="h-6 w-6" />}
                title="Gestión de Pacientes"
                subtitle="Administra y consulta la información de tus pacientes"
                badgeText={`${patients.length} pacientes`}
                badgeClassName="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1"
                actions={
                    <Link href="/patients/new">
                        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Nuevo Paciente
                        </Button>
                    </Link>
                }
            />
            <main className="flex-1 w-full px-0 py-8 space-y-8">
                <div className="w-full flex flex-col space-y-8">
                    {/* Tarjetas de estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
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
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                    <p className="text-sm text-gray-600">{stat.title}</p>
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
                                            <SelectItem value="Activo">Activo</SelectItem>
                                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                                            <SelectItem value="Inactivo">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                                        <SelectTrigger className="w-[180px] border-gray-200">
                                            <SelectValue placeholder="Género" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="Masculino">Masculino</SelectItem>
                                            <SelectItem value="Femenino">Femenino</SelectItem>
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
                                            <TableHead className="font-semibold text-gray-700">Paciente</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Contacto</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                                            <TableHead className="font-semibold text-gray-700">Última Visita</TableHead>
                                            <TableHead className="font-semibold text-gray-700 text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredPatients.slice(0, 10).map((patient) => (
                                            <TableRow key={patient.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                                                            {patient.first_name[0]}{patient.last_name[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">
                                                                {patient.first_name} {patient.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {patient.age} años • {patient.gender}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <Phone className="h-3 w-3 mr-2 text-gray-400" />
                                                            {patient.phone}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Mail className="h-3 w-3 mr-2 text-gray-400" />
                                                            {patient.email}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            patient.status === "Activo" ? "default" :
                                                                patient.status === "Pendiente" ? "secondary" :
                                                                    "outline"
                                                        }
                                                        className={
                                                            patient.status === "Activo" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                                                                patient.status === "Pendiente" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                                                    "bg-gray-100 text-gray-700 border-gray-200"
                                                        }
                                                    >
                                                        {patient.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                                                        {patient.lastVisit}
                                                    </div>
                                                </TableCell>
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
                </div>
            </main>

            {/* Modales */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl p-0 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b px-6 py-4">
                            <h2 className="text-lg font-semibold">Nuevo Paciente</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ×
                            </button>
                        </div>
                        <div className="p-6">
                            <PatientForm
                                onSuccess={() => setShowAddModal(false)}
                                onCancel={() => setShowAddModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
