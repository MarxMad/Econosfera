import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { checkAuthRateLimit } from "@/lib/rateLimit";

// Asegurar NEXTAUTH_URL válida (evita "Failed to construct URL: Invalid URL")
if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.trim() === "") {
  const fallback =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    "https://econosfera.xyz";
  process.env.NEXTAUTH_URL = fallback.replace(/\/$/, "");
}
if (!process.env.NEXTAUTH_URL.startsWith("http://") && !process.env.NEXTAUTH_URL.startsWith("https://")) {
  process.env.NEXTAUTH_URL = `https://${process.env.NEXTAUTH_URL.replace(/^\/+/, "")}`;
}

if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
  console.error(
    "[NextAuth] NEXTAUTH_SECRET no está definida. El login fallará con 'Server error'. Configúrala en Vercel → Settings → Environment Variables."
  );
}

const handler = NextAuth(authOptions);

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const isSignout = url.pathname.endsWith("/signout");
    if (!isSignout) {
      try {
        const rateLimitRes = await checkAuthRateLimit(req);
        if (rateLimitRes) return rateLimitRes;
      } catch (e) {
        console.error("[NextAuth] Rate limit error:", e);
        return NextResponse.json(
          { error: "CredentialsSignin", message: "Error temporal. Intenta de nuevo." },
          { status: 503 }
        );
      }
    }
    const res = await handler(req);
    return res;
  } catch (e) {
    console.error("[NextAuth] POST error:", e);
    return NextResponse.json(
      { error: "CredentialsSignin", message: "Error del servidor. Intenta de nuevo más tarde." },
      { status: 500 }
    );
  }
}

export { handler as GET };
