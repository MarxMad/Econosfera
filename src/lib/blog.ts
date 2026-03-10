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
    title: "La Regla de Taylor en la práctica: cómo los bancos centrales usan la fórmula",
    excerpt: "Una guía sobre el uso de la Regla de Taylor en política monetaria, con evidencia para México y EE.UU.",
    date: "2025-01-15",
    category: "politica-monetaria",
    author: "Econosfera",
    readTimeMinutes: 12,
    metaDescription: "La Regla de Taylor en política monetaria: fórmula, interpretación y evidencia empírica para México.",
  },
  {
    slug: "inflacion-subyacente-vs-general",
    title: "Inflación subyacente vs. general: por qué importa la distinción",
    excerpt: "Definición, componentes excluidos y uso en política monetaria. Guía para interpretar los indicadores del INEGI y Banxico.",
    date: "2025-02-01",
    category: "politica-monetaria",
    author: "Econosfera",
    readTimeMinutes: 10,
    metaDescription: "Diferencias entre inflación subyacente y general en México. Componentes del INPC, metodología INEGI y uso por Banxico.",
  },
  {
    slug: "como-leer-minuta-banxico",
    title: "Cómo leer una minuta de Banxico: guía por secciones",
    excerpt: "Estructura de la minuta de política monetaria, qué buscar en cada párrafo y lenguaje de forward guidance.",
    date: "2025-02-05",
    category: "politica-monetaria",
    author: "Econosfera",
    readTimeMinutes: 11,
    metaDescription: "Guía para interpretar las minutas del Banco de México: estructura, votación y señales de política monetaria.",
  },
  {
    slug: "modelo-is-lm-politica",
    title: "El modelo IS-LM: de la pizarra al diagnóstico de política",
    excerpt: "Derivación intuitiva, desplazamientos de IS y LM, efectos de política fiscal y monetaria en el corto plazo.",
    date: "2025-02-08",
    category: "macroeconomia",
    author: "Econosfera",
    readTimeMinutes: 14,
    metaDescription: "Modelo IS-LM: curvas, equilibrio y efectos de política fiscal y monetaria. Guía para estudiantes de macroeconomía.",
  },
  {
    slug: "dcf-paso-a-paso",
    title: "DCF paso a paso: flujos libres, WACC y valor terminal",
    excerpt: "Construcción de FCF, estimación de WACC y g, valor terminal. Guía práctica de valoración por descuento de flujos.",
    date: "2025-02-10",
    category: "finanzas",
    author: "Econosfera",
    readTimeMinutes: 15,
    metaDescription: "Valoración DCF: cómo construir flujos de caja libres, estimar WACC y calcular el valor terminal. Guía para finanzas corporativas.",
  },
  {
    slug: "elasticidad-precio-demanda",
    title: "Elasticidad precio de la demanda: teoría y aplicación a políticas",
    excerpt: "Definición, cálculo (punto vs. arco), elasticidad e ingreso total. Ejemplos para política de precios e impuestos.",
    date: "2025-02-11",
    category: "microeconomia",
    author: "Econosfera",
    readTimeMinutes: 10,
    metaDescription: "Elasticidad precio de la demanda: fórmulas, tipos (elástica, inelástica) y aplicaciones en política tributaria y precios.",
  },
  {
    slug: "brecha-producto-estimacion",
    title: "Brecha de producto: qué es y cómo se estima",
    excerpt: "Definición, métodos (filtro HP, función de producción) y uso en política monetaria. Referencias a INEGI y Banxico.",
    date: "2025-02-12",
    category: "macroeconomia",
    author: "Econosfera",
    readTimeMinutes: 12,
    metaDescription: "Brecha de producto en México: definición, métodos de estimación (HP, función de producción) y relevancia para política monetaria.",
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
