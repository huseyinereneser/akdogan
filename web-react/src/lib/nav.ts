import type { Pair } from "@/i18n/I18nProvider";

export interface NavItem {
  to: string;
  label: Pair;
}

/** Sade ana menü: alt sayfalar birleşik sayfalarda bölüm bağlantılarıdır. */
export const NAV: NavItem[] = [
  { to: "/", label: { tr: "Ana Sayfa", en: "Home" } },
  { to: "/kurumsal", label: { tr: "Kurumsal", en: "Corporate" } },
  { to: "/hizmetler", label: { tr: "Hizmetler", en: "Services" } },
  { to: "/projeler", label: { tr: "Projeler", en: "Projects" } },
  { to: "/referanslar", label: { tr: "Referanslar", en: "References" } },
  { to: "/medya", label: { tr: "Medya", en: "Media" } },
  { to: "/iletisim", label: { tr: "İletişim", en: "Contact" } },
];
