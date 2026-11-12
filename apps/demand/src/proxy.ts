import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/lib/locales";

const NON_PAGE_PREFIXES = ["/api", "/_next", "/images", "/fonts"];
const NON_PAGE_FILES = ["/favicon.ico", "/robots.txt", "/sitemap.xml"];
const REMOVED_SAMPLE_ARTICLE_SLUGS = new Set([
  "memahami-langkah-awal-menuju-karier-global",
  "memulai-karier-global-dengan-persiapan-yang-tepat",
  "mengapa-employer-global-membutuhkan-partner-talenta",
  "belajar-dari-cerita-perantau-global",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (NON_PAGE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
      NON_PAGE_FILES.includes(pathname) || /\.[a-z0-9]+$/i.test(pathname)) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1];
  const locale = isLocale(firstSegment) ? firstSegment : "en";
  const articleSlug = isLocale(firstSegment) ? pathname.split("/")[3] : pathname.split("/")[2];
  const isArticlePath = isLocale(firstSegment)
    ? pathname.split("/")[2] === "articles"
    : pathname.split("/")[1] === "articles";
  if (isArticlePath && articleSlug && REMOVED_SAMPLE_ARTICLE_SLUGS.has(articleSlug)) {
    const destination = request.nextUrl.clone();
    destination.pathname = `/${locale}/articles`;
    return NextResponse.redirect(destination, 308);
  }

  if (isLocale(firstSegment)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-dtg-locale", firstSegment);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const destination = request.nextUrl.clone();
  destination.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|fonts|favicon.ico|robots.txt|sitemap.xml).*)"],
};

