/**
 * Verifica las tablas de Supabase relacionadas con auth.
 * Útil para diagnosticar problemas de login.
 *
 * Uso: node scripts/check-auth-db.js
 * (Requiere .env con DATABASE_URL o DIRECT_URL)
 */

const path = require("path");
const fs = require("fs");

const envPath = path.resolve(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  });
}

const { PrismaClient } = require("@prisma/client");

async function main() {
  const url = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!url) {
    console.error("Falta DATABASE_URL o DIRECT_URL en .env");
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: { db: { url } },
    log: ["error"],
  });

  console.log("=== Verificación de tablas Auth (Supabase) ===\n");

  try {
    // 1. Conexión
    await prisma.$connect();
    console.log("✓ Conexión a la base de datos OK\n");

    // 2. Usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        emailVerified: true,
        plan: true,
        credits: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    console.log(`Usuarios (últimos ${users.length}):`);
    if (users.length === 0) {
      console.log("  (ninguno) - ¿Registraste algún usuario?\n");
    } else {
      users.forEach((u, i) => {
        const hasPass = !!u.password;
        const passInfo = hasPass ? "con contraseña" : "SIN contraseña (Google)";
        const verified = u.emailVerified ? "✓" : "no verificado";
        console.log(`  ${i + 1}. ${u.email} | ${passInfo} | ${verified}`);
      });
      console.log("");
    }

    // 3. Usuarios que pueden hacer login con email/contraseña
    const withPassword = users.filter((u) => u.password);
    console.log(`Usuarios con contraseña (pueden login email/pass): ${withPassword.length}`);

    // 4. Verificar RLS (si está habilitado, puede bloquear lecturas)
    try {
      const rlsResult = await prisma.$queryRaw`
        SELECT tablename, rowsecurity
        FROM pg_tables t
        JOIN pg_class c ON c.relname = t.tablename
        WHERE schemaname = 'public' AND tablename = 'User'
      `;
      if (rlsResult?.[0]?.rowsecurity) {
        console.log("\n⚠ RLS está HABILITADO en User. Verifica que existan políticas que permitan acceso.");
      }
    } catch (e) {
      // Ignorar si no tenemos permisos para consultar pg_tables
    }

    await prisma.$disconnect();
    console.log("\n=== Fin ===\n");
  } catch (err) {
    console.error("Error:", err.message);
    if (err.message?.includes("connect") || err.message?.includes("ECONNREFUSED")) {
      console.error("\n¿DATABASE_URL es correcta? Revisa en Supabase → Settings → Database.");
    }
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
