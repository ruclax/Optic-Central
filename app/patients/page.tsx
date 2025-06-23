"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Edit, Phone, Mail, Calendar, Users, Download, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useIsAdmin, useHasRoleId } from "@/hooks/useRoles"
import { useAuth } from "@/providers/auth-provider"
import { createClient } from "@supabase/supabase-js"
import dynamic from "next/dynamic"
import { SearchFilterBar } from "@/components/ui/search-filter-bar"

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
    nextAppointment: null,
    status: "Activo",
    prescription: "+1.00 / +0.75",
    address: "Plaza Mayor 789",
  },
  {
    id: "004",
    first_name: "Luis",
    last_name: "Fernández",
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
    first_name: "Carmen",
    last_name: "López",
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
    first_name: "Roberto",
    last_name: "Silva",
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
    first_name: "Patricia",
    last_name: "Morales",
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
    first_name: "Diego",
    last_name: "Herrera",
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
  const isAdmin = useIsAdmin()
  // IDs de roles desde variables de entorno o valores por defecto
  const DOCTOR_ROLE_ID = process.env.NEXT_PUBLIC_DOCTOR_ROLE_ID || "2"
  const OPTOMETRIST_ROLE_ID = process.env.NEXT_PUBLIC_OPTOMETRIST_ROLE_ID || "3"
  const RECEPTIONIST_ROLE_ID = process.env.NEXT_PUBLIC_RECEPTIONIST_ROLE_ID || "4"
  const isDoctor = useHasRoleId(DOCTOR_ROLE_ID)
  const isOptometrist = useHasRoleId(OPTOMETRIST_ROLE_ID)
  const isReceptionist = useHasRoleId(RECEPTIONIST_ROLE_ID)
  const { user } = useAuth()
  // Permitir acceso a admin, doctor, optometrista y recepcionista
  const canView = isAdmin || isDoctor || isOptometrist || isReceptionist
  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-2">Acceso denegado</h2>
        <p className="text-muted-foreground">No tienes permisos para ver esta página.</p>
      </div>
    )
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [patients, setPatients] = useState<any[]>([])
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchDbTerm, setSearchDbTerm] = useState("")
  const [searchDbResults, setSearchDbResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const PatientForm = dynamic(() => import("@/components/patients/PatientForm"), { ssr: false })

  // Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase.from("patients").select(`id, first_name, last_name, phone, email, address, date_of_birth, gender, emergency_contact, emergency_phone, allergies, medications, medical_history, right_eye_sphere, right_eye_cylinder, right_eye_axis, left_eye_sphere, left_eye_cylinder, left_eye_axis, pupillary_distance, notes`)
      if (data) setPatients(data)
    }
    fetchPatients()
  }, [])

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase()
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      patient.id.includes(searchTerm) ||
      (patient.phone || "").includes(searchTerm) ||
      (patient.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
      (statusFilter === "all" || (patient.status || "").toLowerCase() === statusFilter.toLowerCase()) &&
      (genderFilter === "all" || (patient.gender || "").toLowerCase() === genderFilter.toLowerCase())
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

  // Función para saber si puede editar info básica
  const canEditBasic = isReceptionist || isDoctor || isOptometrist || isAdmin
  // Función para saber si puede editar info avanzada
  const canEditAdvanced = isDoctor || isOptometrist || isAdmin

  // Debounce para búsqueda en la base de datos
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => func(...args), delay)
    }
  }

  const handleDbSearch = useCallback(
    debounce(async (term: string) => {
      setSearching(true)
      if (!term) {
        setSearchDbResults([])
        setSearching(false)
        return
      }
      const { data, error } = await supabase
        .from("patients")
        .select("id, first_name, last_name, phone, email, status")
        .or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`)
        .limit(10)
      setSearchDbResults(data || [])
      setSearching(false)
    }, 400),
    []
  )

  // Efecto para búsqueda en tiempo real
  useEffect(() => {
    handleDbSearch(searchDbTerm)
  }, [searchDbTerm, handleDbSearch])

  return (
    <div className="space-y-6 pb-20 px-2 sm:px-4 md:px-0 md:max-w-none md:mx-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Pacientes recientes</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Últimos pacientes atendidos o registrados</p>
        </div>
      </div>

      {/* Indicadores minimalistas solo en móvil */}
      <div className="w-full flex justify-center md:hidden">
        <div className="flex gap-4 w-full max-w-3xl px-1 items-end justify-between py-1">
          <div className="flex flex-col items-center min-w-0">
            <span className="text-base font-bold text-white mb-0.5">Total</span>
            <span className="flex items-center gap-1 text-lg font-bold text-foreground">
              <Users className="h-5 w-5 text-muted-foreground" />
              {patients.length}
            </span>
          </div>
          <div className="flex flex-col items-center min-w-0">
            <span className="text-base font-bold text-white mb-0.5">Activos</span>
            <span className="flex items-center gap-1 text-lg font-bold text-green-600">
              <Users className="h-5 w-5" />
              {patients.filter((p) => p.status === "Activo").length}
            </span>
          </div>
          <div className="flex flex-col items-center min-w-0">
            <span className="text-base font-bold text-white mb-0.5">Pendientes</span>
            <span className="flex items-center gap-1 text-lg font-bold text-yellow-600">
              <Users className="h-5 w-5" />
              {patients.filter((p) => p.status === "Pendiente").length}
            </span>
          </div>
          <div className="flex flex-col items-center min-w-0">
            <span className="text-base font-bold text-white mb-0.5">Revisión</span>
            <span className="flex items-center gap-1 text-lg font-bold text-blue-600">
              <Users className="h-5 w-5" />
              {patients.filter((p) => p.status === "Revisión").length}
            </span>
          </div>
        </div>
      </div>
      {/* Indicadores y botón de nuevo paciente en una sola fila (desktop/tablet) */}
      <div className="hidden md:flex w-full justify-center mt-2">
        <div className="flex w-full items-end gap-8 px-0">
          <div className="flex flex-col items-center flex-1 min-w-0">
            <span className="text-lg font-bold text-white mb-1">Total</span>
            <span className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Users className="h-6 w-6 text-muted-foreground" />
              {patients.length}
            </span>
          </div>
          <div className="flex flex-col items-center flex-1 min-w-0">
            <span className="text-lg font-bold text-white mb-1">Activos</span>
            <span className="flex items-center gap-2 text-2xl font-bold text-green-600">
              <Users className="h-6 w-6" />
              {patients.filter((p) => p.status === "Activo").length}
            </span>
          </div>
          <div className="flex flex-col items-center flex-1 min-w-0">
            <span className="text-lg font-bold text-white mb-1">Pendientes</span>
            <span className="flex items-center gap-2 text-2xl font-bold text-yellow-600">
              <Users className="h-6 w-6" />
              {patients.filter((p) => p.status === "Pendiente").length}
            </span>
          </div>
          <div className="flex flex-col items-center flex-1 min-w-0">
            <span className="text-lg font-bold text-white mb-1">Revisión</span>
            <span className="flex items-center gap-2 text-2xl font-bold text-blue-600">
              <Users className="h-6 w-6" />
              {patients.filter((p) => p.status === "Revisión").length}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de acciones, búsqueda y filtros solo en tablet/desktop */}
      <div className="hidden md:block w-full mx-auto mt-4 px-0">
        <div className="flex items-center gap-2 mb-4 w-full">
          <SearchFilterBar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            filters={[
              {
                label: "Estado",
                value: statusFilter,
                options: [
                  { value: "all", label: "Todos los estados" },
                  { value: "activo", label: "Activo" },
                  { value: "pendiente", label: "Pendiente" },
                  { value: "revisión", label: "Revisión" },
                  { value: "inactivo", label: "Inactivo" },
                ],
                onChange: setStatusFilter,
              },
              {
                label: "Género",
                value: genderFilter,
                options: [
                  { value: "all", label: "Todos" },
                  { value: "masculino", label: "Masculino" },
                  { value: "femenino", label: "Femenino" },
                ],
                onChange: setGenderFilter,
              },
            ]}
            placeholder="Buscar por nombre, ID, teléfono, email o dirección..."
            className="flex-1"
          >
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap ml-2"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />Nuevo Paciente
            </Button>
          </SearchFilterBar>
        </div>
        <div className="rounded-md border overflow-x-auto bg-background w-full">
          <Table className="w-full">
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
              {filteredPatients.slice(0, 20).map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{patient.first_name} {patient.last_name}</div>
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
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
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
      </div>

      {/* Lista de pacientes recientes (máx 10) - siempre visible */}
      <div className="block space-y-3">
        {patients.slice(0, 10).map((patient) => (
          <div key={patient.id} className="bg-zinc-900 rounded-lg p-3 flex flex-col gap-1 shadow-md">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>ID: {patient.id}</span>
              <span>{patient.status}</span>
            </div>
            <div className="font-semibold text-white text-base">{patient.first_name} {patient.last_name}</div>
            <div className="text-white text-xs mb-1">{patient.address}</div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-1">
              <span>{patient.phone}</span>
              <span>{patient.email}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-1">
              <span>{patient.age} años</span>
              <span>{patient.gender}</span>
              <span>Últ. visita: {patient.lastVisit}</span>
              {patient.nextAppointment && <span>Próx: {patient.nextAppointment}</span>}
            </div>
            <div className="flex gap-2 mt-2">
              <Link href={`/patients/${patient.id}/edit`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  Editar
                </Button>
              </Link>
            </div>
          </div>
        ))}
        {patients.length === 0 && (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">No se encontraron pacientes</h3>
            <p className="text-muted-foreground">
              Agrega un nuevo paciente para comenzar.
            </p>
            <button onClick={() => setShowAddModal(true)} className="mt-4 bg-accent text-accent-foreground px-4 py-2 rounded font-semibold">Agregar Primer Paciente</button>
          </div>
        )}
      </div>

      {/* FABs flotantes solo en móvil */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex flex-row justify-center gap-8 items-center pointer-events-none md:hidden">
        <button
          className="pointer-events-auto rounded-full bg-primary text-primary-foreground shadow-lg w-14 h-14 flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          onClick={() => setShowSearchModal(true)}
          aria-label="Buscar paciente"
        >
          <Search className="h-7 w-7" />
        </button>
        <button
          className="pointer-events-auto rounded-full bg-accent text-accent-foreground shadow-lg w-14 h-14 flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
          aria-label="Agregar paciente"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-7 w-7" />
        </button>
      </div>

      {/* Modal de búsqueda de pacientes */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Buscar paciente</h2>
              <button onClick={() => setShowSearchModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
            </div>
            <Input
              autoFocus
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchDbTerm}
              onChange={e => setSearchDbTerm(e.target.value)}
              className="mb-4"
            />
            {searching && <div className="text-center text-muted-foreground py-4">Buscando...</div>}
            {!searching && searchDbTerm && searchDbResults.length === 0 && (
              <div className="text-center text-muted-foreground py-4">No se encontraron pacientes.</div>
            )}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchDbResults.map((p) => (
                <div key={p.id} className="flex flex-col gap-1 border-b pb-2 last:border-b-0 last:pb-0">
                  <div className="font-semibold text-base">{p.first_name} {p.last_name}</div>
                  <div className="text-xs text-muted-foreground">{p.email} | {p.phone}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">{p.status}</span>
                    <Link href={`/patients/${p.id}/edit`} className="ml-auto">
                      <Button size="sm" variant="outline">Ver</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de agregar paciente */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background rounded-lg shadow-xl p-0 w-full max-w-2xl mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Nuevo paciente</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
            </div>
            <div className="p-4 sm:p-6">
              <PatientForm onSuccess={() => setShowAddModal(false)} onCancel={() => setShowAddModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
