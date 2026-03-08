import type { Metadata } from "next";
import { NOBELES_ECONOMIA } from "@/lib/teoriasEconomicas";
import { getBaseUrl } from "@/lib/siteUrl";
import PremiosNobelContent from "@/components/PremiosNobelContent";

export const metadata: Metadata = {
  title: "Premios Nobel de Economía | Lista Completa 1969-2024 | Econosfera",
  description:
    "Lista completa de los Premios Nobel de Ciencias Económicas desde 1969. Paul Samuelson, Milton Friedman, Robert Solow, Joseph Stiglitz, Richard Thaler y más. Biografías y contribuciones de cada galardonado.",
  keywords: [
    "Premio Nobel Economía",
    "Nobel Prize Economics",
    "galardonados Nobel economía",
    "Paul Samuelson",
    "Milton Friedman",
    "Robert Solow",
    "Joseph Stiglitz",
    "Richard Thaler",
    "Claudia Goldin",
    "historia economía",
    "economistas Nobel",
  ],
  openGraph: {
    title: "Premios Nobel de Economía | Lista Completa 1969-2024 | Econosfera",
    description:
      "Lista completa de los Premios Nobel de Ciencias Económicas. Descubre las contribuciones de Paul Samuelson, Milton Friedman, Robert Solow y más economistas galardonados.",
    url: "/premios-nobel-economia",
    type: "website",
    locale: "es_MX",
    siteName: "Econosfera",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premios Nobel de Economía | Econosfera",
    description: "Lista completa de galardonados con el Nobel de Economía desde 1969.",
  },
  alternates: { canonical: "/premios-nobel-economia" },
  robots: { index: true, follow: true },
};

/** JSON-LD ItemList para los Premios Nobel (SEO) */
function NobelJsonLd() {
  const baseUrl = getBaseUrl();
  const items = NOBELES_ECONOMIA.map((n, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Event",
      name: `Premio Nobel de Economía ${n.year}`,
      startDate: `${n.year}-01-01`,
      description: n.descripcion,
      performer: {
        "@type": "Person",
        name: n.autor,
      },
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Premios Nobel de Ciencias Económicas",
    description: "Lista completa de galardonados con el Premio Nobel de Economía desde 1969.",
    numberOfItems: NOBELES_ECONOMIA.length,
    itemListElement: items,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function PremiosNobelPage() {
  return (
    <>
      <NobelJsonLd />
      <main className="min-h-screen bg-slate-100 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <PremiosNobelContent nobeles={NOBELES_ECONOMIA} />
        </div>
      </main>
    </>
  );
}
