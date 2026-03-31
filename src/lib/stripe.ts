import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

// Pricing
export const REGULAR_PRICE_CENTS = 39500; // $395
export const EARLY_BIRD_PRICE_CENTS = 29500; // $295
export const EARLY_BIRD_DEADLINE = new Date("2026-04-30T23:59:59");

export function isEarlyBird(): boolean {
  return new Date() <= EARLY_BIRD_DEADLINE;
}

export function getCurrentPrice(): { cents: number; isEarlyBird: boolean } {
  const early = isEarlyBird();
  return {
    cents: early ? EARLY_BIRD_PRICE_CENTS : REGULAR_PRICE_CENTS,
    isEarlyBird: early,
  };
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}
