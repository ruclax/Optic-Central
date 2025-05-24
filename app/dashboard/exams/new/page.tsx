"use client"

import { useState } from "react"
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

// Datos de ejemplo de pacientes
const patients = [
  { id: "001", name: "María González", phone: "555-0123", age: 45 },
  { id: "002", name: "Carlos Rodríguez", phone: "555-0124", age: 32 },
  { id: "003", name: "Ana Martínez", phone: "555-0125", age: 28 },
  { id: "004", name: "Luis Fernández", phone: "555-0126", age: 55 },
  { id: "005", name: "Carmen López", phone: "555-0127", age: 38 },
]

const examTypes = [
  "Examen completo",
  "Examen de seguimiento",
  "Examen post-operatorio",
  "Examen de rutina",
  "Primera consulta",
  "Control de presión",
  "Examen especializado",
]

const doctors = ["Dr. Ana Rodríguez", "Dr. Carlos Méndez", "Dr. María Fernández"]

export default function NewExamPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPatient = searchParams.get("patient")

  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [patientSearch, setPatientSearch] = useState("")
  const [examData, setExamData] = useState({
    // Información básica
    patientId: preselectedPatient || "",
    patientName: preselectedPatient ? patients.find((p) => p.id === preselectedPatient)?.name || "" : "",
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

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.id.includes(patientSearch) ||
      patient.phone.includes(patientSearch),
  )

  const handleInputChange = (field: string, value: string) => {
    setExamData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePatientSelect = (patient: (typeof patients)[0]) => {
    setExamData((prev) => ({
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
      router.push("/dashboard/exams")
    }, 2000)
  }

  const isFormValid = () => {
    return examData.patientId && examData.type && examData.doctor
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/exams">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Exámenes
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Examen de Vista</h1>
            <p className="text-muted-foreground">Registra los resultados del examen oftalmológico</p>
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
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Examen
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form Validation Alert */}
      {!isFormValid() && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Complete los campos obligatorios: Paciente, Tipo de examen y Doctor.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span>Examen Oftalmológico</span>
          </CardTitle>
          <CardDescription>Complete los resultados del examen de vista</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Información Básica</TabsTrigger>
              <TabsTrigger value="right">Ojo Derecho</TabsTrigger>
              <TabsTrigger value="left">Ojo Izquierdo</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              {/* Selección de Paciente */}
              <div className="space-y-2">
                <Label htmlFor="patient">Paciente *</Label>
                {examData.patientId ? (
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{examData.patientName}</span>
                      <span className="text-sm text-muted-foreground">({examData.patientId})</span>
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
                                  ID: {patient.id} • {patient.phone} • {patient.age} años
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha del Examen</Label>
                  <Input
                    id="date"
                    type="date"
                    value={examData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Examen *</Label>
                  <Select onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo de examen" />
                    </SelectTrigger>
                    <SelectContent>
                      {examTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor *</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="followUpDate">Próximo Control</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={examData.followUpDate}
                    onChange={(e) => handleInputChange("followUpDate", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="right" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ojo Derecho (OD)</CardTitle>
                  <CardDescription>Registre los valores del ojo derecho</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rightEyeSphere">Esfera</Label>
                      <Input
                        id="rightEyeSphere"
                        value={examData.rightEyeSphere}
                        onChange={(e) => handleInputChange("rightEyeSphere", e.target.value)}
                        placeholder="ej: -2.50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rightEyeCylinder">Cilindro</Label>
                      <Input
                        id="rightEyeCylinder"
                        value={examData.rightEyeCylinder}
                        onChange={(e) => handleInputChange("rightEyeCylinder", e.target.value)}
                        placeholder="ej: -1.25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rightEyeAxis">Eje</Label>
                      <Input
                        id="rightEyeAxis"
                        value={examData.rightEyeAxis}
                        onChange={(e) => handleInputChange("rightEyeAxis", e.target.value)}
                        placeholder="ej: 180"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rightEyeVision">Agudeza Visual</Label>
                      <Select onValueChange={(value) => handleInputChange("rightEyeVision", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20/20">20/20</SelectItem>
                          <SelectItem value="20/25">20/25</SelectItem>
                          <SelectItem value="20/30">20/30</SelectItem>
                          <SelectItem value="20/40">20/40</SelectItem>
                          <SelectItem value="20/50">20/50</SelectItem>
                          <SelectItem value="20/60">20/60</SelectItem>
                          <SelectItem value="20/70">20/70</SelectItem>
                          <SelectItem value="20/80">20/80</SelectItem>
                          <SelectItem value="20/100">20/100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rightEyePressure">Presión Intraocular (mmHg)</Label>
                      <Input
                        id="rightEyePressure"
                        value={examData.rightEyePressure}
                        onChange={(e) => handleInputChange("rightEyePressure", e.target.value)}
                        placeholder="ej: 14"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="left" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ojo Izquierdo (OI)</CardTitle>
                  <CardDescription>Registre los valores del ojo izquierdo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="leftEyeSphere">Esfera</Label>
                      <Input
                        id="leftEyeSphere"
                        value={examData.leftEyeSphere}
                        onChange={(e) => handleInputChange("leftEyeSphere", e.target.value)}
                        placeholder="ej: -2.25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leftEyeCylinder">Cilindro</Label>
                      <Input
                        id="leftEyeCylinder"
                        value={examData.leftEyeCylinder}
                        onChange={(e) => handleInputChange("leftEyeCylinder", e.target.value)}
                        placeholder="ej: -1.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leftEyeAxis">Eje</Label>
                      <Input
                        id="leftEyeAxis"
                        value={examData.leftEyeAxis}
                        onChange={(e) => handleInputChange("leftEyeAxis", e.target.value)}
                        placeholder="ej: 175"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="leftEyeVision">Agudeza Visual</Label>
                      <Select onValueChange={(value) => handleInputChange("leftEyeVision", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20/20">20/20</SelectItem>
                          <SelectItem value="20/25">20/25</SelectItem>
                          <SelectItem value="20/30">20/30</SelectItem>
                          <SelectItem value="20/40">20/40</SelectItem>
                          <SelectItem value="20/50">20/50</SelectItem>
                          <SelectItem value="20/60">20/60</SelectItem>
                          <SelectItem value="20/70">20/70</SelectItem>
                          <SelectItem value="20/80">20/80</SelectItem>
                          <SelectItem value="20/100">20/100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leftEyePressure">Presión Intraocular (mmHg)</Label>
                      <Input
                        id="leftEyePressure"
                        value={examData.leftEyePressure}
                        onChange={(e) => handleInputChange("leftEyePressure", e.target.value)}
                        placeholder="ej: 15"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pupillaryDistance">Distancia Pupilar (DP)</Label>
                    <Input
                      id="pupillaryDistance"
                      value={examData.pupillaryDistance}
                      onChange={(e) => handleInputChange("pupillaryDistance", e.target.value)}
                      placeholder="ej: 62 mm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Observaciones del Examen</Label>
                    <Textarea
                      id="notes"
                      value={examData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Observaciones durante el examen, hallazgos especiales, etc."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recommendations">Recomendaciones</Label>
                    <Textarea
                      id="recommendations"
                      value={examData.recommendations}
                      onChange={(e) => handleInputChange("recommendations", e.target.value)}
                      placeholder="Recomendaciones para el paciente, tratamientos sugeridos, etc."
                      rows={4}
                    />
                  </div>

                  {/* Resumen de Resultados */}
                  {(examData.rightEyeSphere || examData.leftEyeSphere) && (
                    <Card className="bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-base">Resumen de Prescripción</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {examData.rightEyeSphere && (
                            <div>
                              <span className="font-medium">OD:</span> {examData.rightEyeSphere}
                              {examData.rightEyeCylinder && ` / ${examData.rightEyeCylinder}`}
                              {examData.rightEyeAxis && ` x ${examData.rightEyeAxis}°`}
                              {examData.rightEyeVision && ` (${examData.rightEyeVision})`}
                            </div>
                          )}
                          {examData.leftEyeSphere && (
                            <div>
                              <span className="font-medium">OI:</span> {examData.leftEyeSphere}
                              {examData.leftEyeCylinder && ` / ${examData.leftEyeCylinder}`}
                              {examData.leftEyeAxis && ` x ${examData.leftEyeAxis}°`}
                              {examData.leftEyeVision && ` (${examData.leftEyeVision})`}
                            </div>
                          )}
                          {examData.pupillaryDistance && (
                            <div>
                              <span className="font-medium">DP:</span> {examData.pupillaryDistance}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
