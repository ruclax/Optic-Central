import { useState } from 'react';

export function useExamsApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async (paciente_id?: string | number) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/examenes';
      if (paciente_id) url += `?paciente_id=${paciente_id}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al obtener exámenes');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/examenes/${id}`);
      if (!res.ok) throw new Error('Error al obtener examen');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/examenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al crear examen');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string | number, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/examenes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar examen');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/examenes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar examen');
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
