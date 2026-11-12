import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CorporateFooter } from "@/components/corporate/CorporateFooter";
import { CorporateNav } from "@/components/corporate/CorporateNav";
import { formatArticleDate, getArticles, getArticleLocale } from "@/lib/articles";
import { PAGE_SEO } from "@/lib/locales";

const EMPTY_COPY = {
  en: { intro: "Practical perspectives on talent readiness, hiring, and responsible international recruitment.", empty: "New articles are being prepared. Please check back soon.", all: "All articles", read: "Read article", home: "Home" },
  id: { intro: "Perspektif praktis tentang kesiapan talenta, perekrutan, dan rekrutmen internasional yang bertanggung jawab.", empty: "Artikel baru sedang disiapkan. Silakan kembali nanti.", all: "Semua artikel", read: "Baca artikel", home: "Beranda" },
  ar: { intro: "رؤى عملية حول جاهزية الكفاءات والتوظيف الدولي المسؤول.", empty: "يجري إعداد مقالات جديدة. يرجى العودة قريباً.", all: "كل المقالات", read: "اقرأ المقال", home: "الرئيسية" },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = getArticleLocale(raw);
  if (!locale) return {};
  const copy = PAGE_SEO[locale].articles;
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: `/${locale}/articles`, languages: { en: "/en/articles", id: "/id/articles", ar: "/ar/articles" } },
    openGraph: { title: copy.title, description: copy.description, url: `/${locale}/articles`, locale: locale === "ar" ? "ar_SA" : locale === "id" ? "id_ID" : "en_US" },
  };
}

export default async function LocalizedArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = getArticleLocale(raw);
  if (!locale) notFound();
  const articles = getArticles(locale);
  const copy = EMPTY_COPY[locale];

  return (
    <main className="corp" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <CorporateNav />
      <section className="dtg-articles-hero">
        <p className="dtg-breadcrumb"><Link href={`/${locale}`}>{copy.home}</Link><span>/</span> {copy.all}</p>
        <h1>{copy.all}</h1>
        <p>{copy.intro}</p>
      </section>
      <section className="dtg-articles-content">
        {articles.length ? (
          <>
            <nav className="dtg-article-tabs" aria-label={copy.all}><span className="is-active">{copy.all} <b>({articles.length})</b></span></nav>
            <div className="dtg-article-grid">
              {articles.map((article) => (
                <article className="dtg-article-card" key={article.id}>
                  <Link className="dtg-article-image" href={`/${locale}/articles/${article.slug}`} aria-label={`${copy.read}: ${article.title}`}>
                    <Image src={article.cover} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />
                  </Link>
                  <p className="dtg-article-category">{article.category}</p>
                  {article.publishedAt && <p className="dtg-article-date">{formatArticleDate(article.publishedAt, locale)}</p>}
                  <h2><Link href={`/${locale}/articles/${article.slug}`}>{article.title}</Link></h2>
                  <p className="dtg-article-excerpt">{article.excerpt}</p>
                  <Link className="dtg-read-more" href={`/${locale}/articles/${article.slug}`}>{copy.read} <span>↗</span></Link>
                </article>
              ))}
            </div>
          </>
        ) : (
          <p className="dtg-article-empty" role="status">{copy.empty}</p>
        )}
      </section>
      <CorporateFooter />
    </main>
  );
}

