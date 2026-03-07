/**
 * Reinicia el progreso de cuestionarios y XP de todos los usuarios.
 * - Elimina todos los QuizAttempt (y QuizAnswer por cascade)
 * - Elimina todos los UserBadge
 * - Pone totalScore y currentStreak en 0 para todos los usuarios
 *
 * Ejecutar: node scripts/reset-quiz-progress.js
 * Requiere: DATABASE_URL en .env
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Reiniciando progreso de cuestionarios y XP...\n');

  // 1. Eliminar intentos de cuestionarios (QuizAnswer se borra por cascade)
  const deletedAttempts = await prisma.quizAttempt.deleteMany({});
  console.log(`  QuizAttempt eliminados: ${deletedAttempts.count}`);

  // 2. Eliminar insignias ganadas
  const deletedBadges = await prisma.userBadge.deleteMany({});
  console.log(`  UserBadge eliminados: ${deletedBadges.count}`);

  // 3. Reiniciar XP y racha de todos los usuarios
  const updated = await prisma.user.updateMany({
    data: { totalScore: 0, currentStreak: 0 },
  });
  console.log(`  Usuarios actualizados (XP=0, racha=0): ${updated.count}`);

  console.log('\n✅ Reinicio completado. Los usuarios pueden resolver los cuestionarios nuevamente.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
