import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { stripe, CREDITS_PER_MONTH } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    if (!stripe) {
        return NextResponse.json({ error: "Stripe no configurado" }, { status: 503 });
    }
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET no definido");
        return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });
    }

    const headersList = await headers();
    const sig = headersList.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "Falta firma" }, { status: 400 });

    let event: Stripe.Event;
    try {
        const body = await request.text();
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret) as Stripe.Event;
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Unknown";
        console.error("Webhook signature verification failed:", message);
        return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                const plan = (session.metadata?.plan || "PRO") as string;
                if (userId && (plan === "PRO" || plan === "RESEARCHER")) {
                    const credits = CREDITS_PER_MONTH[plan];
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            plan,
                            credits: { increment: credits },
                            stripeSubscriptionId: session.subscription as string | null,
                        },
                    });
                }
                break;
            }
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const sub = event.data.object as Stripe.Subscription;
                const customerId = sub.customer as string;
                const user = await prisma.user.findFirst({
                    where: { stripeCustomerId: customerId },
                    select: { id: true },
                });
                if (user) {
                    const isActive = sub.status === "active" || sub.status === "trialing";
                    const planFromMetadata = (sub.metadata?.plan as string) || "PRO";
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            plan: isActive ? planFromMetadata : "FREE",
                            stripeSubscriptionId: isActive ? sub.id : null,
                        },
                    });
                }
                break;
            }
            case "invoice.paid": {
                const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null };
                const subId = invoice.subscription;
                if (!subId) break;
                const sub = await stripe.subscriptions.retrieve(subId as string);
                const customerId = sub.customer as string;
                const user = await prisma.user.findFirst({
                    where: { stripeCustomerId: customerId },
                    select: { id: true, plan: true },
                });
                if (user && (user.plan === "PRO" || user.plan === "RESEARCHER")) {
                    const creditsToAdd = CREDITS_PER_MONTH[user.plan];
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { credits: { increment: creditsToAdd } },
                    });
                }
                break;
            }
            default:
                break;
        }
    } catch (e) {
        console.error("Webhook handler error:", e);
        return NextResponse.json({ error: "Error procesando evento" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
