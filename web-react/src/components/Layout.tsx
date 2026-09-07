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
