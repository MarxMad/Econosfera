import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, STRIPE_PRICE_PRO, STRIPE_PRICE_RESEARCHER, isStripeConfigured } from "@/lib/stripe";
import { checkStripeRateLimit } from "@/lib/rateLimit";
function getErrorMessage(e: unknown): string {
    if (e instanceof Error) return e.message;
    if (typeof e === "object" && e !== null && "message" in e && typeof (e as { message: unknown }).message === "string") {
        return (e as { message: string }).message;
    }
    return "Error al crear la sesión de pago";
}

export async function POST(request: Request) {
    try {
        const rateLimitRes = await checkStripeRateLimit(request);
        if (rateLimitRes) return rateLimitRes;

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
        }
        if (!isStripeConfigured() || !stripe) {
            return NextResponse.json({ error: "Pagos no configurados" }, { status: 503 });
        }

        let body: { plan?: string } = {};
        try {
            body = await request.json();
        } catch {
            body = {};
        }
        const plan = (body.plan || "student") as string;
        const priceId = plan === "researcher" ? STRIPE_PRICE_RESEARCHER : STRIPE_PRICE_PRO;
        if (!priceId) {
            return NextResponse.json({ error: "Plan no disponible. Configura STRIPE_PRICE_PRO o STRIPE_PRICE_RESEARCHER." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user?.email) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

        let customerId = user.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name || undefined,
                metadata: { userId: user.id },
            });
            customerId = customer.id;
            await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customerId },
            });
        }

        const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://econosfera.xyz").replace(/\/$/, "");
        const trialDaysRaw = process.env.STRIPE_TRIAL_DAYS;
        const trialDays = trialDaysRaw ? parseInt(trialDaysRaw, 10) : undefined;
        const trialPeriodDays = trialDays && !isNaN(trialDays) && trialDays > 0 ? trialDays : undefined;

        const sessionStripe = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${baseUrl}/dashboard?subscription=success`,
            cancel_url: `${baseUrl}/pricing`,
            metadata: { userId: user.id, plan: plan === "researcher" ? "RESEARCHER" : "PRO" },
            subscription_data: {
                metadata: { userId: user.id, plan: plan === "researcher" ? "RESEARCHER" : "PRO" },
                trial_period_days: trialPeriodDays,
            },
        });

        const url = sessionStripe.url;
        if (!url) {
            console.error("Stripe checkout session created but url is null");
            return NextResponse.json({ error: "Stripe no devolvió URL de checkout" }, { status: 500 });
        }
        return NextResponse.json({ url });
    } catch (e: unknown) {
        const msg = getErrorMessage(e);
        console.error("Stripe create-checkout-session:", e);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
