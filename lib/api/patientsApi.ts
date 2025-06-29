import { supabase } from '@/lib/supabase'

export interface Patient {
  id: string
  full_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  address?: string
  emergency_contact?: string
  emergency_phone?: string
  medical_history?: string
  insurance_info?: any
  active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface CreatePatientData {
  full_name: string
  email?: string
  phone?: string
  date_of_birth?: string
  address?: string
  emergency_contact?: string
  emergency_phone?: string
  medical_history?: string
  insurance_info?: any
}

export interface UpdatePatientData extends Partial<CreatePatientData> {}

// Obtener todos los pacientes
export async function getPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching patients:', error)
    throw new Error(`Error al obtener pacientes: ${error.message}`)
  }

  return data || []
}

// Obtener un paciente por ID
export async function getPatientById(id: string): Promise<Patient | null> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Paciente no encontrado
    }
    console.error('Error fetching patient:', error)
    throw new Error(`Error al obtener paciente: ${error.message}`)
  }

  return data
}

// Crear un nuevo paciente
export async function createPatient(patientData: CreatePatientData): Promise<Patient> {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('patients')
    .insert({
      ...patientData,
      created_by: user?.id,
      active: true
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating patient:', error)
    throw new Error(`Error al crear paciente: ${error.message}`)
  }

  return data
}

// Actualizar un paciente
export async function updatePatient(id: string, patientData: UpdatePatientData): Promise<Patient> {
  const { data, error } = await supabase
    .from('patients')
    .update(patientData)
    .eq('id', id)
    .eq('active', true)
    .select()
    .single()

  if (error) {
    console.error('Error updating patient:', error)
    throw new Error(`Error al actualizar paciente: ${error.message}`)
  }

  return data
}

// Eliminar un paciente (soft delete)
export async function deletePatient(id: string): Promise<void> {
  const { error } = await supabase
    .from('patients')
    .update({ active: false })
    .eq('id', id)

  if (error) {
    console.error('Error deleting patient:', error)
    throw new Error(`Error al eliminar paciente: ${error.message}`)
  }
}

// Buscar pacientes
export async function searchPatients(query: string): Promise<Patient[]> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('active', true)
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching patients:', error)
    throw new Error(`Error al buscar pacientes: ${error.message}`)
  }

  return data || []
}
