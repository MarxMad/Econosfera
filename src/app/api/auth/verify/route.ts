import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || request.url.split('/api')[0];

    if (!token) {
        return NextResponse.redirect(new URL('/auth/signin?error=MissingToken', baseUrl));
    }

    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.redirect(new URL('/auth/signin?error=InvalidToken', baseUrl));
        }

        // Si el enlace ya expiró pero el usuario ya fue verificado antes, redirigir como éxito (sin auto-login)
        if (verificationToken.expires < new Date()) {
            const user = await prisma.user.findUnique({
                where: { email: verificationToken.identifier },
                select: { emailVerified: true },
            });
            if (user?.emailVerified) {
                return NextResponse.redirect(new URL('/auth/signin?verified=1', baseUrl));
            }
            return NextResponse.redirect(new URL('/auth/signin?error=InvalidToken', baseUrl));
        }

        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { emailVerified: new Date() },
        });

        await prisma.verificationToken.delete({
            where: { token },
        });

        // Token de un solo uso para iniciar sesión sin pedir contraseña (válido 5 min)
        const loginToken = crypto.randomBytes(32).toString('hex');
        const loginExpires = new Date(Date.now() + 5 * 60 * 1000);
        await prisma.verificationToken.create({
            data: {
                identifier: verificationToken.identifier,
                token: loginToken,
                expires: loginExpires,
            },
        });

        return NextResponse.redirect(new URL(`/auth/signin?verified=1&loginToken=${loginToken}`, baseUrl));
    } catch (error) {
        console.error("Verificación fallida:", error);
        return NextResponse.redirect(new URL('/auth/signin?error=InternalError', baseUrl));
    }
}
