import { useSupabaseCRUD } from './useSupabaseCRUD'

// Hook específico para exámenes
export interface Exam {
  id: string
  patient_id: string
  exam_type: string
  exam_date: string
  results?: any
  notes?: string
  prescription?: string
  doctor_id?: string
  status: string
  files_urls?: string[]
  active: boolean
  created_at: string
  updated_at: string
}

export function useExams() {
  return useSupabaseCRUD<Exam>('exams', 'exam_date')
}

// Hook específico para citas
export interface Appointment {
  id: string
  patient_id: string
  doctor_id?: string
  appointment_date: string
  appointment_type: string
  status: string
  notes?: string
  duration_minutes: number
  created_by?: string
  active: boolean
  created_at: string
  updated_at: string
}

export function useAppointments() {
  return useSupabaseCRUD<Appointment>('appointments', 'appointment_date')
}
