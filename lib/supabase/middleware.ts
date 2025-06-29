// Utilidades de middleware para manejar la sesión de usuario
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Evita escribir lógica entre createServerClient y
  // supabase.auth.getUser(). Un simple error podría hacer que el usuario no se autentique correctamente.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // console.log('[MIDDLEWARE][DEBUG] Usuario detectado:', user)

  // Solo redirigir rutas protegidas específicas
  const protectedRoutes = ['/dashboard', '/patients', '/exams', '/users']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (
    !user &&
    isProtectedRoute &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    !request.nextUrl.pathname.startsWith('/reset-password') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // Sin usuario en ruta protegida, redirigir al login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirigir usuario autenticado que intenta acceder a /login
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard' // Puedes cambiar esto por user.default_route si lo tienes disponible en el JWT
    return NextResponse.redirect(url)
  }

  // IMPORTANTE: Debes devolver la supabaseResponse de aquí para hacer que el
  // refresh de cookies funcione correctamente.
  return supabaseResponse
}
