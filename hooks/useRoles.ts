import { useAuth } from "@/providers/auth-provider"

export function useHasRoleId(roleId: string) {
  const { user } = useAuth()
  // Comparar como string para evitar problemas de tipo
  return String(user?.role_id) === String(roleId)
}

export function useIsAdmin() {
  // El role_id de admin debe venir de variable de entorno o constante
  const ADMIN_ROLE_ID = process.env.NEXT_PUBLIC_ADMIN_ROLE_ID || "1"
  return useHasRoleId(ADMIN_ROLE_ID)
}
