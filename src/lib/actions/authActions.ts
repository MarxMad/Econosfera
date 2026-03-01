"use server";

import { prisma } from "../prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendVerificationEmail } from "../email";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function resendVerification() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "No autorizado" };

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) return { error: "Usuario no encontrado" };
    if (user.emailVerified) return { error: "Ya verificado" };

    const userEmail = user.email!;

    // Crear token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await prisma.verificationToken.upsert({
        where: {
            identifier_token: {
                identifier: userEmail,
                token: userEmail
            }
        },
        create: { identifier: userEmail, token, expires },
        update: { token, expires }
    }).catch(async () => {
        await prisma.verificationToken.deleteMany({ where: { identifier: userEmail } });
        await prisma.verificationToken.create({ data: { identifier: userEmail, token, expires } });
    });

    await sendVerificationEmail(userEmail, token, user.name || "Usuario");

    return { success: true };
}

export async function registerUser(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;
        const institution = formData.get("institution") as string;
        const password = formData.get("password") as string;

        if (!email || !password || !name) {
            return { error: "Faltan campos obligatorios" };
        }

        // Verificar si existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "El correo ya está registrado" };
        }

        // Hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                name,
                lastName,
                email,
                institution,
                password: hashedPassword,
            },
        });

        // Generar token de verificación
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hora

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        // Enviar email
        await sendVerificationEmail(email, token, name);

        return { success: true };
    } catch (error: any) {
        console.error("Error en registro:", error);
        return { error: "Error al crear la cuenta" };
    }
}
