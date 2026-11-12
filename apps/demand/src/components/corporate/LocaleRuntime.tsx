"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isLocale, localizedPath } from "@/lib/locales";

export function LocaleRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const active = pathname.split("/")[1];
    const locale = isLocale(active) ? active : "en";
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";

    const localizeLinks = () => {
      for (const anchor of document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')) {
        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("//") || href.startsWith("/api/") || href.startsWith("/_next/") || href.startsWith("/images/")) continue;
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin || /\.[a-z0-9]+$/i.test(url.pathname)) continue;
        url.pathname = localizedPath(locale, url.pathname);
        anchor.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
      }
    };

    const localizeNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const anchor = origin.closest<HTMLAnchorElement>('a[href^="/"]');
      const href = anchor?.getAttribute("href");
      if (!anchor || !href || href.startsWith("/api/") || href.startsWith("/_next/") || href.startsWith("/images/")) return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin || /\.[a-z0-9]+$/i.test(url.pathname)) return;
      event.preventDefault();
      url.pathname = localizedPath(locale, url.pathname);
      window.location.assign(`${url.pathname}${url.search}${url.hash}`);
    };

    localizeLinks();
    document.addEventListener("click", localizeNavigation, true);
    const observer = new MutationObserver(localizeLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      document.removeEventListener("click", localizeNavigation, true);
    };
  }, [pathname]);

  return null;
}

