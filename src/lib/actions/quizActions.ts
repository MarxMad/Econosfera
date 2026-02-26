"use server";

import { prisma } from "../prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getUserStats() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    // Forzamos un cast a 'any' para evitar que los lints bloqueen el build
    // mientras el cliente Prisma se regenera correctamente en el entorno de build.
    const user = await (prisma.user as any).findUnique({
        where: { email: session.user.email },
        select: {
            totalScore: true,
            currentStreak: true,
            credits: true,
            exportsCount: true,
            userBadges: {
                include: { badge: true }
            },
            quizAttempts: true
        }
    });

    return user;
}

export async function getQuizzes() {
    return await (prisma as any).quiz.findMany({
        orderBy: { xpReward: 'asc' },
        include: { questions: true }
    });
}
