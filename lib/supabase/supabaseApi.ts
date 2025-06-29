import { supabase } from './supabaseBrowserClient'

// Opciones para filtrar y ordenar
interface QueryOptions {
  filter?: Record<string, any>
  orderBy?: string
  ascending?: boolean
  limit?: number
  includeInactive?: boolean // Nueva opción para incluir registros inactivos
}

// Obtener todos los registros de una tabla
export async function getAll(table: string, options?: QueryOptions): Promise<any[]> {
  let query = supabase.from(table).select('*')
  
  // Filtrar solo registros activos por defecto, a menos que se especifique lo contrario
  if (!options?.includeInactive) {
    // Aplicar filtro active solo para tablas que lo soporten
    const tablesWithActiveColumn = ['patients', 'exams', 'profiles', 'users']
    if (tablesWithActiveColumn.includes(table)) {
      query = query.eq('active', true)
    }
  }
  
  if (options?.filter) {
    Object.entries(options.filter).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }
  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? true })
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  const { data, error } = await query
  if (error) throw error
  return data || []
}

// Obtener todos los registros incluyendo inactivos
export async function getAllIncludingInactive(table: string, options?: QueryOptions): Promise<any[]> {
  let query = supabase.from(table).select('*')
  if (options?.filter) {
    Object.entries(options.filter).forEach(([key, value]) => {
      query = query.eq(key, value)
    })
  }
  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? true })
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  const { data, error } = await query
  if (error) throw error
  return data || []
}

// Obtener un registro por ID
export async function getById(table: string, id: string | number, idField = 'id'): Promise<any | null> {
  const { data, error } = await supabase.from(table).select('*').eq(idField, id).single()
  if (error) throw error
  return data
}

// Crear un registro
export async function create(table: string, payload: Record<string, any>): Promise<any> {
  const { data, error } = await supabase.from(table).insert([payload]).select().single()
  if (error) throw error
  return data
}

// Actualizar un registro
export async function update(table: string, id: string | number, payload: Record<string, any>, idField = 'id'): Promise<any> {
  const { data, error } = await supabase.from(table).update(payload).eq(idField, id).select().single()
  if (error) throw error
  return data
}

// Eliminar un registro (soft delete)
export async function remove(table: string, id: string | number, idField = 'id'): Promise<void> {
  const { error } = await supabase.from(table).update({ active: false }).eq(idField, id)
  if (error) throw error
}

// Eliminar un registro físicamente (usar con precaución)
export async function hardDelete(table: string, id: string | number, idField = 'id'): Promise<void> {
  const { error } = await supabase.from(table).delete().eq(idField, id)
  if (error) throw error
}
