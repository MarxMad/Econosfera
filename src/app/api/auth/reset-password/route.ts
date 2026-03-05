import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = String(body.email || "").trim().toLowerCase();
        const code = String(body.code || "").trim();
        const newPassword = body.newPassword;

        if (!email || !code || !newPassword) {
            return NextResponse.json({ error: "Faltan email, código o nueva contraseña." }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });
        }

        const tokenRecord = await prisma.passwordResetToken.findFirst({
            where: { email, code },
        });

        if (!tokenRecord) {
            return NextResponse.json({ error: "Código inválido o expirado. Solicita uno nuevo." }, { status: 400 });
        }

        if (tokenRecord.expires < new Date()) {
            await prisma.passwordResetToken.delete({ where: { id: tokenRecord.id } }).catch(() => {});
            return NextResponse.json({ error: "El código ha expirado. Solicita uno nuevo." }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: { email: { equals: email, mode: "insensitive" } },
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: "No se puede restablecer la contraseña de esta cuenta." }, { status: 400 });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed },
        });
        await prisma.passwordResetToken.delete({ where: { id: tokenRecord.id } });

        return NextResponse.json({ success: true, message: "Contraseña actualizada. Ya puedes iniciar sesión." });
    } catch (e) {
        console.error("reset-password:", e);
        return NextResponse.json({ error: "Error interno." }, { status: 500 });
    }
}
