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
    default: "Econosfera | Simuladores de inflación, macro y microeconomía",
    template: "%s | Econosfera",
  },
  description:
    "Herramienta didáctica para estudiantes de economía: inflación y política monetaria, macroeconomía y microeconomía. Simuladores interactivos, regla de Taylor, multiplicador keynesiano, oferta y demanda. Datos Banxico, INEGI, exportar PDF.",
  keywords: [
    "economía",
    "inflación",
    "política monetaria",
    "regla de Taylor",
    "macroeconomía",
    "microeconomía",
    "simulador economía",
    "Banxico",
    "INEGI",
    "multiplicador keynesiano",
    "oferta y demanda",
    "estudiantes economía",
    "herramienta didáctica",
  ],
  authors: [{ name: "MarxMad", url: "https://github.com/MarxMad" }],
  creator: "Econosfera",
  publisher: "Econosfera",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
    title: "Econosfera | Simuladores de inflación, macro y microeconomía",
    description:
      "Herramienta didáctica: simuladores de inflación y política monetaria, macroeconomía y microeconomía. Datos Banxico, INEGI. Exportar y compartir.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Econosfera - Herramienta didáctica de inflación, macro y microeconomía",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Econosfera | Simuladores de inflación, macro y microeconomía",
    description: "Herramienta didáctica: simuladores de inflación, macro y micro. Datos Banxico, INEGI.",
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
