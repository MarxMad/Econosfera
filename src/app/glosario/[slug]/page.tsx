import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, BookOpen, ArrowLeft, Link2 } from "lucide-react";
import { getTerminoBySlug, getTodosLosSlugs, getTerminosPorModulo, getSlugDeTermino } from "@/lib/glosario";
import { getBaseUrl } from "@/lib/siteUrl";

const MODULO_LABEL: Record<string, string> = {
  inflacion: "Inflación",
  macro: "Macro",
  micro: "Micro",
  finanzas: "Finanzas",
  general: "General",
  blockchain: "Blockchain",
  actuaria: "Actuaria",
  estadistica: "Estadística",
  teorias: "Teorías",
};

function truncateDescription(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength).lastIndexOf(" ");
  return (cut > 0 ? text.slice(0, cut) : text.slice(0, maxLength)) + "…";
}

export async function generateStaticParams() {
  return getTodosLosSlugs().map((slug) => ({ slug }));
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const termino = getTerminoBySlug(slug);
  if (!termino) return { title: "Término no encontrado" };

  const base = getBaseUrl();
  const url = `${base}/glosario/${slug}`;
  const description = truncateDescription(termino.definicion, 155);
  const label = MODULO_LABEL[termino.modulo] ?? termino.modulo;

  return {
    title: `${termino.termino} | Glosario Económico`,
    description,
    keywords: [termino.termino, label, "definición", "economía", "glosario"],
    openGraph: {
      title: `${termino.termino} | Glosario Económico | Econosfera`,
      description,
      url,
      type: "article",
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default function GlosarioTerminoPage({ params }: Props) {
  const { slug } = params;
  const termino = getTerminoBySlug(slug);
  if (!termino) notFound();

  const base = getBaseUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: termino.termino,
    description: termino.definicion,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Glosario de Términos Económicos",
      url: `${base}/glosario`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: base },
      { "@type": "ListItem", position: 2, name: "Glosario", item: `${base}/glosario` },
      { "@type": "ListItem", position: 3, name: termino.termino, item: `${base}/glosario/${slug}` },
    ],
  };

  const label = MODULO_LABEL[termino.modulo] ?? termino.modulo;

  const relacionados = getTerminosPorModulo(termino.modulo)
    .filter((t) => t.termino !== termino.termino)
    .slice(0, 6)
    .map((t) => ({ termino: t.termino, slug: getSlugDeTermino(t.termino) }))
    .filter((r): r is { termino: string; slug: string } => r.slug != null);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link href="/glosario" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Glosario
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-slate-700 dark:text-slate-200 font-medium truncate" aria-current="page">
            {termino.termino}
          </span>
        </nav>

        <article className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {termino.termino}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{termino.definicion}</p>

            {termino.formula && (
              <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Fórmula
                </p>
                <p className="font-mono text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-nowrap">
                  {termino.formula}
                </p>
              </div>
            )}

            {termino.ejemplo && (
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wide mb-1">
                  Ejemplo
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic">{termino.ejemplo}</p>
              </div>
            )}

            {relacionados.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Link2 className="w-3.5 h-3.5" />
                  Términos relacionados
                </p>
                <ul className="flex flex-wrap gap-2">
                  {relacionados.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/glosario/${r.slug}`}
                        className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        {r.termino}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="px-6 sm:px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/glosario"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver todos los términos
            </Link>
          </div>
        </article>

        <p className="mt-6 text-center">
          <Link
            href="/glosario"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Explorar glosario completo
          </Link>
        </p>
      </div>
    </div>
  );
}
