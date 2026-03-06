/**
 * Rate limiting usando Supabase/PostgreSQL (Prisma).
 * Sin dependencias externas: usa la misma base de datos del proyecto.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const AUTH_LIMIT = 5;
const AUTH_WINDOW_MS = 60 * 1000; // 1 minuto
const STRIPE_LIMIT = 10;
const STRIPE_WINDOW_MS = 60 * 1000;

/** Obtiene IP del request (Vercel, etc.) */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function checkLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<boolean> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  const existing = await prisma.rateLimit.findUnique({
    where: { key },
  });

  if (!existing) {
    await prisma.rateLimit.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return true;
  }

  if (existing.windowStart < windowStart) {
    await prisma.rateLimit.update({
      where: { key },
      data: { count: 1, windowStart: now },
    });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  await prisma.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
  return true;
}

export function isRateLimitEnabled(): boolean {
  return true; // Siempre activo con Supabase
}

/**
 * Verifica rate limit para auth. Si se excede, retorna Response con 429.
 */
export async function checkAuthRateLimit(
  request: Request
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const key = `auth:${ip}`;
  const allowed = await checkLimit(key, AUTH_LIMIT, AUTH_WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta de nuevo en unos minutos." },
      { status: 429 }
    );
  }
  return null;
}

/**
 * Verifica rate limit para Stripe. Si se excede, retorna Response con 429.
 */
export async function checkStripeRateLimit(
  request: Request
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const key = `stripe:${ip}`;
  const allowed = await checkLimit(key, STRIPE_LIMIT, STRIPE_WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Espera un momento." },
      { status: 429 }
    );
  }
  return null;
}

