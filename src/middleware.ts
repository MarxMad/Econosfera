import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // Return next action if user is authenticated
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/auth/signin",
        }
    }
);

// Apply to all routes except public, auth routes, and _next/static.
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (NextAuth endpoints)
         * - auth/signin (Login page itself)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api/auth|auth/signin|_next/static|_next/image|favicon.ico).*)",
    ],
};
