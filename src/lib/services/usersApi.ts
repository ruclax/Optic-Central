// API fetchers para usuarios y roles usando los endpoints de Next.js

export async function getUsers() {
  const res = await fetch("/api/usuarios");
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return await res.json();
}

export async function getRoles() {
  const res = await fetch("/api/roles");
  if (!res.ok) throw new Error("Error al obtener roles");
  return await res.json();
}

export async function update(table: string, userId: string, data: Record<string, any>) {
  // table se ignora, solo para compatibilidad con la llamada
  const res = await fetch(`/api/usuarios/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar usuario");
  return await res.json();
}

export async function remove(table: string, userId: string) {
  // table se ignora, solo para compatibilidad con la llamada
  const res = await fetch(`/api/usuarios/${userId}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Error al eliminar usuario");
  return await res.json();
}
