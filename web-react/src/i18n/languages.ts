export type LangCode = "tr" | "en" | "ru" | "ar" | "de";

export interface LangMeta {
  kod: LangCode;
  /** Navbar kısaltması: TR, EN … */
  kisa: string;
  /** Ana dildeki tam ad */
  ad: string;
  /** Açılır menüde gösterilen İngilizce tam ad */
  adEn: string;
  yon: "ltr" | "rtl";
  /** .flag--<bayrak> CSS sınıfı */
  bayrak: string;
  htmlLang: string;
}

/** Kaynak: assets/i18n/languages.json — burada tip güvenli kopyası. */
export const LANGS: LangMeta[] = [
  { kod: "tr", kisa: "TR", ad: "Türkçe", adEn: "Turkish", yon: "ltr", bayrak: "tr", htmlLang: "tr" },
  { kod: "en", kisa: "EN", ad: "English", adEn: "English", yon: "ltr", bayrak: "gb", htmlLang: "en" },
  { kod: "ru", kisa: "RU", ad: "Русский", adEn: "Russian", yon: "ltr", bayrak: "ru", htmlLang: "ru" },
  { kod: "ar", kisa: "AR", ad: "العربية", adEn: "Arabic", yon: "rtl", bayrak: "sa", htmlLang: "ar" },
  { kod: "de", kisa: "DE", ad: "Deutsch", adEn: "German", yon: "ltr", bayrak: "de", htmlLang: "de" },
];

export const DEFAULT_LANG: LangCode = "tr";

export const LANG_KEY = "akd-lang";
export const DIR_KEY = "akd-dir";

export function langByCode(code: string | null | undefined): LangMeta | undefined {
  return LANGS.find((l) => l.kod === code);
}
