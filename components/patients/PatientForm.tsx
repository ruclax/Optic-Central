"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, User, Eye, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useIsAdmin, useHasRoleId } from "@/hooks/useRoles"
import { useAuth } from "@/providers/auth-provider"
import { createClient } from "@supabase/supabase-js"

export default function PatientForm({ onSuccess, onCancel }: { onSuccess?: () => void, onCancel?: () => void }) {
    const isAdmin = useIsAdmin()
    const DOCTOR_ROLE_ID = process.env.NEXT_PUBLIC_DOCTOR_ROLE_ID || "2"
    const OPTOMETRIST_ROLE_ID = process.env.NEXT_PUBLIC_OPTOMETRIST_ROLE_ID || "3"
    const RECEPTIONIST_ROLE_ID = process.env.NEXT_PUBLIC_RECEPTIONIST_ROLE_ID || "4"
    const isDoctor = useHasRoleId(DOCTOR_ROLE_ID)
    const isOptometrist = useHasRoleId(OPTOMETRIST_ROLE_ID)
    const isReceptionist = useHasRoleId(RECEPTIONIST_ROLE_ID)
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [patientData, setPatientData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
        emergencyContact: "",
        emergencyPhone: "",
        allergies: "",
        medications: "",
        medicalHistory: "",
        rightEyeSphere: "",
        rightEyeCylinder: "",
        rightEyeAxis: "",
        leftEyeSphere: "",
        leftEyeCylinder: "",
        leftEyeAxis: "",
        pupillaryDistance: "",
        notes: "",
    })

    const handleInputChange = (field: string, value: string) => {
        setPatientData((prev) => ({ ...prev, [field]: value }))
    }

    const canCreate = isAdmin || isDoctor || isOptometrist || isReceptionist
    if (!canCreate) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold mb-2">Acceso denegado</h2>
                <p className="text-muted-foreground">No tienes permisos para registrar pacientes.</p>
            </div>
        )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const handleSave = async () => {
        setIsLoading(true)
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
                if (onSuccess) onSuccess()
            }, 1500)
        } else {
            alert("Error al registrar paciente: " + error.message)
        }
    }

    const isFormValid = () => {
        return patientData.firstName && patientData.lastName && patientData.phone && patientData.birthDate
    }

    if (showSuccess) {
        return (
            <div className="min-h-[300px] flex items-center justify-center">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="pt-6">
                        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">¡Paciente Creado!</h2>
                        <p className="text-muted-foreground mb-4">
                            El expediente de {patientData.firstName} {patientData.lastName} ha sido creado exitosamente.
                        </p>
                        <p className="text-sm text-muted-foreground">Redirigiendo...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); if (isFormValid()) handleSave(); }} autoComplete="off">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">Nuevo Paciente</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" autoFocus value={patientData.firstName} onChange={e => handleInputChange("firstName", e.target.value)} required className="w-full" />
                </div>
                <div>
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" value={patientData.lastName} onChange={e => handleInputChange("lastName", e.target.value)} required className="w-full" />
                </div>
                <div>
                    <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                    <Input id="birthDate" type="date" value={patientData.birthDate} onChange={e => handleInputChange("birthDate", e.target.value)} required className="w-full" />
                </div>
                <div>
                    <Label htmlFor="gender">Género</Label>
                    <Select value={patientData.gender} onValueChange={v => handleInputChange("gender", v)}>
                        <SelectTrigger id="gender" className="w-full">
                            <SelectValue placeholder="Selecciona género" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Femenino">Femenino</SelectItem>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" value={patientData.phone} onChange={e => handleInputChange("phone", e.target.value)} required className="w-full" />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={patientData.email} onChange={e => handleInputChange("email", e.target.value)} className="w-full" />
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" value={patientData.address} onChange={e => handleInputChange("address", e.target.value)} className="w-full" />
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="medicalHistory">Historial médico</Label>
                    <Textarea id="medicalHistory" value={patientData.medicalHistory} onChange={e => handleInputChange("medicalHistory", e.target.value)} className="w-full" rows={2} />
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea id="notes" value={patientData.notes} onChange={e => handleInputChange("notes", e.target.value)} className="w-full" rows={2} />
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                )}
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]" disabled={isLoading || !isFormValid()}>
                    {isLoading ? "Guardando..." : "Guardar"}
                </Button>
            </div>
        </form>
    )
}
