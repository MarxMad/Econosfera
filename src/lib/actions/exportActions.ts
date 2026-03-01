"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function registrarExportacion(modulo: string, type: string = "PDF") {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Debes iniciar sesión para exportar datos y reportes.");
    }

    // Verificar créditos
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true }
    });

    if (!user || user.credits < 1) {
        throw new Error("No tienes créditos suficientes para exportar. Por favor, adquiere más créditos.");
    }

    // Descontar 1 crédito y registrar la exportación
    await prisma.$transaction([
        prisma.user.update({
            where: { id: session.user.id },
            data: {
                credits: { decrement: 1 },
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
