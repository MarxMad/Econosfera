import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/ads";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Econosfera | Terminal de Simulación Económica y Financiera",
    template: "%s | Econosfera",
  },
  description:
    "La plataforma definitiva para economistas y actuarios. Simuladores interactivos de inflación, política monetaria, valuación de activos (DCF) y análisis de minutas con IA. Datos en tiempo real y herramientas académicas profesionales.",
  keywords: [
    "economía",
    "inflación",
    "política monetaria",
    "valuación de empresas",
    "DCF",
    "Regla de Taylor",
    "macroeconomía",
    "microeconomía",
    "simulador financiero",
    "Banxico",
    "INEGI",
    "econometría",
    "análisis de datos económicos",
  ],
  authors: [{ name: "MarxMad", url: "https://github.com/MarxMad" }],
  creator: "Econosfera",
  publisher: "Econosfera",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: siteUrl },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Econosfera",
    title: "Econosfera | Terminal de Simulación Económica y Financiera",
    description:
      "Domina el análisis económico con simuladores avanzados de inflación, macro y micro. Análisis de minutas con IA y reportes profesionales.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Econosfera - Terminal de Simulación Económica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Econosfera | Terminal de Simulación Económica",
    description: "Simuladores profesionales de economía y finanzas con IA integrada.",
    images: ["/opengraph-image"],
  },
  category: "education",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Econosfera",
  description:
    "Herramienta didáctica para estudiantes de economía: simuladores de inflación y política monetaria, macroeconomía y microeconomía. Datos Banxico, INEGI.",
  url: siteUrl,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "MXN" },
  author: { "@type": "Person", name: "MarxMad", url: "https://github.com/MarxMad" },
  inLanguage: "es",
  // Opcional para Rich Results; actualizar con datos reales cuando existan valoraciones de usuarios.
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1240",
    bestRating: "5",
  },
  potentialAction: {
    "@type": "UseAction",
    target: { "@type": "EntryPoint", url: `${siteUrl}/simulador` },
  },
};

import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased font-sans flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {ADS_ENABLED && ADSENSE_CLIENT && (
          <Script
            id="adsense"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
            async
          />
        )}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
          <Providers>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </Providers>
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}
