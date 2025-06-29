/**
 * Utilidades para manejar sesiones y limpieza automática
 */

import { supabase } from '@/lib/supabase'

/**
 * Configura un intervalo para verificar y limpiar sesiones expiradas
 */
export function setupSessionCleanup() {
  // Verificar cada 5 minutos si la sesión sigue siendo válida
  const interval = setInterval(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        console.log('[SESSION] Sesión inválida o expirada, limpiando...')
        await supabase.auth.signOut()
        // Opcional: recargar la página para resetear completamente el estado
        // window.location.reload()
      }
    } catch (error) {
      console.error('[SESSION] Error verificando sesión:', error)
    }
  }, 5 * 60 * 1000) // 5 minutos

  // Retornar función para limpiar el intervalo
  return () => clearInterval(interval)
}

/**
 * Maneja la limpieza cuando la ventana se cierra
 */
export function setupWindowCleanup() {
  const cleanup = () => {
    // Opcional: cerrar sesión cuando se cierra la ventana/pestaña
    // navigator.sendBeacon para enviar una petición final al cerrar
    console.log('[SESSION] Ventana cerrándose')
  }

  window.addEventListener('beforeunload', cleanup)
  window.addEventListener('unload', cleanup)

  return () => {
    window.removeEventListener('beforeunload', cleanup)
    window.removeEventListener('unload', cleanup)
  }
}

/**
 * Detecta si el usuario ha estado inactivo y opcionalmente cierra la sesión
 */
export function setupInactivityLogout(timeoutMinutes: number = 30) {
  let timeoutId: NodeJS.Timeout

  const resetTimeout = () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
      console.log('[SESSION] Usuario inactivo, cerrando sesión...')
      await supabase.auth.signOut()
      window.location.href = '/login'
    }, timeoutMinutes * 60 * 1000)
  }

  // Eventos que indican actividad del usuario
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
  
  events.forEach(event => {
    document.addEventListener(event, resetTimeout, true)
  })

  // Iniciar el timeout
  resetTimeout()

  // Función de limpieza
  return () => {
    clearTimeout(timeoutId)
    events.forEach(event => {
      document.removeEventListener(event, resetTimeout, true)
    })
  }
}
