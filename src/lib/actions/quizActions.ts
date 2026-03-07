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

/** Verifica si el usuario puede acceder al cuestionario según su plan. Free: primeros 2; Pro/Researcher: todos. */
export async function canAccessQuiz(quizId: string): Promise<boolean> {
    const session = await getServerSession(authOptions);
    const plan = (session?.user as any)?.plan ?? "FREE";
    if (plan === "PRO" || plan === "RESEARCHER") return true;

    const quizzes = await (prisma as any).quiz.findMany({
        orderBy: { xpReward: 'asc' },
        select: { id: true }
    });
    const idx = quizzes.findIndex((q: any) => q.id === quizId);
    return idx >= 0 && idx < 2; // Free: solo primeros 2 cuestionarios
}
