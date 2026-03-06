/**
 * Signout alternativo: borra la cookie de sesión y redirige.
 * Evita el 500 del handler estándar de NextAuth (posible conflicto con Prisma/adapter).
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SESSION_COOKIES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export async function GET(request: Request) {
  const callbackUrl =
    new URL(request.url).searchParams.get("callbackUrl") || "/";

  const cookieStore = await cookies();
  for (const name of SESSION_COOKIES) {
    cookieStore.delete(name);
  }
  cookieStore.delete("next-auth.csrf-token");
  cookieStore.delete("__Host-next-auth.csrf-token");

  return NextResponse.redirect(new URL(callbackUrl, request.url));
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => new FormData());
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";

  const cookieStore = await cookies();
  for (const name of SESSION_COOKIES) {
    cookieStore.delete(name);
  }
  cookieStore.delete("next-auth.csrf-token");
  cookieStore.delete("__Host-next-auth.csrf-token");

  return NextResponse.redirect(new URL(callbackUrl, request.url));
}
