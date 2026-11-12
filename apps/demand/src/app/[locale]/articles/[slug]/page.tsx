import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CorporateFooter } from "@/components/corporate/CorporateFooter";
import { CorporateNav } from "@/components/corporate/CorporateNav";
import { LanguageSwitch } from "@/components/corporate/LanguageSwitch";
import { formatArticleDate, getArticle, getArticles, getArticleLocale, getPublishedArticlePaths, type Article } from "@/lib/articles";
import { PAGE_SEO } from "@/lib/locales";

const COPY = {
  en: { home: "Home", articles: "Articles", next: "Related articles", all: "View all →", faq: "Frequently asked questions", nextStep: "Next step", nextStepCopy: "Before progressing a role, confirm its responsibilities, written employment terms, required checks, and who owns each decision for that hiring route.", candidate: "For candidate information and applications, visit Perantau Global.", candidateLink: "Explore Perantau Global" },
  id: { home: "Beranda", articles: "Artikel", next: "Artikel terkait", all: "Lihat semua →", faq: "Pertanyaan umum", nextStep: "Langkah berikutnya", nextStepCopy: "Sebelum melanjutkan proses suatu posisi, pastikan tanggung jawab kerja, kondisi kerja tertulis, pemeriksaan yang diperlukan, dan pihak yang bertanggung jawab atas setiap keputusan.", candidate: "Informasi dan lamaran kandidat tersedia melalui Perantau Global.", candidateLink: "Kunjungi Perantau Global" },
  ar: { home: "الرئيسية", articles: "المقالات", next: "مقالات ذات صلة", all: "عرض الكل ←", faq: "أسئلة شائعة", nextStep: "الخطوة التالية", nextStepCopy: "قبل متابعة التوظيف، تأكد من مسؤوليات الدور وشروط العمل المكتوبة والفحوصات المطلوبة والجهة المسؤولة عن كل قرار.", candidate: "للاطلاع على معلومات المرشحين والطلبات، تفضل بزيارة Perantau Global.", candidateLink: "زيارة Perantau Global" },
} as const;

function readFaqs(blocks: Article["body"]) {
  const faqs: { question: string; answer: string }[] = [];
  let question = "";
  for (const block of blocks) {
    if (block.type === "h3") question = block.text;
    else if (block.type === "p" && question) {
      faqs.push({ question, answer: block.text });
      question = "";
    }
  }
  return faqs;
}

// Only slugs returned by generateStaticParams (approved published records) exist publicly.
export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles("en").concat(getArticles("id"), getArticles("ar"))
    .map((article) => ({ locale: article.locale, slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = getArticleLocale(raw);
  const article = locale ? getArticle(slug, locale) : undefined;
  if (!article || !locale) return {};
  const alternates = getPublishedArticlePaths(article.group);
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/${locale}/articles/${article.slug}`, languages: alternates },
    openGraph: { type: "article", title: article.title, description: article.excerpt, url: `/${locale}/articles/${article.slug}`, locale: locale === "ar" ? "ar_SA" : locale === "id" ? "id_ID" : "en_US" },
  };
}

export default async function LocalizedArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = getArticleLocale(raw);
  const article = locale ? getArticle(slug, locale) : undefined;
  if (!locale || !article) notFound();
  const copy = COPY[locale];
  const related = getArticles(locale).filter((item) => item.group !== article.group).slice(0, 2);
  const wordCount = article.body.reduce((sum, block) => sum + (block.type === "p" ? block.text.split(/\s+/).filter(Boolean).length : 0), 0);
  const readTime = `${Math.max(1, Math.ceil(wordCount / 220))} min read`;
  const faqIndex = article.body.findIndex((block) => block.type === "h2" && block.text === copy.faq);
  const nextStepIndex = article.body.findIndex((block, index) => index > faqIndex && block.type === "h2" && block.text === copy.nextStep);
  const articleBodyEnd = faqIndex >= 0 ? faqIndex : nextStepIndex >= 0 ? nextStepIndex : article.body.length;
  const faqEnd = nextStepIndex > faqIndex ? nextStepIndex : article.body.length;
  const faqs = faqIndex >= 0 ? readFaqs(article.body.slice(faqIndex + 1, faqEnd)) : [];

  return (
    <main className="corp" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <CorporateNav />
      <section className="dtg-post-hero">
        <div className="dtg-post-hero-copy">
          <p className="dtg-breadcrumb"><Link href={`/${locale}`}>{copy.home}</Link><span>/</span><Link href={`/${locale}/articles`}>{copy.articles}</Link><span>/</span> {article.category}</p>
          <h1>{article.title}</h1>
        </div>
        <div className="dtg-post-hero-image"><Image src={article.cover} alt="" fill priority sizes="(max-width: 800px) 100vw, 52vw" /></div>
      </section>
      <section className="dtg-post-layout">
        <article className="dtg-post-content">
          <div className="dtg-post-language"><LanguageSwitch alternatePaths={getPublishedArticlePaths(article.group)} /></div>
          <p className="dtg-post-meta"><span>Daya Talenta Global</span>{article.publishedAt && <span>{formatArticleDate(article.publishedAt, locale)}</span>}<span>{article.category}</span><span>{readTime}</span></p>
          <p className="dtg-post-intro">{article.excerpt}</p>
          <div className="dtg-post-body">{article.body.slice(0, articleBodyEnd).map((block, index) => (
            <section key={`${index}-${block.text.slice(0, 30)}`}>
              {block.type === "h2" && <h3>{block.text}</h3>}
              {block.type === "h3" && <h4>{block.text}</h4>}
              {block.type === "p" && <p>{block.text}</p>}
            </section>
          ))}</div>
          {faqs.length > 0 && <section className="dtg-post-faq" aria-labelledby="article-faq-title">
            <h2 id="article-faq-title">{copy.faq}</h2>
            <div className="dtg-post-faq-list">{faqs.map((faq) => <details className="dtg-post-faq-item" key={faq.question}>
              <summary>{faq.question}<span aria-hidden="true">＋</span></summary>
              <div className="dtg-post-faq-answer"><p>{faq.answer}</p></div>
            </details>)}</div>
          </section>}
          <section className="dtg-post-next-step">
            <h2>{copy.nextStep}</h2>
            <p>{copy.nextStepCopy}</p>
          </section>
        </article>
        <aside className="dtg-post-sidebar">
          {related.length > 0 && <div className="dtg-related"><p><b>{copy.next}</b><Link href={`/${locale}/articles`}>{copy.all}</Link></p>{related.map((item) => <Link className="dtg-related-item" href={`/${locale}/articles/${item.slug}`} key={item.id}><Image src={item.cover} alt="" width={76} height={58} /><span><b>{item.title}</b>{item.publishedAt && <small>{formatArticleDate(item.publishedAt, locale)}</small>}</span></Link>)}</div>}
          <div className="dtg-sidebar-cta"><p>{copy.candidate}</p><a href="https://www.perantauglobal.com/" target="_blank" rel="noreferrer">{copy.candidateLink}</a></div>
        </aside>
      </section>
      <CorporateFooter />
    </main>
  );
}

