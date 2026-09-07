import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "./Reveal";
import type { Pair } from "@/i18n/I18nProvider";

interface SectionHeadProps {
  eyebrow?: Pair;
  title: Pair;
  text?: Pair;
  center?: boolean;
}

export function SectionHead({ eyebrow, title, text, center }: SectionHeadProps) {
  const { t } = useI18n();
  return (
    <Reveal className={"section-head" + (center ? " section-head--center" : "")}>
      {eyebrow && <p className="eyebrow">{t(eyebrow)}</p>}
      <h2>{t(title)}</h2>
      {text && <p>{t(text)}</p>}
    </Reveal>
  );
}

export interface Reason {
  no: string;
  title: Pair;
  text: Pair;
}

/** Numaralı gerekçe/adım listesi (.reasons > .reason). */
export function ReasonList({ items }: { items: Reason[] }) {
  const { t } = useI18n();
  return (
    <div className="reasons">
      {items.map((r, i) => (
        <Reveal className="reason" delay={i % 2 ? 80 : 0} key={r.no}>
          <span className="reason__no">{r.no}</span>
          <div>
            <h3>{t(r.title)}</h3>
            <p>{t(r.text)}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
