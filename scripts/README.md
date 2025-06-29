# Scripts de Desarrollo - Óptica Central

## 📋 Descripción

Este directorio contiene scripts de utilidad para el desarrollo y configuración inicial del proyecto.

## 🔧 Scripts Disponibles

### `crear-usuarios-prueba.js`

**Propósito**: Crear usuarios de prueba con diferentes roles para testing y desarrollo.

**Uso**:

```bash
cd scripts
node crear-usuarios-prueba.js
```

**Requisitos**:

- Variables de entorno configuradas en `.env.local`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Usuarios que crea**:

- `admin@opticacentral.com` - Administrador
- `optometrista1@opticacentral.com` - Optometrista
- `optometrista2@opticacentral.com` - Optometrista
- `biselador@opticacentral.com` - Biselador
- `maquilador@opticacentral.com` - Maquilador
- `recepcion1@opticacentral.com` - Recepcionista
- `recepcion2@opticacentral.com` - Recepcionista

**Contraseña por defecto**: `Test1234*`

## ⚠️ Advertencias de Seguridad

- **Solo para desarrollo**: Estos scripts contienen credenciales de prueba
- **No usar en producción**: Las contraseñas están en texto plano
- **Cambiar contraseñas**: Después de usar en producción, cambiar todas las contraseñas
- **Variables de entorno**: Asegurar que las variables estén correctamente configuradas

## 🔄 Recomendaciones de Uso

1. **Desarrollo local**: Ejecutar después de configurar la base de datos
2. **Testing**: Usar para pruebas de roles y permisos
3. **Demos**: Útil para presentaciones con datos de prueba
4. **Producción**: Eliminar este directorio antes del deploy a producción

## 🚀 Próximas Mejoras

- [ ] Script para eliminar usuarios de prueba
- [ ] Generación de contraseñas aleatorias
- [ ] Configuración desde archivo JSON
- [ ] Validación de roles existentes
- [ ] Log detallado de operaciones

---

_Mantener estos scripts solo durante el desarrollo activo del proyecto._
