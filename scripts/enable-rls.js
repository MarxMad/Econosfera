/**
 * Habilita RLS (Row Level Security) en todas las tablas public de Supabase.
 * Se ejecuta con Prisma contra tu base de datos (usa DIRECT_URL o DATABASE_URL).
 *
 * Uso (desde la raíz del proyecto, con .env cargado):
 *   node scripts/enable-rls.js
 *
 * O con variables ya exportadas:
 *   DIRECT_URL="postgresql://..." node scripts/enable-rls.js
 *
 * RLS es una función de PostgreSQL; Prisma no lo define en el schema, por eso
 * se aplica con este script (una sola vez) o desde el SQL Editor de Supabase.
 */

const path = require("path");
const fs = require("fs");

// Cargar .env manualmente si existe (sin depender de dotenv)
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

const tables = [
  "Account",
  "Session",
  "User",
  "Quiz",
  "Question",
  "Option",
  "QuizAttempt",
  "QuizAnswer",
  "Badge",
  "UserBadge",
  "Scenario",
  "VerificationToken",
  "ExportLog",
];

async function main() {
  // Usar DATABASE_URL (pooler, puerto 6543) primero: suele ser el único alcanzable desde fuera.
  // DIRECT_URL (5432) a veces está restringido en Supabase desde redes externas.
  const url = process.env.DATABASE_URL || process.env.DIRECT_URL;
  if (!url) {
    console.error("Falta DATABASE_URL o DIRECT_URL en el entorno.");
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: {
      db: { url },
    },
  });

  console.log("Habilitando RLS en las tablas public...\n");

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE IF EXISTS public."${table}" ENABLE ROW LEVEL SECURITY`
      );
      console.log(`  ✓ public."${table}"`);
    } catch (err) {
      console.error(`  ✗ public."${table}":`, err.message);
    }
  }

  await prisma.$disconnect();
  console.log("\nListo. El Security Advisor de Supabase debería dejar de marcar RLS deshabilitado.");
}

main();
