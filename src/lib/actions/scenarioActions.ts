"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveScenario(data: {
    type: string;
    subType?: string;
    name: string;
    variables: any;
    results?: any;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return { error: "Debes iniciar sesión para guardar escenarios" };
    }

    try {
        const scenario = await prisma.scenario.create({
            data: {
                userId: session.user.id,
                type: data.type,
                subType: data.subType,
                name: data.name,
                data: data.variables,
                results: data.results,
            },
        });

        revalidatePath("/dashboard");
        return { success: true, scenario };
    } catch (e) {
        console.error(e);
        return { error: "Error al guardar el escenario" };
    }
}

export async function getScenarios() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return [];
    }

    return prisma.scenario.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });
}

export async function deleteScenario(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return { error: "No autorizado" };
    }

    try {
        await prisma.scenario.delete({
            where: { id, userId: session.user.id },
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (e) {
        return { error: "Error al eliminar" };
    }
}

export async function getScenarioById(id: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return null;
    }

    return prisma.scenario.findUnique({
        where: { id, userId: session.user.id },
    });
}
