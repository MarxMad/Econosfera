import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendVerificationEmail(email: string, token: string, name: string) {
    if (!resend) {
        console.warn("RESEND_API_KEY no configurada. Saltando envío de email.");
        return { success: false, error: "Servicio de correo no configurado" };
    }

    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}`;

    try {
        const data = await resend.emails.send({
            from: process.env.RESEND_FROM || 'Econosfera <noreply@econosfera.xyz>',
            to: email,
            subject: 'Verifica tu cuenta en Econosfera',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 24px;">
          <h1 style="color: #1e293b; font-size: 24px; font-weight: 800; margin-bottom: 16px;">Hola ${name},</h1>
          <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
            Gracias por unirte a la terminal de análisis económico Econosfera. Para asegurar tu cuenta y activar tus créditos de IA, haz clic en el botón de abajo. Este enlace es válido durante 24 horas. Si pides otro correo de verificación, el enlace anterior dejará de funcionar.
          </p>
          <a href="${verifyUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 700;">Verificar Cuenta</a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 32px; border-top: 1px solid #f1f5f9; pt-16px;">
            Si no creaste esta cuenta, puedes ignorar este correo.
          </p>
        </div>
      `,
        });
        if (data?.error) {
            console.error("Resend API error:", data.error);
            return { success: false, error: (data.error as { message?: string })?.message || "Error al enviar" };
        }
        return { success: true, data };
    } catch (error) {
        console.error("Error enviando email:", error);
        return { success: false, error: error instanceof Error ? error.message : "Error al enviar el correo" };
    }
}
