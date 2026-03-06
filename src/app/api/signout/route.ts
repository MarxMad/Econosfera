/**
 * Signout alternativo: borra la cookie de sesión y redirige.
 * Evita el 500 del handler estándar de NextAuth (posible conflicto con Prisma/adapter).
 * Usa las mismas opciones que NextAuth al crear la cookie para que el navegador la borre.
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "__Host-next-auth.session-token",
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

const isProd = process.env.NODE_ENV === "production";

function clearCookie(response: NextResponse, name: string, httpOnly = true) {
  response.cookies.set(name, "", {
    path: "/",
    maxAge: 0,
    httpOnly,
    sameSite: "lax",
    secure: isProd,
  });
}

function clearSessionCookies(response: NextResponse, names: string[]) {
  for (const name of names) {
    const isCsrf = name.includes("csrf") || name.includes("callback-url");
    clearCookie(response, name, !isCsrf);
  }
}

export async function GET(request: Request) {
  const callbackUrl =
    new URL(request.url).searchParams.get("callbackUrl") || "/";

  const response = NextResponse.redirect(new URL(callbackUrl, request.url));

  // Borrar TODAS las cookies de NextAuth que vengan en la request
  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  const toDelete: string[] = [];
  for (const c of all) {
    if (
      c.name.includes("session") ||
      c.name.includes("auth") ||
      c.name.includes("authjs") ||
      c.name.includes("csrf") ||
      c.name.includes("callback-url")
    ) {
      toDelete.push(c.name);
    }
  }
  const namesToClear =
    toDelete.length > 0
      ? toDelete
      : [...SESSION_COOKIES, "next-auth.csrf-token", "__Host-next-auth.csrf-token", "__Secure-next-auth.csrf-token", "next-auth.callback-url"];
  for (const name of namesToClear) {
    try {
      cookieStore.delete(name);
    } catch {
      // Ignorar si delete no está soportado en este contexto
    }
  }
  clearSessionCookies(response, namesToClear);

  return response;
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => new FormData());
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";

  const response = NextResponse.redirect(new URL(callbackUrl, request.url));

  const cookieStore = await cookies();
  const all = cookieStore.getAll();
  const toDelete: string[] = [];
  for (const c of all) {
    if (
      c.name.includes("session") ||
      c.name.includes("auth") ||
      c.name.includes("authjs") ||
      c.name.includes("csrf") ||
      c.name.includes("callback-url")
    ) {
      toDelete.push(c.name);
    }
  }
  const namesToClear =
    toDelete.length > 0
      ? toDelete
      : [...SESSION_COOKIES, "next-auth.csrf-token", "__Host-next-auth.csrf-token", "__Secure-next-auth.csrf-token", "next-auth.callback-url"];
  for (const name of namesToClear) {
    try {
      cookieStore.delete(name);
    } catch {
      // Ignorar
    }
  }
  clearSessionCookies(response, namesToClear);

  return response;
}
