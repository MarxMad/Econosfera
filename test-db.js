const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findFirst();
  console.log('SUCCESS:', users);
}
main().catch(console.error).finally(() => prisma.$disconnect());
