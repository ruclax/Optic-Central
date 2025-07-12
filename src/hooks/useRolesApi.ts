import { useState } from 'react';

export function useRolesApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/roles');
      if (!res.ok) throw new Error('Error al obtener roles');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Asignar rol a usuario
  const assignToUser = async (usuario_id: string, rol_id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/usuario_roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id, rol_id }),
      });
      if (!res.ok) throw new Error('Error al asignar rol');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getAll, assignToUser, loading, error };
}
