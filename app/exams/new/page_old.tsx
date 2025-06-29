"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/providers/auth-provider"
import { CheckCircle, Stethoscope } from "lucide-react"
import { useExams, usePatients } from "@/hooks/useSupabaseCRUD"
import { toast } from "@/hooks/use-toast"

type NewExamFormProps = {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function NewExamForm({ onSuccess, onCancel }: NewExamFormProps) {
  const { user } = useAuth()
  const { createItem, loading } = useExams()
  const { data: patients } = usePatients()
  const [showSuccess, setShowSuccess] = useState(false)
  const [examData, setExamData] = useState({
    // Información básica
    patient_id: "",
    exam_date: new Date().toISOString().split('T')[0],
    exam_type: "Examen General",
    status: "pending",
    
    // Agudeza visual
    visual_acuity_right: "",
    visual_acuity_left: "",
    
    // Refracción ojo derecho
    right_eye_sphere: "",
    right_eye_cylinder: "",
    right_eye_axis: "",
    right_eye_add: "",
    
    // Refracción ojo izquierdo
    left_eye_sphere: "",
    left_eye_cylinder: "",
    left_eye_axis: "",
    left_eye_add: "",
    
    // Medidas adicionales
    pupillary_distance: "",
    intraocular_pressure_right: "",
    intraocular_pressure_left: "",
    
    // Observaciones
    findings: "",
    diagnosis: "",
    recommendations: "",
    notes: "",
    
    // Archivos
    files_urls: "",
    
    // Próxima cita
    next_appointment_date: ""
  })

  const tabOrder = ["basic", "medical", "exam"]
  const tabLabels: Record<string, string> = {
    basic: "Datos Básicos",
    medical: "Información Médica General",
    exam: "Datos del Examen",
  }

  // Función para avanzar o retroceder de tab
  const goToTab = (direction: "next" | "prev") => {
    const idx = tabOrder.indexOf(activeTab)
    if (direction === "next" && idx < tabOrder.length - 1) setActiveTab(tabOrder[idx + 1])
    if (direction === "prev" && idx > 0) setActiveTab(tabOrder[idx - 1])
  }

  return (
    <Card className="bg-background text-foreground border border-border shadow-md w-full max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="font-heading">Nuevo Examen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Paciente</Label>
            <Select value={formValues.patient_id} onValueChange={v => handleInputChange("patient_id", v)}>
              <SelectTrigger className="bg-card text-card-foreground border border-border"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Doctor</Label>
            <Select value={formValues.doctor_id} onValueChange={v => handleInputChange("doctor_id", v)}>
              <SelectTrigger className="bg-card text-card-foreground border border-border"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                {doctors.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Fecha</Label>
            <Input className="bg-card text-card-foreground border border-border" value={formValues.exam_date} onChange={e => handleInputChange("exam_date", e.target.value)} type="date" />
          </div>
          <div>
            <Label>Estado</Label>
            <Select value={formValues.status} onValueChange={v => handleInputChange("status", v)}>
              <SelectTrigger className="bg-card text-card-foreground border border-border"><SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground">
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Archivos (URLs, separados por coma)</Label>
            <Input className="bg-card text-card-foreground border border-border" value={formValues.files_urls.join(",")} onChange={e => handleInputChange("files_urls", e.target.value.split(","))} />
          </div>
        </div>
        {/* Tabs para las secciones */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
          <TabsList className="mb-4 w-full flex justify-between">
            {tabOrder.map(tab => (
              <TabsTrigger key={tab} value={tab}>{tabLabels[tab]}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="basic">
            <PatientBasicInfoSection editable={canEditBasicInfo} values={formValues.basic} onChange={handleSectionChange("basic")} />
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => goToTab("next")} className="bg-primary text-primary-foreground">
                Siguiente
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="medical">
            <MedicalGeneralInfoSection editable={canEditMedicalInfo} values={formValues.medical} onChange={handleSectionChange("medical")} />
            <div className="flex justify-between gap-2 mt-4">
              <Button variant="outline" onClick={() => goToTab("prev")} className="bg-background text-foreground border border-border">
                Anterior
              </Button>
              <Button onClick={() => goToTab("next")} className="bg-primary text-primary-foreground">
                Siguiente
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="exam">
            <ExamDataSection editable={canEditExamData} values={formValues.exam} onChange={handleSectionChange("exam")} />
            <div className="flex justify-between gap-2 mt-4">
              <Button variant="outline" onClick={() => goToTab("prev")} className="bg-background text-foreground border border-border">
                Anterior
              </Button>
              <Button onClick={handleSave} disabled={isLoading} className="bg-primary text-primary-foreground">
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        {showSuccess && (
          <Alert className="mt-4 bg-accent text-accent-foreground border border-border">
            <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            <AlertDescription>Examen creado correctamente.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export function NewExamPage(props: any) {
  return (
    <Suspense>
      <NewExamForm {...props} />
    </Suspense>
  )
}