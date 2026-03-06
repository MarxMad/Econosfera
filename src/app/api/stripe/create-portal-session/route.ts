import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { checkStripeRateLimit } from "@/lib/rateLimit";

function getErrorMessage(e: unknown): string {
    if (e instanceof Error) return e.message;
    if (typeof e === "object" && e !== null && "message" in e && typeof (e as { message: unknown }).message === "string") {
        return (e as { message: string }).message;
    }
    return "Error al abrir el portal de facturación";
}

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
            select: { id: true, stripeCustomerId: true },
        });
        if (!user?.stripeCustomerId) {
            return NextResponse.json(
                { error: "No tienes una suscripción activa en Stripe. Si obtuviste el plan por otro medio, contacta a soporte." },
                { status: 400 }
            );
        }

        const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://econosfera.xyz").replace(/\/$/, "");
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${baseUrl}/dashboard`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (e: unknown) {
        const msg = getErrorMessage(e);
        console.error("Stripe create-portal-session:", e);
        if (msg.includes("No such customer") || msg.includes("No such customer:")) {
            const user = await prisma.user.findFirst({
                where: { email: session.user!.email },
                select: { id: true },
            });
            if (user) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { stripeCustomerId: null, stripeSubscriptionId: null },
                });
            }
            return NextResponse.json(
                { error: "La suscripción anterior ya no es válida (cliente eliminado o cuenta Stripe cambiada). Suscríbete de nuevo desde la página de precios." },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
