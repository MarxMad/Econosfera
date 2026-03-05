/**
 * Normaliza emails existentes en la BD: trim + lowercase.
 * Ejecutar una vez si tienes usuarios que no pueden iniciar sesión por mayúsculas/espacios.
 *
 * Uso: node scripts/normalize-emails.js
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
const url = process.env.DATABASE_URL || process.env.DIRECT_URL;
const prisma = url
  ? new PrismaClient({ datasources: { db: { url } } })
  : new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  let updated = 0;
  for (const u of users) {
    if (!u.email) continue;
    const norm = u.email.trim().toLowerCase();
    if (norm !== u.email) {
      try {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: u.id },
            data: { email: norm },
          }),
          prisma.verificationToken.updateMany({
            where: { identifier: u.email },
            data: { identifier: norm },
          }),
        ]);
        console.log(`  ${u.email} → ${norm}`);
        updated++;
      } catch (err) {
        console.error(`  Error con ${u.email}:`, err.message);
      }
    }
  }
  await prisma.$disconnect();
  console.log(`\nListo. ${updated} email(s) normalizado(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
