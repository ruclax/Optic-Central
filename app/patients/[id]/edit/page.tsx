"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"
import { usePatients } from "@/hooks/useSupabaseCRUD"
import { toast } from "@/hooks/use-toast"

export default function EditPatientPage() {
    const { user } = useAuth()
    const router = useRouter()
    const params = useParams()
    const { getItem, updateItem, loading } = usePatients()

    const [patient, setPatient] = useState({
        id: "",
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        address: "",
        date_of_birth: "",
        gender: "",
        emergency_contact: "",
        emergency_phone: "",
        allergies: "",
        medications: "",
        medical_history: "",
        right_eye_sphere: "",
        right_eye_cylinder: "",
        right_eye_axis: "",
        left_eye_sphere: "",
        left_eye_cylinder: "",
        left_eye_axis: "",
        pupillary_distance: "",
        notes: ""
    })

    // Fetch real de datos del paciente
    useEffect(() => {
        const fetchPatient = async () => {
            if (params.id) {
                const data = await getItem(params.id as string)
                if (data) {
                    setPatient(data)
                } else {
                    toast({
                        title: "Error",
                        description: "No se pudo cargar la información del paciente",
                        variant: "destructive"
                    })
                }
            }
        }
        fetchPatient()
    }, [params.id, getItem])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPatient({ ...patient, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        const updateData = {
            first_name: patient.first_name,
            last_name: patient.last_name,
            phone: patient.phone,
            email: patient.email,
            address: patient.address,
            date_of_birth: patient.date_of_birth,
            gender: patient.gender,
            emergency_contact: patient.emergency_contact,
            emergency_phone: patient.emergency_phone,
            allergies: patient.allergies,
            medications: patient.medications,
            medical_history: patient.medical_history,
            right_eye_sphere: patient.right_eye_sphere,
            right_eye_cylinder: patient.right_eye_cylinder,
            right_eye_axis: patient.right_eye_axis,
            left_eye_sphere: patient.left_eye_sphere,
            left_eye_cylinder: patient.left_eye_cylinder,
            left_eye_axis: patient.left_eye_axis,
            pupillary_distance: patient.pupillary_distance,
            notes: patient.notes
        }

        const success = await updateItem(params.id as string, updateData)
        if (success) {
            toast({
                title: "Paciente actualizado",
                description: "Los datos del paciente se han guardado correctamente"
            })
            router.push("/patients")
        } else {
            toast({
                title: "Error",
                description: "No se pudo actualizar el paciente",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-6 px-2 sm:px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl sm:text-3xl font-bold">Editar Paciente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Datos personales y contacto */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Datos Personales</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre</label>
                                <Input name="first_name" value={patient.first_name} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Apellidos</label>
                                <Input name="last_name" value={patient.last_name} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
                                <Input name="date_of_birth" type="date" value={patient.date_of_birth} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Género</label>
                                <Input name="gender" value={patient.gender} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Contacto</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Teléfono</label>
                                <Input name="phone" value={patient.phone} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <Input name="email" value={patient.email} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Dirección</label>
                                <Input name="address" value={patient.address} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Contacto de emergencia</label>
                                <Input name="emergency_contact" value={patient.emergency_contact} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Teléfono de emergencia</label>
                                <Input name="emergency_phone" value={patient.emergency_phone} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Historial Médico</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Alergias</label>
                                <Input name="allergies" value={patient.allergies} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Medicamentos</label>
                                <Input name="medications" value={patient.medications} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Historial médico</label>
                                <Input name="medical_history" value={patient.medical_history} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Datos Ópticos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Graduación OD (Esfera)</label>
                                <Input name="right_eye_sphere" value={patient.right_eye_sphere} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Graduación OD (Cilindro)</label>
                                <Input name="right_eye_cylinder" value={patient.right_eye_cylinder} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Graduación OD (Eje)</label>
                                <Input name="right_eye_axis" value={patient.right_eye_axis} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Graduación OI (Esfera)</label>
                                <Input name="left_eye_sphere" value={patient.left_eye_sphere} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Graduación OI (Cilindro)</label>
                                <Input name="left_eye_cylinder" value={patient.left_eye_cylinder} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Graduación OI (Eje)</label>
                                <Input name="left_eye_axis" value={patient.left_eye_axis} onChange={handleChange} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">Distancia Pupilar</label>
                                <Input name="pupillary_distance" value={patient.pupillary_distance} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Notas</h2>
                        <Input name="notes" value={patient.notes} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => router.back()} disabled={loading} className="w-full sm:w-auto">Cancelar</Button>
                        <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
