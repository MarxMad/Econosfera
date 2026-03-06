"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function registrarExportacion(modulo: string, type: string = "PDF") {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Debes iniciar sesión para exportar datos y reportes.");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true, emailVerified: true, plan: true }
    });

    if (!user) {
        throw new Error("Usuario no encontrado.");
    }
    if (!user.emailVerified) {
        throw new Error("Verifica tu correo electrónico para exportar. Revisa tu bandeja de entrada.");
    }

    const plan = (user.plan ?? "FREE").toUpperCase();
    const exportacionesIlimitadas = plan === "PRO" || plan === "RESEARCHER";

    if (!exportacionesIlimitadas && user.credits < 1) {
        throw new Error("No tienes créditos suficientes para exportar. Por favor, adquiere más créditos o actualiza a Pro.");
    }

    // PRO y RESEARCHER: exportaciones ilimitadas (no consumen créditos). FREE: descuenta 1 crédito.
    await prisma.$transaction([
        prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(exportacionesIlimitadas ? {} : { credits: { decrement: 1 } }),
                exportsCount: { increment: 1 }
            }
        }),
        prisma.exportLog.create({
            data: {
                userId: session.user.id,
                type,
                module: modulo,
            }
        })
    ]);

    return { success: true };
}
