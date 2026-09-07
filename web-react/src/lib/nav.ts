import type { Pair } from "@/i18n/I18nProvider";

export interface NavChild {
  to: string;
  label: Pair;
}

export interface NavItem {
  to: string;
  label: Pair;
  children?: NavChild[];
}

/** Ana menü — orijinal _partials/header.html yapısıyla birebir. */
export const NAV: NavItem[] = [
  { to: "/", label: { tr: "Ana Sayfa", en: "Home" } },
  {
    to: "/hakkimizda",
    label: { tr: "Kurumsal", en: "Corporate" },
    children: [
      { to: "/hakkimizda", label: { tr: "Hakkımızda", en: "About Us" } },
      { to: "/kadromuz", label: { tr: "Kadromuz", en: "Our Team" } },
      { to: "/belgeler", label: { tr: "Belgelerimiz", en: "Certificates & Documents" } },
      { to: "/hesap-numaralarimiz", label: { tr: "Hesap Numaralarımız", en: "Bank Accounts" } },
      { to: "/kvkk", label: { tr: "Kişisel Verilerin Korunması", en: "Data Protection (KVKK)" } },
    ],
  },
  { to: "/hizmetler", label: { tr: "Hizmetler", en: "Services" } },
  { to: "/projeler", label: { tr: "Projeler", en: "Projects" } },
  { to: "/referanslar", label: { tr: "Referanslar", en: "References" } },
  {
    to: "/galeri",
    label: { tr: "Medya", en: "Media" },
    children: [
      { to: "/galeri", label: { tr: "Foto Galeri", en: "Photo Gallery" } },
      { to: "/videolar", label: { tr: "Videolar", en: "Videos" } },
      { to: "/yorumlar#yorum-birak", label: { tr: "Yorum Bırak", en: "Leave a Review" } },
    ],
  },
  {
    to: "/iletisim",
    label: { tr: "İletişim", en: "Contact" },
    children: [
      { to: "/iletisim", label: { tr: "İletişim Bilgileri", en: "Contact Details" } },
      { to: "/insan-kaynaklari", label: { tr: "İnsan Kaynakları", en: "Human Resources" } },
    ],
  },
];
