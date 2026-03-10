"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Datos consolidados para el dashboard. Una sola llamada reduce queries a la DB.
 */
export async function getDashboardData() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { user: null, scenarios: [] };
  }

  const [user, scenarios] = await Promise.all([
    (prisma.user as any).findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        lastName: true,
        email: true,
        image: true,
        institution: true,
        phone: true,
        occupation: true,
        educationLevel: true,
        emailVerified: true,
        emailMarketingOptIn: true,
        unamCreditsClaimedAt: true,
        credits: true,
        totalScore: true,
        currentStreak: true,
        exportsCount: true,
        plan: true,
        userBadges: { include: { badge: true } },
        quizAttempts: true,
      },
    }),
    prisma.scenario.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { user, scenarios };
}
