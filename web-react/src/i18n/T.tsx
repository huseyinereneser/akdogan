import type { ElementType } from "react";
import { useI18n } from "./I18nProvider";

interface TProps {
  tr: string;
  en: string;
}

/** Düz metin çevirisi: <T tr="Ana Sayfa" en="Home" /> */
export function T({ tr, en }: TProps) {
  const { t } = useI18n();
  return <>{t(tr, en)}</>;
}

interface HtmlProps extends TProps {
  as?: ElementType;
  className?: string;
}

/** Zengin metin (bold, <br> …) içeren çeviri. */
export function Html({ tr, en, as: Tag = "div", className }: HtmlProps) {
  const { tHtml } = useI18n();
  return (
    <Tag className={className} dangerouslySetInnerHTML={{ __html: tHtml(tr, en) }} />
  );
}
