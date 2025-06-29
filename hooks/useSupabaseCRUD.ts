import { useState, useEffect } from 'react'
import { getAll, getById, create, update, remove } from '@/lib/supabase/supabaseApi'

// Hook genérico para CRUD de cualquier tabla de Supabase
export function useSupabaseCRUD<T extends { id: string; active?: boolean }>(
  tableName: string,
  defaultOrderBy: string = 'created_at'
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Intentar primero con filtro active, si falla, usar sin filtro
      let result
      try {
        result = await getAll(tableName, { 
          orderBy: defaultOrderBy, 
          ascending: false 
        })
      } catch (err: any) {
        // Si falla (posiblemente por columna active), intentar sin filtro active
        if (err.message?.includes('active') || err.message?.includes('column')) {
          result = await getAll(tableName, { 
            orderBy: defaultOrderBy, 
            ascending: false,
            includeInactive: true
          })
        } else {
          throw err
        }
      }
      setData(result)
    } catch (err: any) {
      setError(err.message || `Error al cargar ${tableName}`)
    } finally {
      setLoading(false)
    }
  }

  const getItem = async (id: string): Promise<T | null> => {
    try {
      return await getById(tableName, id)
    } catch (err: any) {
      setError(err.message || `Error al cargar registro`)
      return null
    }
  }

  const createItem = async (itemData: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T | null> => {
    setLoading(true)
    setError(null)
    try {
      const newItem = await create(tableName, { ...itemData, active: true })
      await fetchData() // Refresh the list
      return newItem
    } catch (err: any) {
      setError(err.message || `Error al crear registro`)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (id: string, itemData: Partial<T>): Promise<T | null> => {
    setLoading(true)
    setError(null)
    try {
      const updatedItem = await update(tableName, id, itemData)
      await fetchData() // Refresh the list
      return updatedItem
    } catch (err: any) {
      setError(err.message || `Error al actualizar registro`)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await remove(tableName, id) // Soft delete
      await fetchData() // Refresh the list
      return true
    } catch (err: any) {
      setError(err.message || `Error al eliminar registro`)
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    fetchData,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    clearError: () => setError(null)
  }
}

// Hook específico para pacientes usando el genérico
export interface Patient {
  id: string
  first_name: string
  last_name: string
  full_name?: string
  phone: string
  email?: string
  address?: string
  date_of_birth?: string
  gender?: string
  emergency_contact?: string
  emergency_phone?: string
  allergies?: string
  medications?: string
  medical_history?: string
  right_eye_sphere?: string
  right_eye_cylinder?: string
  right_eye_axis?: string
  left_eye_sphere?: string
  left_eye_cylinder?: string
  left_eye_axis?: string
  pupillary_distance?: string
  notes?: string
  active: boolean
  created_by_profile_id?: string
  created_at: string
  updated_at: string
}

export function usePatients() {
  return useSupabaseCRUD<Patient>('patients')
}

// Hook específico para exámenes usando el genérico
export interface Exam {
  id: string
  patient_id: string
  doctor_id?: string
  exam_date: string
  exam_type: string
  status: string
  visual_acuity_right?: string
  visual_acuity_left?: string
  right_eye_sphere?: string
  right_eye_cylinder?: string
  right_eye_axis?: string
  right_eye_add?: string
  left_eye_sphere?: string
  left_eye_cylinder?: string
  left_eye_axis?: string
  left_eye_add?: string
  pupillary_distance?: string
  intraocular_pressure_right?: string
  intraocular_pressure_left?: string
  findings?: string
  diagnosis?: string
  recommendations?: string
  notes?: string
  files_urls?: string
  next_appointment_date?: string
  active: boolean
  created_by_profile_id?: string
  created_at: string
  updated_at: string
}

export function useExams() {
  return useSupabaseCRUD<Exam>('exams', 'exam_date')
}
