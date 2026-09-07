import { Link, useSearchParams } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";

export default function Tesekkurler() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const error = params.has("err") || params.get("durum") === "hata";

  return (
    <>
      <PageMeta
        title={{ tr: "Teşekkürler | Akdoğan Turizm", en: "Thank You | Akdoğan Turizm" }}
      />
      <section className="section">
        <div className="container container--narrow" style={{ textAlign: "center" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            Akdoğan Turizm
          </p>

          {error ? (
            <div>
              <h1>{t("Bir sorun oluştu", "Something went wrong")}</h1>
              <p className="lead" style={{ marginTop: 20 }}>
                {t(
                  "Mesajınız gönderilemedi. Lütfen 0262 642 91 03 numaralı hattımızı arayın ya da info@akdoganturizm.com adresine yazın.",
                  "Your message could not be sent. Please call us on 0262 642 91 03 or write to info@akdoganturizm.com."
                )}
              </p>
            </div>
          ) : (
            <div>
              <h1>{t("Teşekkürler", "Thank you")}</h1>
              <p className="lead" style={{ marginTop: 20 }}>
                {t(
                  "Mesajınız bize ulaştı. Ekibimiz en kısa sürede size dönüş yapacak.",
                  "Your message has reached us. Our team will get back to you as soon as possible."
                )}
              </p>
            </div>
          )}

          <div className="btn-row" style={{ justifyContent: "center", marginTop: 36 }}>
            <Link className="btn btn--primary" to="/">
              {t("Ana Sayfaya Dön", "Back to home")}
            </Link>
            <Link className="btn btn--outline" to="/hizmetler">
              {t("Hizmetlerimiz", "Our services")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
