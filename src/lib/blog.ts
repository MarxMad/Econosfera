/**
 * Blog: tipos y datos para artículos.
 * Los artículos se pueden almacenar en MDX, CMS o aquí como datos estáticos.
 */

export type BlogCategory =
  | "politica-monetaria"
  | "macroeconomia"
  | "microeconomia"
  | "finanzas"
  | "mercados"
  | "metodologia"
  | "datos"
  | "opinion";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  category: BlogCategory;
  author?: string;
  image?: string; // URL
  readTimeMinutes?: number;
  /** Para SEO */
  metaDescription?: string;
}

export const CATEGORY_LABEL: Record<BlogCategory, string> = {
  "politica-monetaria": "Política monetaria",
  macroeconomia: "Macroeconomía",
  microeconomia: "Microeconomía",
  finanzas: "Finanzas",
  mercados: "Mercados",
  metodologia: "Metodología",
  datos: "Datos y evidencia",
  opinion: "Opinión",
};

/** Listado de entradas (por ahora vacío o con placeholders; se puede conectar a MDX/CMS). */
const POSTS: BlogPost[] = [
  {
    slug: "ejemplo-regla-taylor",
    title: "La Regla de Taylor: Marco de Decisión para la Política Monetaria Moderna",
    excerpt: "Un análisis exhaustivo sobre cómo John Taylor transformó la banca central. Incluye la derivación de la fórmula, el ajuste por tasa neutral y su aplicación en la economía mexicana.",
    date: "2025-01-15",
    category: "politica-monetaria",
    author: "Econosfera Research",
    readTimeMinutes: 12,
    image: "/blog/taylor-rule.png",
    metaDescription: "Análisis técnico de la Regla de Taylor en México. Aprende a calcular la tasa de política monetaria sugerida basada en inflación y brecha de producto.",
  },
  {
    slug: "inflacion-subyacente-vs-general",
    title: "Inflación Subyacente vs. General: La Brújula de los Bancos Centrales",
    excerpt: "Más allá de los titulares. Descubre por qué Banxico ignora ciertos precios volátiles y cómo los economistas detectan la tendencia inflacionaria de fondo.",
    date: "2025-02-01",
    category: "politica-monetaria",
    author: "Econosfera Research",
    readTimeMinutes: 10,
    image: "/blog/inflacion-compare.png",
    metaDescription: "Guía de consulta sobre la inflación subyacente. Diferencias clave con la inflación general y su impacto en las tasas de interés.",
  },
  {
    slug: "como-leer-minuta-banxico",
    title: "Anatomía de una Minuta de Banxico: Guía de Interpretación Técnica",
    excerpt: "Aprende a decodificar el lenguaje del forward guidance. Desde la balanza de riesgos hasta el análisis de tópicos, convertimos un documento denso en señales de mercado claras.",
    date: "2025-02-05",
    category: "politica-monetaria",
    author: "Econosfera Research",
    readTimeMinutes: 11,
    image: "/blog/minuta-banxico.png",
    metaDescription: "Decodifica las señales de Banxico. Guía paso a paso para leer y entender las minutas de política monetaria.",
  },
  {
    slug: "modelo-is-lm-politica",
    title: "El Modelo IS-LM en el Siglo XXI: Diagnóstico de Política Fiscal y Monetaria",
    excerpt: "De la teoría de Hicks a la realidad económica actual. Analizamos la interacción entre el mercado de bienes y dinero para predecir el impacto de los estímulos fiscales.",
    date: "2025-02-08",
    category: "macroeconomia",
    author: "Econosfera Research",
    readTimeMinutes: 14,
    image: "/blog/is-lm.png",
    metaDescription: "Macroeconomía aplicada: El modelo IS-LM para entender tasas de interés y renta nacional.",
  },
  {
    slug: "dcf-paso-a-paso",
    title: "Valoración DCF de Alto Nivel: Flujos Libres, WACC y Escenarios Terminales",
    excerpt: "La metodología definitiva para valorar activos. Una guía técnica sobre la construcción de flujos de caja, estimación de Betas y el rigor matemático del valor terminal.",
    date: "2025-02-10",
    category: "finanzas",
    author: "Econosfera Research",
    readTimeMinutes: 15,
    image: "/blog/dcf-valuation.png",
    metaDescription: "Domina el Discounted Cash Flow. Guía completa paso a paso para valuación de empresas y proyectos.",
  },
  {
    slug: "elasticidad-precio-demanda",
    title: "Elasticidad Precio: Sensibilidad de Mercado y Optimización de Ingresos",
    excerpt: "Análisis microeconómico sobre la respuesta de la demanda. Aprende a aplicar elasticidades arco y punto para predecir el impacto de cambios en precios e impuestos.",
    date: "2025-02-11",
    category: "microeconomia",
    author: "Econosfera Research",
    readTimeMinutes: 10,
    image: "/blog/elasticidad.png",
    metaDescription: "Microeconomía de consulta: Fórmulas y aplicaciones de la elasticidad precio de la demanda.",
  },
];

export function getBlogPosts(): BlogPost[] {
  return [...POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getBlogSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}
