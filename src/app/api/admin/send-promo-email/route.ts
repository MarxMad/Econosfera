/**
 * Envía correo de promoción/alianza a todos los suscriptores.
 * POST /api/admin/send-promo-email
 * Body: { title: string, body: string, ctaText?: string, ctaUrl?: string, campaignId?: string }
 * Requiere CRON_SECRET o ADMIN_SECRET en Authorization: Bearer <secret>
 */

import { NextResponse } from "next/server";
import {
  getMarketingSubscribers,
  wasRecentlySent,
  logCampaignSent,
  sendPromoEmail,
} from "@/lib/emailCampaigns";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET || process.env.ADMIN_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { title, body: bodyText, ctaText, ctaUrl, campaignId } = body;

  if (!title || !bodyText) {
    return NextResponse.json(
      { error: "Faltan title y body" },
      { status: 400 }
    );
  }

  const subscribers = await getMarketingSubscribers();
  let sent = 0;

  for (const user of subscribers) {
    if (!user.email) continue;

    const id = campaignId || `promo-${Date.now()}`;
    const alreadySent = await wasRecentlySent(user.id, "promo", id, 365);
    if (alreadySent) continue;

    const result = await sendPromoEmail(user.email, user.name || "estudiante", {
      title,
      body: bodyText,
      ctaText,
      ctaUrl,
    });

    if (result.success) {
      await logCampaignSent(user.id, "promo", id);
      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent, total: subscribers.length });
}
