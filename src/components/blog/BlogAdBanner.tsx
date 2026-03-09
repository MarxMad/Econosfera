"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import AdSlot from "@/components/AdSlot";
import {
  ADS_ENABLED,
  ADSENSE_CLIENT,
  ADSENSE_SLOT_BLOG_1,
  ADSENSE_SLOT_BLOG_2,
  AFFILIATE_ENABLED,
  AFFILIATE_BROKER_NAME,
  AFFILIATE_BROKER_URL,
  AFFILIATE_CTA_TEXT,
  AFFILIATE_BROKER_IMAGE,
} from "@/lib/ads";

/** XM PipAffiliates: banner líder 728x90 */
const XM_LEADERBOARD = {
  href: "https://clicks.pipaffiliates.com/c?m=131871&c=744292",
  img: "https://ads.pipaffiliates.com/i/131871?c=744292",
  width: 728,
  height: 90,
};

interface BlogAdBannerProps {
  /** Slot ID de AdSense (opcional). Si no se pasa, usa BLOG_1 o BLOG_2 según contexto. */
  slotId?: string;
  /** Formato: leaderboard (728x90) o rectangle (300x250) */
  format?: "leaderboard" | "rectangle";
  /** Si true, usa el slot para artículos (BLOG_2). Si false, usa el de página principal (BLOG_1). Solo aplica cuando slotId no está definido. */
  forArticle?: boolean;
  /** Etiqueta para el placeholder cuando no hay anuncios */
  label?: string;
}

/**
 * Banner de publicidad para el blog.
 * Prioridad: 1) AdSense si está activo, 2) XM/affiliate, 3) Placeholder.
 */
export default function BlogAdBanner({
  slotId,
  format = "leaderboard",
  forArticle = false,
  label = "Publicidad",
}: BlogAdBannerProps) {
  const resolvedSlotId = slotId ?? (forArticle ? ADSENSE_SLOT_BLOG_2 : ADSENSE_SLOT_BLOG_1);
  const showAdSense = ADS_ENABLED && ADSENSE_CLIENT && resolvedSlotId;
  const showXmAffiliate = !showAdSense;
  const showAffiliate = !showAdSense && AFFILIATE_ENABLED && AFFILIATE_BROKER_URL;

  if (showAdSense) {
    const adFormat = format === "leaderboard" ? "horizontal" : "rectangle";
    return (
      <aside className="my-6 flex justify-center" aria-label="Anuncio">
        <AdSlot
          slotId={resolvedSlotId}
          format={adFormat as "auto" | "rectangle" | "horizontal"}
          label={label}
          className="min-w-0 w-full max-w-full"
        />
      </aside>
    );
  }

  if (showXmAffiliate && format === "leaderboard") {
    return (
      <aside className="my-6 flex justify-center min-h-[90px]" aria-label="Promoción XM">
        <a
          href={XM_LEADERBOARD.href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full max-w-[728px] mx-auto overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={XM_LEADERBOARD.img}
            alt="XM"
            width={XM_LEADERBOARD.width}
            height={XM_LEADERBOARD.height}
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-auto max-w-full object-contain"
          />
        </a>
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
        style={{
          minHeight: format === "rectangle" ? 250 : 90,
        }}
      >
        <span>{label}</span>
      </div>
    </aside>
  );
}
