/**
 * Registra el consentimiento de cookies en Supabase (Prisma).
 * Se llama cuando el usuario acepta el banner de cookies.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;

    // Fingerprint opcional: header enviado por el cliente (hash simple para anónimos)
    const fingerprint =
      (request.headers.get("x-consent-fingerprint") as string) || null;

    await prisma.cookieConsentLog.create({
      data: {
        userId,
        fingerprint: fingerprint || undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("cookie-consent:", e);
    return NextResponse.json(
      { error: "Error al registrar consentimiento" },
      { status: 500 }
    );
  }
}
