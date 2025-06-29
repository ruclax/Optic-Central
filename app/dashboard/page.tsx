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

export default function Dashboard() {
  const { user } = useAuth()

  // Datos de ejemplo mejorados
  const stats = [
    {
      title: "Pacientes Activos",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      href: "/patients"
    },
    {
      title: "Exámenes Pendientes",
      value: "23",
      change: "-8%",
      trend: "down",
      icon: Eye,
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      href: "/exams"
    },
    {
      title: "Citas de Hoy",
      value: "12",
      change: "+4",
      trend: "up",
      icon: Calendar,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      href: "/appointments"
    },
    {
      title: "Satisfacción",
      value: "98%",
      change: "+2%",
      trend: "up",
      icon: Star,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      href: "/reviews"
    }
  ]

  const recentActivities = [
    {
      type: "exam",
      patient: "María González",
      action: "Examen completado",
      time: "hace 2 horas",
      status: "completed"
    },
    {
      type: "appointment",
      patient: "Carlos Rodríguez",
      action: "Cita agendada",
      time: "hace 3 horas",
      status: "scheduled"
    },
    {
      type: "patient",
      patient: "Ana Martínez",
      action: "Nuevo paciente registrado",
      time: "hace 5 horas",
      status: "new"
    }
  ]

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
                <Link href="/patients/new">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md">
                    <Users className="mr-3 h-4 w-4" />
                    Nuevo Paciente
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/exams/new">
                  <Button className="w-full justify-start bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border border-emerald-200 hover:border-emerald-300 transition-all duration-300 shadow-sm hover:shadow-md">
                    <Eye className="mr-3 h-4 w-4" />
                    Nuevo Examen
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/appointments/new">
                  <Button className="w-full justify-start bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border border-amber-200 hover:border-amber-300 transition-all duration-300 shadow-sm hover:shadow-md">
                    <Calendar className="mr-3 h-4 w-4" />
                    Nueva Cita
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

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
