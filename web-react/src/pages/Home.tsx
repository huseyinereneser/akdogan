import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { PageMeta } from "@/components/PageMeta";

const SERVICES = [
  {
    no: "01",
    title: { tr: "Personel Taşımacılığı", en: "Personnel Transport" },
    summary: {
      tr: "Kamu ve özel kuruluşlara yönelik, yasal yükümlülüklere tam uyumlu düzenli personel servis hizmeti. Vardiya saatlerinize göre planlanan güzergâhlar.",
      en: "Regular staff shuttle services for public and private institutions, fully compliant with legal obligations. Routes planned around your shift hours.",
    },
    hash: "#personel-tasimaciligi",
  },
  {
    no: "02",
    title: { tr: "Öğrenci Taşımacılığı", en: "Student Transport" },
    summary: {
      tr: "Okul öncesi ve tüm kademelerdeki öğrencilerin evden okula, okuldan eve güvenli ve konforlu taşınması. Rehber personel eşliğinde hizmet.",
      en: "Safe, comfortable home-to-school transport for pre-school and all grade levels, with a chaperone on board.",
    },
    hash: "#ogrenci-tasimaciligi",
  },
  {
    no: "03",
    title: { tr: "VIP Transfer", en: "VIP Transfer" },
    summary: {
      tr: "Son model, özel üretim araç filomuzla havalimanı karşılama, misafir ve üst düzey personel transferi. Protokol standartlarında hizmet.",
      en: "Airport meet-and-greet and guest / executive transfers with our late-model, purpose-built fleet. Protocol-grade service.",
    },
    hash: "#vip-transfer",
  },
  {
    no: "04",
    title: { tr: "Araç Kiralama", en: "Vehicle Rental" },
    summary: {
      tr: "Günlük, aylık ve uzun dönem araç kiralama seçenekleri. Sürücülü veya sürücüsüz, kurumsal filo ihtiyaçlarına uygun esnek çözümler.",
      en: "Daily, monthly and long-term rental options. With or without a driver — flexible solutions for corporate fleet needs.",
    },
    hash: "#arac-kiralama",
  },
  {
    no: "05",
    title: { tr: "Şehir İçi Yolcu Taşımacılığı", en: "Intercity & Local Passenger Transport" },
    summary: {
      tr: "0 km araçlarımızla şehir içi yolcu taşımacılığında modern ve kaliteli hizmet. Grup transferleri ve özel organizasyon ulaşımı.",
      en: "Modern, quality local passenger transport with our zero-km vehicles. Group transfers and event transport.",
    },
    hash: "#sehir-ici-tasimacilik",
  },
  {
    no: "06",
    title: { tr: "Turizm Organizasyonları", en: "Tour Organisations" },
    summary: {
      tr: "Kurumsal geziler, tur programları ve etkinlik ulaşımı. Planlamadan uygulamaya kadar tüm süreci sizin adınıza yönetiyoruz.",
      en: "Corporate trips, tour programmes and event transport. We manage the whole process on your behalf, from planning to delivery.",
    },
    hash: "#turizm-organizasyonlari",
  },
];

