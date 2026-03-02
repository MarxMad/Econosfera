/**
 * Configuración de publicidad.
 *
 * Para activar Google AdSense:
 * 1. Crea una cuenta en https://www.google.com/adsense/
 * 2. Solicita aprobación (tu sitio debe cumplir políticas de AdSense).
 * 3. Añade en .env.local:
 *    NEXT_PUBLIC_ADS_ENABLED=true
 *    NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX  (tu ID de editor)
 *    NEXT_PUBLIC_ADSENSE_SLOT_GLOSARIO_1=XXXXXXXX (opcional, unidad para glosario)
 *    NEXT_PUBLIC_ADSENSE_SLOT_GLOSARIO_2=XXXXXXXX (opcional, segunda unidad)
 * 4. En el layout se cargará el script de AdSense y los componentes AdSlot
 *    mostrarán los anuncios donde definas slotId (crea las unidades en AdSense).
 *
 * Para banners de referido (ej. broker):
 *    NEXT_PUBLIC_AFFILIATE_ENABLED=true
 *    NEXT_PUBLIC_AFFILIATE_BROKER_NAME=Nombre del broker
 *    NEXT_PUBLIC_AFFILIATE_BROKER_URL=https://... (tu link de referido)
 *    NEXT_PUBLIC_AFFILIATE_CTA_TEXT=Abre tu cuenta (opcional)
 *
 * Si NEXT_PUBLIC_ADS_ENABLED no está en true, se muestran placeholders
 * para que el diseño se adapte a los espacios de publicidad.
 */

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
export const ADSENSE_SLOT_GLOSARIO_1 = process.env.NEXT_PUBLIC_ADSENSE_SLOT_GLOSARIO_1 || "";
export const ADSENSE_SLOT_GLOSARIO_2 = process.env.NEXT_PUBLIC_ADSENSE_SLOT_GLOSARIO_2 || "";

export const AFFILIATE_ENABLED = process.env.NEXT_PUBLIC_AFFILIATE_ENABLED === "true";
export const AFFILIATE_BROKER_NAME = process.env.NEXT_PUBLIC_AFFILIATE_BROKER_NAME || "Broker";
export const AFFILIATE_BROKER_URL = process.env.NEXT_PUBLIC_AFFILIATE_BROKER_URL || "";
export const AFFILIATE_CTA_TEXT = process.env.NEXT_PUBLIC_AFFILIATE_CTA_TEXT || "Conocer más";
export const AFFILIATE_BROKER_IMAGE = process.env.NEXT_PUBLIC_AFFILIATE_BROKER_IMAGE || "";

/** Tamaños habituales para bloques de anuncios (responsive). */
export const AD_FORMATS = {
  /** Banner horizontal 728x90 o responsive */
  banner: "horizontal",
  /** Rectángulo medio 300x250 */
  rectangle: "rectangle",
  /** Responsive: se adapta al ancho del contenedor */
  auto: "auto",
} as const;
