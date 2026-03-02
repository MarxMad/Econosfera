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
