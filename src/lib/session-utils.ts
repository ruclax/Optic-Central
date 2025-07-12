/**
 * Utilidades para manejar sesiones y limpieza automática
 */

import { supabase } from '@/lib/supabase-server'

// Centraliza el cierre de sesión y notificación
async function handleLogout(reason: string) {
  // Puedes integrar aquí un sistema de notificaciones/toast si lo tienes
  alert(reason) // Reemplaza por tu sistema de notificaciones preferido
  await supabase.auth.signOut()
  window.location.href = '/login'
}

export function setupSessionCleanup() {
  // Verificar cada 5 minutos si la sesión sigue siendo válida
  const interval = setInterval(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) {
        console.log('[SESSION] Sesión inválida o expirada, limpiando...')
        await handleLogout('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
      }
    } catch (error) {
      console.error('[SESSION] Error verificando sesión:', error)
    }
  }, 5 * 60 * 1000) // 5 minutos
  return () => clearInterval(interval)
}

export function setupWindowCleanup() {
  const cleanup = () => {
    // Opcional: cerrar sesión cuando se cierra la ventana/pestaña
    // navigator.sendBeacon para enviar una petición final al cerrar
    console.log('[SESSION] Ventana cerrándose')
  }

  window.addEventListener('beforeunload', cleanup)

  return () => {
    window.removeEventListener('beforeunload', cleanup)
  }
}

export function setupInactivityLogout(timeoutMinutes: number = 30) {
  let timeoutId: number | undefined
  let warningId: number | undefined
  let warned = false

  // Muestra advertencia antes de cerrar sesión
  function showWarning() {
    warned = true
    alert('Vas a ser desconectado por inactividad en 1 minuto.') // Reemplaza por modal/toast si tienes
  }

  const resetTimeout = () => {
    if (warningId) clearTimeout(warningId)
    if (timeoutId) clearTimeout(timeoutId)
    warned = false
    timeoutId = window.setTimeout(async () => {
      await handleLogout('Sesión cerrada por inactividad.')
    }, timeoutMinutes * 60 * 1000)
    // Muestra advertencia 1 minuto antes
    warningId = window.setTimeout(() => {
      if (!warned) showWarning()
    }, (timeoutMinutes - 1) * 60 * 1000)
  }

  // Eventos que indican actividad del usuario
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
  events.forEach(event => {
    document.addEventListener(event, resetTimeout, true)
  })
  resetTimeout()
  return () => {
    if (timeoutId) clearTimeout(timeoutId)
    if (warningId) clearTimeout(warningId)
    events.forEach(event => {
      document.removeEventListener(event, resetTimeout, true)
    })
  }
}
