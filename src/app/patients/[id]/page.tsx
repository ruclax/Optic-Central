"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePatientsApi } from "@/hooks/usePatientsApi"
import { AuthGuard } from "@/components/AuthGuard"
import { toast } from "@/hooks/use-toast"

export default function PatientDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { getById, loading } = usePatientsApi()
    const [patient, setPatient] = useState<any>(null)

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

    if (loading || !patient) {
        return (
            <AuthGuard>
                <div className="max-w-2xl mx-auto mt-10 text-center text-lg text-gray-500">Cargando datos del paciente...</div>
            </AuthGuard>
        )
    }

    return (
        <AuthGuard>
            <div className="max-w-3xl mx-auto mt-6 px-2 sm:px-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl sm:text-3xl font-bold">Detalle del Paciente</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Datos Personales</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-sm font-medium mb-1">Nombre</span>
                                    <div className="p-2 border rounded bg-gray-50">{patient.nombre}</div>
                                </div>
                                <div>
                                    <span className="block text-sm font-medium mb-1">Sexo</span>
                                    <div className="p-2 border rounded bg-gray-50">{patient.sexo}</div>
                                </div>
                                <div>
                                    <span className="block text-sm font-medium mb-1">Edad</span>
                                    <div className="p-2 border rounded bg-gray-50">{patient.edad}</div>
                                </div>
                                <div>
                                    <span className="block text-sm font-medium mb-1">Teléfono</span>
                                    <div className="p-2 border rounded bg-gray-50">{patient.telefono}</div>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="block text-sm font-medium mb-1">Dirección</span>
                                    <div className="p-2 border rounded bg-gray-50">{patient.direccion}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Información Adicional</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-sm font-medium mb-1">Ocupación</span>
                                    <div className="p-2 border rounded bg-gray-50">{patient.ocupacion}</div>
                                </div>
                                <div>
                                    <span className="block text-sm font-medium mb-1">Otras actividades</span>
                                    <div className="p-2 border rounded bg-gray-50">{patient.otras_actividades}</div>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="block text-sm font-medium mb-1">Motivo de consulta</span>
                                    <div className="p-2 border rounded bg-gray-50">{patient.motivo_consulta}</div>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="block text-sm font-medium mb-1">Fecha de registro</span>
                                    <div className="p-2 border rounded bg-gray-50">{patient.fecha_registro}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">Volver</Button>
                            <Button onClick={() => router.push(`/patients/${patient.id}/edit`)} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">Editar</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthGuard>
    )
}
