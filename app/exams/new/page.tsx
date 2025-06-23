"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, User, Search, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useIsAdmin, useHasRoleId } from "@/hooks/useRoles"
import { useAuth } from "@/providers/auth-provider"
import { createClient } from "@supabase/supabase-js"

// Datos de ejemplo de pacientes
const examTypes = [
  "Examen completo",
  "Examen de seguimiento",
  "Examen post-operatorio",
  "Examen de rutina",
  "Primera consulta",
  "Control de presión",
  "Examen especializado",
]

// Permitir que el formulario acepte onSuccess y onCancel como props
function NewExamPageContent({ onSuccess, onCancel }: { onSuccess?: () => void; onCancel?: () => void }) {
  const isAdmin = useIsAdmin()
  // IDs de roles desde variables de entorno o valores por defecto
  const DOCTOR_ROLE_ID = process.env.NEXT_PUBLIC_DOCTOR_ROLE_ID || "2"
  const OPTOMETRIST_ROLE_ID = process.env.NEXT_PUBLIC_OPTOMETRIST_ROLE_ID || "3"
  const isDoctor = useHasRoleId(DOCTOR_ROLE_ID)
  const isOptometrist = useHasRoleId(OPTOMETRIST_ROLE_ID)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPatient = searchParams.get("patient")

  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [patientSearch, setPatientSearch] = useState("")
  const [examData, setExamData] = useState({
    // Información básica
    patientId: preselectedPatient || "",
    patientName: "",
    date: new Date().toISOString().split("T")[0],
    type: "",
    doctor: "",

    // Resultados ojo derecho
    rightEyeSphere: "",
    rightEyeCylinder: "",
    rightEyeAxis: "",
    rightEyeVision: "",
    rightEyePressure: "",

    // Resultados ojo izquierdo
    leftEyeSphere: "",
    leftEyeCylinder: "",
    leftEyeAxis: "",
    leftEyeVision: "",
    leftEyePressure: "",

    // Otros datos
    pupillaryDistance: "",
    notes: "",
    recommendations: "",
    followUpDate: "",
  })

  const [patients, setPatients] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])

  useEffect(() => {
    const fetchPatients = async () => {
      const { data } = await supabase.from("patients").select("id, first_name, last_name, phone")
      if (data) setPatients(data)
    }
    const fetchDoctors = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, role:roles(name)")
      if (data) setDoctors(data.filter((d: any) => d.role && (d.role[0]?.name === "DOCTOR" || d.role[0]?.name === "OPTOMETRISTA")))
    }
    fetchPatients()
    fetchDoctors()
  }, [])

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.id.includes(patientSearch) ||
      (patient.phone || "").includes(patientSearch),
  )

  const handleInputChange = (field: string, value: string) => {
    setExamData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Cuando se selecciona un paciente, se asigna el nombre real
  const handlePatientSelect = (patient: any) => {
    setExamData((prev) => ({
      ...prev,
      patientId: patient.id,
      patientName: `${patient.first_name} ${patient.last_name}`,
    }))
    setPatientSearch("")
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Mapear campos del formulario a la tabla exams
    const payload: any = {
      patient_id: examData.patientId,
      date: examData.date,
      type: examData.type,
      doctor: examData.doctor,
      right_eye_sphere: examData.rightEyeSphere,
      right_eye_cylinder: examData.rightEyeCylinder,
      right_eye_axis: examData.rightEyeAxis,
      right_eye_vision: examData.rightEyeVision,
      right_eye_pressure: examData.rightEyePressure,
      left_eye_sphere: examData.leftEyeSphere,
      left_eye_cylinder: examData.leftEyeCylinder,
      left_eye_axis: examData.leftEyeAxis,
      left_eye_vision: examData.leftEyeVision,
      left_eye_pressure: examData.leftEyePressure,
      pupillary_distance: examData.pupillaryDistance,
      notes: examData.notes,
      recommendations: examData.recommendations,
      follow_up_date: examData.followUpDate,
      created_by_profile_id: user?.id,
    }
    const { error } = await supabase.from("exams").insert(payload)
    setIsLoading(false)
    if (!error) {
      setShowSuccess(true)
      setTimeout(() => {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/exams")
        }
      }, 2000)
    } else {
      alert("Error al registrar examen: " + error.message)
    }
  }

  // Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const isFormValid = () => {
    return examData.patientId && examData.type && examData.doctor
  }

  // Proteger acceso
  const canCreate = isAdmin || isDoctor || isOptometrist
  if (!canCreate) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-2">Acceso denegado</h2>
        <p className="text-muted-foreground">No tienes permisos para registrar exámenes.</p>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Examen Registrado!</h2>
            <p className="text-muted-foreground mb-4">
              El examen de {examData.patientName} ha sido registrado exitosamente.
            </p>
            <p className="text-sm text-muted-foreground">Redirigiendo a la lista de exámenes...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={e => { e.preventDefault(); if (isFormValid()) handleSave(); }} autoComplete="off" aria-modal="true" role="dialog">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Nuevo Examen</h1>
        {/* Eliminado botón Cancelar duplicado del header */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patientId">Paciente</Label>
          <Input id="patientId" autoFocus value={examData.patientId} onChange={e => handleInputChange("patientId", e.target.value)} required className="w-full" />
        </div>
        <div>
          <Label htmlFor="date">Fecha</Label>
          <Input id="date" type="date" value={examData.date} onChange={e => handleInputChange("date", e.target.value)} required className="w-full" />
        </div>
        <div>
          <Label htmlFor="type">Tipo de examen</Label>
          <Select value={examData.type} onValueChange={v => handleInputChange("type", v)}>
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="Selecciona tipo" />
            </SelectTrigger>
            <SelectContent>
              {examTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="doctor">Doctor</Label>
          <Input id="doctor" value={examData.doctor} onChange={e => handleInputChange("doctor", e.target.value)} required className="w-full" />
        </div>
        {/* Más campos aquí, siguiendo el mismo patrón, con etiquetas y feedback */}
        <div className="md:col-span-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea id="notes" value={examData.notes} onChange={e => handleInputChange("notes", e.target.value)} className="w-full" rows={2} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={() => onCancel ? onCancel() : router.push('/exams')}>Cancelar</Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]" disabled={isLoading || !isFormValid()}>
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  )
}

export default function NewExamPage(props: any) {
  return (
    <Suspense>
      <NewExamPageContent {...props} />
    </Suspense>
  )
}