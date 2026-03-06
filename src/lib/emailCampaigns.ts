/**
 * Campañas de email: recordatorios, blog, promociones.
 * Usa Resend (mismo que verificación y reset).
 */

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import type { BlogPost } from "@/lib/blog";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.RESEND_FROM || "Econosfera <noreply@econosfera.xyz>";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const FOOTER = `
  <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
    Recibes este correo porque aceptaste notificaciones en Econosfera.
    <a href="${BASE_URL}/dashboard" style="color: #2563eb;">Desactivar en tu perfil</a>.
  </p>
`;

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) return { success: false, error: "Resend no configurado" };
  const data = await resend.emails.send({ from: FROM, to, subject, html });
  if (data?.error) return { success: false, error: (data.error as { message?: string })?.message };
  return { success: true };
}

/** Usuarios que aceptaron marketing y tienen email verificado */
export async function getMarketingSubscribers() {
  return prisma.user.findMany({
    where: {
      emailMarketingOptIn: true,
      email: { not: null },
      emailVerified: { not: null },
    },
    select: { id: true, email: true, name: true },
  });
}

/** ¿Ya enviamos este tipo de campaña a este usuario recientemente? */
export async function wasRecentlySent(
  userId: string,
  campaignType: string,
  slugOrId: string | null,
  minDaysAgo: number
) {
  const since = new Date(Date.now() - minDaysAgo * 24 * 60 * 60 * 1000);
  const existing = await prisma.emailCampaignLog.findFirst({
    where: {
      userId,
      campaignType,
      ...(slugOrId ? { slugOrId } : {}),
      sentAt: { gte: since },
    },
  });
  return !!existing;
}

/** Registrar envío */
export async function logCampaignSent(
  userId: string,
  campaignType: string,
  slugOrId: string | null = null
) {
  await prisma.emailCampaignLog.create({
    data: { userId, campaignType, slugOrId },
  });
}

/** Recordatorio de uso (semanal) */
export async function sendReminderEmail(email: string, name: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 24px;">
      <h1 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Hola ${name || "estudiante"},</h1>
      <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
        Te extrañamos en Econosfera. ¿Listo para practicar con los simuladores de macro, micro o finanzas?
      </p>
      <a href="${BASE_URL}/simulador" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 700;">Abrir simulador</a>
      ${FOOTER}
    </div>
  `;
  return sendEmail(email, "Te extrañamos en Econosfera 💡", html);
}

/** Nueva entrada al blog */
export async function sendBlogPostEmail(
  email: string,
  name: string,
  post: BlogPost
) {
  const url = `${BASE_URL}/blog/${post.slug}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 24px;">
      <h1 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Nuevo artículo: ${post.title}</h1>
      <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
        ${post.excerpt}
      </p>
      <a href="${url}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 700;">Leer artículo</a>
      ${FOOTER}
    </div>
  `;
  return sendEmail(email, `Nuevo en el blog: ${post.title} | Econosfera`, html);
}

/** Promoción o alianza (ej. universidad) */
export async function sendPromoEmail(
  email: string,
  name: string,
  opts: { title: string; body: string; ctaText?: string; ctaUrl?: string }
) {
  const cta = opts.ctaUrl && opts.ctaText
    ? `<a href="${opts.ctaUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 700;">${opts.ctaText}</a>`
    : "";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 24px;">
      <h1 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Hola ${name || "estudiante"},</h1>
      <h2 style="color: #334155; font-size: 18px; margin-bottom: 12px;">${opts.title}</h2>
      <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px; white-space: pre-line;">${opts.body}</p>
      ${cta}
      ${FOOTER}
    </div>
  `;
  return sendEmail(email, opts.title + " | Econosfera", html);
}
