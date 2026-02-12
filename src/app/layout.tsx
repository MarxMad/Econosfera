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

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "Econosfera",
    template: "%s | Econosfera",
  },
  description: "Herramienta didáctica para estudiantes de economía: inflación y política monetaria, macroeconomía y microeconomía. Simuladores y recursos para prácticas.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Econosfera",
    description: "Herramienta didáctica para estudiantes de economía: simuladores de inflación, macro y micro.",
    images: ["/favicon.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased font-sans flex flex-col">
        {ADS_ENABLED && ADSENSE_CLIENT && (
          <Script
            id="adsense"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
            async
          />
        )}
        <div className="flex-1 flex flex-col">
          {children}
          <Footer />
        </div>
        <CookieConsent />
      </body>
    </html>
  );
}
