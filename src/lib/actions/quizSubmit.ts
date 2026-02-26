"use server";

import { prisma } from "../prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function submitQuizAttempt(quizId: string, score: number, xpReward: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "No autorizado" };

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) return { error: "Usuario no encontrado" };

        // Insert attempt
        const existingAttempt = await prisma.quizAttempt.findFirst({
            where: { userId: user.id, quizId }
        });

        await prisma.quizAttempt.create({
            data: {
                userId: user.id,
                quizId,
                score,
                completed: true
            }
        });

        // Award XP only if first time attempting
        if (!existingAttempt) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    totalScore: { increment: xpReward }
                }
            });
        }

        // Simplified badge logic
        if (score === 100) {
            const badge = await prisma.badge.findFirst(); // just give first badge as demo
            if (badge) {
                await prisma.userBadge.upsert({
                    where: { userId_badgeId: { userId: user.id, badgeId: badge.id } },
                    update: {},
                    create: { userId: user.id, badgeId: badge.id }
                });
            }
        }

        return { success: true };
    } catch (error: any) {
        console.error(error);
        return { error: error.message };
    }
}

export async function getQuizById(id: string) {
    return await prisma.quiz.findUnique({
        where: { id },
        include: {
            questions: {
                include: { options: true }
            }
        }
    });
}
