/**
 * Textos para citar la herramienta Econosfera en trabajos académicos.
 * La URL se resuelve en el cliente con window.location.origin si está disponible.
 */

const NOMBRE = "Econosfera";
const DESCRIPCION = "Herramienta didáctica de inflación y política monetaria";

function getUrlBase(): string {
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "https://econosfera.vercel.app"; // Fallback si se usa en SSR
}

const ANIO = new Date().getFullYear();

export function getCitaApa(urlBase?: string): string {
  const base = urlBase ?? getUrlBase();
  return `${NOMBRE}. (${ANIO}). ${DESCRIPCION}. ${base}`;
}

export function getCitaChicago(urlBase?: string): string {
  const base = urlBase ?? getUrlBase();
  return `${NOMBRE}. ${ANIO}. "${DESCRIPCION}." Accedido el ${new Date().toLocaleDateString("es-MX", { dateStyle: "long" })}. ${base}.`;
}

export function getCitaBibtex(urlBase?: string): string {
  const base = urlBase ?? getUrlBase();
  return `@misc{econosfera${ANIO},
  author = {{${NOMBRE}}},
  title = {${DESCRIPCION}},
  year = {${ANIO}},
  url = {${base}},
  note = {Herramienta didáctica en línea}
}`;
}
