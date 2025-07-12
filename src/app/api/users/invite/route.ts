import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { email, nombre, telefono, rolId } = await req.json()
  const supabase = createRouteHandlerClient({ cookies })

  // 1. Invita al usuario (genera auth user y envía magic link)
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email)
  if (error) return Response.json({ error: error.message }, { status: 400 })

  // 2. Crea el registro en tu tabla usuarios (usa el UUID de data.user.id)
  await supabase.from('usuarios').insert({
    id: data.user.id,
    nombre,
    email,
    telefono,
    activo: true
  })

  // 3. Asigna el rol
  await supabase.from('usuario_roles').insert({
    usuario_id: data.user.id,
    rol_id: rolId
  })

  return Response.json({ success: true })
}