const REASONS = [
  {
    no: "01",
    title: { tr: "16 yıllık saha deneyimi", en: "16 years of field experience" },
    text: {
      tr: "2010'dan bu yana kesintisiz hizmet veriyoruz. Farklı ölçekteki kurumların ulaşım ihtiyacını yönetmiş, her senaryoyu sahada görmüş bir ekibiz.",
      en: "We have provided uninterrupted service since 2010. We are a team that has managed the transport needs of organisations of every scale, and seen every scenario in the field.",
    },
  },
  {
    no: "02",
    title: { tr: "Dakiklik ve sorumluluk", en: "Punctuality and responsibility" },
    text: {
      tr: "Hızlı, dakik ve sorumluluk sahibi bir ekiple çalışıyoruz. Güzergâh planlaması ve anlık operasyon takibi sayesinde servisler saatinde hareket eder.",
      en: "We work with a fast, punctual and responsible team. Thanks to route planning and live operational tracking, our services run on time.",
    },
  },
  {
    no: "03",
    title: { tr: "Modern ve 0 km filo", en: "Modern, zero-km fleet" },
    text: {
      tr: "Filomuz düzenli aralıklarla yenilenir. Periyodik bakımları eksiksiz yapılan araçlarımız hem konfor hem de yol güvenliği açısından üst standarttadır.",
      en: "Our fleet is renewed at regular intervals. Vehicles with complete, periodic maintenance meet the highest standard for both comfort and road safety.",
    },
  },
  {
    no: "04",
    title: { tr: "Güvenlik önceliği", en: "Safety first" },
    text: {
      tr: "Özellikle öğrenci taşımacılığında güvenlik tavizsizdir. Deneyimli sürücüler, rehber personel ve mevzuata tam uyum temel çalışma prensibimizdir.",
      en: "Safety is non-negotiable, especially in student transport. Experienced drivers, chaperones and full regulatory compliance are core to how we work.",
    },
  },
];

const STEPS = [
  {
    no: "01",
    title: { tr: "İhtiyaç analizi", en: "Needs analysis" },
    text: {
      tr: "Personel sayınızı, vardiya düzeninizi ve toplanma noktalarınızı birlikte değerlendiriyoruz.",
      en: "We assess your staff numbers, shift schedule and pickup points together.",
    },
  },
  {
    no: "02",
    title: { tr: "Güzergâh ve filo planı", en: "Route and fleet plan" },
    text: {
      tr: "En verimli güzergâhları çıkarıp ihtiyaca uygun araç tipini ve sefer sayısını belirliyoruz.",
      en: "We map the most efficient routes and determine the right vehicle type and number of trips for your needs.",
    },
  },
  {
    no: "03",
    title: { tr: "Operasyon ve takip", en: "Operations and tracking" },
    text: {
      tr: "Hizmet başladıktan sonra da düzenli raporlama ve tek noktadan iletişimle süreci yönetiyoruz.",
      en: "Once service begins, we manage the process with regular reporting and single-point communication.",
    },
  },
];

