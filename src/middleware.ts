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

// Apply to restricted routes only
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/simulador/:path*"
    ],
};
