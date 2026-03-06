/**
 * Cron: envía correos de recordatorio semanales.
 * Vercel Cron llama a esta ruta (ver vercel.json).
 * Protegido por CRON_SECRET.
 */

import { NextResponse } from "next/server";
import {
  getMarketingSubscribers,
  wasRecentlySent,
  logCampaignSent,
  sendReminderEmail,
} from "@/lib/emailCampaigns";

export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Resend no configurado" }, { status: 503 });
  }

  const subscribers = await getMarketingSubscribers();
  let sent = 0;
  let skipped = 0;

  for (const user of subscribers) {
    if (!user.email) continue;

    const alreadySent = await wasRecentlySent(user.id, "reminder", null, 7);
    if (alreadySent) {
      skipped++;
      continue;
    }

    const result = await sendReminderEmail(
      user.email,
      user.name || "estudiante"
    );

    if (result.success) {
      await logCampaignSent(user.id, "reminder", null);
      sent++;
    }
  }

  return NextResponse.json({
    ok: true,
    sent,
    skipped,
    total: subscribers.length,
  });
}
