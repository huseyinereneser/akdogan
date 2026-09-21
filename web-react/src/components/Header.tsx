import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { useStuckHeader } from "@/hooks/useStuckHeader";
import { NAV } from "@/lib/nav";
import { LangMenu } from "./LangMenu";

export function Header() {
  const { t } = useI18n();
  const stuck = useStuckHeader();
  const [navOpen, setNavOpen] = useState(false);
  const [logo, setLogo] = useState("/assets/img/logo.png");
  const [menu, setMenu] = useState<Record<string, { tr?: string; en?: string; href?: string; aktif?: boolean }>>({});
  const location = useLocation();

  // Sayfa değişince mobil menüyü kapat.
  useEffect(() => setNavOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    fetch("/assets/data/site.json", { cache: "no-cache" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.marka?.logo) setLogo(`/${data.marka.logo}`);
        if (data?.menu) setMenu(data.menu);
      })
      .catch(() => {});
  }, []);

  // Açıkken gövde kaydırmasını kilitle + Escape ile kapat.
  useEffect(() => {
    document.body.classList.toggle("nav-open", navOpen);
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("nav-open");
    };
  }, [navOpen]);

  return (
    <>
      <header className={"header" + (stuck ? " is-stuck" : "")}>
        <div className="container">
          <Link className="logo" to="/" aria-label="Akdoğan Turizm">
            <img
              className="logo__img logo__img--light"
              src={logo}
              alt="Akdoğan Turizm"
              width={440}
              height={148}
            />
          </Link>

          <nav
            className={"nav" + (navOpen ? " is-open" : "")}
            id="ana-menu"
            aria-label={t("Ana menü", "Main menu")}
          >
            {NAV.map((item) => {
              const key = item.to === "/" ? "anasayfa" : item.to.slice(1);
              const config = menu[key];
              if (config?.aktif === false) return null;
              const to = config?.href
                ? config.href.replace(/^index\.html$/, "/").replace(/\.html$/, "").replace(/^(?!\/)/, "/")
                : item.to;
              const label = config?.tr || config?.en
                ? { tr: config.tr || item.label.tr, en: config.en || item.label.en }
                : item.label;
              return (
                <NavLink
                  key={item.to}
                  className={({ isActive }) => "nav__link" + (isActive ? " is-active" : "")}
                  to={to}
                  end={item.to === "/"}
                >
                  {t(label)}
                </NavLink>
              );
            })}

            <Link className="btn btn--primary" to="/iletisim#teklif">
              {t("Teklif Al", "Get a Quote")}
            </Link>
          </nav>

          <div className="header__cta">
            <LangMenu />
            <Link className="btn btn--dark" to="/iletisim#teklif">
              {t("Teklif Al", "Get a Quote")}
            </Link>
            <button
              className="nav-toggle"
              type="button"
              aria-label={
                navOpen ? t("Menüyü kapat", "Close menu") : t("Menüyü aç", "Open menu")
              }
              aria-expanded={navOpen}
              aria-controls="ana-menu"
              onClick={() => setNavOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <div
        className={"nav-backdrop" + (navOpen ? " is-open" : "")}
        onClick={() => setNavOpen(false)}
      />
    </>
  );
}
