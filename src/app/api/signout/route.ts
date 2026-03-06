/**
 * Signout alternativo: borra la cookie de sesión y redirige.
 * Evita el 500 del handler estándar de NextAuth (posible conflicto con Prisma/adapter).
 */

import { NextResponse } from "next/server";

const SESSION_COOKIES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

function clearSessionCookies(response: NextResponse) {
  const path = "/";
  for (const name of SESSION_COOKIES) {
    response.cookies.set(name, "", { maxAge: 0, path });
  }
  response.cookies.set("next-auth.csrf-token", "", { maxAge: 0, path });
  response.cookies.set("__Host-next-auth.csrf-token", "", { maxAge: 0, path });
}

export async function GET(request: Request) {
  const callbackUrl =
    new URL(request.url).searchParams.get("callbackUrl") || "/";

  const response = NextResponse.redirect(new URL(callbackUrl, request.url));
  clearSessionCookies(response);
  return response;
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => new FormData());
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";

  const response = NextResponse.redirect(new URL(callbackUrl, request.url));
  clearSessionCookies(response);
  return response;
}
