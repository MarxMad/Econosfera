"use client";

import { useEffect, useRef } from "react";
import { ADS_ENABLED, ADSENSE_CLIENT } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  /** ID del espacio de anuncio (ej. el slot-id que te da AdSense) */
  slotId?: string;
  /** Formato: "auto" (responsive), "rectangle" (300x250), "horizontal" (728x90) */
  format?: "auto" | "rectangle" | "horizontal";
  /** Clases CSS del contenedor */
  className?: string;
  /** Estilo del contenedor (ej. minHeight para evitar saltos de layout) */
  style?: React.CSSProperties;
  /** Nombre del slot para el placeholder cuando los anuncios están desactivados */
  label?: string;
}

export default function AdSlot({
  slotId = "",
  format = "auto",
  className = "",
  style,
  label = "Publicidad",
}: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!ADS_ENABLED || !ADSENSE_CLIENT || !slotId || typeof window === "undefined") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense push error:", e);
    }
  }, [slotId]);

  const formatAttr = format === "auto" ? "auto" : format === "rectangle" ? "vertical" : "horizontal";

  if (!ADS_ENABLED || !ADSENSE_CLIENT) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-sm ${className}`}
        style={{
          minHeight: format === "rectangle" ? 250 : format === "horizontal" ? 90 : 100,
          ...style,
        }}
        aria-hidden
      >
        <span>{label}</span>
      </div>
    );
  }

  if (!slotId) {
    return null;
  }

  return (
    <div className={`overflow-hidden rounded-lg ${className}`} style={style}>
      <ins
        ref={ref}
        className="adsbygoogle block"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={formatAttr}
        data-full-width-responsive={format === "auto" ? "true" : undefined}
        style={{
          display: "block",
          minHeight: format === "rectangle" ? 250 : format === "horizontal" ? 90 : undefined,
        }}
        aria-hidden
      />
    </div>
  );
}
