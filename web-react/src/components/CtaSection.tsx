import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "./Reveal";
import type { Pair } from "@/i18n/I18nProvider";

export interface CtaAction {
  label: Pair;
  to?: string;
  href?: string;
  variant?: "primary" | "light" | "outline" | "dark";
}

interface CtaSectionProps {
  title: Pair;
  text: Pair;
  actions: CtaAction[];
}

export function CtaSection({ title, text, actions }: CtaSectionProps) {
  const { t } = useI18n();
  return (
    <section className="cta">
      <div className="container">
        <Reveal>
          <h2>{t(title)}</h2>
          <p>{t(text)}</p>
        </Reveal>
        <Reveal className="cta__actions" delay={100}>
          {actions.map((a, i) => {
            const cls = `btn btn--${a.variant ?? (i === 0 ? "primary" : "light")}`;
            return a.to ? (
              <Link className={cls} to={a.to} key={i}>
                {t(a.label)}
              </Link>
            ) : (
              <a className={cls} href={a.href} key={i}>
                {t(a.label)}
              </a>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
