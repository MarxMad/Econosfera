import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Rate limiting se hace en los route handlers (usa Prisma/Supabase).
 * El middleware en Edge no puede usar Prisma, solo protege dashboard/simulador.
 */
export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const response = NextResponse.next();

    // Auth: dashboard y simulador
    if (path.startsWith("/dashboard") || path.startsWith("/simulador")) {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });
        if (!token) {
            const signInUrl = new URL("/auth/signin", req.url);
            return NextResponse.redirect(signInUrl);
        }
        return response;
    }

    return response;
}

export const config = {
    matcher: ["/dashboard/:path*", "/simulador/:path*"],
};
