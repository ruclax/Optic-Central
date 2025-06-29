import { supabase } from '@/lib/supabase'

// Interfaces para tipos de respuesta de la API
export interface DashboardStats {
  totalPatients: number
  pendingExams: number
  completedExamsThisMonth: number
  newPatientsThisMonth: number
  activeUsers: number
}

export interface RecentActivity {
  id: string
  type: 'patient' | 'exam' | 'user'
  title: string
  description: string
  date: string
  status?: string
}

// Tipos para las consultas de Supabase
interface PatientRecord {
  id: string
  full_name: string
  created_at: string
}

interface ExamRecord {
  id: string
  exam_type: string
  status: string
  created_at: string
  patients: {
    full_name: string
  } | null
}

interface Exam {
  id: string
  patient_id: string
  doctor_id?: string
  exam_type: string
  exam_date: string
  status: string
  patients?: {
    id: string
    full_name: string
    phone?: string
  }
  profiles?: {
    id: string
    full_name: string
  }
}

// Obtener estadísticas del dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const currentDate = new Date()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)

    // Ejecutar todas las consultas en paralelo para mejor rendimiento
    const [
      { count: totalPatients, error: patientsError },
      { count: pendingExams, error: pendingError },
      { count: completedExamsThisMonth, error: completedError },
      { count: newPatientsThisMonth, error: newPatientsError },
      { count: activeUsers, error: usersError }
    ] = await Promise.all([
      // Contar pacientes totales activos
      supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('active', true),

      // Contar exámenes pendientes
      supabase
        .from('exams')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),

      // Contar exámenes completados este mes
      supabase
        .from('exams')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .gte('updated_at', firstDayOfMonth.toISOString()),

      // Contar nuevos pacientes este mes
      supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)
        .gte('created_at', firstDayOfMonth.toISOString()),

      // Contar usuarios activos (profiles)
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('active', true)
    ])

    // Verificar errores individuales
    if (patientsError) console.warn('Error fetching patients count:', patientsError)
    if (pendingError) console.warn('Error fetching pending exams:', pendingError)
    if (completedError) console.warn('Error fetching completed exams:', completedError)
    if (newPatientsError) console.warn('Error fetching new patients:', newPatientsError)
    if (usersError) console.warn('Error fetching users count:', usersError)

    return {
      totalPatients: totalPatients || 0,
      pendingExams: pendingExams || 0,
      completedExamsThisMonth: completedExamsThisMonth || 0,
      newPatientsThisMonth: newPatientsThisMonth || 0,
      activeUsers: activeUsers || 0
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    // Retornar valores por defecto en caso de error
    return {
      totalPatients: 0,
      pendingExams: 0,
      completedExamsThisMonth: 0,
      newPatientsThisMonth: 0,
      activeUsers: 0
    }
  }
}

// Obtener actividad reciente
export async function getRecentActivity(): Promise<RecentActivity[]> {
  try {
    const activities: RecentActivity[] = []

    // Ejecutar consultas en paralelo
    const [
      { data: recentPatients, error: patientsError },
      { data: recentExams, error: examsError }
    ] = await Promise.all([
      // Obtener pacientes recientes
      supabase
        .from('patients')
        .select('id, full_name, created_at')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(5),

      // Obtener exámenes recientes
      supabase
        .from('exams')
        .select(`
          id, 
          exam_type, 
          status, 
          created_at,
          patients(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    // Manejar errores de consultas
    if (patientsError) {
      console.warn('Error fetching recent patients:', patientsError)
    }
    if (examsError) {
      console.warn('Error fetching recent exams:', examsError)
    }

    // Procesar pacientes recientes
    if (recentPatients && !patientsError) {
      activities.push(...recentPatients.map((patient: PatientRecord) => ({
        id: `patient-${patient.id}`,
        type: 'patient' as const,
        title: 'Nuevo paciente registrado',
        description: patient.full_name,
        date: patient.created_at
      })))
    }

    // Procesar exámenes recientes
    if (recentExams && !examsError) {
      activities.push(...recentExams.map((exam: ExamRecord) => ({
        id: `exam-${exam.id}`,
        type: 'exam' as const,
        title: `Examen: ${exam.exam_type}`,
        description: `Paciente: ${exam.patients?.full_name || 'No asignado'}`,
        date: exam.created_at,
        status: exam.status
      })))
    }

    // Ordenar por fecha más reciente y limitar a 10
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)

  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return []
  }
}

// Obtener exámenes próximos (para hoy y mañana)
export async function getUpcomingExams(): Promise<Exam[]> {
  try {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Formatear fechas en formato YYYY-MM-DD
    const todayStr = today.toISOString().split('T')[0]
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    const { data: upcomingExams, error } = await supabase
      .from('exams')
      .select(`
        *,
        patients(id, full_name, phone),
        profiles(id, full_name)
      `)
      .gte('exam_date', todayStr)
      .lte('exam_date', tomorrowStr)
      .in('status', ['pending', 'in_progress'])
      .order('exam_date', { ascending: true })

    if (error) {
      console.warn('Error fetching upcoming exams:', error)
      return []
    }

    return upcomingExams || []
  } catch (error) {
    console.error('Error fetching upcoming exams:', error)
    return []
  }
}
