"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/providers/auth-provider"
import { supabase } from "@/lib/supabase"
import { CheckCircle } from "lucide-react"

interface PatientFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function PatientForm({ onSuccess, onCancel }: PatientFormProps) {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [patientData, setPatientData] = useState({
        full_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        address: "",
        emergency_contact: "",
        emergency_phone: "",
        medical_history: "",
        insurance_info: "",
        active: true,
        notes: ""
    })

    interface PatientData {
        full_name: string;
        email: string;
        phone: string;
        date_of_birth: string;
        address: string;
        emergency_contact: string;
        emergency_phone: string;
        medical_history: string;
        insurance_info: string;
        active: boolean;
        notes: string;
    }

    type PatientDataField = keyof PatientData;

    const handleInputChange = (field: PatientDataField, value: string | boolean) => {
        setPatientData((prev: PatientData) => ({ ...prev, [field]: value }));
    }

    const handleSave = async () => {
        setIsLoading(true)
        const payload = {
            ...patientData,
            created_by: user?.id
        }
        // Guardar en Supabase
        const { error } = await supabase.from("patients").insert([payload])
        setIsLoading(false)
        if (!error) {
            setShowSuccess(true)
            onSuccess && onSuccess()
        }
    }

    return (
        <Card className="bg-background text-foreground border border-border shadow-md max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-heading">Nuevo Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Nombre completo</Label>
                        <Input className="bg-card text-card-foreground border border-border" value={patientData.full_name} onChange={e => handleInputChange("full_name", e.target.value)} required />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input className="bg-card text-card-foreground border border-border" value={patientData.email} onChange={e => handleInputChange("email", e.target.value)} type="email" />
                    </div>
                    <div>
                        <Label>Teléfono</Label>
                        <Input className="bg-card text-card-foreground border border-border" value={patientData.phone} onChange={e => handleInputChange("phone", e.target.value)} />
                    </div>
                    <div>
                        <Label>Fecha de nacimiento</Label>
                        <Input className="bg-card text-card-foreground border border-border" value={patientData.date_of_birth} onChange={e => handleInputChange("date_of_birth", e.target.value)} type="date" />
                    </div>
                    <div className="md:col-span-2">
                        <Label>Dirección</Label>
                        <Input className="bg-card text-card-foreground border border-border" value={patientData.address} onChange={e => handleInputChange("address", e.target.value)} />
                    </div>
                    <div>
                        <Label>Contacto de emergencia</Label>
                        <Input className="bg-card text-card-foreground border border-border" value={patientData.emergency_contact} onChange={e => handleInputChange("emergency_contact", e.target.value)} />
                    </div>
                    <div>
                        <Label>Teléfono de emergencia</Label>
                        <Input className="bg-card text-card-foreground border border-border" value={patientData.emergency_phone} onChange={e => handleInputChange("emergency_phone", e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <Label>Historial médico</Label>
                        <Textarea className="bg-card text-card-foreground border border-border" value={patientData.medical_history} onChange={e => handleInputChange("medical_history", e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <Label>Información de seguro (JSON)</Label>
                        <Textarea className="bg-card text-card-foreground border border-border" value={patientData.insurance_info} onChange={e => handleInputChange("insurance_info", e.target.value)} placeholder='{"compañía": "", "número": ""}' />
                    </div>
                    <div className="md:col-span-2">
                        <Label>Notas</Label>
                        <Textarea className="bg-card text-card-foreground border border-border" value={patientData.notes} onChange={e => handleInputChange("notes", e.target.value)} />
                    </div>
                    <div>
                        <Label>Activo</Label>
                        <Select value={patientData.active ? "true" : "false"} onValueChange={v => handleInputChange("active", v === "true")}>
                            <SelectTrigger className="bg-card text-card-foreground border border-border"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-popover text-popover-foreground">
                                <SelectItem value="true">Sí</SelectItem>
                                <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onCancel} className="bg-background text-foreground border border-border">Cancelar</Button>
                    <Button onClick={handleSave} disabled={isLoading} className="bg-primary text-primary-foreground">Guardar</Button>
                </div>
                {showSuccess && (
                    <Alert className="mt-4 bg-accent text-accent-foreground border border-border">
                        {/* Asegúrate de que CheckCircle use color adaptativo */}
                        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                        <AlertDescription>Paciente creado correctamente.</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}
