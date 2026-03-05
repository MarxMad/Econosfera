import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, STRIPE_PRICE_PRO, STRIPE_PRICE_RESEARCHER, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
    }
    if (!isStripeConfigured() || !stripe) {
        return NextResponse.json({ error: "Pagos no configurados" }, { status: 503 });
    }

    try {
        const body = await request.json();
        const plan = (body.plan || "student") as string;
        const priceId = plan === "researcher" ? STRIPE_PRICE_RESEARCHER : STRIPE_PRICE_PRO;
        if (!priceId) {
            return NextResponse.json({ error: "Plan no disponible" }, { status: 400 });
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

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
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
                trial_period_days: process.env.STRIPE_TRIAL_DAYS ? parseInt(process.env.STRIPE_TRIAL_DAYS, 10) : undefined,
            },
        });

        return NextResponse.json({ url: sessionStripe.url });
    } catch (e: unknown) {
        console.error("Stripe create-checkout-session:", e);
        return NextResponse.json(
            { error: e instanceof Error ? e.message : "Error al crear la sesión de pago" },
            { status: 500 }
        );
    }
}
