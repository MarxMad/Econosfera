import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/auth/signin?error=MissingToken', request.url));
    }

    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.redirect(new URL('/auth/signin?error=InvalidToken', request.url));
        }

        // Si el enlace ya expiró pero el usuario ya fue verificado antes, redirigir como éxito
        if (verificationToken.expires < new Date()) {
            const user = await prisma.user.findUnique({
                where: { email: verificationToken.identifier },
                select: { emailVerified: true },
            });
            if (user?.emailVerified) {
                return NextResponse.redirect(new URL('/auth/signin?verified=1', request.url));
            }
            return NextResponse.redirect(new URL('/auth/signin?error=InvalidToken', request.url));
        }

        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { emailVerified: new Date() },
        });

        await prisma.verificationToken.delete({
            where: { token },
        });

        return NextResponse.redirect(new URL('/auth/signin?verified=1', request.url));
    } catch (error) {
        console.error("Verificación fallida:", error);
        return NextResponse.redirect(new URL('/auth/signin?error=InternalError', request.url));
    }
}
