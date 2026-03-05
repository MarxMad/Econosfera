/**
 * Restablece la contraseña de un usuario por email.
 * Útil si no puedes entrar y sabes tu correo.
 *
 * Uso: node scripts/reset-password.js "tu@email.com" "tuNuevaContraseña"
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

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const url = process.env.DATABASE_URL || process.env.DIRECT_URL;
const prisma = url
  ? new PrismaClient({ datasources: { db: { url } } })
  : new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim()?.toLowerCase();
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error("Uso: node scripts/reset-password.js \"tu@email.com\" \"tuNuevaContraseña\"");
    process.exit(1);
  }

  const users = await prisma.user.findMany({ where: { email: { not: null } } });
  const user = users.find((u) => u.email?.trim().toLowerCase() === email);

  if (!user) {
    console.error("No existe ningún usuario con ese correo.");
    process.exit(1);
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  await prisma.$disconnect();
  console.log("Contraseña actualizada. Ya puedes iniciar sesión con la nueva.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
