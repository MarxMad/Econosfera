import type { Metadata, Viewport } from "next";
import React from "react";
import Glosario from "@/components/Glosario";
import GlosarioAdLayout from "@/components/GlosarioAdSidebars";
import { TERMINOS, getSlugDeTermino, getDefinicionSEO } from "@/lib/glosario";
import { getBaseUrl } from "@/lib/siteUrl";

export const metadata: Metadata = {
  title: "Glosario de Términos Económicos | Diccionario Finanzas, Inflación y Macroeconomía",
  description:
    "Diccionario económico con más de 100 definiciones: qué es inflación subyacente, Regla de Taylor, brecha de producto, DCF, VPN, TIR, curva IS-LM, Banxico. Referencia académica para estudiantes y profesionales. Consulta gratis.",
  keywords: [
    "glosario económico",
    "diccionario economía",
    "qué es inflación subyacente",
    "definición Regla de Taylor",
    "brecha de producto",
    "términos financieros",
    "inflación",
    "política monetaria",
    "macroeconomía",
    "microeconomía",
    "finanzas",
    "curva de Phillips",
    "IS-LM",
    "DCF",
    "VPN",
    "TIR",
    "Banxico",
    "Cetes",
    "Black-Scholes",
  ],
  openGraph: {
    title: "Glosario de Términos Económicos | Diccionario Finanzas e Inflación | Econosfera",
    description: "Más de 100 definiciones de economía y finanzas: inflación, política monetaria, macro, micro, DCF, bonos. Referencia académica. Consulta sin cuenta.",
    url: "/glosario",
    type: "website",
    locale: "es_MX",
    siteName: "Econosfera",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glosario Económico | Diccionario Finanzas e Inflación",
    description: "Definiciones de inflación, política monetaria, macro, micro y finanzas. Consulta gratis sin crear cuenta.",
  },
  alternates: { canonical: "/glosario" },
  robots: { index: true, follow: true },
};

function GlosarioJsonLd() {
  const base = getBaseUrl();
  const termsWithSlug = TERMINOS.map((t) => ({ ...t, slug: getSlugDeTermino(t.termino) })).filter(
    (t): t is typeof t & { slug: string } => t.slug != null
  );

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Glosario de Términos Económicos",
    description: "Diccionario de economía, finanzas, inflación y política monetaria con definiciones académicas.",
    numberOfItems: termsWithSlug.length,
    itemListElement: termsWithSlug.slice(0, 100).map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "DefinedTerm",
        name: t.termino,
        description: t.definicion.slice(0, 200) + (t.definicion.length > 200 ? "…" : ""),
        url: `${base}/glosario/${t.slug}`,
      },
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: termsWithSlug.slice(0, 50).map((t) => ({
      "@type": "Question",
      name: `¿Qué es ${t.termino}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: getDefinicionSEO(t),
      },
    })),
  };

  const definedTermSetSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glosario de Términos Económicos - Econosfera",
    description: "Conjunto de definiciones de términos económicos y financieros para estudiantes y profesionales.",
    url: `${base}/glosario`,
    hasDefinedTerm: termsWithSlug.slice(0, 50).map((t) => ({
      "@type": "DefinedTerm",
      name: t.termino,
      url: `${base}/glosario/${t.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }} />
    </>
  );
}

export default function GlosarioPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <GlosarioJsonLd />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <GlosarioAdLayout compact={false}>
          <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Cargando glosario...</div>}>
            <Glosario standalone />
          </React.Suspense>
        </GlosarioAdLayout>
      </div>
    </div>
  );
}
