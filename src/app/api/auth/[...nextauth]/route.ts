import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkAuthRateLimit } from "@/lib/rateLimit";

if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
  console.error(
    "[NextAuth] NEXTAUTH_SECRET no está definida. El login fallará con 'Server error'. Configúrala en Vercel → Settings → Environment Variables."
  );
}

const handler = NextAuth(authOptions);

export async function POST(req: Request) {
  const url = new URL(req.url);
  const isSignout = url.pathname.endsWith("/signout");
  if (!isSignout) {
    const rateLimitRes = await checkAuthRateLimit(req);
    if (rateLimitRes) return rateLimitRes;
  }
  return handler(req);
}

export { handler as GET };
