/**
 * Envía notificación de nueva entrada al blog a todos los suscriptores.
 * POST /api/admin/send-blog-email
 * Body: { slug: string, secret: string }
 * Requiere CRON_SECRET o ADMIN_SECRET en Authorization: Bearer <secret>
 */

import { NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/blog";
import {
  getMarketingSubscribers,
  wasRecentlySent,
  logCampaignSent,
  sendBlogPostEmail,
} from "@/lib/emailCampaigns";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET || process.env.ADMIN_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const slug = body.slug as string;
  if (!slug) {
    return NextResponse.json({ error: "Falta slug del post" }, { status: 400 });
  }

  const post = getBlogPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
  }

  const subscribers = await getMarketingSubscribers();
  let sent = 0;

  for (const user of subscribers) {
    if (!user.email) continue;

    const alreadySent = await wasRecentlySent(user.id, "blog", slug, 365);
    if (alreadySent) continue;

    const result = await sendBlogPostEmail(
      user.email,
      user.name || "estudiante",
      post
    );

    if (result.success) {
      await logCampaignSent(user.id, "blog", slug);
      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent, total: subscribers.length });
}
