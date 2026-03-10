"use client";

import AdSlot from "@/components/AdSlot";
import {
  ADS_ENABLED,
  ADSENSE_CLIENT,
  ADSENSE_SLOT_BLOG_1,
  ADSENSE_SLOT_BLOG_2,
} from "@/lib/ads";

/** XM PipAffiliates: banner líder 728x90 */
const XM_LEADERBOARD = {
  href: "https://clicks.pipaffiliates.com/c?m=131871&c=744292",
  img: "https://ads.pipaffiliates.com/i/131871?c=744292",
  width: 728,
  height: 90,
};

/** XM PipAffiliates: banner casi cuadrado 300x250 */
const XM_RECTANGLE = {
  href: "https://clicks.pipaffiliates.com/c?m=131871&c=744292",
  img: "https://ads.pipaffiliates.com/i/131871?c=744292",
  width: 300,
  height: 250,
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
 * Prioridad: 1) AdSense si está activo, 2) XM PipAffiliates (link directo, sin variables de entorno).
 */
export default function BlogAdBanner({
  slotId,
  format = "leaderboard",
  forArticle = false,
  label = "Publicidad",
}: BlogAdBannerProps) {
  const resolvedSlotId = slotId ?? (forArticle ? ADSENSE_SLOT_BLOG_2 : ADSENSE_SLOT_BLOG_1);
  const showAdSense = ADS_ENABLED && ADSENSE_CLIENT && resolvedSlotId;

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

  const xmBanner = format === "rectangle" ? XM_RECTANGLE : XM_LEADERBOARD;
  const isRectangle = format === "rectangle";
  return (
    <aside
      className="my-6 flex justify-center"
      aria-label="Promoción XM"
    >
      <a
        href={xmBanner.href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        referrerPolicy="no-referrer-when-downgrade"
        className={`block overflow-hidden rounded-xl ${isRectangle ? "w-[300px] max-w-full" : "w-full max-w-[728px] mx-auto"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={xmBanner.img}
          alt="XM - Opera con un broker regulado"
          width={xmBanner.width}
          height={xmBanner.height}
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-auto object-contain"
        />
      </a>
    </aside>
  );
}
