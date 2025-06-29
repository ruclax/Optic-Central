// Datos de ejemplo para exámenes
export const mockExams = [
    {
        id: "001",
        patient_id: "001",
        patient_name: "María González",
        date: "2024-01-15",
        type: "Examen Completo",
        doctor: "Dr. López",
        status: "Completado",
        results: "Miopía leve",
        notes: "Receta actualizada"
    },
    {
        id: "002",
        patient_id: "002",
        patient_name: "Carlos Rodríguez",
        date: "2024-01-14",
        type: "Revisión",
        doctor: "Dr. Martínez",
        status: "Pendiente",
        results: "",
        notes: "Programado para la próxima semana"
    },
    {
        id: "003",
        patient_id: "003",
        patient_name: "Ana Martínez",
        date: "2024-01-13",
        type: "Examen Inicial",
        doctor: "Dr. López",
        status: "En Proceso",
        results: "Pendiente",
        notes: "Requiere seguimiento"
    },
    {
        id: "004",
        patient_id: "004",
        patient_name: "José García",
        date: "2024-01-12",
        type: "Control",
        doctor: "Dr. Martínez",
        status: "Completado",
        results: "Normal",
        notes: "Sin cambios"
    },
    {
        id: "005",
        patient_id: "005",
        patient_name: "Laura Fernández",
        date: "2024-01-11",
        type: "Examen Completo",
        doctor: "Dr. López",
        status: "En Proceso",
        results: "Pendiente",
        notes: "Primera consulta"
    }
];

export type ExamType = typeof mockExams[0];
