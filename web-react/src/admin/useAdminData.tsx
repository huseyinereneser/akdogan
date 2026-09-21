import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import i18nKaynakVarsayilan from "./data/i18nKaynak.json";
import type { I18nCikti, I18nKaynak, SiteData } from "./types";

const SITE_KEY = "akd_admin_site_taslak_v1";
const I18N_KEY = "akd_admin_i18n_taslak_v1";

function downloadJSON(filename: string, data: unknown) {
  const json = JSON.stringify(data, null, 4);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** i18nKaynak.text içindeki bir dili düz {t: {ingilizce: çeviri}} biçimine derler. */
function diliDerle(kaynak: I18nKaynak, dil: "ru" | "ar" | "de"): I18nCikti {
  const t: Record<string, string> = {};
  for (const [anahtar, cevirler] of Object.entries(kaynak.text || {})) {
    const deger = cevirler?.[dil];
    if (deger) t[anahtar] = deger;
  }
  return { t };
}

interface AdminDataValue {
  site: SiteData | null;
  i18n: I18nKaynak;
  yukleniyor: boolean;
  hata: string | null;
  siteyiGuncelle: (guncelleyici: (onceki: SiteData) => SiteData) => void;
  i18nGuncelle: (guncelleyici: (onceki: I18nKaynak) => I18nKaynak) => void;
  siteyiSifirla: () => void;
  i18nSifirla: () => void;
  siteIndir: () => void;
  i18nIndir: () => void;
  siteIceAktar: (dosya: File) => Promise<void>;
  i18nIceAktar: (dosya: File) => Promise<void>;
}

const AdminDataContext = createContext<AdminDataValue | null>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteData | null>(null);
  const [i18n, setI18n] = useState<I18nKaynak>(i18nKaynakVarsayilan as I18nKaynak);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    let ayakta = true;

    const taslakSite = localStorage.getItem(SITE_KEY);
    if (taslakSite) {
      try {
        setSite(JSON.parse(taslakSite));
      } catch {
        /* bozuk taslak — canlıdan yüklemeye devam et */
      }
    }
    const taslakI18n = localStorage.getItem(I18N_KEY);
    if (taslakI18n) {
      try {
        setI18n(JSON.parse(taslakI18n));
      } catch {
        /* bozuk taslak — bundled varsayılan kalsın */
      }
    }

    if (!taslakSite) {
      fetch("/assets/data/site.json", { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("site.json okunamadı"))))
        .then((veri) => {
          if (ayakta) setSite(veri);
        })
        .catch((e) => {
          if (ayakta) setHata(String(e?.message || e));
        })
        .finally(() => {
          if (ayakta) setYukleniyor(false);
        });
    } else {
      setYukleniyor(false);
    }

    return () => {
      ayakta = false;
    };
  }, []);

  useEffect(() => {
    if (site) localStorage.setItem(SITE_KEY, JSON.stringify(site));
  }, [site]);

  useEffect(() => {
    localStorage.setItem(I18N_KEY, JSON.stringify(i18n));
  }, [i18n]);

  const siteyiGuncelle = useCallback((guncelleyici: (onceki: SiteData) => SiteData) => {
    setSite((onceki) => (onceki ? guncelleyici(onceki) : onceki));
  }, []);

  const i18nGuncelle = useCallback((guncelleyici: (onceki: I18nKaynak) => I18nKaynak) => {
    setI18n((onceki) => guncelleyici(onceki));
  }, []);

  const siteyiSifirla = useCallback(() => {
    localStorage.removeItem(SITE_KEY);
    setYukleniyor(true);
    fetch("/assets/data/site.json", { cache: "no-cache" })
      .then((r) => r.json())
      .then(setSite)
      .finally(() => setYukleniyor(false));
  }, []);

  const i18nSifirla = useCallback(() => {
    localStorage.removeItem(I18N_KEY);
    setI18n(i18nKaynakVarsayilan as I18nKaynak);
  }, []);

  const siteIndir = useCallback(() => {
    if (!site) return;
    downloadJSON("site.json", { ...site, guncelleme: new Date().toISOString() });
  }, [site]);

  const i18nIndir = useCallback(() => {
    downloadJSON("i18n-kaynak.json", i18n);
    window.setTimeout(() => downloadJSON("ru.json", diliDerle(i18n, "ru")), 200);
    window.setTimeout(() => downloadJSON("ar.json", diliDerle(i18n, "ar")), 400);
    window.setTimeout(() => downloadJSON("de.json", diliDerle(i18n, "de")), 600);
  }, [i18n]);

  const siteIceAktar = useCallback(async (dosya: File) => {
    const metin = await dosya.text();
    const veri = JSON.parse(metin);
    setSite(veri);
  }, []);

  const i18nIceAktar = useCallback(async (dosya: File) => {
    const metin = await dosya.text();
    const veri = JSON.parse(metin);
    if (!veri || typeof veri !== "object" || !("text" in veri)) {
      throw new Error("Dosya beklenen { text: {...} } biçiminde değil.");
    }
    setI18n(veri as I18nKaynak);
  }, []);

  const value = useMemo<AdminDataValue>(
    () => ({
      site,
      i18n,
      yukleniyor,
      hata,
      siteyiGuncelle,
      i18nGuncelle,
      siteyiSifirla,
      i18nSifirla,
      siteIndir,
      i18nIndir,
      siteIceAktar,
      i18nIceAktar,
    }),
    [site, i18n, yukleniyor, hata, siteyiGuncelle, i18nGuncelle, siteyiSifirla, i18nSifirla, siteIndir, i18nIndir, siteIceAktar, i18nIceAktar]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminDataValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData, AdminDataProvider içinde kullanılmalı");
  return ctx;
}
