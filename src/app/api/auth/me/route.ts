import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET /api/auth/me
export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // LOG: Mostrar cookies recibidas
  console.log('[API][auth/me] Cookies:', req.headers.get('cookie'));
  // También log en terminal (si está en entorno server)
  if (typeof process !== 'undefined' && process.stdout) {
    process.stdout.write('[API][auth/me][TERMINAL] Cookies: ' + req.headers.get('cookie') + '\n');
  }

  // Obtener sesión del usuario autenticado
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();
  console.log('[API][auth/me] user:', user, 'sessionError:', sessionError);
  if (typeof process !== 'undefined' && process.stdout) {
    process.stdout.write('[API][auth/me][TERMINAL] user: ' + JSON.stringify(user) + ' sessionError: ' + JSON.stringify(sessionError) + '\n');
  }
  if (sessionError || !user) {
    return NextResponse.json({ user: null, roles: [], error: 'No autenticado' }, { status: 401 });
  }

  // Buscar usuario en la tabla usuarios
  const { data: usuario, error: usuarioError } = await supabase
    .from('usuarios')
    .select('id, nombre, email, activo')
    .eq('id', user.id)
    .single();
  console.log('[API][auth/me] usuario:', usuario, 'usuarioError:', usuarioError);
  if (typeof process !== 'undefined' && process.stdout) {
    process.stdout.write('[API][auth/me][TERMINAL] usuario: ' + JSON.stringify(usuario) + ' usuarioError: ' + JSON.stringify(usuarioError) + '\n');
  }

  if (usuarioError || !usuario) {
    return NextResponse.json({ user: null, roles: [], error: 'Usuario no encontrado' }, { status: 404 });
  }

  // Log extra para depuración
  console.log('[API][auth/me] user.id usado para roles:', user.id);
  if (typeof process !== 'undefined' && process.stdout) {
    process.stdout.write('[API][auth/me][TERMINAL] user.id usado para roles: ' + user.id + '\n');
  }

  // Buscar roles del usuario (sin !inner, log de estructura)
  const { data: roles, error: rolesError } = await supabase
    .from('usuario_roles')
    .select('rol_id, roles(nombre)')
    .eq('usuario_id', user.id);
  console.log('[API][auth/me] roles (raw):', roles, 'rolesError:', rolesError);
  if (typeof process !== 'undefined' && process.stdout) {
    process.stdout.write('[API][auth/me][TERMINAL] roles (raw): ' + JSON.stringify(roles) + ' rolesError: ' + JSON.stringify(rolesError) + '\n');
  }

  // Mapeo robusto y seguro del nombre del rol
  const rolesList = Array.isArray(roles)
    ? roles
        .map(r => {
          if (r && r.roles) {
            if (Array.isArray(r.roles) && r.roles.length > 0 && typeof r.roles[0]?.nombre === 'string') {
              return r.roles[0].nombre;
            }
            if (typeof r.roles === 'object' && r.roles !== null && typeof (r.roles as any).nombre === 'string') {
              return (r.roles as any).nombre;
            }
          }
          return undefined;
        })
        .filter((nombre): nombre is string => Boolean(nombre))
    : [];

  // Log final de respuesta
  console.log('[API][auth/me] RESPONSE:', { user: usuario, roles: rolesList });
  if (typeof process !== 'undefined' && process.stdout) {
    process.stdout.write('[API][auth/me][TERMINAL] RESPONSE: ' + JSON.stringify({ user: usuario, roles: rolesList }) + '\n');
  }

  return NextResponse.json({ user: usuario, roles: rolesList });
}
