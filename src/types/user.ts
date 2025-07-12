export type User = {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  // Relación opcional para UI
  rol_id?: number;
  roles?: Role;
  // Campos extra para UI
  [key: string]: any;
};

export type Role = {
  id: number;
  nombre: string;
  descripcion?: string;
};
