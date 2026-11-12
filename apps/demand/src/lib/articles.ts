import { articleRecords, type ArticleLocale, type ArticleStatus } from "./article-content";

export type { ArticleLocale, ArticleStatus };
export type Article = {
  id: string;
  group: string;
  locale: ArticleLocale;
  status: ArticleStatus;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  readTime: string;
  primaryKeyword: string;
  supportingKeywords: string;
  cover: string;
  body: { type: "p" | "h2" | "h3"; text: string }[];
  reviewStatus: string;
  sourceDocId: string;
  publishedAt?: string;
};

/** Draft records are kept in source control but never returned by public helpers. */
export const articleRecordsAll: Article[] = articleRecords.map((record) => ({
  ...record,
  slug: record.slug.split("/").at(-1) ?? record.slug,
  category: categoryFor(record.group, record.locale),
  body: record.body.map((block) => ({ type: block.type, text: block.text })),
  readTime: `${Math.max(1, Math.ceil(record.body.filter((block) => block.type === "p").reduce((sum, block) => sum + block.text.split(/\s+/).filter(Boolean).length, 0) / 220))} min read`,
}));

export const articles: Article[] = articleRecordsAll.filter((article) => article.status === "published");

export function getArticles(locale: ArticleLocale = "en") {
  return articles.filter((article) => article.locale === locale);
}

export function getArticle(slug: string, locale: ArticleLocale = "en") {
  return articles.find((article) => article.slug === slug && article.locale === locale);
}

export function getPublishedArticlePaths(group: string): Partial<Record<ArticleLocale, string>> {
  return Object.fromEntries(
    articles.filter((article) => article.group === group)
      .map((article) => [article.locale, `/${article.locale}/articles/${article.slug}`]),
  );
}

export function getArticleLocale(value: string): ArticleLocale | null {
  return value === "en" || value === "id" || value === "ar" ? value : null;
}

export function formatArticleDate(value: string | undefined, locale: ArticleLocale) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf())) return value;
  const dateLocale = locale === "id" ? "id-ID" : locale === "ar" ? "ar-SA" : "en-GB";
  return new Intl.DateTimeFormat(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function categoryFor(group: string, locale: ArticleLocale) {
  if (locale === "ar") return group.startsWith("barista") ? "دليل توظيف أصحاب المقاهي" : "دليل توظيف المستشفيات";
  if (locale === "id") return group.startsWith("barista") ? "Panduan Employer Kafe" : "Panduan Employer Rumah Sakit";
  return group.startsWith("barista") ? "Café Employer Guide" : "Hospital Employer Guide";
}

