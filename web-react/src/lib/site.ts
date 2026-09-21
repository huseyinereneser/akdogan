import { useEffect, useState } from "react";

export interface SiteData {
  iletisim?: Record<string, string>;
  galeri?: Array<Record<string, string>>;
  galeri_kategoriler?: Array<Record<string, string>>;
  hizmetler?: Array<Record<string, any>>;
  sayfalar?: Record<string, any>;
  [key: string]: any;
}

export function siteAsset(path?: string, fallback = "") {
  if (!path) return fallback;
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * İsimden baş harfleri üretir (kadro kartlarında fotoğraf yerine kullanılır):
 *   "Yakup Özdemir"  → "YÖ"
 *   "Aslan Akdoğan"  → "AA"
 *   "Olcay"          → "O"
 * Türkçe büyük harf kuralı için toLocaleUpperCase("tr-TR") kullanılır (i → İ).
 */
export function initials(name?: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0]!.charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : "";
  return (first + last).toLocaleUpperCase("tr-TR");
}

/**
 * WhatsApp (wa.me) için telefon numarasını uluslararası biçime getirir:
 *   "0532 051 36 06" → "905320513606"
 *   "532 051 36 06"  → "905320513606"
 *   "+90 532 …" / "90532…" → olduğu gibi (yalnız rakam)
 * wa.me baştaki "0" ile çalışmaz; panelden gelen yerel numara bu yüzden
 * normalize edilmeli.
 */
export function waNumber(raw?: string, fallback = "905320513606"): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return fallback;
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return "90" + digits.slice(1);
  if (digits.length === 10) return "90" + digits;
  return digits;
}

/** Normalize edilmiş numarayla tam wa.me bağlantısı. */
export function waLink(raw?: string, fallback = "905320513606"): string {
  return "https://wa.me/" + waNumber(raw, fallback);
}

type TextPair = { tr: string; en: string };

/**
 * Panelin "Sayfa Metinleri" (sayfalar.json) alanlarını okumak için yardımcı.
 * Dönen fonksiyon: `cms("hero_baslik", { tr, en })` — panelde doluysa panel
 * metnini, boşsa buradaki varsayılanı verir. İngilizce boşsa Türkçe'ye düşmek
 * çağıran tarafın (t()/translate) işi; burada yalnızca alan seçimi yapılır.
 */
export function pageText(site: SiteData | null, pageKey: string) {
  const alanlar: Record<string, any> = site?.sayfalar?.[pageKey]?.alanlar ?? {};
  return (key: string, fallback: TextPair): TextPair => ({
    tr: (alanlar[key]?.tr ?? "").trim() || fallback.tr,
    en: (alanlar[key]?.en ?? "").trim() || fallback.en,
  });
}

export function useSiteData() {
  const [site, setSite] = useState<SiteData | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/assets/data/site.json", { cache: "no-cache" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => { if (alive && data) setSite(data); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return site;
}
