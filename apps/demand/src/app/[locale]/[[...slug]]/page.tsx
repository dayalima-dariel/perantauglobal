import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import EuropePage from "@/app/europe/page";
import ForCandidatesPage from "@/app/for-candidates/page";
import HomePage from "@/app/page";
import PrivacyPage from "@/app/privacy/page";
import RegionsPage from "@/app/regions/page";
import ResourcesPage from "@/app/resources/page";
import ServicesPage from "@/app/services/page";
import TermsPage from "@/app/terms/page";
import JapanPage from "@/app/japan/page";
import { isLocale, LOCALIZED_ROUTES, PAGE_SEO, type Locale } from "@/lib/locales";

const pages = {
  "": HomePage,
  about: AboutPage,
  services: ServicesPage,
  resources: ResourcesPage,
  regions: RegionsPage,
  contact: ContactPage,
  "for-candidates": ForCandidatesPage,
  europe: EuropePage,
  japan: JapanPage,
  privacy: PrivacyPage,
  terms: TermsPage,
};

export function generateStaticParams() {
  return (["en", "id", "ar"] as const).flatMap((locale) =>
    LOCALIZED_ROUTES.filter((route) => route !== "articles").map((route) => ({ locale, slug: route ? route.split("/") : [] })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug = [] } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const route = slug.join("/");
  const copy = PAGE_SEO[locale][route] ?? PAGE_SEO[locale][""];
  const canonical = `/${locale}${route ? `/${route}` : ""}`;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        (["en", "id", "ar"] as const).map((language) => [
          language,
          `/${language}${route ? `/${route}` : ""}`,
        ]),
      ),
    },
    openGraph: { type: "website", title: copy.title, description: copy.description, url: canonical, locale: locale === "ar" ? "ar_SA" : locale === "id" ? "id_ID" : "en_US" },
  };
}

export default async function LocalizedPage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale: rawLocale, slug = [] } = await params;
  if (!isLocale(rawLocale)) notFound();
  const route = slug.join("/");

  if (route === "experience") redirect(`/${rawLocale}/about#evidence`);
  if (route === "insights") redirect(`/${rawLocale}/articles`);
  if (route === "talent") redirect(`/${rawLocale}/for-candidates`);
  if (route === "why-dtg") redirect(`/${rawLocale}/about#why-dtg`);
  if (route === "saudi-gcc") redirect(`/${rawLocale}/saudi-gcc`);
  if (route === "partnerships") redirect(`/${rawLocale}/contact#partnership`);

  const Page = pages[route as keyof typeof pages];
  if (!Page) notFound();
  return <Page />;
}

