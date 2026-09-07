import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead, ReasonList, type Reason } from "@/components/SectionHead";
import { StatsBand } from "@/components/StatsBand";
import { CtaSection } from "@/components/CtaSection";
import type { Pair } from "@/i18n/I18nProvider";

interface Milestone {
  year: Pair;
  title: Pair;
  text: Pair;
}

const TIMELINE: Milestone[] = [
  {
    year: { tr: "2010", en: "2010" },
    title: { tr: "Kuruluş", en: "Founded" },
    text: {
      tr: "Akdoğan Turizm, Gebze'de personel taşımacılığı hizmeti vermek üzere kuruldu.",
      en: "Akdoğan Turizm was founded in Gebze to provide personnel transport services.",
    },
  },
  {
    year: { tr: "2013", en: "2013" },
    title: { tr: "Öğrenci taşımacılığı", en: "Student transport" },
    text: {
      tr: "Okul servisi hizmetiyle faaliyet alanımızı genişlettik; rehber personel uygulamasına geçtik.",
      en: "We expanded into school shuttle services and introduced on-board chaperones.",
    },
  },
  {
    year: { tr: "2016", en: "2016" },
    title: { tr: "Filo yenilemesi", en: "Fleet renewal" },
    text: {
      tr: "Araç filomuzu 0 km araçlarla yenileyerek konfor ve güvenlik standartlarımızı yükselttik.",
      en: "We renewed our fleet with zero-km vehicles, raising our comfort and safety standards.",
    },
  },
  {
    year: { tr: "2019", en: "2019" },
    title: { tr: "VIP transfer", en: "VIP transfer" },
    text: {
      tr: "Son model, özel üretim araçlarla havalimanı karşılama ve misafir transferi hizmetine başladık.",
      en: "We began airport meet-and-greet and guest transfer services with late-model, purpose-built vehicles.",
    },
  },
  {
    year: { tr: "Bugün", en: "Today" },
    title: { tr: "Kurumsal büyüme", en: "Corporate growth" },
    text: {
      tr: "Altı ana hizmet başlığında, kamu ve özel sektörün çok sayıda kuruluşuna hizmet veriyoruz.",
      en: "We serve numerous public and private sector organisations across six core service areas.",
    },
  },
];

const VALUES: Reason[] = [
  {
    no: "01",
    title: { tr: "Güvenlik", en: "Safety" },
    text: {
      tr: "Yolcu güvenliği pazarlık konusu değildir. Araç bakımları, sürücü seçimi ve mevzuat uyumu bu ilkeye göre yönetilir.",
      en: "Passenger safety is non-negotiable. Vehicle maintenance, driver selection and regulatory compliance are all managed around this principle.",
    },
  },
  {
    no: "02",
    title: { tr: "Dakiklik", en: "Punctuality" },
    text: {
      tr: "Bir servisin gecikmesi, onlarca insanın gününü etkiler. Planlamayı ve operasyonu bu bilinçle kurguluyoruz.",
      en: "A single delayed shuttle affects dozens of people's day. We plan and operate with that awareness.",
    },
  },
  {
    no: "03",
    title: { tr: "Sorumluluk", en: "Responsibility" },
    text: {
      tr: "Verdiğimiz sözün arkasında duruyor, sorun çıktığında hızlı ve şeffaf şekilde çözüm üretiyoruz.",
      en: "We stand behind our word, and when an issue arises we resolve it quickly and transparently.",
    },
  },
  {
    no: "04",
    title: { tr: "Süreklilik", en: "Continuity" },
    text: {
      tr: "Filomuzu, ekibimizi ve süreçlerimizi düzenli olarak yenileyerek hizmet kalitemizi sürekli yukarı taşıyoruz.",
      en: "We keep raising our service quality by regularly renewing our fleet, our team and our processes.",
    },
  },
];

