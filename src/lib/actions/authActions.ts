"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password) {
        return { error: "Email y contraseña son requeridos" };
    }

    const existing = await prisma.user.findUnique({
        where: { email },
    });

    if (existing) {
        return { error: "El usuario ya existe" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                credits: 10, // Créditos iniciales gratis
            },
        });

        return { success: true, user: { id: user.id, email: user.email } };
    } catch (e) {
        console.error(e);
        return { error: "Error al crear el usuario" };
    }
}
