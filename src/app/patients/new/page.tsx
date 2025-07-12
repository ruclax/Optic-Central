"use client"

import { useEffect, useState } from "react"
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
import { useAuth } from "@/providers/auth-provider"
import { usePatients } from "@/providers/patients-provider"
import { toast } from "@/hooks/use-toast"

interface NewPatientPageProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function NewPatientPage({ onSuccess, onCancel }: NewPatientPageProps) {
  const { user } = useAuth();
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  const router = useRouter()
  const { createItem, loading } = usePatients()
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeStep, setActiveStep] = useState<StepKey>("personal")
  const stepLabels = {
    personal: "Datos Personales",
    medical: "Historial Médico",
    optical: "Datos Ópticos",
    notes: "Observaciones"
  }
  type StepKey = keyof typeof stepLabels
  const stepOrder: StepKey[] = ["personal", "medical", "optical", "notes"]
  const [patientData, setPatientData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    prefijo: "",
    sexo: "",
    edad: 0,
    ocupacion: "",
    otras_actividades: ""
  })

  const handleInputChange = (field: string, value: string | number) => {
    // Validar solo números en teléfono y limitar a 10 dígitos, aplicar formato visual XXX-XXX-XXXX
    if (field === "telefono") {
      let soloNumeros = String(value).replace(/[^0-9]/g, "");
      if (soloNumeros.length > 10) soloNumeros = soloNumeros.slice(0, 10);
      // Formato visual: XXX-XXX-XXXX
      let formatted = soloNumeros;
      if (soloNumeros.length > 3) {
        formatted = soloNumeros.slice(0, 3) + "-" + soloNumeros.slice(3);
      }
      if (soloNumeros.length > 6) {
        formatted = soloNumeros.slice(0, 3) + "-" + soloNumeros.slice(3, 6) + "-" + soloNumeros.slice(6);
      }
      setPatientData((prev) => ({
        ...prev,
        telefono: formatted,
      }))
      return;
    }
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const goToStep = (direction: "next" | "prev") => {
    const idx = stepOrder.indexOf(activeStep)
    if (direction === "next" && idx < stepOrder.length - 1) setActiveStep(stepOrder[idx + 1])
    if (direction === "prev" && idx > 0) setActiveStep(stepOrder[idx - 1])
  }

  const handleSave = async () => {
    const telefonoNumerico = patientData.telefono.replace(/[^0-9]/g, "");
    const payload = {
      nombre: patientData.nombre,
      email: patientData.email,
      telefono: telefonoNumerico,
      prefijo: patientData.prefijo?.trim() ? patientData.prefijo : undefined,
      sexo: patientData.sexo,
      edad: Number(patientData.edad),
      ocupacion: patientData.ocupacion?.trim() ? patientData.ocupacion : "Sin definir",
      otras_actividades: patientData.otras_actividades?.trim() ? patientData.otras_actividades : "Sin definir"
    }
    const newPatient = await createItem(payload)
    if (newPatient) {
      setShowSuccess(true)
      toast({
        title: "Paciente creado",
        description: `El expediente de ${patientData.nombre} ha sido creado exitosamente.`
      })
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          router.push("/patients")
        }, 2000)
      }
    } else {
      toast({
        title: "Error",
        description: "No se pudo crear el paciente. Intente nuevamente.",
        variant: "destructive"
      })
    }
  }

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  const isFormValid = () => {
    // Teléfono: solo números y 10 dígitos
    const telefonoValido = /^[0-9]{10}$/.test(patientData.telefono);
    return patientData.nombre && patientData.sexo && telefonoValido && patientData.email && isEmailValid(patientData.email);
  }

  if (showSuccess) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">¡Paciente Creado!</h2>
            <p className="text-muted-foreground mb-4">
              El expediente de {patientData.nombre} ha sido creado exitosamente.
            </p>
            <p className="text-sm text-muted-foreground">Redirigiendo a la lista de pacientes...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onCancel ? onCancel : () => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Regresar
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Nuevo Paciente</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Complete la información para crear un nuevo expediente</p>
          </div>
        </div>
      </div>

      {/* Form Validation Alert */}
      {!isFormValid() && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Complete los campos obligatorios: Nombre, Teléfono y Correo electrónico válido.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input id="nombre" name="nombre" value={patientData.nombre} onChange={e => handleInputChange("nombre", e.target.value)} required />
            </div>
            {/* Prefijo y Teléfono juntos */}
            <div className="flex gap-2 items-end">
              <div>
                <Label htmlFor="prefijo">Prefijo</Label>
                <Select
                  value={patientData.prefijo}
                  onValueChange={v => handleInputChange("prefijo", v)}
                >
                  <SelectTrigger id="prefijo" name="prefijo" className="w-28">
                    <SelectValue placeholder="+52" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+52">México (+52)</SelectItem>
                    <SelectItem value="+1">EE.UU. (+1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={patientData.telefono}
                  onChange={e => handleInputChange("telefono", e.target.value)}
                  required
                  maxLength={12}
                  placeholder="Ejemplo: 123-456-7890"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  inputMode="numeric"
                  autoComplete="tel"
                  className="placeholder:text-gray-300"
                />
              </div>
            </div>
            {/* Email */}
            <div>
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input id="email" name="email" type="email" value={patientData.email} onChange={e => handleInputChange("email", e.target.value)} required />
            </div>
            {/* Sexo */}
            <div>
              <Label htmlFor="sexo">Sexo</Label>
              <Select value={patientData.sexo} onValueChange={v => handleInputChange("sexo", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                  <SelectItem value="O">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Edad */}
            <div>
              <Label htmlFor="edad">Edad</Label>
              <Input id="edad" name="edad" type="number" value={patientData.edad} onChange={e => handleInputChange("edad", e.target.value)} />
            </div>
            {/* Ocupación */}
            <div className="md:col-span-2">
              <Label htmlFor="ocupacion">Ocupación</Label>
              <Input id="ocupacion" name="ocupacion" value={patientData.ocupacion} onChange={e => handleInputChange("ocupacion", e.target.value)} />
            </div>
            {/* Otras actividades */}
            <div className="md:col-span-2">
              <Label htmlFor="otras_actividades">Otras actividades</Label>
              <Input id="otras_actividades" name="otras_actividades" value={patientData.otras_actividades} onChange={e => handleInputChange("otras_actividades", e.target.value)} />
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-4">
            <Button variant="outline" onClick={onCancel ? onCancel : () => router.back()} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!isFormValid() || loading} className="bg-primary text-primary-foreground">
              {loading ? (
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
        </CardContent>
      </Card>
    </div>
  )
}
