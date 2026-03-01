
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPasswords() {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, password: true }
    });

    console.log(`Checking ${users.length} users...`);
    for (const user of users) {
        if (!user.password) {
            console.log(`User ${user.email} has no password (likely Google Login)`);
            continue;
        }

        const isHashed = user.password.startsWith('$2');
        if (!isHashed) {
            console.log(`CRITICAL: User ${user.email} has a non-hashed password: ${user.password}`);
        } else {
            console.log(`User ${user.email} has a hashed password.`);
        }
    }
    await prisma.$disconnect();
}

checkPasswords().catch(console.error);
