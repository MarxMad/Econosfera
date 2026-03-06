import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { checkStripeRateLimit } from "@/lib/rateLimit";

/** Crea una sesión del Stripe Customer Portal (galería de pago: gestionar método de pago, facturas, cancelar). */
export async function POST(request: Request) {
    const rateLimitRes = await checkStripeRateLimit(request);
    if (rateLimitRes) return rateLimitRes;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
    }
    if (!isStripeConfigured() || !stripe) {
        return NextResponse.json({ error: "Pagos no configurados" }, { status: 503 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { stripeCustomerId: true },
        });
        if (!user?.stripeCustomerId) {
            return NextResponse.json(
                { error: "No tienes una suscripción activa para gestionar. Suscríbete desde la página de precios." },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${baseUrl}/dashboard`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (e: unknown) {
        console.error("Stripe create-portal-session:", e);
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Error al abrir el portal de facturación" },
            { status: 500 }
        );
    }
}
