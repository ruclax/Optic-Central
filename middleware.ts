// Middleware de Next.js para manejar autenticación automática
import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Actualizar sesión de usuario
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto las que empiecen con:
     * - _next/static (archivos estáticos)
     * - _next/image (archivos de optimización de imagen)
     * - favicon.ico (favicon)
     * - api/ (rutas de API)
     * - archivos estáticos (svg, png, jpg, jpeg, gif, webp)
     * Puedes modificar este patrón para incluir más rutas.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
