import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";
import { articles } from "@/lib/articles";
import { LOCALIZED_ROUTES, LOCALES } from "@/lib/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = LOCALIZED_ROUTES.filter((route) => !["partnerships", "europe", "japan"].includes(route));
  const corporateRoutes = LOCALES.flatMap((locale) => publicRoutes.map((route) => ({
    url: `https://${SITE.domain}/${locale}${route ? `/${route}` : ""}`,
    changeFrequency: route === "articles" ? "weekly" as const : "monthly" as const,
    priority: route === "" ? 1 : route === "contact" ? 0.8 : 0.7,
  })));
  const marketRoutes = LOCALES.flatMap((locale) => ["saudi-gcc", "europe", "japan"].map((route) => ({
    url: `https://${SITE.domain}/${locale}/${route}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })));
  const articleRoutes = articles.map((article) => ({
    url: `https://${SITE.domain}/${article.locale}/articles/${article.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
    ...(article.publishedAt ? { lastModified: new Date(article.publishedAt) } : {}),
  }));
  return [
    ...corporateRoutes,
    ...marketRoutes,
    ...articleRoutes,
  ];
}

