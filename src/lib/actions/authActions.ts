"use server";

import { prisma } from "../prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendVerificationEmail } from "../email";
import crypto from "crypto";

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
