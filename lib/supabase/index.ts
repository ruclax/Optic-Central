// Archivo de exports centralizados para Supabase
// SOLO usar el cliente de browser para evitar múltiples instancias
export { supabase } from './supabaseBrowserClient'
export { createSupabaseServerClient } from './supabaseServerClient'
export * from './supabaseApi'
