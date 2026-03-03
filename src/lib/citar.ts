/**
 * Textos para citar la herramienta Econosfera en trabajos académicos.
 * Se usa la URL canónica econosfera.xyz en todas las citas.
 */

const NOMBRE = "Econosfera";
const DESCRIPCION = "Herramienta didáctica de inflación y política monetaria";
const URL_CANONICA = "https://econosfera.xyz";

function getUrlBase(): string {
  return URL_CANONICA;
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