export default function Hakkimizda() {
  const { t } = useI18n();

  return (
    <>
      <PageMeta
        title={{ tr: "Hakkımızda | Akdoğan Turizm", en: "About Us | Akdoğan Turizm" }}
        description={{
          tr: "Akdoğan Turizm 2010 yılında Gebze'de kuruldu. Kurumsal ulaşım alanındaki hikayemiz, misyonumuz, vizyonumuz ve çalışma değerlerimiz.",
          en: "Akdoğan Turizm was founded in Gebze in 2010. Our story, mission, vision and working values in corporate transport.",
        }}
      />

      <PageHero
        bg="/assets/img/fleet-2-temsili.jpg"
        bgAlt={{
          tr: "Akdoğan Turizm araç filosu (temsili görsel)",
          en: "Akdoğan Turizm fleet (representative image)",
        }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Hakkımızda", en: "About Us" } },
        ]}
        eyebrow={{ tr: "Hakkımızda", en: "About Us" }}
        title={{ tr: "2010'dan bugüne kesintisiz yolculuk", en: "An unbroken journey since 2010" }}
        lead={{
          tr: "Gebze'de küçük bir filoyla başlayan hikayemiz, bugün her gün binlerce kişiyi güvenle taşıyan kurumsal bir yapıya dönüştü.",
          en: "Our story began with a small fleet in Gebze and has grown into a corporate organisation that safely transports thousands of people every day.",
        }}
      />

      {/* ŞİRKET HİKAYESİ */}
      <section className="section">
        <div className="container">
          <div className="split">
            <Reveal>
              <p className="eyebrow">{t("Şirket Hikayemiz", "Our Company Story")}</p>
              <h2>
                {t(
                  "Yolun başında da, bugün de aynı sözü verdik: zamanında ve güvenle.",
                  "At the start of the road, and today, we made the same promise: on time and with trust."
                )}
              </h2>
              <p className="lead" style={{ marginTop: 24 }}>
                {t(
                  "Akdoğan Turizm, 2010 yılında Kocaeli'nin sanayi merkezi Gebze'de, kurumların ulaşım ihtiyacına gerçek bir çözüm sunmak amacıyla kuruldu.",
                  "Akdoğan Turizm was founded in 2010 in Gebze, the industrial heart of Kocaeli, to offer a genuine solution to organisations' transport needs."
                )}
              </p>
              <p style={{ color: "var(--text-muted)" }}>
                {t(
                  "Sanayi bölgesinde faaliyet gösteren kuruluşların en temel ihtiyaçlarından biri, personelinin işine zamanında ve güvenle ulaşmasıdır. Biz de tam bu noktada, servis taşımacılığını sadece bir araç hizmeti değil; planlama, operasyon takibi ve sorumluluk gerektiren bütünsel bir süreç olarak ele aldık.",
                  "One of the most fundamental needs of organisations operating in industrial zones is for their staff to reach work on time and safely. This is exactly where we started: treating shuttle transport not merely as a vehicle service, but as a holistic process requiring planning, operational tracking and responsibility."
                )}
              </p>
              <p style={{ color: "var(--text-muted)" }}>
                {t(
                  "Yıllar içinde hizmet alanımızı öğrenci taşımacılığı, VIP transfer, araç kiralama, şehir içi yolcu taşımacılığı ve turizm organizasyonlarını kapsayacak şekilde genişlettik. Filomuzu düzenli olarak yeniledik, ekibimizi büyüttük; ancak ilk günkü çalışma disiplinimizden hiç ödün vermedik.",
                  "Over the years we expanded our service area to cover student transport, VIP transfer, vehicle rental, local passenger transport and tour organisations. We renewed our fleet regularly and grew our team, without ever compromising on the working discipline we started with."
                )}
              </p>
              <p style={{ color: "var(--text-muted)" }}>
                {t(
                  "Bugün hedefimiz, hizmet kalitemizi ve kurumsal yapımızı sürekli geliştirerek sektörün lider markalarından biri olmaktır.",
                  "Today our goal is to keep improving our service quality and corporate structure to become one of the industry's leading brands."
                )}
              </p>
            </Reveal>

            <Reveal className="split__media" delay={120}>
              <img
                className="media media--3-4"
                src="/assets/img/personel-yolcu-temsili.jpg"
                alt={t("Servise binen yolcular (temsili görsel)", "Passengers boarding a shuttle (representative image)")}
                loading="lazy"
              />
              <div className="badge-year">
                <strong>16+</strong>
                <span>{t("Yıllık deneyim", "Years of experience")}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ZAMAN ÇİZELGESİ */}
      <section className="section section--soft">
        <div className="container">
          <div className="split" style={{ alignItems: "start" }}>
            <Reveal>
              <p className="eyebrow">{t("Yolculuğumuz", "Our Journey")}</p>
              <h2>{t("2010'dan bugüne dönüm noktaları", "Milestones from 2010 to today")}</h2>
              <p style={{ marginTop: 22, color: "var(--text-muted)" }}>
                {t(
                  "Kuruluşumuzdan bu yana attığımız adımlar, bugünkü hizmet kalitemizin temelini oluşturuyor.",
                  "The steps we have taken since our founding form the foundation of our service quality today."
                )}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <ul className="timeline">
                {TIMELINE.map((m, i) => (
                  <li key={i}>
                    <span className="timeline__year">{t(m.year)}</span>
                    <h3>{t(m.title)}</h3>
                    <p>{t(m.text)}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MİSYON / VİZYON */}
      <section className="section">
        <div className="container">
          <SectionHead
            center
            eyebrow={{ tr: "Misyon & Vizyon", en: "Mission & Vision" }}
            title={{ tr: "Bizi yolda tutan iki pusula", en: "Two compasses that keep us on course" }}
          />
          <div className="grid-2-cards">
            <Reveal className="panel">
              <h3>{t("Misyonumuz", "Our Mission")}</h3>
              <p>
                {t(
                  "Hizmet verdiğimiz her kuruluşun ulaşım yükünü üzerinden almak; personelin, öğrencinin ve misafirin yolculuğunu güvenli, konforlu ve dakik hale getirmek. Bunu yaparken yasal yükümlülüklere eksiksiz uyum sağlamak ve iş ortaklarımıza öngörülebilir, şeffaf bir hizmet sunmak.",
                  "To take the transport burden off every organisation we serve, and to make the journeys of staff, students and guests safe, comfortable and on time — while fully complying with legal obligations and offering our partners predictable, transparent service."
                )}
              </p>
            </Reveal>
            <Reveal className="panel panel--dark" delay={100}>
              <h3>{t("Vizyonumuz", "Our Vision")}</h3>
              <p>
                {t(
                  "Filo kalitesi, operasyon disiplini ve müşteri memnuniyetiyle ölçüldüğünde Türkiye'de kurumsal ulaşım sektörünün lider markalarından biri olmak; teknolojiyi ve sürdürülebilir çözümleri hizmetimizin merkezine yerleştirmek.",
                  "To be one of the leading brands in Türkiye's corporate transport sector, measured by fleet quality, operational discipline and customer satisfaction — placing technology and sustainable solutions at the heart of our service."
                )}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* DEĞERLER */}
      <section className="section section--soft">
        <div className="container">
          <SectionHead
            eyebrow={{ tr: "Değerlerimiz", en: "Our Values" }}
            title={{ tr: "Çalışma prensiplerimiz", en: "Our working principles" }}
          />
          <ReasonList items={VALUES} />
        </div>
      </section>

      <StatsBand />

      <CtaSection
        title={{ tr: "Bizimle çalışmak ister misiniz?", en: "Would you like to work with us?" }}
        text={{
          tr: "Kurumunuzun ulaşım ihtiyacını dinleyelim, size özel bir plan hazırlayalım.",
          en: "Let us hear about your organisation's transport needs and prepare a tailored plan for you.",
        }}
        actions={[
          { label: { tr: "Teklif Al", en: "Get a Quote" }, to: "/iletisim#teklif" },
          { label: { tr: "Hizmetlerimiz", en: "Our Services" }, to: "/hizmetler", variant: "light" },
        ]}
      />
    </>
  );
}
