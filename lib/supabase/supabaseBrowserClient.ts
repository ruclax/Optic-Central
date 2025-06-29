import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton para evitar múltiples instancias
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Configuraciones de seguridad mejoradas
        persistSession: true,        // Mantener sesión en localStorage
        autoRefreshToken: true,      // Renovar tokens automáticamente
        detectSessionInUrl: true,    // Detectar sesión en URL (para OAuth)
        // Tiempo de vida de sesión más seguro (30 minutos)
        // accessTokenLifetime: 1800, // 30 minutos en segundos (opcional)
      },
      // Configuración para manejar conexiones perdidas
      global: {
        headers: {
          'X-Client-Info': 'optica-central-web',
        },
      },
    })
  }
  return supabaseInstance
}

export const supabase = getSupabaseClient()
