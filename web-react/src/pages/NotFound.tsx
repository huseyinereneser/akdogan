import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <>
      <PageMeta
        title={{ tr: "Sayfa bulunamadı — Akdoğan Turizm", en: "Page not found — Akdoğan Turizm" }}
      />
      <section className="section">
        <div className="container container--narrow" style={{ textAlign: "center" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            404
          </p>
          <h1>{t("Aradığınız sayfa bulunamadı", "Page not found")}</h1>
          <p className="lead" style={{ marginTop: 20 }}>
            {t(
              "Sayfa taşınmış ya da kaldırılmış olabilir, ya da adres yanlış yazılmış olabilir. Aşağıdaki bağlantılardan devam edebilirsiniz.",
              "The page may have been moved or removed, or the address may have been typed incorrectly. You can continue from the links below."
            )}
          </p>
          <div className="btn-row" style={{ justifyContent: "center", marginTop: 36 }}>
            <Link className="btn btn--primary" to="/">
              {t("Ana Sayfaya Dön", "Back to home")}
            </Link>
            <Link className="btn btn--outline" to="/iletisim">
              {t("Bize Ulaşın", "Contact us")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
