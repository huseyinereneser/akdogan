import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { useStuckHeader } from "@/hooks/useStuckHeader";
import { NAV } from "@/lib/nav";
import { LangMenu } from "./LangMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { t } = useI18n();
  const stuck = useStuckHeader();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();

  // Sayfa değişince mobil menüyü kapat.
  useEffect(() => setNavOpen(false), [location.pathname, location.hash]);

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
              src="/assets/img/logo.png"
              alt="Akdoğan Turizm"
              width={440}
              height={148}
            />
            <img
              className="logo__img logo__img--dark"
              src="/assets/img/logo-light.png"
              alt=""
              aria-hidden="true"
              width={440}
              height={148}
            />
          </Link>

          <nav
            className={"nav" + (navOpen ? " is-open" : "")}
            id="ana-menu"
            aria-label={t("Ana menü", "Main menu")}
          >
            {NAV.map((item) =>
              item.children ? (
                <div className="nav__item" key={item.to}>
                  <NavLink
                    className="nav__link"
                    to={item.to}
                    end={item.to === "/"}
                  >
                    {t(item.label)}
                  </NavLink>
                  <div className="dropdown">
                    <div className="dropdown__panel">
                      {item.children.map((c) => (
                        <Link key={c.to} to={c.to}>
                          {t(c.label)}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  className="nav__link"
                  to={item.to}
                  end={item.to === "/"}
                >
                  {t(item.label)}
                </NavLink>
              )
            )}

            <Link className="btn btn--primary" to="/iletisim#teklif">
              {t("Teklif Al", "Get a Quote")}
            </Link>
          </nav>

          <div className="header__cta">
            <LangMenu />
            <ThemeToggle />
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
