import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import type { Pair } from "@/i18n/I18nProvider";

interface Crumb {
  label: Pair;
  to?: string;
}

interface PageHeroProps {
  bg: string;
  bgAlt: Pair;
  crumbs: Crumb[];
  eyebrow: Pair;
  title: Pair;
  lead?: Pair;
}

/** Alt sayfaların üst başlık bloğu (.page-hero). */
export function PageHero({ bg, bgAlt, crumbs, eyebrow, title, lead }: PageHeroProps) {
  const { t } = useI18n();
  return (
    <section className="page-hero">
      <div className="page-hero__media">
        <img className="media" src={bg} alt={t(bgAlt)} loading="lazy" />
      </div>
      <div className="page-hero__overlay" />
      <div className="container">
        <div className="page-hero__inner">
          <nav className="breadcrumb" aria-label={t("Sayfa yolu", "Breadcrumb")}>
            {crumbs.map((c, i) => (
              <Fragment key={i}>
                {c.to ? <Link to={c.to}>{t(c.label)}</Link> : <span>{t(c.label)}</span>}
                {i < crumbs.length - 1 && <span>/</span>}
              </Fragment>
            ))}
          </nav>
          <p className="eyebrow">{t(eyebrow)}</p>
          <h1>{t(title)}</h1>
          {lead && <p>{t(lead)}</p>}
        </div>
      </div>
    </section>
  );
}
