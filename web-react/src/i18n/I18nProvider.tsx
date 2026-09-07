import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANG,
  DIR_KEY,
  LANG_KEY,
  LANGS,
  langByCode,
  type LangCode,
  type LangMeta,
} from "./languages";
import {
  loadDict,
  toArabicDigits,
  translate,
  translateHtml,
  type Dict,
} from "./text";

export interface Pair {
  tr: string;
  en: string;
}

interface I18nValue {
  lang: LangCode;
  meta: LangMeta;
  dir: "ltr" | "rtl";
  langs: LangMeta[];
  setLang: (code: LangCode) => void;
  /** Düz metin: t("Ana Sayfa", "Home") ya da t({ tr, en }). */
  t: (tr: string | Pair, en?: string) => string;
  /** HTML metin: dangerouslySetInnerHTML={{ __html: tHtml(...) }} */
  tHtml: (tr: string | Pair, en?: string) => string;
  /** Sayısal metni aktif dile göre biçimler (Arapça'da Arap-Hint rakamları). */
  num: (value: number | string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function readStoredLang(): LangCode {
  try {
    const s = localStorage.getItem(LANG_KEY);
    if (s && langByCode(s)) return s as LangCode;
  } catch {
    /* yok say */
  }
  return DEFAULT_LANG;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(readStoredLang);
  const [dict, setDict] = useState<Dict | null>(null);

  const meta = langByCode(lang) ?? LANGS[0];
  const dir = meta.yon;

  // Sözlüğü yükle (ru/ar/de). tr/en için anında boş sözlük.
  useEffect(() => {
    let alive = true;
    loadDict(lang).then((d) => {
      if (alive) setDict(d);
    });
    return () => {
      alive = false;
    };
  }, [lang]);

  // <html> lang/dir + kalıcılık + diğer sekmelere olay.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", meta.htmlLang);
    root.setAttribute("dir", dir);
    try {
      localStorage.setItem(LANG_KEY, lang);
      localStorage.setItem(DIR_KEY, dir);
    } catch {
      /* yok say */
    }
    document.dispatchEvent(
      new CustomEvent("akd:langchange", { detail: { lang, dir } })
    );
  }, [lang, dir, meta.htmlLang]);

  const setLang = useCallback((code: LangCode) => {
    if (langByCode(code)) setLangState(code);
  }, []);

  const t = useCallback(
    (tr: string | Pair, en?: string): string => {
      const p: Pair = typeof tr === "string" ? { tr, en: en ?? tr } : tr;
      return translate(lang, dict, p.tr, p.en);
    },
    [lang, dict]
  );

  const tHtml = useCallback(
    (tr: string | Pair, en?: string): string => {
      const p: Pair = typeof tr === "string" ? { tr, en: en ?? tr } : tr;
      return translateHtml(lang, dict, p.tr, p.en);
    },
    [lang, dict]
  );

  const num = useCallback(
    (value: number | string): string => {
      const s = String(value);
      return lang === "ar" ? toArabicDigits(s) : s;
    },
    [lang]
  );

  const value = useMemo<I18nValue>(
    () => ({ lang, meta, dir, langs: LANGS, setLang, t, tHtml, num }),
    [lang, meta, dir, setLang, t, tHtml, num]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n, <I18nProvider> içinde kullanılmalı");
  return ctx;
}
