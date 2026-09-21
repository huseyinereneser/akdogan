import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CallFab } from "./CallFab";

/** Yeni sayfada #hash varsa oraya, yoksa en üste kaydır. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  const { t } = useI18n();

  useEffect(() => {
    fetch("/assets/data/site.json", { cache: "no-cache" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const appearance = data?.gorunum ?? {};
        const root = document.documentElement;
        if (/^#[0-9a-f]{6}$/i.test(appearance.accent || "")) root.style.setProperty("--accent", appearance.accent);
        if (/^#[0-9a-f]{6}$/i.test(appearance.accent_dark || "")) root.style.setProperty("--accent-dark", appearance.accent_dark);
        if (Number.isFinite(Number(appearance.radius))) root.style.setProperty("--radius", `${Math.max(0, Math.min(24, Number(appearance.radius)))}px`);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <a className="skip-link" href="#icerik">
        {t("İçeriğe geç", "Skip to content")}
      </a>
      <ScrollManager />
      <Header />
      <main id="icerik">
        <Outlet />
      </main>
      <Footer />
      <CallFab />
    </>
  );
}
