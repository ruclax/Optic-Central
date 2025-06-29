// Script Node.js funcional para crear usuarios de prueba en Supabase Auth usando Service Role Key
// Compatible con Node.js 18+ (usa fetch nativo, no requiere node-fetch)

require("dotenv").config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const users = [
  {
    email: "admin@opticacentral.com",
    password: "Test1234*",
    full_name: "Ana Admin",
    role: "admin",
  },
  {
    email: "optometrista1@opticacentral.com",
    password: "Test1234*",
    full_name: "Olga Optometrista",
    role: "optometrist",
  },
  {
    email: "optometrista2@opticacentral.com",
    password: "Test1234*",
    full_name: "Pedro Optometrista",
    role: "optometrist",
  },
  {
    email: "biselador@opticacentral.com",
    password: "Test1234*",
    full_name: "Bruno Biselador",
    role: "biselador",
  },
  {
    email: "maquilador@opticacentral.com",
    password: "Test1234*",
    full_name: "Marta Maquiladora",
    role: "maquilador",
  },
  {
    email: "recepcion1@opticacentral.com",
    password: "Test1234*",
    full_name: "Rosa Recepcionista",
    role: "receptionist",
  },
  {
    email: "recepcion2@opticacentral.com",
    password: "Test1234*",
    full_name: "Luis Recepcionista",
    role: "receptionist",
  },
];

async function createUser(user) {
  // 1. Crear usuario en Auth
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      password: user.password,
      user_metadata: { full_name: user.full_name },
      email_confirm: true,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    if (data.error_code === "email_exists") {
      console.log(`⚠️  Usuario ya existe: ${user.email}`);
    } else {
      console.error(`❌ Error creando usuario ${user.email}:`, data);
    }
    return;
  }

  const userId = data.user?.id || data.id;
  console.log(`✅ Usuario creado: ${user.email} (ID: ${userId})`);

  // 2. Actualizar rol en la tabla profiles
  if (userId) {
    try {
      // Primero, obtener el role_id de la tabla roles
      const roleRes = await fetch(
        `${SUPABASE_URL}/rest/v1/roles?name=eq.${user.role}&select=id`,
        {
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const roleData = await roleRes.json();

      if (!roleRes.ok || !roleData || roleData.length === 0) {
        console.error(`   ❌ No se encontró el rol: ${user.role}`);
        return;
      }

      const roleId = roleData[0].id;

      // Ahora actualizar el role_id en profiles
      const updateRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
        {
          method: "PATCH",
          headers: {
            apikey: SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            role_id: roleId,
          }),
        }
      );

      if (updateRes.ok) {
        console.log(`   🎯 Rol asignado: ${user.role}`);
      } else {
        const errorData = await updateRes.json();
        console.error(`   ❌ Error asignando rol:`, errorData);
      }
    } catch (error) {
      console.error(`   ❌ Error actualizando perfil:`, error.message);
    }
  }
}

(async () => {
  console.log("🚀 Iniciando creación de usuarios de prueba...\n");

  for (const user of users) {
    await createUser(user);
    // Pequeña pausa entre usuarios para evitar rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("\n✨ Proceso completado!");
  console.log("📋 Usuarios creados con sus roles asignados:");
  users.forEach((user) => {
    console.log(`   • ${user.email} → ${user.role}`);
  });
})();
