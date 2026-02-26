import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.redirect(new URL('/dashboard?error=MissingToken', request.url));
    }

    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken || verificationToken.expires < new Date()) {
            return NextResponse.redirect(new URL('/dashboard?error=InvalidToken', request.url));
        }

        // Actualizar usuario
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { emailVerified: new Date() },
        });

        // Borrar token usado
        await prisma.verificationToken.delete({
            where: { token },
        });

        return NextResponse.redirect(new URL('/dashboard?verified=true', request.url));
    } catch (error) {
        console.error("Verificación fallida:", error);
        return NextResponse.redirect(new URL('/dashboard?error=InternalError', request.url));
    }
}
