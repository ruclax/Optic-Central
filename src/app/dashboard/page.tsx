"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Eye,
  UserPlus,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Activity,
  Star,
  Shield
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"
import { PageHeader } from "@/components/ui/PageHeader"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

type Patient = {
  id: string
  full_name?: string
  nombre?: string
  email?: string
  activo?: boolean
  created_at?: string
  fecha_registro?: string
  // ...otros campos relevantes
}

type Exam = {
  id: string
  paciente_nombre?: string
  nombre_paciente?: string
  paciente_id?: string
  status?: string
  estado?: string
  estatus?: string
  created_at?: string
  fecha?: string
  // ...otros campos relevantes
}

const NewPatientForm = dynamic(() => import("../patients/new/page"), { ssr: false })
const NewExamForm = dynamic(() => import("../exams/new/page"), { ssr: false })

export default function Dashboard() {
  const { user } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [showExamModal, setShowExamModal] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [patientsRes, examsRes] = await Promise.all([
          fetch("/api/pacientes", { credentials: "include" }),
          fetch("/api/examenes", { credentials: "include" })
        ])
        const patientsData = await patientsRes.json()
        const examsData = await examsRes.json()
        setPatients(Array.isArray(patientsData) ? patientsData : [])
        setExams(Array.isArray(examsData) ? examsData : [])
      } catch (e) {
        setPatients([])
        setExams([])
      } finally {
        setLoading(false)
      }
    }
    if (user) fetchData()
  }, [user])

  // Protección: si no hay usuario, redirigir a login
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  // Calcular métricas
  const activePatients = patients.filter((p: any) => p.activo !== false) // si no hay campo activo, cuenta todos
  const pendingExams = exams.filter((e: any) => (e.status || e.estado || e.estatus || '').toLowerCase().includes('pend'))

  const stats = [
    {
      title: "Pacientes Activos",
      value: loading ? "..." : activePatients.length,
      change: "", // Puedes calcular variación si tienes histórico
      trend: "up",
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      href: "/patients"
    },
    {
      title: "Exámenes Pendientes",
      value: loading ? "..." : pendingExams.length,
      change: "",
      trend: "down",
      icon: Eye,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      href: "/exams"
    }
  ]

  // Actividad reciente: últimos 3 pacientes y exámenes
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.created_at || b.fecha_registro || 0).getTime() - new Date(a.created_at || a.fecha_registro || 0).getTime())
    .slice(0, 3)
    .map((p) => ({
      type: "patient",
      patient: p.full_name || p.nombre || p.email || "Paciente",
      action: "Nuevo paciente registrado",
      time: p.created_at ? timeAgo(p.created_at) : (p.fecha_registro ? timeAgo(p.fecha_registro) : "-"),
      status: "new",
      date: p.created_at || p.fecha_registro || ""
    }))
  const recentExams = [...exams]
    .sort((a, b) => new Date(b.created_at || b.fecha || 0).getTime() - new Date(a.created_at || a.fecha || 0).getTime())
    .slice(0, 3)
    .map((e) => ({
      type: "exam",
      patient: e.paciente_nombre || e.nombre_paciente || e.paciente_id || "Paciente",
      action: (e.status || e.estado || e.estatus || '').toLowerCase().includes('pend') ? "Examen pendiente" : "Examen completado",
      time: e.created_at ? timeAgo(e.created_at) : (e.fecha ? timeAgo(e.fecha) : "-"),
      status: (e.status || e.estado || e.estatus || '').toLowerCase().includes('pend') ? "pending" : "completed",
      date: e.created_at || e.fecha || ""
    }))
  const recentActivities = [...recentPatients, ...recentExams]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  function timeAgo(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diff < 60) return `hace ${diff} seg`;
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    return date.toLocaleDateString()
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader
        icon={<Star className="h-6 w-6" />}
        title="Panel de Control"
        subtitle="Resumen y acceso rápido a las principales métricas y acciones"
        badgeText={undefined}
        actions={null}
      />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">{/* Cards de estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background">
                <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${stat.color}`} />
                <CardHeader className="pb-3 relative">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${stat.color} text-white shadow-lg`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                      <TrendingUp className={`h-3 w-3 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                      {stat.change}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 relative">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <p className="text-sm text-gray-600 mb-4">{stat.title}</p>
                  <Link href={stat.href}>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                      size="sm"
                    >
                      Ver detalles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Acciones rápidas mejoradas */}
            <Card className="lg:col-span-1 border-0 shadow-lg bg-background">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <span>Acciones Rápidas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => setShowPatientModal(true)}
                >
                  <Users className="mr-3 h-4 w-4" />
                  Nuevo Paciente
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
                <Button
                  className="w-full justify-start bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border border-emerald-200 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => setShowExamModal(true)}
                >
                  <Eye className="mr-3 h-4 w-4" />
                  Nuevo Examen
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
                {/* Botón de cita oculto para MVP */}
              </CardContent>
            </Card>

            {/* Modales flotantes */}
            {showPatientModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl lg:max-w-2xl mx-2 sm:mx-0 p-4 sm:p-6 relative animate-fade-in max-h-[98vh] overflow-y-auto">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                    onClick={() => setShowPatientModal(false)}
                  >
                    ×
                  </button>
                  <NewPatientForm onSuccess={() => { setShowPatientModal(false); }} onCancel={() => setShowPatientModal(false)} />
                </div>
              </div>
            )}
            {showExamModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-2 sm:mx-0 p-4 sm:p-8 relative animate-fade-in max-h-[98vh] overflow-y-auto">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
                    onClick={() => setShowExamModal(false)}
                  >
                    ×
                  </button>
                  <NewExamForm onSuccess={() => { setShowExamModal(false); }} onCancel={() => setShowExamModal(false)} />
                </div>
              </div>
            )}

            {/* Actividad reciente */}
            <Card className="lg:col-span-2 border-0 shadow-lg bg-background">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span>Actividad Reciente</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md">
                    <div className={`p-2 rounded-full ${activity.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                      activity.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                      {activity.status === 'completed' ? <CheckCircle className="h-4 w-4" /> :
                        activity.status === 'scheduled' ? <Clock className="h-4 w-4" /> :
                          <UserPlus className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.patient}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.action}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
