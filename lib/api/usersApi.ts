import { supabase } from '@/lib/supabase'

export interface User {
  id: string
  full_name: string
  email: string
  // role_id solo para asignación de roles, no para control de acceso
  role_id: string
  phone?: string
  active: boolean
  avatar_url?: string
  metadata?: any
  created_at: string
  updated_at: string
  // Datos relacionados
  roles?: {
    id: string
    name: string
    description?: string
    default_route?: string
  }
}

export interface Role {
  id: string
  name: string
  description?: string
  default_route?: string
  permissions?: any
  active: boolean
}

export interface CreateUserData {
  email: string
  password: string
  full_name: string
  role_id: string
  phone?: string
}

export interface UpdateUserData {
  full_name?: string
  role_id?: string
  phone?: string
  active?: boolean
}

// Obtener todos los roles
export async function getRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('active', true)
    .order('name')

  if (error) {
    console.error('Error fetching roles:', error)
    throw new Error(`Error al obtener roles: ${error.message}`)
  }

  return data || []
}

// Obtener todos los usuarios (solo admins)
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      roles!inner(id, name, description, default_route)
    `)
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    throw new Error(`Error al obtener usuarios: ${error.message}`)
  }

  return data || []
}

// Obtener un usuario por ID
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      roles!inner(id, name, description, default_route)
    `)
    .eq('id', id)
    .eq('active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Usuario no encontrado
    }
    console.error('Error fetching user:', error)
    throw new Error(`Error al obtener usuario: ${error.message}`)
  }

  return data
}

// Crear un nuevo usuario (solo admins, usando service role)
export async function createUser(userData: CreateUserData): Promise<{ success: boolean; error?: string }> {
  try {
    // Obtener token de usuario actual
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) {
      return { success: false, error: 'No hay sesión activa' }
    }

    const response = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(userData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Error al crear usuario')
    }

    return { success: true }
  } catch (error) {
    console.error('Error creating user:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    }
  }
}

// Actualizar un usuario
export async function updateUser(id: string, userData: UpdateUserData): Promise<User> {
  const { data, error } = await supabase
    .from('profiles')
    .update(userData)
    .eq('id', id)
    .select(`
      *,
      roles!inner(id, name, description, default_route)
    `)
    .single()

  if (error) {
    console.error('Error updating user:', error)
    throw new Error(`Error al actualizar usuario: ${error.message}`)
  }

  return data
}

// Desactivar un usuario (soft delete)
export async function deactivateUser(id: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ active: false })
    .eq('id', id)

  if (error) {
    console.error('Error deactivating user:', error)
    throw new Error(`Error al desactivar usuario: ${error.message}`)
  }
}

// Activar un usuario
export async function activateUser(id: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ active: true })
    .eq('id', id)

  if (error) {
    console.error('Error activating user:', error)
    throw new Error(`Error al activar usuario: ${error.message}`)
  }
}

// Buscar usuarios
export async function searchUsers(query: string): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      roles!inner(id, name, description, default_route)
    `)
    .eq('active', true)
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching users:', error)
    throw new Error(`Error al buscar usuarios: ${error.message}`)
  }

  return data || []
}
