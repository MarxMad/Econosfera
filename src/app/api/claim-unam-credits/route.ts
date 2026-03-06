/**
 * Reclamar 10 créditos extra por ser estudiante UNAM.
 * Una sola vez por usuario. Requiere cuenta verificada e institución UNAM.
 * Transacción atómica para evitar doble reclamación.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAuthRateLimit } from "@/lib/rateLimit";

const UNAM_CREDITS = 10;

function isUnamInstitution(institution: string | null): boolean {
  if (!institution || !institution.trim()) return false;
  const norm = institution.trim().toLowerCase();
  return (
    norm.includes("unam") ||
    norm.includes("universidad nacional autónoma de méxico")
  );
}

export async function POST(request: Request) {
  const rateLimitRes = await checkAuthRateLimit(request);
  if (rateLimitRes) return rateLimitRes;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        emailVerified: true,
        institution: true,
        unamCreditsClaimedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Verifica tu correo antes de reclamar" },
        { status: 400 }
      );
    }

    if (user.unamCreditsClaimedAt) {
      return NextResponse.json(
        { error: "Ya reclamaste tus créditos UNAM" },
        { status: 400 }
      );
    }

    if (!isUnamInstitution(user.institution)) {
      return NextResponse.json(
        { error: "Esta oferta es solo para estudiantes UNAM" },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const current = await tx.user.findUnique({
        where: { id: user.id },
        select: { unamCreditsClaimedAt: true },
      });
      if (current?.unamCreditsClaimedAt) return null;

      return tx.user.update({
        where: { id: user.id },
        data: {
          credits: { increment: UNAM_CREDITS },
          unamCreditsClaimedAt: new Date(),
        },
        select: { credits: true },
      });
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Ya reclamaste tus créditos UNAM" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      credits: updated.credits,
      message: "¡10 créditos extra añadidos!",
    });
  } catch (e) {
    console.error("claim-unam-credits:", e);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
