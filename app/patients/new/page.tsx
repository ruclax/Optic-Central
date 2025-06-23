"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, User, Eye, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useIsAdmin, useHasRoleId } from "@/hooks/useRoles"
import { useAuth } from "@/providers/auth-provider"
import { createClient } from "@supabase/supabase-js"

export default function NewPatientPage() {
  const isAdmin = useIsAdmin()
  // IDs de roles desde variables de entorno o valores por defecto
  const DOCTOR_ROLE_ID = process.env.NEXT_PUBLIC_DOCTOR_ROLE_ID || "2"
  const OPTOMETRIST_ROLE_ID = process.env.NEXT_PUBLIC_OPTOMETRIST_ROLE_ID || "3"
  const RECEPTIONIST_ROLE_ID = process.env.NEXT_PUBLIC_RECEPTIONIST_ROLE_ID || "4"
  const isDoctor = useHasRoleId(DOCTOR_ROLE_ID)
  const isOptometrist = useHasRoleId(OPTOMETRIST_ROLE_ID)
  const isReceptionist = useHasRoleId(RECEPTIONIST_ROLE_ID)
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [patientData, setPatientData] = useState({
    // Datos personales
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",

    // Datos médicos
    allergies: "",
    medications: "",
    medicalHistory: "",

    // Datos ópticos
    rightEyeSphere: "",
    rightEyeCylinder: "",
    rightEyeAxis: "",
    leftEyeSphere: "",
    leftEyeCylinder: "",
    leftEyeAxis: "",
    pupillaryDistance: "",

    // Observaciones
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Proteger acceso
  const canCreate = isAdmin || isDoctor || isOptometrist || isReceptionist
  if (!canCreate) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-2">Acceso denegado</h2>
        <p className="text-muted-foreground">No tienes permisos para registrar pacientes.</p>
      </div>
    )
  }

  // Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const handleSave = async () => {
    setIsLoading(true)
    // Mapear campos del formulario a la tabla patients
    const payload: any = {
      first_name: patientData.firstName,
      last_name: patientData.lastName,
      phone: patientData.phone,
      email: patientData.email,
      address: patientData.address,
      date_of_birth: patientData.birthDate,
      gender: patientData.gender,
      created_by_profile_id: user?.id,
      medical_history: patientData.medicalHistory,
      notes: patientData.notes
    }
    const { error } = await supabase.from("patients").insert(payload)
    setIsLoading(false)
    if (!error) {
      setShowSuccess(true)
      setTimeout(() => {
        router.push("/patients")
      }, 2000)
    } else {
      alert("Error al registrar paciente: " + error.message)
    }
  }

  const isFormValid = () => {
    return patientData.firstName && patientData.lastName && patientData.phone && patientData.birthDate
  }

  if (showSuccess) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Paciente Creado!</h2>
            <p className="text-muted-foreground mb-4">
              El expediente de {patientData.firstName} {patientData.lastName} ha sido creado exitosamente.
            </p>
            <p className="text-sm text-muted-foreground">Redirigiendo a la lista de pacientes...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-2 sm:px-4 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/patients">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Pacientes
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Nuevo Paciente</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Complete la información para crear un nuevo expediente</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid() || isLoading} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Paciente
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form Validation Alert */}
      {!isFormValid() && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Complete los campos obligatorios: Nombre, Apellidos, Teléfono y Fecha de Nacimiento.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <span>Información del Paciente</span>
          </CardTitle>
          <CardDescription>Complete todos los campos necesarios para crear el expediente</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mb-4">
              <TabsTrigger value="personal" className="text-xs sm:text-sm py-2 sm:py-3">Datos Personales</TabsTrigger>
              <TabsTrigger value="medical" className="text-xs sm:text-sm py-2 sm:py-3">Historial Médico</TabsTrigger>
              <TabsTrigger value="optical" className="text-xs sm:text-sm py-2 sm:py-3">Datos Ópticos</TabsTrigger>
              <TabsTrigger value="notes" className="text-xs sm:text-sm py-2 sm:py-3">Observaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={patientData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Ingrese el nombre"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos *</Label>
                  <Input
                    id="lastName"
                    value={patientData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Ingrese los apellidos"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={patientData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    value={patientData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Número de teléfono"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={patientData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={patientData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Dirección completa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Contacto de Emergencia</Label>
                  <Input
                    id="emergencyContact"
                    value={patientData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Nombre del contacto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Teléfono de Emergencia</Label>
                  <Input
                    id="emergencyPhone"
                    value={patientData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    placeholder="Teléfono del contacto"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="space-y-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Alergias</Label>
                  <Textarea
                    id="allergies"
                    value={patientData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    placeholder="Describa cualquier alergia conocida"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medications">Medicamentos Actuales</Label>
                  <Textarea
                    id="medications"
                    value={patientData.medications}
                    onChange={(e) => handleInputChange("medications", e.target.value)}
                    placeholder="Liste los medicamentos que toma actualmente"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Historial Médico</Label>
                  <Textarea
                    id="medicalHistory"
                    value={patientData.medicalHistory}
                    onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                    placeholder="Historial médico relevante, cirugías previas, etc."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="optical" className="space-y-6">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-blue-600" />
                    Prescripción Óptica
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Ojo Derecho */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Ojo Derecho (OD)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="rightEyeSphere">Esfera</Label>
                          <Input
                            id="rightEyeSphere"
                            value={patientData.rightEyeSphere}
                            onChange={(e) => handleInputChange("rightEyeSphere", e.target.value)}
                            placeholder="ej: -2.50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rightEyeCylinder">Cilindro</Label>
                          <Input
                            id="rightEyeCylinder"
                            value={patientData.rightEyeCylinder}
                            onChange={(e) => handleInputChange("rightEyeCylinder", e.target.value)}
                            placeholder="ej: -1.25"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rightEyeAxis">Eje</Label>
                          <Input
                            id="rightEyeAxis"
                            value={patientData.rightEyeAxis}
                            onChange={(e) => handleInputChange("rightEyeAxis", e.target.value)}
                            placeholder="ej: 180"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Ojo Izquierdo */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Ojo Izquierdo (OI)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="leftEyeSphere">Esfera</Label>
                          <Input
                            id="leftEyeSphere"
                            value={patientData.leftEyeSphere}
                            onChange={(e) => handleInputChange("leftEyeSphere", e.target.value)}
                            placeholder="ej: -2.25"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="leftEyeCylinder">Cilindro</Label>
                          <Input
                            id="leftEyeCylinder"
                            value={patientData.leftEyeCylinder}
                            onChange={(e) => handleInputChange("leftEyeCylinder", e.target.value)}
                            placeholder="ej: -1.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="leftEyeAxis">Eje</Label>
                          <Input
                            id="leftEyeAxis"
                            value={patientData.leftEyeAxis}
                            onChange={(e) => handleInputChange("leftEyeAxis", e.target.value)}
                            placeholder="ej: 175"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-4 sm:mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="pupillaryDistance">Distancia Pupilar (DP)</Label>
                      <Input
                        id="pupillaryDistance"
                        value={patientData.pupillaryDistance}
                        onChange={(e) => handleInputChange("pupillaryDistance", e.target.value)}
                        placeholder="ej: 62 mm"
                        className="max-w-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="notes">Observaciones y Notas</Label>
                <Textarea
                  id="notes"
                  value={patientData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Agregue cualquier observación adicional sobre el paciente, preferencias, etc."
                  rows={6}
                  className="text-sm sm:text-base"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
