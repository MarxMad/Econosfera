import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkAuthRateLimit } from "@/lib/rateLimit";
import crypto from "crypto";

function generateCode(): string {
    return String(crypto.randomInt(100000, 999999));
}

export async function POST(request: Request) {
    const rateLimitRes = await checkAuthRateLimit(request);
    if (rateLimitRes) return rateLimitRes;

    try {
        const body = await request.json();
        const email = String(body.email || "").trim().toLowerCase();
        if (!email) {
            return NextResponse.json({ error: "Ingresa tu correo electr?nico" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: { email: { equals: email, mode: "insensitive" } },
        });

        // Siempre responder ?xito para no revelar si el correo existe
        if (!user) {
            return NextResponse.json({ success: true, message: "Si el correo est? registrado, recibir?s un c?digo en unos minutos." });
        }

        if (!user.password) {
            return NextResponse.json({ success: true, message: "Si el correo est? registrado, recibir?s un c?digo en unos minutos." });
        }

        const code = generateCode();
        const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await prisma.passwordResetToken.deleteMany({ where: { email: user.email! } });
        await prisma.passwordResetToken.create({
            data: { email: user.email!, code, expires },
        });

        const sendResult = await sendPasswordResetEmail(
            user.email!,
            code,
            user.name || "Usuario"
        );

        if (!sendResult.success) {
            console.error("Error enviando c?digo de reset:", sendResult.error);
            return NextResponse.json({ error: "No pudimos enviar el correo. Intenta de nuevo m?s tarde." }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Si el correo est? registrado, recibir?s un c?digo en unos minutos." });
    } catch (e) {
        console.error("forgot-password:", e);
        return NextResponse.json({ error: "Error interno." }, { status: 500 });
    }
}
