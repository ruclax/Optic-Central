"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Calendar, Clock, User, Search, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

// Datos de ejemplo de pacientes
const patients = [
  { id: "001", name: "María González", phone: "555-0123" },
  { id: "002", name: "Carlos Rodríguez", phone: "555-0124" },
  { id: "003", name: "Ana Martínez", phone: "555-0125" },
  { id: "004", name: "Luis Fernández", phone: "555-0126" },
  { id: "005", name: "Carmen López", phone: "555-0127" },
]

// Horarios disponibles
const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
]

const appointmentTypes = [
  "Examen de rutina",
  "Primera consulta",
  "Control post-cirugía",
  "Entrega de lentes",
  "Ajuste de lentes",
  "Examen especializado",
  "Consulta de seguimiento",
]

const doctors = ["Dr. Ana Rodríguez", "Dr. Carlos Méndez", "Dr. María Fernández", "Técnico Especialista"]

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPatient = searchParams.get("patient")

  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [patientSearch, setPatientSearch] = useState("")
  const [appointmentData, setAppointmentData] = useState({
    patientId: preselectedPatient || "",
    patientName: preselectedPatient ? patients.find((p) => p.id === preselectedPatient)?.name || "" : "",
    date: "",
    time: "",
    type: "",
    doctor: "",
    notes: "",
    duration: "30", // minutos
    reminder: "24", // horas antes
  })

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.id.includes(patientSearch) ||
      patient.phone.includes(patientSearch),
  )

  const handleInputChange = (field: string, value: string) => {
    setAppointmentData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePatientSelect = (patient: (typeof patients)[0]) => {
    setAppointmentData((prev) => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
    }))
    setPatientSearch("")
  }

  const handleSave = async () => {
    setIsLoading(true)

    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setShowSuccess(true)

    // Redirigir después de 2 segundos
    setTimeout(() => {
      router.push("/dashboard/appointments")
    }, 2000)
  }

  const isFormValid = () => {
    return (
      appointmentData.patientId &&
      appointmentData.date &&
      appointmentData.time &&
      appointmentData.type &&
      appointmentData.doctor
    )
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  if (showSuccess) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Cita Programada!</h2>
            <p className="text-muted-foreground mb-4">
              La cita para {appointmentData.patientName} ha sido programada exitosamente para el{" "}
              {new Date(appointmentData.date).toLocaleDateString("es-ES")} a las {appointmentData.time}.
            </p>
            <p className="text-sm text-muted-foreground">Redirigiendo a la agenda...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/appointments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Citas
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nueva Cita</h1>
            <p className="text-muted-foreground">Programa una nueva cita para un paciente</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid() || isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Programando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Programar Cita
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form Validation Alert */}
      {!isFormValid() && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            Complete todos los campos obligatorios: Paciente, Fecha, Hora, Tipo de cita y Doctor.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información de la Cita */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Información de la Cita</span>
            </CardTitle>
            <CardDescription>Complete los detalles de la cita a programar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selección de Paciente */}
            <div className="space-y-2">
              <Label htmlFor="patient">Paciente *</Label>
              {appointmentData.patientId ? (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{appointmentData.patientName}</span>
                    <span className="text-sm text-muted-foreground">({appointmentData.patientId})</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleInputChange("patientId", "")}>
                    Cambiar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar paciente por nombre, ID o teléfono..."
                      value={patientSearch}
                      onChange={(e) => setPatientSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {patientSearch && (
                    <div className="border rounded-lg max-h-40 overflow-y-auto">
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">
                                ID: {patient.id} • {patient.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredPatients.length === 0 && (
                        <div className="p-3 text-center text-muted-foreground">No se encontraron pacientes</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  min={getMinDate()}
                  value={appointmentData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora *</Label>
                <Select onValueChange={(value) => handleInputChange("time", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tipo de Cita */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Cita *</Label>
              <Select onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de cita" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Doctor */}
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor/Especialista *</Label>
              <Select onValueChange={(value) => handleInputChange("doctor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duración */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duración (minutos)</Label>
              <Select value={appointmentData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="90">1.5 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas y Observaciones</Label>
              <Textarea
                id="notes"
                value={appointmentData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Agregue cualquier nota o instrucción especial para la cita..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Resumen y Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span>Resumen de la Cita</span>
            </CardTitle>
            <CardDescription>Revise los detalles antes de confirmar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {appointmentData.patientId && (
              <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                <h4 className="font-medium">Detalles de la Cita</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paciente:</span>
                    <span className="font-medium">{appointmentData.patientName}</span>
                  </div>
                  {appointmentData.date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span className="font-medium">
                        {new Date(appointmentData.date).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {appointmentData.time && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hora:</span>
                      <span className="font-medium">{appointmentData.time}</span>
                    </div>
                  )}
                  {appointmentData.type && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <span className="font-medium">{appointmentData.type}</span>
                    </div>
                  )}
                  {appointmentData.doctor && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span className="font-medium">{appointmentData.doctor}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración:</span>
                    <span className="font-medium">{appointmentData.duration} minutos</span>
                  </div>
                </div>
              </div>
            )}

            {/* Configuración de Recordatorios */}
            <div className="space-y-4">
              <h4 className="font-medium">Configuración de Recordatorios</h4>
              <div className="space-y-2">
                <Label htmlFor="reminder">Enviar recordatorio</Label>
                <Select
                  value={appointmentData.reminder}
                  onValueChange={(value) => handleInputChange("reminder", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No enviar recordatorio</SelectItem>
                    <SelectItem value="2">2 horas antes</SelectItem>
                    <SelectItem value="24">24 horas antes</SelectItem>
                    <SelectItem value="48">48 horas antes</SelectItem>
                    <SelectItem value="168">1 semana antes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="space-y-4">
              <h4 className="font-medium">Acciones Adicionales</h4>
              <div className="space-y-2">
                <Link href="/dashboard/patients/new">
                  <Button variant="outline" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Crear Nuevo Paciente
                  </Button>
                </Link>
                {appointmentData.patientId && (
                  <Link href={`/dashboard/records/${appointmentData.patientId}`}>
                    <Button variant="outline" className="w-full">
                      Ver Expediente del Paciente
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
