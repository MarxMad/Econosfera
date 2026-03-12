import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { getBlogPostBySlug, getBlogSlugs, CATEGORY_LABEL } from "@/lib/blog";
import { BLOG_CONTENT } from "@/lib/blogContent";
import BlogAdBanner from "@/components/blog/BlogAdBanner";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: `${post.title} | Blog Econosfera`,
    description: post.metaDescription ?? post.excerpt,
    openGraph: {
      title: `${post.title} | Blog Econosfera`,
      description: post.metaDescription ?? post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const ContentComponent = BLOG_CONTENT[post.slug];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] selection:bg-blue-500/30">
      {/* Reading Progress Bar (Client Component needed for real interactivity, but for now we skip or use CSS) */}
      <div className="fixed top-0 left-0 h-1.5 bg-blue-600 z-[100] transition-all" style={{ width: '0%' }} id="reading-progress" />

      {/* Hero Header Section */}
      <div className="relative w-full overflow-hidden pt-20 pb-12 sm:pb-20">
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent)]" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <nav aria-label="Breadcrumb" className="mb-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Volver al centro de consulta
            </Link>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-xl shadow-blue-500/30">
                  {CATEGORY_LABEL[post.category]}
                </span>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {post.readTimeMinutes} min
                  </span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                {post.title}
              </h1>

              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl border-l-4 border-blue-500 pl-6 py-2">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  <img src="/favicon.png" alt="Econosfera" className="w-8 h-8 opacity-50 grayscale invert dark:invert-0" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{post.author ?? "Econosfera Research"}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Actualizado el {new Date(post.date).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 blur-[100px] opacity-20 -z-10" />
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative rotate-3 hover:rotate-0 transition-all duration-700">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-slate-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-[1fr_300px] gap-16 py-12">
        <article className="prose prose-slate dark:prose-invert prose-lg max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 dark:prose-headings:text-white
          prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400
          prose-strong:text-slate-900 dark:prose-strong:text-white
          prose-img:rounded-[2.5rem] prose-img:shadow-2xl
          prose-code:text-blue-600 dark:prose-code:text-blue-400
          prose-a:no-underline hover:prose-a:underline
        ">
          {ContentComponent ? (
            <ContentComponent />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-10 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">
                Contenido en preparación. Este artículo estará disponible pronto.
              </p>
            </div>
          )}
        </article>

        <aside className="space-y-12">
          <div className="sticky top-24 space-y-12">
            {/* TOC Placeholder or Dynamic Sections can go here */}

            <div className="p-8 rounded-[2rem] bg-slate-900 text-white space-y-6">
              <h4 className="text-lg font-black leading-tight">¿Te gusta este contenido?</h4>
              <p className="text-slate-400 text-sm font-medium">Unimos teoría y simuladores para que domines el mercado.</p>
              <button className="w-full py-4 rounded-xl bg-blue-600 font-black text-sm hover:bg-blue-500 transition-all">
                Únete al Newsletter
              </button>
            </div>

            <BlogAdBanner format="rectangle" forArticle label="Sponsors" />
          </div>
        </aside>
      </div>

      {/* Final Call To Action */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <footer className="mt-14 pt-12 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-black text-blue-600 dark:text-blue-400 hover:gap-4 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Explorar otros temas de consulta
            </Link>
            <div className="flex gap-4">
              {/* Social Share Mockups */}
              {['TW', 'LI', 'FB'].map(s => (
                <button key={s} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-[10px] font-black dark:text-slate-500">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
