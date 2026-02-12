/**
 * Configuración de publicidad.
 *
 * Para activar Google AdSense:
 * 1. Crea una cuenta en https://www.google.com/adsense/
 * 2. Solicita aprobación (tu sitio debe cumplir políticas de AdSense).
 * 3. Añade en .env.local:
 *    NEXT_PUBLIC_ADS_ENABLED=true
 *    NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX  (tu ID de editor)
 * 4. En el layout se cargará el script de AdSense y los componentes AdSlot
 *    mostrarán los anuncios donde definas slotId (crea las unidades en AdSense).
 *
 * Si NEXT_PUBLIC_ADS_ENABLED no está en true, se muestran placeholders
 * para que el diseño se adapte a los espacios de publicidad.
 */

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

/** Tamaños habituales para bloques de anuncios (responsive). */
export const AD_FORMATS = {
  /** Banner horizontal 728x90 o responsive */
  banner: "horizontal",
  /** Rectángulo medio 300x250 */
  rectangle: "rectangle",
  /** Responsive: se adapta al ancho del contenedor */
  auto: "auto",
} as const;
