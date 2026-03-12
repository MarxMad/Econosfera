import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { getBlogPosts, CATEGORY_LABEL } from "@/lib/blog";
import BlogAdBanner from "@/components/blog/BlogAdBanner";

export const metadata: Metadata = {
  title: "Blog | Guías y tips para estudiantes de economía y finanzas",
  description:
    "Guías gratuitas sobre política monetaria, macroeconomía, finanzas y metodología. Cómo usar los simuladores, teoría aplicada y tips para estudiantes.",
  openGraph: {
    title: "Blog | Econosfera",
    description: "Guías y tips gratuitos para estudiantes de economía, finanzas y contabilidad.",
    url: "/blog",
  },
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
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
            Guías gratuitas para estudiantes: cómo usar los simuladores, teoría aplicada y tips de finanzas, contabilidad y economía.
          </p>
        </header>

        <BlogAdBanner format="leaderboard" />

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
          <ul className="grid gap-8 sm:gap-10 md:grid-cols-2">
            {posts.map((post, idx) => (
              <li key={post.slug} className="animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 100}ms` }}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group relative block h-full rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.15)] hover:border-blue-500/50 hover:-translate-y-2"
                >
                  {/* Hover Accent Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {post.image ? (
                    <div className="aspect-[16/9] bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent z-10" />
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,#fff_1px,transparent_1px)] bg-[size:20px_20px]" />
                      <BookOpen className="w-16 h-16 text-white/20" />
                    </div>
                  )}

                  <div className="p-8 sm:p-10 relative z-20">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                        {CATEGORY_LABEL[post.category]}
                      </span>
                      <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base line-clamp-2 mb-8 leading-relaxed font-medium">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.date).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                        {post.readTimeMinutes != null && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTimeMinutes} min
                          </span>
                        )}
                      </div>

                      <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
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
