import { useEffect } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Pair } from "@/i18n/I18nProvider";

interface PageMetaProps {
  title: Pair;
  description?: Pair;
}

/**
 * Sayfa başlığı ve açıklama meta'sını günceller. (İstemci tarafı; kalıcı
 * SEO için ileride prerender/SSG eklenebilir.)
 */
export function PageMeta({ title, description }: PageMetaProps) {
  const { t } = useI18n();
  const titleText = t(title);
  const descText = description ? t(description) : null;

  useEffect(() => {
    document.title = titleText;
    if (descText != null) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
      }
      m.setAttribute("content", descText);
    }
  }, [titleText, descText]);

  return null;
}
