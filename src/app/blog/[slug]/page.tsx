import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Calendar, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { getBlogPostBySlug, getBlogSlugs, CATEGORY_LABEL } from "@/lib/blog";
import { BLOG_CONTENT } from "@/lib/blogContent";
import { authOptions } from "@/lib/auth";
import BlogPaywall from "@/components/blog/BlogPaywall";

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
  const session = await getServerSession(authOptions);
  const isPremium = session?.user?.plan === "PRO" || session?.user?.plan === "RESEARCHER";

  if (!isPremium) {
    return <BlogPaywall forArticle />;
  }

  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const ContentComponent = BLOG_CONTENT[post.slug];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <article className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>
        </nav>

        <header className="mb-10">
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-4">
            {CATEGORY_LABEL[post.category]}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            {post.readTimeMinutes != null && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTimeMinutes} min de lectura
              </span>
            )}
            {post.author && (
              <span>{post.author}</span>
            )}
          </div>
        </header>

        <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl">
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
        </div>

        <footer className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-700">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver todos los artículos
          </Link>
        </footer>
      </article>
    </div>
  );
}
