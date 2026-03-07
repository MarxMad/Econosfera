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

function getNextAuthParams(pathname: string): string[] {
  const match = pathname.match(/^\/api\/auth\/(.+)$/);
  return match ? match[1].split("/").filter(Boolean) : [];
}

/** Context que NextAuth espera: debe tener params con nextauth para usar NextAuthRouteHandler (App Router) */
function buildContext(pathname: string): { params: { nextauth: string[] } } {
  const nextauth = getNextAuthParams(pathname);
  return { params: { nextauth } };
}

export async function POST(
  req: Request,
  context?: { params?: Promise<Record<string, string | string[]>> | Record<string, string | string[]> }
) {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const isSignout = pathname.endsWith("/signout");
    // NextAuth requiere ctx.params para usar NextAuthRouteHandler (App Router).
    // Priorizar context de Next.js; si no existe, construir desde pathname.
    const ctx =
      context && "params" in context && context.params != null
        ? { params: context.params instanceof Promise ? context.params : Promise.resolve(context.params) }
        : buildContext(pathname);
    if (!isSignout) {
      try {
        const rateLimitRes = await checkAuthRateLimit(req);
        if (rateLimitRes) return rateLimitRes;
      } catch (e) {
        console.error("[NextAuth] Rate limit error (continuando sin limit):", e);
        // Si rate limit falla (ej. DB), continuar sin bloquear el login
      }
    }
    // NextAuthRouteHandler requiere req.nextUrl; si falta (ej. en Vercel), añadirlo
    const reqForAuth = req as Request & { nextUrl?: URL };
    if (!reqForAuth.nextUrl && req.url) {
      reqForAuth.nextUrl = new URL(req.url);
    }
    const res = await handler(reqForAuth, ctx);
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
        const body: Record<string, string> = {
          error: "CredentialsSignin",
          message: "Error del servidor. Intenta de nuevo más tarde.",
        };
        if (process.env.DEBUG_AUTH === "1" || process.env.NODE_ENV !== "production") {
          body.debug = "Respuesta 500 no-JSON: " + (text?.slice(0, 300) || "");
        }
        return NextResponse.json(body, { status: 500 });
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
    const body: Record<string, string> = { error: "CredentialsSignin", message: userMsg };
    if (process.env.DEBUG_AUTH === "1" || process.env.NODE_ENV !== "production") {
      body.debug = err.message;
    }
    return NextResponse.json(body, { status: 500 });
  }
}

export async function GET(
  req: Request,
  context?: { params?: Promise<Record<string, string | string[]>> | Record<string, string | string[]> }
) {
  const url = new URL(req.url);
  const ctx =
    context && "params" in context && context.params != null
      ? { params: context.params instanceof Promise ? context.params : Promise.resolve(context.params) }
      : buildContext(url.pathname);
  const reqForAuth = req as Request & { nextUrl?: URL };
  if (!reqForAuth.nextUrl && req.url) {
    reqForAuth.nextUrl = new URL(req.url);
  }
  return handler(reqForAuth, ctx);
}
