"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import {
  ADS_ENABLED,
  ADSENSE_CLIENT,
  AFFILIATE_ENABLED,
  AFFILIATE_BROKER_NAME,
  AFFILIATE_BROKER_URL,
  AFFILIATE_CTA_TEXT,
  AFFILIATE_BROKER_IMAGE,
} from "@/lib/ads";

/** Iframes XM PipAffiliates (enlaces directos, sin variables de entorno) */
const XM_IFRAME_SMALL = "https://images.pipaffiliates.com/f/b?g=1011&c=744292";  // 320x100
const XM_IFRAME_LARGE = "https://images.pipaffiliates.com/f/b?g=1013&c=744292";  // 300x250

interface GlosarioAdBannerProps {
  /** Slot ID de AdSense para esta posición (opcional). Si no hay, se muestra affiliate o placeholder. */
  slotId?: string;
  /** Formato del bloque AdSense */
  format?: "auto" | "rectangle" | "horizontal";
  /** Etiqueta para el placeholder cuando no hay anuncios */
  label?: string;
}

/**
 * Banner de publicidad para páginas de concepto del glosario.
 * Prioridad: 1) AdSense si está activo y hay slotId, 2) Banner de referido (broker) si está activo, 3) Placeholder.
 */
export default function GlosarioAdBanner({
  slotId = "",
  format = "rectangle",
  label = "Publicidad",
}: GlosarioAdBannerProps) {
  const showAdSense = ADS_ENABLED && ADSENSE_CLIENT && slotId;
  const showXmAffiliate = !showAdSense; // XM siempre visible cuando no hay AdSense
  const showAffiliate = !showAdSense && AFFILIATE_ENABLED && AFFILIATE_BROKER_URL;

  if (showAdSense) {
    return (
      <aside className="my-6 flex justify-center" aria-label="Anuncio">
        <AdSlot slotId={slotId} format={format} label={label} className="min-w-0 w-full max-w-full" />
      </aside>
    );
  }

  if (showXmAffiliate) {
    const isRectangle = format === "rectangle";
    const src = isRectangle ? XM_IFRAME_LARGE : XM_IFRAME_SMALL;
    const width = isRectangle ? 300 : 320;
    const height = isRectangle ? 250 : 100;
    return (
      <aside className="my-6 flex justify-center" aria-label="Promoción XM">
        <iframe
          src={src}
          width={width}
          height={height}
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
          title="XM Afiliados"
        />
      </aside>
    );
  }

  if (showAffiliate) {
    return (
      <aside className="my-6" aria-label="Promoción de partner">
        <Link
          href={AFFILIATE_BROKER_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-900/80 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
        >
          {AFFILIATE_BROKER_IMAGE ? (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AFFILIATE_BROKER_IMAGE}
                alt=""
                className="w-full h-full object-contain p-1"
              />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {AFFILIATE_BROKER_NAME.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Recomendado para ti
            </p>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {AFFILIATE_BROKER_NAME}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Opera con un broker regulado. Tu capital en riesgo.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium group-hover:bg-blue-700 transition-colors shrink-0">
            {AFFILIATE_CTA_TEXT}
            <ExternalLink className="w-4 h-4" />
          </span>
        </Link>
      </aside>
    );
  }

  return (
    <aside className="my-6 flex justify-center" aria-hidden>
      <div
        className="flex items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-sm w-full"
        style={{ minHeight: format === "rectangle" ? 250 : format === "horizontal" ? 90 : 100 }}
      >
        <span>{label}</span>
      </div>
    </aside>
  );
}
