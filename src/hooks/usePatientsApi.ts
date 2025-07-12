import { useState } from 'react';

export function usePatientsApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listar todos los pacientes
  const getAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pacientes');
      if (!res.ok) throw new Error('Error al obtener pacientes');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener paciente por ID
  const getById = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pacientes/${id}`);
      if (!res.ok) throw new Error('Error al obtener paciente');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear paciente
  const create = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear paciente');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar paciente
  const update = async (id: string | number, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pacientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar paciente');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar paciente
  const remove = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pacientes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar paciente');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getAll, getById, create, update, remove, loading, error };
}
