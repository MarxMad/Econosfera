import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { getBlogPosts, CATEGORY_LABEL } from "@/lib/blog";
import { authOptions } from "@/lib/auth";
import BlogPaywall from "@/components/blog/BlogPaywall";

export const metadata: Metadata = {
  title: "Blog | Artículos para economistas",
  description:
    "Artículos sobre política monetaria, macroeconomía, finanzas y metodología. Análisis, datos y referencias para estudiantes y profesionales.",
  openGraph: {
    title: "Blog | Econosfera",
    description: "Artículos para economistas: política monetaria, macro, finanzas y más.",
    url: "/blog",
  },
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const session = await getServerSession(authOptions);
  const isPremium = session?.user?.plan === "PRO" || session?.user?.plan === "RESEARCHER";

  if (!isPremium) {
    return <BlogPaywall />;
  }

  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <header className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Blog
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Artículos para economistas
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Análisis, evidencia y reflexión sobre política monetaria, macroeconomía, finanzas y mercados. Con referencias, datos y formato listo para citar.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-12 sm:p-16 text-center">
            <BookOpen className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              Próximamente
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Estamos preparando artículos extensos con imágenes, citas, referencias y cuadros. Revisa la lista de temas en <strong>docs/BLOG_TEMAS_ARTICULOS.md</strong>.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
                >
                  {post.image ? (
                    <div className="aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={post.image}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-3">
                      {CATEGORY_LABEL[post.category]}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.date).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                      {post.readTimeMinutes != null && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTimeMinutes} min
                        </span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                      Leer artículo
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
