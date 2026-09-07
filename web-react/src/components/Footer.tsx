import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { Html } from "@/i18n/T";

const CORP_LINKS = [
  { to: "/hakkimizda", label: { tr: "Hakkımızda", en: "About Us" } },
  { to: "/kadromuz", label: { tr: "Kadromuz", en: "Our Team" } },
  { to: "/belgeler", label: { tr: "Belgelerimiz", en: "Certificates & Documents" } },
  { to: "/referanslar", label: { tr: "Referanslarımız", en: "References" } },
  { to: "/hesap-numaralarimiz", label: { tr: "Hesap Numaralarımız", en: "Bank Accounts" } },
  { to: "/insan-kaynaklari", label: { tr: "İnsan Kaynakları", en: "Human Resources" } },
  { to: "/kvkk", label: { tr: "Kişisel Verilerin Korunması", en: "Data Protection (KVKK)" } },
];

const SERVICE_LINKS = [
  { to: "/hizmetler#personel-tasimaciligi", label: { tr: "Personel Taşımacılığı", en: "Personnel Transport" } },
  { to: "/hizmetler#ogrenci-tasimaciligi", label: { tr: "Öğrenci Taşımacılığı", en: "Student Transport" } },
  { to: "/hizmetler#vip-transfer", label: { tr: "VIP Transfer", en: "VIP Transfer" } },
  { to: "/hizmetler#arac-kiralama", label: { tr: "Araç Kiralama", en: "Vehicle Rental" } },
  { to: "/hizmetler#sehir-ici-tasimacilik", label: { tr: "Şehir İçi Taşımacılık", en: "Intercity & Local Transport" } },
  { to: "/hizmetler#turizm-organizasyonlari", label: { tr: "Turizm Organizasyonları", en: "Tour Organisations" } },
  { to: "/projeler", label: { tr: "Projelerimiz", en: "Our Projects" } },
];

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__about">
            <Link className="logo logo--light" to="/" aria-label="Akdoğan Turizm">
              <img src="/assets/img/logo-light.png" alt="Akdoğan Turizm" width={440} height={148} />
            </Link>
            <p>
              {t(
                "Gebze / Kocaeli merkezli olarak personel taşımacılığı, öğrenci taşımacılığı ve VIP transfer alanlarında deneyimli kadromuzla hizmet veriyoruz.",
                "From our Gebze / Kocaeli base we provide personnel transport, student transport and VIP transfer services, with an experienced team behind every route."
              )}
            </p>
            <div className="socials">
              <a className="social" href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" {...stroke}>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a className="social" href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" {...stroke}>
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                </svg>
              </a>
              <a className="social" href="#" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a className="social" href="#" aria-label="YouTube">
                <svg viewBox="0 0 24 24" {...stroke}>
                  <rect x="2" y="5" width="20" height="14" rx="4" />
                  <path d="m10 9 5 3-5 3z" />
                </svg>
              </a>
              <a
                className="social social--wa"
                href="https://wa.me/905320513606"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" {...stroke}>
                  <path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 21l2.3-5.3A8.4 8.4 0 1 1 21 11.5z" />
                </svg>
                <span>{t("WhatsApp'tan yazın", "Message us on WhatsApp")}</span>
              </a>
            </div>
          </div>

          <div>
            <h4>{t("Kurumsal", "Corporate")}</h4>
            <ul className="footer__links">
              {CORP_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{t(l.label)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>{t("Hizmetler", "Services")}</h4>
            <ul className="footer__links">
              {SERVICE_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{t(l.label)}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__contact-bar">
          <h4>{t("İletişim", "Contact")}</h4>
          <ul className="footer__contact footer__contact--row">
            <li>
              <svg viewBox="0 0 24 24" {...stroke}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Köşklüçesme Mah. Topçular Cad. No: 66/A, Gebze / Kocaeli</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" {...stroke}>
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1z" />
              </svg>
              <span>
                <a href="tel:+902626429103">0262 642 91 03</a>
                <br />
                <a href="tel:+905468814671">0546 881 46 71</a>
              </span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" {...stroke}>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </svg>
              <a href="mailto:info@akdoganturizm.com">info@akdoganturizm.com</a>
            </li>
            <li>
              <svg viewBox="0 0 24 24" {...stroke}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <Html
                as="span"
                tr="Hafta içi 09.00 – 19.00<br>Cumartesi 09.30 – 19.00<br>Pazar kapalı"
                en="Weekdays 09:00 – 19:00<br>Saturday 09:30 – 19:00<br>Sunday closed"
              />
            </li>
          </ul>
        </div>

        <div className="footer__bottom">
          <p>
            &copy; <span>{year}</span>{" "}
            {t("Akdoğan Turizm. Tüm hakları saklıdır.", "Akdoğan Turizm. All rights reserved.")}
          </p>
          <p className="footer__credits">
            {t(
              "Bazı görseller: “Turkey School bus” — ccarlstead (CC BY 2.0) ve “İstanbul Erkek Lisesi school buses” — Mr.choppers (CC BY-SA 3.0), Wikimedia Commons.",
              "Some images: “Turkey School bus” by ccarlstead (CC BY 2.0) and “İstanbul Erkek Lisesi school buses” by Mr.choppers (CC BY-SA 3.0), via Wikimedia Commons."
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
