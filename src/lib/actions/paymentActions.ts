"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CREDITS_PER_MONTH } from "@/lib/stripe";

export async function processPayment(plan: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { error: "Debes iniciar sesión" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return { error: "Usuario no encontrado" };

        let planName = 'PRO';
        let newCredits = user.credits + CREDITS_PER_MONTH.PRO;

        if (plan === 'researcher') {
            planName = 'RESEARCHER';
            newCredits = user.credits + CREDITS_PER_MONTH.RESEARCHER;
        }

        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                plan: planName,
                credits: newCredits
            }
        });

        return { success: true };
    } catch (e: any) {
        console.error("Error al procesar pago:", e);
        return { error: "Error interno al actualizar la cuenta" };
    }
}
