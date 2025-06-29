import { supabase } from '@/lib/supabase'

export interface Exam {
  id: string
  patient_id: string
  doctor_id?: string
  exam_type: string
  exam_date: string
  results?: any
  notes?: string
  prescription?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  files_urls?: string[]
  created_at: string
  updated_at: string
  // Datos relacionados
  patients?: {
    id: string
    full_name: string
    email?: string
  }
  profiles?: {
    id: string
    full_name: string
    email?: string
  }
}

export interface CreateExamData {
  patient_id: string
  exam_type: string
  exam_date: string
  results?: any
  notes?: string
  prescription?: string
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
}

export interface UpdateExamData extends Partial<CreateExamData> {}

// Tipos de exámenes predefinidos
export const EXAM_TYPES = [
  'Examen de agudeza visual',
  'Refracción',
  'Tonometría (presión ocular)',
  'Fondo de ojo',
  'Campo visual',
  'Biomicroscopía',
  'Evaluación de lentes de contacto',
  'Examen completo de la vista',
  'Seguimiento',
  'Otro'
] as const

export const EXAM_STATUSES = [
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in_progress', label: 'En Progreso', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completado', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800' }
] as const

// Obtener todos los exámenes
export async function getExams(): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select(`
      *,
      patients!inner(id, full_name, email),
      profiles(id, full_name, email)
    `)
    .order('exam_date', { ascending: false })

  if (error) {
    console.error('Error fetching exams:', error)
    throw new Error(`Error al obtener exámenes: ${error.message}`)
  }

  return data || []
}

// Obtener exámenes por paciente
export async function getExamsByPatient(patientId: string): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select(`
      *,
      patients!inner(id, full_name, email),
      profiles(id, full_name, email)
    `)
    .eq('patient_id', patientId)
    .order('exam_date', { ascending: false })

  if (error) {
    console.error('Error fetching patient exams:', error)
    throw new Error(`Error al obtener exámenes del paciente: ${error.message}`)
  }

  return data || []
}

// Obtener un examen por ID
export async function getExamById(id: string): Promise<Exam | null> {
  const { data, error } = await supabase
    .from('exams')
    .select(`
      *,
      patients!inner(id, full_name, email),
      profiles(id, full_name, email)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Examen no encontrado
    }
    console.error('Error fetching exam:', error)
    throw new Error(`Error al obtener examen: ${error.message}`)
  }

  return data
}

// Crear un nuevo examen
export async function createExam(examData: CreateExamData): Promise<Exam> {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('exams')
    .insert({
      ...examData,
      doctor_id: user?.id,
      status: examData.status || 'pending'
    })
    .select(`
      *,
      patients!inner(id, full_name, email),
      profiles(id, full_name, email)
    `)
    .single()

  if (error) {
    console.error('Error creating exam:', error)
    throw new Error(`Error al crear examen: ${error.message}`)
  }

  return data
}

// Actualizar un examen
export async function updateExam(id: string, examData: UpdateExamData): Promise<Exam> {
  const { data, error } = await supabase
    .from('exams')
    .update(examData)
    .eq('id', id)
    .select(`
      *,
      patients!inner(id, full_name, email),
      profiles(id, full_name, email)
    `)
    .single()

  if (error) {
    console.error('Error updating exam:', error)
    throw new Error(`Error al actualizar examen: ${error.message}`)
  }

  return data
}

// Eliminar un examen
export async function deleteExam(id: string): Promise<void> {
  const { error } = await supabase
    .from('exams')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting exam:', error)
    throw new Error(`Error al eliminar examen: ${error.message}`)
  }
}

// Buscar exámenes
export async function searchExams(query: string): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select(`
      *,
      patients!inner(id, full_name, email),
      profiles(id, full_name, email)
    `)
    .or(`exam_type.ilike.%${query}%,notes.ilike.%${query}%,patients.full_name.ilike.%${query}%`)
    .order('exam_date', { ascending: false })

  if (error) {
    console.error('Error searching exams:', error)
    throw new Error(`Error al buscar exámenes: ${error.message}`)
  }

  return data || []
}
