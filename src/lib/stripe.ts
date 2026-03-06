import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
export const stripe = secret ? new Stripe(secret) : null;

export const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO || "";
export const STRIPE_PRICE_RESEARCHER = process.env.STRIPE_PRICE_RESEARCHER || "";

/** Créditos IA que se recargan cada mes por plan (webhook invoice.paid + checkout.session.completed) */
export const CREDITS_PER_MONTH = { PRO: 50, RESEARCHER: 200 } as const;

export function isStripeConfigured(): boolean {
    return Boolean(process.env.STRIPE_SECRET_KEY && (STRIPE_PRICE_PRO || STRIPE_PRICE_RESEARCHER));
}
