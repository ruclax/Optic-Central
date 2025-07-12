"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"
import { usePatientsApi } from "@/hooks/usePatientsApi"
import { toast } from "@/hooks/use-toast"
import { AuthGuard } from "@/components/AuthGuard"

export default function EditPatientPage() {
    const { user } = useAuth();
    const router = useRouter()
    const params = useParams()
    const { getById, update, loading } = usePatientsApi()

    const [patient, setPatient] = useState({
        id: 0,
        nombre: "",
        direccion: "",
        telefono: "",
        sexo: "",
        edad: 0,
        ocupacion: "",
        otras_actividades: "",
        motivo_consulta: "",
        fecha_registro: ""
    })

    // Fetch real de datos del paciente
    useEffect(() => {
        const fetchPatient = async () => {
            if (params.id) {
                const data = await getById(params.id as string)
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
    }, [params.id, getById])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPatient({ ...patient, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        const updateData = {
            nombre: patient.nombre,
            direccion: patient.direccion,
            telefono: patient.telefono,
            sexo: patient.sexo,
            edad: Number(patient.edad),
            ocupacion: patient.ocupacion,
            otras_actividades: patient.otras_actividades,
            motivo_consulta: patient.motivo_consulta
        }
        const success = await update(params.id as string, updateData)
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
        <AuthGuard>
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
                                    <Input name="nombre" value={patient.nombre} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Sexo</label>
                                    <Input name="sexo" value={patient.sexo} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Edad</label>
                                    <Input name="edad" type="number" value={patient.edad} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                                    <Input name="telefono" value={patient.telefono} onChange={handleChange} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Dirección</label>
                                    <Input name="direccion" value={patient.direccion} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Información Adicional</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Ocupación</label>
                                    <Input name="ocupacion" value={patient.ocupacion} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Otras actividades</label>
                                    <Input name="otras_actividades" value={patient.otras_actividades} onChange={handleChange} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Motivo de consulta</label>
                                    <Input name="motivo_consulta" value={patient.motivo_consulta} onChange={handleChange} />
                                </div>
                            </div>
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
        </AuthGuard>
    )
}
