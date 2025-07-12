"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useExamsContext } from "@/providers/exams-provider"
import { usePatients } from "@/providers/patients-provider"
import { ArrowLeft, Edit, Stethoscope, User, Calendar, Eye, Download } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"

export default function ExamDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { getById } = useExamsContext()
    const { getById: getPatientById } = usePatients()
    const { user } = useAuth();
    const [exam, setExam] = useState<any>(null)
    const [patient, setPatient] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadExamData = async () => {
            if (params.id) {
                const examData = await getById(params.id as string)
                if (examData) {
                    setExam(examData)
                    // Cargar datos del paciente
                    if (examData.patient_id) {
                        const patientData = await getPatientById(examData.patient_id)
                        setPatient(patientData)
                    }
                }
                setLoading(false)
            }
        }

        loadExamData()
    }, [params.id, getById, getPatientById])

    useEffect(() => {
        if (!user) {
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
    }, [user]);

    const getStatusBadge = (status: string) => {
        const variants = {
            completed: { variant: "default", label: "Completado", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
            pending: { variant: "secondary", label: "Pendiente", className: "bg-amber-100 text-amber-700 border-amber-200" },
            in_progress: { variant: "outline", label: "En Proceso", className: "bg-purple-100 text-purple-700 border-purple-200" },
            cancelled: { variant: "outline", label: "Cancelado", className: "bg-gray-100 text-gray-700 border-gray-200" }
        }

        const config = variants[status as keyof typeof variants] || variants.pending
        return (
            <Badge variant={config.variant as any} className={config.className}>
                {config.label}
            </Badge>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p>Cargando examen...</p>
                </div>
            </div>
        )
    }

    if (!exam) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Examen no encontrado</h1>
                    <Link href="/exams">
                        <Button>Volver a Exámenes</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/exams">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Exámenes
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar PDF
                    </Button>
                    <Link href={`/exams/${exam.id}/edit`}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Información del Examen */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="h-5 w-5" />
                                Información del Examen
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tipo de Examen</label>
                                    <p className="font-medium">{exam.exam_type}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Estado</label>
                                    <div className="mt-1">
                                        {getStatusBadge(exam.status)}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Fecha del Examen</label>
                                    <p className="font-medium">{new Date(exam.exam_date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Doctor</label>
                                    <p className="font-medium">{exam.doctor_id || 'No asignado'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Refracción */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Refracción
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium mb-3">Ojo Derecho</h4>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Esfera</label>
                                            <p className="font-mono">{exam.right_eye_sphere || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Cilindro</label>
                                            <p className="font-mono">{exam.right_eye_cylinder || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Eje</label>
                                            <p className="font-mono">{exam.right_eye_axis || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Add</label>
                                            <p className="font-mono">{exam.right_eye_add || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-3">Ojo Izquierdo</h4>
                                    <div className="grid grid-cols-4 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Esfera</label>
                                            <p className="font-mono">{exam.left_eye_sphere || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Cilindro</label>
                                            <p className="font-mono">{exam.left_eye_cylinder || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Eje</label>
                                            <p className="font-mono">{exam.left_eye_axis || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">Add</label>
                                            <p className="font-mono">{exam.left_eye_add || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Distancia Pupilar</label>
                                    <p className="font-medium">{exam.pupillary_distance || '-'} mm</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Presión Intraocular OD</label>
                                    <p className="font-medium">{exam.intraocular_pressure_right || '-'} mmHg</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Presión Intraocular OI</label>
                                    <p className="font-medium">{exam.intraocular_pressure_left || '-'} mmHg</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resultados y Observaciones */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Resultados y Observaciones</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {exam.findings && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Hallazgos</label>
                                    <p className="mt-1 text-sm whitespace-pre-wrap">{exam.findings}</p>
                                </div>
                            )}

                            {exam.diagnosis && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Diagnóstico</label>
                                    <p className="mt-1 text-sm whitespace-pre-wrap">{exam.diagnosis}</p>
                                </div>
                            )}

                            {exam.recommendations && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Recomendaciones</label>
                                    <p className="mt-1 text-sm whitespace-pre-wrap">{exam.recommendations}</p>
                                </div>
                            )}

                            {exam.notes && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Notas Adicionales</label>
                                    <p className="mt-1 text-sm whitespace-pre-wrap">{exam.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Información del Paciente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Paciente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {patient ? (
                                <div className="space-y-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                                        <p className="font-medium">{patient.first_name} {patient.last_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                                        <p>{patient.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                                        <p>{patient.email}</p>
                                    </div>
                                    <div className="pt-2">
                                        <Link href={`/patients/${patient.id}`}>
                                            <Button variant="outline" size="sm" className="w-full">
                                                Ver Perfil Completo
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground">Información del paciente no disponible</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Metadatos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Información Adicional
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Creado</label>
                                <p className="text-sm">{new Date(exam.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Actualizado</label>
                                <p className="text-sm">{new Date(exam.updated_at).toLocaleString()}</p>
                            </div>
                            {exam.next_appointment_date && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Próxima Cita</label>
                                    <p className="text-sm">{new Date(exam.next_appointment_date).toLocaleDateString()}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
