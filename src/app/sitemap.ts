import { MetadataRoute } from "next";
import { getTodosLosSlugs } from "@/lib/glosario";
import { getBlogSlugs } from "@/lib/blog";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://econosfera.vercel.app";
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const glossarySlugs = getTodosLosSlugs();
  const glossaryEntries: MetadataRoute.Sitemap = glossarySlugs.map((slug) => ({
    url: `${base}/glosario/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogSlugs = getBlogSlugs();
  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${base}/simulador`, lastModified: new Date(), changeFrequency: "always" as const, priority: 0.9 },
    { url: `${base}/glosario`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${base}/premios-nobel-economia`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.85 },
    ...glossaryEntries,
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...blogEntries,
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/manual`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/cuestionarios`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${base}/aviso-privacidad`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${base}/terminos-condiciones`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
