/** URL base del sitio para canonical, JSON-LD y sitemap. */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (typeof process !== "undefined" && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://econosfera.vercel.app";
}
