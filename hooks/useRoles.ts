import { useAuth } from "@/providers/auth-provider"

// Todos los hooks de acceso usan solo el nombre del rol (role), nunca role_id
export function useHasRoleName(roleName: string) {
  const { user } = useAuth()
  return user?.role?.toLowerCase() === roleName.toLowerCase()
}

export function useIsAdmin() {
  return useHasRoleName("admin")
}

export function useIsOptometrist() {
  return useHasRoleName("optometrist")
}

export function useIsBiselador() {
  return useHasRoleName("biselador")
}

export function useIsMaquilador() {
  return useHasRoleName("maquilador")
}

export function useIsReceptionist() {
  return useHasRoleName("receptionist")
}
