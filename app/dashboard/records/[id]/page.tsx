"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  FileText,
  Edit,
  Download,
  PrinterIcon as Print,
  Plus,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

// Datos de ejemplo del paciente
const patientData = {
  id: "001",
  name: "María González",
  age: 45,
  gender: "Femenino",
  phone: "555-0123",
  email: "maria.gonzalez@email.com",
  address: "Calle Principal 123, Ciudad Central",
  birthDate: "1979-03-15",
  emergencyContact: "Carlos González",
  emergencyPhone: "555-0124",
  status: "Activo",
  registrationDate: "2023-05-15",
  lastVisit: "2024-01-15",
  nextAppointment: "2024-02-15",

  // Historial médico
  allergies: "Ninguna conocida",
  medications: "Vitamina D, Omega 3",
  medicalHistory: "Hipertensión controlada, cirugía de cataratas OI en 2022",

  // Prescripción actual
  prescription: {
    rightEye: {
      sphere: "-2.50",
      cylinder: "-1.75",
      axis: "180",
    },
    leftEye: {
      sphere: "-2.25",
      cylinder: "-1.50",
      axis: "175",
    },
    pupillaryDistance: "62",
    prescriptionDate: "2024-01-15",
    prescribedBy: "Dr. Ana Rodríguez",
  },

  // Historial de visitas
  visits: [
    {
      id: 1,
      date: "2024-01-15",
      type: "Examen de rutina",
      doctor: "Dr. Ana Rodríguez",
      notes: "Revisión anual. Cambio menor en prescripción OD.",
      prescription: "-2.50/-1.75x180 | -2.25/-1.50x175",
    },
    {
      id: 2,
      date: "2023-01-20",
      type: "Examen anual",
      doctor: "Dr. Ana Rodríguez",
      notes: "Estable. Sin cambios significativos.",
      prescription: "-2.25/-1.50x180 | -2.00/-1.25x175",
    },
    {
      id: 3,
      date: "2022-06-10",
      type: "Post-operatorio",
      doctor: "Dr. Carlos Méndez",
      notes: "Control post-cirugía cataratas OI. Evolución favorable.",
      prescription: "-2.00/-1.25x180 | -1.75/-1.00x175",
    },
  ],

  // Compras/Lentes
  purchases: [
    {
      id: 1,
      date: "2024-01-15",
      type: "Lentes progresivos",
      frame: "Ray-Ban RB5154",
      lenses: "Varilux Comfort",
      price: "$450.00",
      status: "Entregado",
    },
    {
      id: 2,
      date: "2023-02-10",
      type: "Lentes de sol graduados",
      frame: "Oakley Holbrook",
      lenses: "Polarizados",
      price: "$320.00",
      status: "Entregado",
    },
  ],
}

