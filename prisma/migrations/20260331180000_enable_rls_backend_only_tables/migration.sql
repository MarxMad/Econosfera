-- RLS en tablas solo usadas por el servidor (Prisma / API routes).
-- PostgREST (anon / authenticated) no debe leer ni escribir estas tablas.
-- El rol de conexión del servidor (dueño de la tabla o rol con BYPASSRLS) sigue accediendo con Prisma.

ALTER TABLE "RateLimit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "EmailCampaignLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CookieConsentLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PasswordResetToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StripeWebhookEvent" ENABLE ROW LEVEL SECURITY;

-- Políticas explícitas: denegar anon y authenticated (cliente Supabase / API pública).
CREATE POLICY "deny_public_api_RateLimit" ON "RateLimit"
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_public_api_EmailCampaignLog" ON "EmailCampaignLog"
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_public_api_CookieConsentLog" ON "CookieConsentLog"
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_public_api_PasswordResetToken" ON "PasswordResetToken"
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_public_api_StripeWebhookEvent" ON "StripeWebhookEvent"
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);
