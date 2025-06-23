"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search, Plus, User, Calendar, FileText, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { SearchFilterBar } from "@/components/ui/search-filter-bar"
import dynamic from "next/dynamic"
import { supabase } from "@/lib/supabaseClient"
import { SearchModal } from "@/components/ui/search-modal"
import { EmptyState } from "@/components/ui/empty-state"

export default function ExamsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [exams, setExams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const NewExamForm = dynamic(() => import("./new/page"), { ssr: false })

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("exams")
        .select(`id, patient_id, patient_name, date, type, doctor, status, results, notes`)
        .order("date", { ascending: false })
        .limit(20)
      if (error) {
        setExams([])
      } else {
        setExams(data || [])
      }
      setLoading(false)
    }
    fetchExams()
  }, [])

  const filteredExams = exams.filter((exam) => {
    if (!exam) return false;
    const patientName = (exam.patient_name || "").toString().toLowerCase();
    const patientId = (exam.patient_id || "").toString();
    const doctor = (exam.doctor || "").toString().toLowerCase();
    const status = (exam.status || "").toString().toLowerCase();
    const type = (exam.type || "").toString().toLowerCase();

    const matchesSearch =
      patientName.includes(searchTerm.toLowerCase()) ||
      patientId.includes(searchTerm) ||
      doctor.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || status === statusFilter.toLowerCase();
    const matchesType = typeFilter === "all" || type.includes(typeFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
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
    <div className="space-y-6 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestión de Exámenes</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Administra los exámenes de vista y sus resultados</p>
        </div>
        <button
          className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Examen
        </button>
      </div>
      {/* FABs en móvil: búsqueda y nuevo examen, respetando dark mode y tokens Tailwind */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex flex-row justify-center gap-8 items-center pointer-events-none md:hidden">
        <button
          className="pointer-events-auto rounded-full bg-primary text-primary-foreground shadow-lg w-14 h-14 flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          onClick={() => setShowSearchBar(true)}
          aria-label="Buscar examen"
        >
          <Search className="h-7 w-7" />
        </button>
        <button
          className="pointer-events-auto rounded-full bg-accent text-accent-foreground shadow-lg w-14 h-14 flex items-center justify-center text-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
          onClick={() => setShowAddModal(true)}
          aria-label="Nuevo examen"
        >
          <Plus className="h-7 w-7" />
        </button>
      </div>
      {/* Barra de búsqueda emergente solo en móvil usando SearchModal */}
      <SearchModal
        open={showSearchBar}
        onClose={() => setShowSearchBar(false)}
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por paciente, ID o doctor..."
        label="Buscar examen"
      />
      {/* Filtros y barra de búsqueda solo en desktop/tablet */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Lista de Exámenes</CardTitle>
          <CardDescription>Busca y filtra exámenes por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
            <SearchFilterBar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              filters={[
                {
                  label: "Estado",
                  value: statusFilter,
                  options: [
                    { value: "all", label: "Todos los estados" },
                    { value: "completado", label: "Completado" },
                    { value: "pendiente", label: "Pendiente" },
                    { value: "en proceso", label: "En Proceso" },
                  ],
                  onChange: setStatusFilter,
                },
                {
                  label: "Tipo",
                  value: typeFilter,
                  options: [
                    { value: "all", label: "Todos los tipos" },
                    { value: "completo", label: "Examen completo" },
                    { value: "seguimiento", label: "Seguimiento" },
                    { value: "post-operatorio", label: "Post-operatorio" },
                  ],
                  onChange: setTypeFilter,
                },
              ]}
              placeholder="Buscar por paciente, ID o doctor..."
              className="flex-1"
            >
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </SearchFilterBar>
          </div>
          {/* Lista solo muestra exámenes más recientes (máx 5) */}
          <div className="hidden md:block">
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[700px]">
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Cargando exámenes...</TableCell>
                    </TableRow>
                  ) : filteredExams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <h3 className="text-lg font-medium">No se encontraron exámenes</h3>
                        <p className="text-muted-foreground">Agrega un nuevo examen para comenzar.</p>
                        <button onClick={() => setShowAddModal(true)} className="mt-4 bg-accent text-accent-foreground px-4 py-2 rounded font-semibold">Agregar Primer Examen</button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExams.slice(0, 5).map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">#{exam.id.toString().padStart(3, "0")}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{exam.patient_name}</div>
                            <div className="text-sm text-muted-foreground">ID: {exam.patient_id}</div>
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
                            <Link href={`/exams/${exam.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="block md:hidden space-y-3">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Cargando exámenes...</div>
            ) : (
              filteredExams.length === 0 ? (
                <EmptyState
                  title="No se encontraron exámenes"
                  description="Agrega un nuevo examen para comenzar."
                  actionLabel="Agregar Primer Examen"
                  onAction={() => setShowAddModal(true)}
                />
              ) : (
                filteredExams.slice(0, 10).map((exam) => (
                  <div key={exam.id} className="bg-zinc-900 rounded-lg p-3 flex flex-col gap-1 shadow-md">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>ID: {exam.id}</span>
                      <span>{exam.status}</span>
                    </div>
                    <div className="font-semibold text-white text-base">{exam.patient_name}</div>
                    <div className="text-white text-xs mb-1">{exam.date} • {exam.type}</div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-1">
                      <span>{exam.doctor}</span>
                      {exam.results && <span>OD: {exam.results.rightEye?.sphere}/{exam.results.rightEye?.cylinder} OI: {exam.results.leftEye?.sphere}/{exam.results.leftEye?.cylinder}</span>}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Link href={`/exams/${exam.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">Ver</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </CardContent>
      </Card>
      {/* Modal de agregar examen */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-background rounded-lg shadow-xl p-0 w-full max-w-2xl mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-semibold">Nuevo examen</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700 text-xl">×</button>
            </div>
            <div className="p-4 sm:p-6">
              <NewExamForm onSuccess={() => setShowAddModal(false)} onCancel={() => setShowAddModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
