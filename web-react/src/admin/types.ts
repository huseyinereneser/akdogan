/**
 * public/assets/data/site.json ile birebir aynı şekil. Panel bu nesneyi
 * düzenler; "Kaydet" bunu dosya olarak indirir, siz repoya koyup deploy
 * edersiniz (bkz. src/admin/README-ic.md).
 */
export interface SiteIletisim {
  telefon?: string;
  gsm?: string;
  whatsapp?: string;
  eposta?: string;
  adres?: string;
  saatler_tr?: string;
  saatler_en?: string;
  [key: string]: string | undefined;
}

export interface SiteSosyal {
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  linkedin?: string;
  [key: string]: string | undefined;
}

export interface SiteSeo {
  baslik_tr?: string;
  baslik_en?: string;
  aciklama_tr?: string;
  aciklama_en?: string;
  [key: string]: string | undefined;
}

export interface SiteGorunum {
  accent?: string;
  accent_dark?: string;
  radius?: number;
}

export interface SiteMenuOge {
  tr: string;
  en: string;
  href?: string;
  aktif?: boolean;
}

export interface SiteHizmet {
  id: string;
  sira: number;
  gorsel?: string;
  tr: { baslik: string; ozet: string; detay: string };
  en: { baslik: string; ozet: string; detay: string };
}

export interface SiteGaleriOge {
  id: string;
  sira: number;
  dosya: string;
  kategori: string;
  baslik_tr: string;
  baslik_en: string;
}

export interface SiteGaleriKategori {
  anahtar: string;
  ad_tr: string;
  ad_en: string;
}

export interface SiteSayfaAlan {
  ad: string;
  tr: string;
  en: string;
}

export interface SiteSayfa {
  etiket_tr: string;
  alanlar: Record<string, SiteSayfaAlan>;
}

export interface SiteData {
  guncelleme?: string;
  iletisim: SiteIletisim;
  sosyal: SiteSosyal;
  seo: SiteSeo;
  genel: unknown[];
  gorunum: SiteGorunum;
  gorseller: Record<string, string>;
  marka: { logo?: string };
  menu: Record<string, SiteMenuOge>;
  bolumler: Record<string, boolean>;
  seo_sayfalar: unknown[];
  hizmetler: SiteHizmet[];
  galeri: SiteGaleriOge[];
  galeri_kategoriler: SiteGaleriKategori[];
  sayfalar: Record<string, SiteSayfa>;
  [key: string]: unknown;
}

/** Kaynak çeviri tablosu: İngilizce anahtar → {ru, ar, de}. */
export type I18nKaynak = {
  text: Record<string, { ru?: string; ar?: string; de?: string }>;
};

/** Yayınlanan public/assets/i18n/{ru,ar,de}.json şekli. */
export type I18nCikti = { t: Record<string, string> };
