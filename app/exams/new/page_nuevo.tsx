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

    // Handlers
    const handleInputChange = (field: string, value: any) => {
        setExamData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        // Validaciones básicas
        if (!examData.patient_id) {
            toast({
                title: "Error",
                description: "Debe seleccionar un paciente",
                variant: "destructive"
            })
            return
        }

        // Mapear datos para crear el examen
        const payload = {
            patient_id: examData.patient_id,
            doctor_id: user?.id,
            exam_date: examData.exam_date,
            exam_type: examData.exam_type,
            status: examData.status,
            visual_acuity_right: examData.visual_acuity_right,
            visual_acuity_left: examData.visual_acuity_left,
            right_eye_sphere: examData.right_eye_sphere,
            right_eye_cylinder: examData.right_eye_cylinder,
            right_eye_axis: examData.right_eye_axis,
            right_eye_add: examData.right_eye_add,
            left_eye_sphere: examData.left_eye_sphere,
            left_eye_cylinder: examData.left_eye_cylinder,
            left_eye_axis: examData.left_eye_axis,
            left_eye_add: examData.left_eye_add,
            pupillary_distance: examData.pupillary_distance,
            intraocular_pressure_right: examData.intraocular_pressure_right,
            intraocular_pressure_left: examData.intraocular_pressure_left,
            findings: examData.findings,
            diagnosis: examData.diagnosis,
            recommendations: examData.recommendations,
            notes: examData.notes,
            files_urls: examData.files_urls,
            next_appointment_date: examData.next_appointment_date || null,
            created_by_profile_id: user?.id
        }

        const result = await createItem(payload)
        if (result) {
            setShowSuccess(true)
            toast({
                title: "Examen creado",
                description: "El examen ha sido registrado correctamente"
            })
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess()
                }, 1500)
            }
        } else {
            toast({
                title: "Error",
                description: "No se pudo crear el examen",
                variant: "destructive"
            })
        }
    }

    return (
        <Card className="bg-background text-foreground border border-border shadow-md max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading">
                    <Stethoscope className="h-5 w-5" />
                    Nuevo Examen
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {showSuccess && (
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <AlertDescription>Examen creado correctamente.</AlertDescription>
                    </Alert>
                )}

                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Paciente *</Label>
                        <Select value={examData.patient_id} onValueChange={v => handleInputChange("patient_id", v)}>
                            <SelectTrigger className="bg-card text-card-foreground border border-border">
                                <SelectValue placeholder="Seleccionar paciente" />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.map((patient) => (
                                    <SelectItem key={patient.id} value={patient.id}>
                                        {patient.first_name} {patient.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Fecha del Examen</Label>
                        <Input
                            className="bg-card text-card-foreground border border-border"
                            value={examData.exam_date}
                            onChange={e => handleInputChange("exam_date", e.target.value)}
                            type="date"
                        />
                    </div>
                    <div>
                        <Label>Tipo de Examen</Label>
                        <Select value={examData.exam_type} onValueChange={v => handleInputChange("exam_type", v)}>
                            <SelectTrigger className="bg-card text-card-foreground border border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Examen General">Examen General</SelectItem>
                                <SelectItem value="Revisión">Revisión</SelectItem>
                                <SelectItem value="Examen Inicial">Examen Inicial</SelectItem>
                                <SelectItem value="Control">Control</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Estado</Label>
                        <Select value={examData.status} onValueChange={v => handleInputChange("status", v)}>
                            <SelectTrigger className="bg-card text-card-foreground border border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="completed">Completado</SelectItem>
                                <SelectItem value="in_progress">En Proceso</SelectItem>
                                <SelectItem value="cancelled">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Refracción */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Refracción</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">Ojo Derecho</h4>
                            <div className="grid grid-cols-4 gap-2">
                                <div>
                                    <Label className="text-xs">Esfera</Label>
                                    <Input
                                        placeholder="±0.00"
                                        value={examData.right_eye_sphere}
                                        onChange={e => handleInputChange("right_eye_sphere", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Cilindro</Label>
                                    <Input
                                        placeholder="±0.00"
                                        value={examData.right_eye_cylinder}
                                        onChange={e => handleInputChange("right_eye_cylinder", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Eje</Label>
                                    <Input
                                        placeholder="0-180"
                                        value={examData.right_eye_axis}
                                        onChange={e => handleInputChange("right_eye_axis", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Add</Label>
                                    <Input
                                        placeholder="+0.00"
                                        value={examData.right_eye_add}
                                        onChange={e => handleInputChange("right_eye_add", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium">Ojo Izquierdo</h4>
                            <div className="grid grid-cols-4 gap-2">
                                <div>
                                    <Label className="text-xs">Esfera</Label>
                                    <Input
                                        placeholder="±0.00"
                                        value={examData.left_eye_sphere}
                                        onChange={e => handleInputChange("left_eye_sphere", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Cilindro</Label>
                                    <Input
                                        placeholder="±0.00"
                                        value={examData.left_eye_cylinder}
                                        onChange={e => handleInputChange("left_eye_cylinder", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Eje</Label>
                                    <Input
                                        placeholder="0-180"
                                        value={examData.left_eye_axis}
                                        onChange={e => handleInputChange("left_eye_axis", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs">Add</Label>
                                    <Input
                                        placeholder="+0.00"
                                        value={examData.left_eye_add}
                                        onChange={e => handleInputChange("left_eye_add", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Medidas adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label>Distancia Pupilar</Label>
                        <Input
                            placeholder="mm"
                            value={examData.pupillary_distance}
                            onChange={e => handleInputChange("pupillary_distance", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Presión Intraocular OD</Label>
                        <Input
                            placeholder="mmHg"
                            value={examData.intraocular_pressure_right}
                            onChange={e => handleInputChange("intraocular_pressure_right", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Presión Intraocular OI</Label>
                        <Input
                            placeholder="mmHg"
                            value={examData.intraocular_pressure_left}
                            onChange={e => handleInputChange("intraocular_pressure_left", e.target.value)}
                        />
                    </div>
                </div>

                {/* Observaciones */}
                <div className="space-y-4">
                    <div>
                        <Label>Hallazgos</Label>
                        <Textarea
                            placeholder="Describe los hallazgos del examen..."
                            value={examData.findings}
                            onChange={e => handleInputChange("findings", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Diagnóstico</Label>
                        <Textarea
                            placeholder="Diagnóstico principal..."
                            value={examData.diagnosis}
                            onChange={e => handleInputChange("diagnosis", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Recomendaciones</Label>
                        <Textarea
                            placeholder="Recomendaciones para el paciente..."
                            value={examData.recommendations}
                            onChange={e => handleInputChange("recommendations", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Notas Adicionales</Label>
                        <Textarea
                            placeholder="Notas adicionales..."
                            value={examData.notes}
                            onChange={e => handleInputChange("notes", e.target.value)}
                        />
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-2 pt-4">
                    {onCancel && (
                        <Button variant="outline" onClick={onCancel} disabled={loading}>
                            Cancelar
                        </Button>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={loading || !examData.patient_id}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Guardando...
                            </div>
                        ) : (
                            "Crear Examen"
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
