import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;
export const stripe = secret ? new Stripe(secret, { apiVersion: "2023-10-16" }) : null;

export const STRIPE_PRICE_PRO = process.env.STRIPE_PRICE_PRO || "";
export const STRIPE_PRICE_RESEARCHER = process.env.STRIPE_PRICE_RESEARCHER || "";

export function isStripeConfigured(): boolean {
    return Boolean(process.env.STRIPE_SECRET_KEY && (STRIPE_PRICE_PRO || STRIPE_PRICE_RESEARCHER));
}