export default function PatientRecordPage({ params }: { params: { id: string } }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "bg-green-100 text-green-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Entregado":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/patients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Pacientes
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expediente de {patientData.name}</h1>
            <p className="text-muted-foreground">
              ID: {patientData.id} • Registrado el {patientData.registrationDate}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Print className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Create a simple text export of patient data
              const exportData = `
EXPEDIENTE MÉDICO - ÓPTICA CENTRAL
=====================================

INFORMACIÓN DEL PACIENTE:
Nombre: ${patientData.name}
ID: ${patientData.id}
Edad: ${patientData.age} años
Género: ${patientData.gender}
Teléfono: ${patientData.phone}
Email: ${patientData.email}
Dirección: ${patientData.address}

PRESCRIPCIÓN ACTUAL:
Ojo Derecho (OD): ${patientData.prescription.rightEye.sphere} / ${patientData.prescription.rightEye.cylinder} x ${patientData.prescription.rightEye.axis}°
Ojo Izquierdo (OI): ${patientData.prescription.leftEye.sphere} / ${patientData.prescription.leftEye.cylinder} x ${patientData.prescription.leftEye.axis}°
Distancia Pupilar: ${patientData.prescription.pupillaryDistance} mm
Fecha de prescripción: ${patientData.prescription.prescriptionDate}
Prescrito por: ${patientData.prescription.prescribedBy}

HISTORIAL MÉDICO:
Alergias: ${patientData.allergies}
Medicamentos: ${patientData.medications}
Historial: ${patientData.medicalHistory}

Generado el: ${new Date().toLocaleDateString("es-ES")}
  `.trim()

              const blob = new Blob([exportData], { type: "text/plain" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `expediente_${patientData.name.replace(/\s+/g, "_")}_${patientData.id}.txt`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Link href={`/dashboard/patients/${patientData.id}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Status Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{patientData.name}</h2>
                <p className="text-muted-foreground">
                  {patientData.age} años • {patientData.gender}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(patientData.status)} className="mb-2">
                {patientData.status}
              </Badge>
              <p className="text-sm text-muted-foreground">Última visita: {patientData.lastVisit}</p>
              {patientData.nextAppointment && (
                <p className="text-sm text-blue-600 font-medium">Próxima cita: {patientData.nextAppointment}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="medical">Historial Médico</TabsTrigger>
          <TabsTrigger value="prescription">Prescripción</TabsTrigger>
          <TabsTrigger value="visits">Visitas</TabsTrigger>
          <TabsTrigger value="purchases">Compras</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Información Personal</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{patientData.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{patientData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{patientData.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Nacimiento: {patientData.birthDate}</span>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Contacto de Emergencia</h4>
                  <p className="text-sm">{patientData.emergencyContact}</p>
                  <p className="text-sm text-muted-foreground">{patientData.emergencyPhone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Prescripción Actual */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span>Prescripción Actual</span>
                </CardTitle>
                <CardDescription>Última actualización: {patientData.prescription.prescriptionDate}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Ojo Derecho (OD)</h4>
                    <div className="space-y-1 text-sm">
                      <p>Esfera: {patientData.prescription.rightEye.sphere}</p>
                      <p>Cilindro: {patientData.prescription.rightEye.cylinder}</p>
                      <p>Eje: {patientData.prescription.rightEye.axis}°</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Ojo Izquierdo (OI)</h4>
                    <div className="space-y-1 text-sm">
                      <p>Esfera: {patientData.prescription.leftEye.sphere}</p>
                      <p>Cilindro: {patientData.prescription.leftEye.cylinder}</p>
                      <p>Eje: {patientData.prescription.leftEye.axis}°</p>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm">
                    <span className="font-medium">DP:</span> {patientData.prescription.pupillaryDistance} mm
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Prescrito por: {patientData.prescription.prescribedBy}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Operaciones comunes para este paciente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <Link href={`/dashboard/appointments/new?patient=${patientData.id}`}>
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span>Agendar Cita</span>
                  </Button>
                </Link>
                <Link href={`/dashboard/exams/new?patient=${patientData.id}`}>
                  <Button variant="outline" className="w-full h-20 flex-col">
                    <Eye className="h-6 w-6 mb-2" />
                    <span>Nuevo Examen</span>
                  </Button>
                </Link>
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Plus className="h-6 w-6 mb-2" />
                  <span>Nueva Venta</span>
                </Button>
                <Button variant="outline" className="w-full h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Agregar Nota</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial Médico</CardTitle>
              <CardDescription>Información médica relevante del paciente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                  Alergias
                </h4>
                <p className="text-sm bg-orange-50 p-3 rounded-lg">
                  {patientData.allergies || "No se han registrado alergias"}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Medicamentos Actuales</h4>
                <p className="text-sm bg-blue-50 p-3 rounded-lg">
                  {patientData.medications || "No se han registrado medicamentos"}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Historial Médico</h4>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">
                  {patientData.medicalHistory || "No se ha registrado historial médico"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de Prescripción</CardTitle>
              <CardDescription>Prescripción óptica detallada y evolución</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ojo Derecho (OD)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Esfera:</span>
                        <span className="font-mono">{patientData.prescription.rightEye.sphere}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Cilindro:</span>
                        <span className="font-mono">{patientData.prescription.rightEye.cylinder}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Eje:</span>
                        <span className="font-mono">{patientData.prescription.rightEye.axis}°</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ojo Izquierdo (OI)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Esfera:</span>
                        <span className="font-mono">{patientData.prescription.leftEye.sphere}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Cilindro:</span>
                        <span className="font-mono">{patientData.prescription.leftEye.cylinder}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Eje:</span>
                        <span className="font-mono">{patientData.prescription.leftEye.axis}°</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Distancia Pupilar (DP)</p>
                      <p className="text-2xl font-bold">{patientData.prescription.pupillaryDistance} mm</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Fecha de prescripción</p>
                      <p className="font-medium">{patientData.prescription.prescriptionDate}</p>
                      <p className="text-sm text-muted-foreground">Por: {patientData.prescription.prescribedBy}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visits" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historial de Visitas</CardTitle>
                  <CardDescription>Registro completo de todas las visitas del paciente</CardDescription>
                </div>
                <Link href={`/dashboard/exams/new?patient=${patientData.id}`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Visita
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientData.visits.map((visit, index) => (
                  <Card key={visit.id} className="border-l-4 border-l-blue-600">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{visit.type}</Badge>
                            <span className="text-sm text-muted-foreground">{visit.date}</span>
                          </div>
                          <p className="font-medium">{visit.doctor}</p>
                          <p className="text-sm text-muted-foreground">{visit.notes}</p>
                          {visit.prescription && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <span className="font-medium">Prescripción: </span>
                              <code>{visit.prescription}</code>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Historial de Compras</CardTitle>
                  <CardDescription>Lentes y productos adquiridos por el paciente</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Venta
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientData.purchases.map((purchase, index) => (
                  <Card key={purchase.id} className="border-l-4 border-l-green-600">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(purchase.status)}>{purchase.status}</Badge>
                            <span className="text-sm text-muted-foreground">{purchase.date}</span>
                          </div>
                          <p className="font-medium">{purchase.type}</p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              <span className="font-medium">Montura:</span> {purchase.frame}
                            </p>
                            <p>
                              <span className="font-medium">Lentes:</span> {purchase.lenses}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-green-600">{purchase.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
