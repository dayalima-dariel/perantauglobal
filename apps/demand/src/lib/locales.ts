export const LOCALES = ["en", "id", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, { name: string; flag: string; native: string }> = {
  en: { name: "English", native: "English", flag: "/images/flag-us.svg" },
  id: { name: "Indonesia", native: "Bahasa Indonesia", flag: "/images/flag-id.svg" },
  ar: { name: "العربية", native: "العربية", flag: "/images/flag-sa.svg" },
};

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "id" || value === "ar";
}

export function localizedPath(locale: Locale, pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const unprefixed = path.replace(/^\/(?:en|id|ar)(?=\/|$)/, "") || "/";
  return unprefixed === "/" ? `/${locale}` : `/${locale}${unprefixed}`;
}

export const LOCALIZED_ROUTES = [
  "", "about", "services", "resources", "regions", "articles", "contact",
  "for-candidates", "europe", "japan", "privacy", "terms", "partnerships",
] as const;

export const PAGE_SEO: Record<Locale, Record<string, { title: string; description: string }>> = {
  en: {
    "": { title: "Indonesian Talent for International Employers", description: "Employer-first workforce recruitment and support from Daya Talenta Global." },
    about: { title: "About Daya Talenta Global", description: "Learn about DTG's employer-first approach to Indonesian talent, readiness, and documented recruitment routes." },
    services: { title: "Workforce Solutions", description: "Explore workforce recruitment support for international employers hiring Indonesian talent." },
    resources: { title: "Employer Resources", description: "Guides and practical resources for employers recruiting Indonesian talent through P3MI." },
    regions: { title: "Markets", description: "Explore DTG's market conversations for Saudi Arabia and GCC, Europe, and Japan." },
    articles: { title: "Articles", description: "Employer perspectives on Indonesian talent, hiring readiness, and international recruitment." },
    contact: { title: "Contact DTG", description: "Discuss an international workforce requirement with Daya Talenta Global." },
    "for-candidates": { title: "For Candidates", description: "Candidate information and applications are managed through Perantau Global." },
    europe: { title: "Indonesian Talent for Europe", description: "Discuss role requirements, readiness, and documented recruitment routes for Europe." },
    japan: { title: "Indonesian Talent for Japan", description: "Discuss role requirements, readiness, and documented recruitment routes for Japan." },
    privacy: { title: "Privacy Policy", description: "How Daya Talenta Global handles information submitted through this website." },
    terms: { title: "Terms of Use", description: "Terms that apply to use of the Daya Talenta Global website." },
    partnerships: { title: "Partnership Inquiry", description: "Contact Daya Talenta Global about a potential partnership." },
  },
  id: {
    "": { title: "Talenta Indonesia untuk Employer Internasional", description: "Rekrutmen dan dukungan tenaga kerja berbasis kebutuhan employer oleh Daya Talenta Global." },
    about: { title: "Tentang Daya Talenta Global", description: "Pendekatan DTG dalam meninjau talenta Indonesia, kesiapan, dan jalur rekrutmen terdokumentasi." },
    services: { title: "Solusi Tenaga Kerja", description: "Dukungan rekrutmen bagi employer internasional yang mencari talenta Indonesia." },
    resources: { title: "Materi Employer", description: "Panduan dan materi praktis bagi employer yang merekrut talenta Indonesia melalui P3MI." },
    regions: { title: "Pasar", description: "Jelajahi pembahasan DTG untuk Saudi Arabia dan GCC, Eropa, serta Jepang." },
    articles: { title: "Artikel", description: "Perspektif employer tentang talenta Indonesia, kesiapan kerja, dan rekrutmen internasional." },
    contact: { title: "Kontak DTG", description: "Diskusikan kebutuhan tenaga kerja internasional bersama Daya Talenta Global." },
    "for-candidates": { title: "Untuk Kandidat", description: "Informasi dan lamaran kandidat dikelola melalui Perantau Global." },
    europe: { title: "Talenta Indonesia untuk Eropa", description: "Diskusikan kebutuhan peran, kesiapan, dan jalur rekrutmen terdokumentasi untuk Eropa." },
    japan: { title: "Talenta Indonesia untuk Jepang", description: "Diskusikan kebutuhan peran, kesiapan, dan jalur rekrutmen terdokumentasi untuk Jepang." },
    privacy: { title: "Kebijakan Privasi", description: "Cara Daya Talenta Global menangani informasi yang dikirim melalui website ini." },
    terms: { title: "Ketentuan Penggunaan", description: "Ketentuan penggunaan website Daya Talenta Global." },
    partnerships: { title: "Inquiry Kemitraan", description: "Hubungi Daya Talenta Global mengenai peluang kemitraan." },
  },
  ar: {
    "": { title: "كفاءات إندونيسية لأصحاب العمل الدوليين", description: "حلول توظيف ودعم للقوى العاملة وفق احتياجات أصحاب العمل من Daya Talenta Global." },
    about: { title: "عن Daya Talenta Global", description: "تعرّف على نهج DTG في مراجعة الكفاءات الإندونيسية والجاهزية ومسارات التوظيف الموثقة." },
    services: { title: "حلول القوى العاملة", description: "دعم التوظيف لأصحاب العمل الدوليين الباحثين عن كفاءات إندونيسية." },
    resources: { title: "موارد أصحاب العمل", description: "أدلة وموارد عملية لأصحاب العمل الذين يوظفون كفاءات إندونيسية عبر P3MI." },
    regions: { title: "الأسواق", description: "استكشف محادثات DTG حول السعودية والخليج وأوروبا واليابان." },
    articles: { title: "المقالات", description: "وجهات نظر أصحاب العمل حول الكفاءات الإندونيسية والجاهزية والتوظيف الدولي." },
    contact: { title: "تواصل مع DTG", description: "ناقش احتياج القوى العاملة الدولية مع Daya Talenta Global." },
    "for-candidates": { title: "للمرشحين", description: "تُدار معلومات المرشحين والطلبات عبر Perantau Global." },
    europe: { title: "كفاءات إندونيسية لأوروبا", description: "ناقش متطلبات الدور والجاهزية ومسار التوظيف الموثق لأوروبا." },
    japan: { title: "كفاءات إندونيسية لليابان", description: "ناقش متطلبات الدور والجاهزية ومسار التوظيف الموثق لليابان." },
    privacy: { title: "سياسة الخصوصية", description: "كيفية تعامل Daya Talenta Global مع المعلومات المقدمة عبر هذا الموقع." },
    terms: { title: "شروط الاستخدام", description: "الشروط التي تنطبق على استخدام موقع Daya Talenta Global." },
    partnerships: { title: "استفسار الشراكة", description: "تواصل مع Daya Talenta Global لمناقشة فرصة شراكة." },
  },
};

