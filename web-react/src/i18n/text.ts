/** Çalışma zamanı sözlüğü — assets/i18n/<kod>.json ({ t, h }). */
export interface Dict {
  t: Record<string, string>;
  h: Record<string, string>;
}

const ARAB_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function toArabicDigits(s: string): string {
  return String(s).replace(/[0-9]/g, (d) => ARAB_DIGITS.charAt(+d));
}

export function toWesternDigits(s: string): string {
  return String(s).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
}

/** i18n-build.js ile birebir aynı normalizasyon (h anahtarlarını eşlemek için). */
export const norm = (s: string): string => String(s).replace(/\s+/g, " ").trim();
export const stripTags = (s: string): string => norm(String(s).replace(/<[^>]*>/g, ""));

const decode = (s: string): string =>
  String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

/** ru/ar/de sözlüklerini getirir; sonuç önbelleğe alınır. */
const cache = new Map<string, Promise<Dict>>();

export function loadDict(code: string): Promise<Dict> {
  if (code === "tr" || code === "en") return Promise.resolve({ t: {}, h: {} });
  let p = cache.get(code);
  if (!p) {
    p = fetch(`/assets/i18n/${code}.json`, { cache: "no-cache" })
      .then((r) => (r.ok ? r.json() : { t: {}, h: {} }))
      .catch(() => ({ t: {}, h: {} }));
    cache.set(code, p);
  }
  return p;
}

/** Düz metin çevirisi. tr = kaynak metin, en = İngilizce anahtar. */
export function translate(
  lang: string,
  dict: Dict | null,
  tr: string,
  en: string
): string {
  if (lang === "tr") return tr;
  if (lang === "en") return en;
  const hit = dict?.t[norm(en)] ?? dict?.t[en] ?? en;
  return lang === "ar" ? toArabicDigits(hit) : hit;
}

/** Zengin (HTML) metin çevirisi — dangerouslySetInnerHTML için string döner. */
export function translateHtml(
  lang: string,
  dict: Dict | null,
  trHtml: string,
  enHtml: string
): string {
  if (lang === "tr") return trHtml;
  if (lang === "en") return enHtml;
  const key = stripTags(decode(enHtml));
  const hit = dict?.h[key] ?? dict?.t[key] ?? enHtml;
  return lang === "ar" ? toArabicDigits(hit) : hit;
}
