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
        console.error("[NextAuth] Rate limit error (continuando sin limit):", e);
        // Si rate limit falla (ej. DB), continuar sin bloquear el login
      }
    }
    const res = await handler(req);
    if (res?.status === 500) {
      const text = await res.text();
      try {
        const parsed = JSON.parse(text);
        if (parsed?.url && typeof parsed.url === "string") {
          try {
            new URL(parsed.url);
          } catch {
            delete parsed.url;
          }
        }
        return NextResponse.json(parsed, { status: 500 });
      } catch {
        console.error("[NextAuth] 500 body no es JSON:", text?.slice(0, 200));
        return NextResponse.json(
          { error: "CredentialsSignin", message: "Error del servidor. Intenta de nuevo más tarde." },
          { status: 500 }
        );
      }
    }
    return res;
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    console.error("[NextAuth] POST error:", err.message, err.stack);
    const msg = err.message?.toLowerCase() || "";
    const userMsg =
      msg.includes("connect") || msg.includes("econnrefused") || msg.includes("database")
        ? "Error de conexión con la base de datos. Verifica DATABASE_URL en Vercel."
        : msg.includes("secret") || msg.includes("nextauth_secret")
          ? "NEXTAUTH_SECRET no configurado. Añádela en Vercel."
          : "Error del servidor. Intenta de nuevo más tarde.";
    return NextResponse.json(
      { error: "CredentialsSignin", message: userMsg },
      { status: 500 }
    );
  }
}

export { handler as GET };