export default function Home() {
  const { t } = useI18n();

  return (
    <>
      <PageMeta
        title={{
          tr: "Akdoğan Turizm | Kurumsal Ulaşım ve Turizm Hizmetleri — Gebze / Kocaeli",
          en: "Akdoğan Turizm | Corporate Transport & Tourism Services — Gebze / Kocaeli",
        }}
        description={{
          tr: "2010'dan bu yana personel taşımacılığı, öğrenci servisi, VIP transfer, araç kiralama ve turizm organizasyonları. Gebze / Kocaeli merkezli, modern ve 0 km araç filosu.",
          en: "Since 2010: personnel transport, student shuttle, VIP transfer, vehicle rental and tour organisations. Gebze / Kocaeli based, with a modern zero-km fleet.",
        }}
      />

      {/* HERO */}
      <section className="hero">
        <div className="hero__media">
          <img
            className="media"
            src="/assets/img/hero-temsili.jpg"
            alt={t(
              "Yolda ilerleyen modern bir tur otobüsü (temsili görsel)",
              "A modern coach on the road (representative image)"
            )}
            // @ts-expect-error - fetchpriority DOM özniteliği
            fetchpriority="high"
          />
        </div>
        <div className="hero__overlay" />
        <div className="container">
          <div className="hero__inner">
            <Reveal as="p" className="eyebrow" delay={0}>
              {t("2010'dan Bu Yana", "Since 2010")}
            </Reveal>
            <Reveal as="h1" delay={80}>
              {t(
                "Her gün binlerce kişiyi zamanında ulaştırıyoruz.",
                "We get thousands of people where they need to be, on time, every day."
              )}
            </Reveal>
            <Reveal as="p" className="hero__text" delay={160}>
              {t(
                "Personel ve öğrenci taşımacılığından VIP transfere kadar kurumsal ulaşımın her alanında; modern filomuz, dakik ekibimiz ve yasal mevzuata tam uyumlu hizmet anlayışımızla yanınızdayız.",
                "From personnel and student transport to VIP transfer, we cover every area of corporate mobility with a modern fleet, a punctual team and a fully compliant approach."
              )}
            </Reveal>
            <Reveal className="btn-row" delay={240}>
              <Link className="btn btn--primary" to="/iletisim#teklif">
                {t("Teklif Al", "Get a Quote")}
              </Link>
              <Link className="btn btn--light" to="/hizmetler">
                {t("Hizmetlerimiz", "Our Services")}
              </Link>
            </Reveal>
            <Reveal className="hero__meta" delay={320}>
              <div>
                <strong>16+</strong> <span>{t("Yıllık deneyim", "Years of experience")}</span>
              </div>
              <div>
                <strong>0 km</strong>{" "}
                <span>{t("Sıfır km araç filosu", "Brand-new vehicle fleet")}</span>
              </div>
              <div>
                <strong>7/24</strong> <span>{t("Operasyon desteği", "Operations support")}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HAKKIMIZDA ÖZETİ */}
      <section className="section">
        <div className="container">
          <div className="split">
            <Reveal>
              <p className="eyebrow">{t("Hakkımızda", "About Us")}</p>
              <h2>
                {t(
                  "Ulaşımı bir hizmet değil, bir sorumluluk olarak görüyoruz.",
                  "We see transport not as a service, but as a responsibility."
                )}
              </h2>
              <p className="lead" style={{ marginTop: 24 }}>
                {t(
                  "Akdoğan Turizm, 2010 yılında Gebze'de kurulduğu günden bu yana kamu ve özel sektör kuruluşlarına kurumsal ulaşım hizmeti sunuyor.",
                  "Since it was founded in Gebze in 2010, Akdoğan Turizm has provided corporate transport services to public and private sector organisations."
                )}
              </p>
              <p style={{ color: "var(--text-muted)" }}>
                {t(
                  "Bugün geldiğimiz noktada; her sabah işine yetişmesi gereken personelden, okul servisine binen bir öğrenciye kadar taşıdığımız her yolcunun güvenliğini ve zamanını önceliğimiz sayıyoruz. Hızlı, dakik ve sorumluluk sahibi ekibimizle sektörün lider markalarından biri olmayı hedefliyoruz.",
                  "Today, we consider the safety and time of every passenger we carry a priority — from staff who need to get to work every morning to a student boarding the school shuttle. With a fast, punctual and responsible team, we aim to be one of the industry's leading brands."
                )}
              </p>
              <ul className="checklist">
                <li>
                  <span>
                    <strong>{t("Yasal uyumluluk.", "Legal compliance.")}</strong>{" "}
                    {t(
                      "Tüm araç ve sürücülerimiz mevzuatın gerektirdiği belge ve yükümlülüklere sahiptir.",
                      "All our vehicles and drivers hold every document and qualification required by law."
                    )}
                  </span>
                </li>
                <li>
                  <span>
                    <strong>{t("Dakiklik.", "Punctuality.")}</strong>{" "}
                    {t(
                      "Güzergâh planlaması ve operasyon takibiyle gecikmesiz servis.",
                      "On-time service through route planning and live operational tracking."
                    )}
                  </span>
                </li>
                <li>
                  <span>
                    <strong>{t("Konfor.", "Comfort.")}</strong>{" "}
                    {t(
                      "Bakımı düzenli yapılan, modern ve 0 km araçlardan oluşan filo.",
                      "A fleet of modern, zero-km vehicles kept in regular maintenance."
                    )}
                  </span>
                </li>
              </ul>
              <div className="btn-row">
                <Link className="btn btn--outline" to="/hakkimizda">
                  {t("Şirket Hikayemiz", "Our Company Story")}
                </Link>
              </div>
            </Reveal>

            <Reveal className="split__media" delay={120}>
              <img
                className="media media--4-3"
                src="/assets/img/fleet-temsili.jpg"
                alt={t(
                  "Park hâlinde bekleyen otobüs filosu (temsili görsel)",
                  "A parked fleet of coaches (representative image)"
                )}
                loading="lazy"
              />
              <div className="badge-year">
                <strong>2010</strong>
                <span>{t("Kuruluş", "Founded")}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section className="section section--soft">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">{t("Hizmetlerimiz", "Our Services")}</p>
            <h2>{t("Kurumsal ulaşımın altı ana başlığı", "Six key areas of corporate transport")}</h2>
            <p>
              {t(
                "İhtiyacınıza göre kurgulanan, uçtan uca planlanan ve tek noktadan yönetilen ulaşım çözümleri.",
                "Transport solutions built around your needs, planned end-to-end and managed from a single point."
              )}
            </p>
          </Reveal>

          <Reveal className="grid-3">
            {SERVICES.map((s) => (
              <article className="service-card" key={s.no}>
                <p className="service-card__no">{s.no}</p>
                <h3>{t(s.title)}</h3>
                <p>{t(s.summary)}</p>
                <Link className="link-arrow" to={`/hizmetler${s.hash}`}>
                  {t("Detaylı bilgi", "Learn more")}
                </Link>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* NEDEN AKDOĞAN */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <p className="eyebrow">{t("Neden Akdoğan Turizm?", "Why Akdoğan Turizm?")}</p>
            <h2>{t("Kurumların bize güvenmesinin dört nedeni", "Four reasons organisations trust us")}</h2>
          </Reveal>

          <div className="reasons">
            {REASONS.map((r, i) => (
              <Reveal className="reason" delay={i % 2 ? 80 : 0} key={r.no}>
                <span className="reason__no">{r.no}</span>
                <div>
                  <h3>{t(r.title)}</h3>
                  <p>{t(r.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* İSTATİSTİK BANDI */}
      <section className="stats">
        <div className="container">
          <div className="stats__grid">
            <Reveal className="stat">
              <div className="stat__value">2010</div>
              <p className="stat__label">{t("Kuruluş yılı", "Year founded")}</p>
            </Reveal>
            <Reveal className="stat" delay={80}>
              <div className="stat__value">
                <CountUp value={3500} suffix="+" />
              </div>
              <p className="stat__label">{t("Günlük taşınan yolcu", "Passengers transported daily")}</p>
            </Reveal>
            <Reveal className="stat" delay={160}>
              <div className="stat__value">
                <CountUp value={120} suffix="+" />
              </div>
              <p className="stat__label">{t("Filodaki araç sayısı", "Vehicles in the fleet")}</p>
            </Reveal>
            <Reveal className="stat" delay={240}>
              <div className="stat__value">
                <CountUp value={60} suffix="+" />
              </div>
              <p className="stat__label">{t("Kurumsal iş ortağı", "Corporate partners")}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SÜREÇ */}
      <section className="section section--tight section--soft">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">{t("Nasıl Çalışıyoruz?", "How We Work")}</p>
            <h2>{t("Üç adımda hizmete başlıyoruz", "We start service in three steps")}</h2>
          </Reveal>

          <div className="reasons">
            {STEPS.map((s, i) => (
              <Reveal className="reason" delay={i * 80} key={s.no}>
                <span className="reason__no">{s.no}</span>
                <div>
                  <h3>{t(s.title)}</h3>
                  <p>{t(s.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <Reveal>
            <h2>
              {t(
                "Kurumunuz için ulaşım planını birlikte kuralım.",
                "Let's build a transport plan for your organisation together."
              )}
            </h2>
            <p>
              {t(
                "İhtiyacınızı anlatın, size özel bir çözüm ve fiyat teklifiyle en kısa sürede dönüş yapalım.",
                "Tell us what you need, and we'll get back to you as soon as possible with a tailored solution and quote."
              )}
            </p>
          </Reveal>
          <Reveal className="cta__actions" delay={100}>
            <Link className="btn btn--primary" to="/iletisim#teklif">
              {t("Teklif Al", "Get a Quote")}
            </Link>
            <a className="btn btn--light" href="tel:+902626429103">
              0262 642 91 03
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
