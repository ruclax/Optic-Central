"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Eye,
  UserPlus,
  DollarSign,
  Package,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useIsAdmin } from "@/hooks/useRoles"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

// Datos de ejemplo
const stats = [
  {
    title: "Total Pacientes",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
    href: "/patients",
  },
  {
    title: "Exámenes Pendientes",
    value: "8",
    change: "-2%",
    icon: Eye,
    color: "text-orange-600",
    href: "/exams",
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
    href: "/patients/new",
  },
  {
    title: "Nuevo Examen",
    description: "Realizar examen de vista a paciente",
    icon: Eye,
    color: "text-purple-600",
    href: "/exams/new",
  },
  {
    title: "Gestionar Inventario",
    description: "Actualizar stock de monturas y lentes",
    icon: Package,
    color: "text-orange-600",
    href: "/dashboard/inventory",
  },
]

export default function Dashboard() {
  const { user, isLoading } = useAuth()
  const isAdmin = useIsAdmin()
  const router = useRouter()

  if (!isLoading && !user) {
    // Si no está autenticado, redirige a login
    router.replace("/login")
    return null
  }

  if (!isLoading && user && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-2">Acceso denegado</h2>
        <p className="text-muted-foreground">Solo los administradores pueden acceder al dashboard principal.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-2">Cargando...</h2>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-2 sm:px-4">
      {/* Welcome Section */}
      <div className="pt-2 sm:pt-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Bienvenido a Óptica Central</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Gestiona pacientes, exámenes y operaciones de tu óptica desde un solo lugar.
        </p>
      </div>

      {/* Stats Cards - Indicadores en una sola fila, minimalistas, sin cuadros, responsivos */}
      <div className="w-full flex justify-center">
        <div className="flex w-full max-w-7xl px-1 items-end justify-between gap-4 md:gap-8 py-1">
          {stats.map((stat, index) => (
            <Link
              key={index}
              href={stat.href}
              className="flex flex-col items-center flex-1 min-w-0 group"
            >
              <span className="text-base md:text-lg lg:text-xl font-bold text-white mb-0.5 text-center">
                {stat.title}
              </span>
              <span className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl lg:text-3xl font-bold text-foreground group-hover:scale-105 transition-transform">
                <stat.icon className={`h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 ${stat.color}`} />
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-green-600 mt-1 text-center">
                {stat.change} desde el mes pasado
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions - Botones grandes y bien distribuidos, tamaño similar a indicadores en desktop */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Acciones Rápidas</h2>
        <div
          className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 lg:grid-cols-6 w-full"
        >
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href} className="min-w-0">
              <Card
                className="flex flex-col items-center justify-center gap-2 py-4 sm:py-7 cursor-pointer hover:shadow-md transition-shadow h-full min-w-0 md:aspect-auto md:h-auto md:min-w-0 md:max-w-full md:flex-1 select-none active:scale-95 touch-manipulation w-full"
                style={{ minWidth: 0, maxWidth: '100%' }}
              >
                <action.icon className="h-7 w-7 sm:h-10 sm:w-10 text-white" />
                <span className="text-xs sm:text-sm md:text-base font-semibold text-white text-center truncate w-full uppercase tracking-wide">
                  {action.title}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Actividades Recientes: exámenes, pacientes nuevos, rechecks */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Actividades Recientes</CardTitle>
            <CardDescription>Movimientos recientes en el sistema</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            {/* En mobile, mostrar como tarjetas apiladas */}
            <div className="block md:hidden space-y-3 p-2">
              {/* Ejemplo de actividades recientes en tarjetas */}
              <div className="bg-zinc-900 rounded-lg p-3 flex flex-col gap-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2025-06-22</span>
                  <Badge className="bg-blue-700 text-white">Examen</Badge>
                </div>
                <div className="font-semibold text-white">María González</div>
                <div className="text-white text-xs">Examen visual completo</div>
                <div className="flex justify-end mt-1">
                  <Link href="/exams/123"><Button size="sm" variant="outline">Ver</Button></Link>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3 flex flex-col gap-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2025-06-21</span>
                  <Badge className="bg-green-700 text-white">Nuevo Paciente</Badge>
                </div>
                <div className="font-semibold text-white">Carlos Rodríguez</div>
                <div className="text-white text-xs">Registro inicial</div>
                <div className="flex justify-end mt-1">
                  <Link href="/patients/002"><Button size="sm" variant="outline">Ver</Button></Link>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-lg p-3 flex flex-col gap-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2025-06-20</span>
                  <Badge className="bg-purple-700 text-white">Recheck</Badge>
                </div>
                <div className="font-semibold text-white">Ana Martínez</div>
                <div className="text-white text-xs">Revisión de lentes</div>
                <div className="flex justify-end mt-1">
                  <Link href="/patients/003"><Button size="sm" variant="outline">Ver</Button></Link>
                </div>
              </div>
            </div>
            {/* En desktop/tablet, tabla tradicional */}
            <Table className="min-w-[600px] hidden md:table">
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Detalle</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Ejemplo de actividades recientes */}
                <TableRow>
                  <TableCell className="text-white">2025-06-22</TableCell>
                  <TableCell><Badge className="bg-blue-700 text-white">Examen</Badge></TableCell>
                  <TableCell className="text-white">María González</TableCell>
                  <TableCell className="text-white">Examen visual completo</TableCell>
                  <TableCell>
                    <Link href="/exams/123"><Button size="sm" variant="outline">Ver</Button></Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-white">2025-06-21</TableCell>
                  <TableCell><Badge className="bg-green-700 text-white">Nuevo Paciente</Badge></TableCell>
                  <TableCell className="text-white">Carlos Rodríguez</TableCell>
                  <TableCell className="text-white">Registro inicial</TableCell>
                  <TableCell>
                    <Link href="/patients/002"><Button size="sm" variant="outline">Ver</Button></Link>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-white">2025-06-20</TableCell>
                  <TableCell><Badge className="bg-purple-700 text-white">Recheck</Badge></TableCell>
                  <TableCell className="text-white">Ana Martínez</TableCell>
                  <TableCell className="text-white">Revisión de lentes</TableCell>
                  <TableCell>
                    <Link href="/patients/003"><Button size="sm" variant="outline">Ver</Button></Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Resumen Línea de Maquilado de Lentes */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Línea de Maquilado de Lentes</CardTitle>
            <CardDescription>Estado actual de los pedidos de lentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-900 rounded-lg p-4 flex flex-col items-center min-h-[80px] touch-manipulation">
                <span className="text-3xl font-bold text-white">5</span>
                <span className="text-white mt-1">En proceso</span>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 flex flex-col items-center min-h-[80px] touch-manipulation">
                <span className="text-3xl font-bold text-white">2</span>
                <span className="text-white mt-1">Listos para entrega</span>
              </div>
              <div className="bg-zinc-900 rounded-lg p-4 flex flex-col items-center min-h-[80px] touch-manipulation">
                <span className="text-3xl font-bold text-white">1</span>
                <span className="text-white mt-1">Entregados hoy</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div>
        <Card>
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
  )
}
