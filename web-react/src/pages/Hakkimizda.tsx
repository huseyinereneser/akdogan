import { useI18n } from "@/i18n/I18nProvider";
import { useSiteData, initials } from "@/lib/site";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead, ReasonList, type Reason } from "@/components/SectionHead";
import { StatsBand } from "@/components/StatsBand";
import { CtaSection } from "@/components/CtaSection";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { Link } from "react-router-dom";
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
      tr: "Dört ana hizmet başlığında, kamu ve özel sektörün çok sayıda kuruluşuna hizmet veriyoruz.",
      en: "We serve numerous public and private sector organisations across four core service areas.",
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

const DOCUMENTS: GalleryImage[] = [
  { src: "/assets/img/belgeler/akdogan_turizm_marka_tescil.jpg", ratio: "media--3-4", caption: { tr: "Marka Tescil Belgesi", en: "Trademark Registration Certificate" } },
  { src: "/assets/img/belgeler/akdoganturizm-gto.jpg", ratio: "media--3-4", caption: { tr: "Ticaret Odası (GTO) Belgesi", en: "Chamber of Commerce (GTO) Certificate" } },
  { src: "/assets/img/belgeler/akdoganturizm-meslekibelge.jpg", ratio: "media--3-4", caption: { tr: "Mesleki Yeterlilik Belgesi", en: "Professional Competency Certificate" } },
  { src: "/assets/img/belgeler/akdoganturizm-iso9001.jpg", ratio: "media--3-4", caption: { tr: "ISO 9001 – Kalite Yönetim Sistemi", en: "ISO 9001 – Quality Management System" } },
  { src: "/assets/img/belgeler/akdoganturizm-iso10002.jpg", ratio: "media--3-4", caption: { tr: "ISO 10002 – Müşteri Memnuniyeti Yönetim Sistemi", en: "ISO 10002 – Customer Satisfaction Management System" } },
  { src: "/assets/img/belgeler/akdoganturizm-iso45001.jpg", ratio: "media--3-4", caption: { tr: "ISO 45001 – İş Sağlığı ve Güvenliği Yönetim Sistemi", en: "ISO 45001 – Occupational Health & Safety Management System" } },
  { src: "/assets/img/belgeler/akdoganturizm-iso14001.jpg", ratio: "media--3-4", caption: { tr: "ISO 14001 – Çevre Yönetim Sistemi", en: "ISO 14001 – Environmental Management System" } },
];

export default function Hakkimizda() {
  const { t } = useI18n();
  const site = useSiteData();
  const cms = site?.sayfalar?.hakkimizda?.alanlar ?? {};
  const cmsPair = (key: string, fallback: { tr: string; en: string }) => ({
    tr: cms[key]?.tr || fallback.tr,
    en: cms[key]?.en || fallback.en,
  });

  return (
    <>
      <PageMeta
        title={{ tr: "Kurumsal | Akdoğan Turizm", en: "Corporate | Akdoğan Turizm" }}
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
          { label: { tr: "Kurumsal", en: "Corporate" } },
        ]}
        eyebrow={{ tr: "Kurumsal", en: "Corporate" }}
        title={cmsPair("hero_baslik", { tr: "2010'dan bugüne kesintisiz yolculuk", en: "An unbroken journey since 2010" })}
        lead={cmsPair("hero_metin", {
          tr: "Gebze'de küçük bir filoyla başlayan hikayemiz, bugün her gün binlerce kişiyi güvenle taşıyan kurumsal bir yapıya dönüştü.",
          en: "Our story began with a small fleet in Gebze and has grown into a corporate organisation that safely transports thousands of people every day.",
        })}
      />

      <nav className="anchor-nav container" aria-label={t("Kurumsal bölüm menüsü", "Corporate section menu")}>
        <a href="#hakkimizda">{t("Hakkımızda", "About us")}</a>
        <a href="#misyon-vizyon">{t("Misyon & Vizyon", "Mission & Vision")}</a>
        <a href="#kadromuz">{t("Kadromuz", "Our team")}</a>
        <a href="#belgeler">{t("Belgelerimiz", "Documents")}</a>
        <a href="#hesaplar">{t("Hesap Bilgileri", "Bank accounts")}</a>
        <a href="#kvkk">{t("KVKK", "Data protection")}</a>
      </nav>

      {/* ŞİRKET HİKAYESİ */}
      <section className="section" id="hakkimizda">
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
                {t(cmsPair("giris", {
                  tr: "Akdoğan Turizm, 2010 yılında Kocaeli'nin sanayi merkezi Gebze'de, kurumların ulaşım ihtiyacına gerçek bir çözüm sunmak amacıyla kuruldu.",
                  en: "Akdoğan Turizm was founded in 2010 in Gebze, the industrial heart of Kocaeli, to offer a genuine solution to organisations' transport needs."
                }))}
              </p>
              <p style={{ color: "var(--text-muted)" }}>
                {t(
                  "Sanayi bölgesinde faaliyet gösteren kuruluşların en temel ihtiyaçlarından biri, personelinin işine zamanında ve güvenle ulaşmasıdır. Biz de tam bu noktada, servis taşımacılığını sadece bir araç hizmeti değil; planlama, operasyon takibi ve sorumluluk gerektiren bütünsel bir süreç olarak ele aldık.",
                  "One of the most fundamental needs of organisations operating in industrial zones is for their staff to reach work on time and safely. This is exactly where we started: treating shuttle transport not merely as a vehicle service, but as a holistic process requiring planning, operational tracking and responsibility."
                )}
              </p>
              <p style={{ color: "var(--text-muted)" }}>
                {t(
                  "Yıllar içinde hizmet alanımızı öğrenci taşımacılığı, VIP transfer ve araç kiralamayı kapsayacak şekilde genişlettik. Filomuzu düzenli olarak yeniledik, ekibimizi büyüttük; ancak ilk günkü çalışma disiplinimizden hiç ödün vermedik.",
                  "Over the years we expanded our service area to cover student transport, VIP transfer and vehicle rental. We renewed our fleet regularly and grew our team, without ever compromising on the working discipline we started with."
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
      <section className="section" id="misyon-vizyon">
        <div className="container">
          <SectionHead
            center
            eyebrow={{ tr: "Misyon & Vizyon", en: "Mission & Vision" }}
            title={{ tr: "Bizi yolda tutan iki pusula", en: "Two compasses that keep us on course" }}
          />
          <div className="grid-2-cards">
            <Reveal className="panel panel--dark">
              <span className="panel__no">01</span>
              <h3>{t("Misyonumuz", "Our Mission")}</h3>
              <p>
                {t(cmsPair("misyon", {
                  tr: "Hizmet verdiğimiz her kurumun ulaşım sorumluluğunu eksiksiz üstleniyoruz. Personelin, öğrencinin ve misafirin her yolculuğunu güvenli, konforlu ve tam zamanında tamamlamayı taahhüt ediyoruz.",
                  en: "We take full responsibility for the transport of every organisation we serve. We are committed to completing every journey — for staff, students and guests — safely, comfortably and precisely on time."
                }))}
              </p>
            </Reveal>
            <Reveal className="panel panel--dark" delay={100}>
              <span className="panel__no">02</span>
              <h3>{t("Vizyonumuz", "Our Vision")}</h3>
              <p>
                {t(cmsPair("vizyon", {
                  tr: "Türkiye'nin kurumsal ulaşım sektöründe öncü markalarından biri olmayı hedefliyoruz; bu hedefe filo kalitesi, operasyon disiplini ve kesintisiz müşteri memnuniyetiyle ulaşıyoruz.",
                  en: "We aspire to be among Türkiye's leading corporate transport brands — a goal we pursue through fleet quality, operational discipline and unwavering customer satisfaction."
                }))}
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

      <section className="section" id="kadromuz">
        <div className="container">
          <SectionHead
            eyebrow={{ tr: "Kadromuz", en: "Our Team" }}
            title={{ tr: "İşi yürüten ekip", en: "The team behind the operation" }}
            text={{ tr: "Planlama, operasyon ve müşteri iletişimini deneyimli ekibimiz birlikte yürütür.", en: "Our experienced team handles planning, operations and customer communication together." }}
          />
          <div className="grid-auto grid-auto--4col">
            {[
              { name: "Aslan Akdoğan", role: { tr: "Yönetim Kurulu Başkanı", en: "Chairman of the Board" } },
              { name: "Kübra Helvacı", role: { tr: "Muhasebe", en: "Accounting" } },
              { name: "Olcay Önsal", role: { tr: "Proje Sorumlusu", en: "Project Manager" } },
              { name: "Dilan Avcıoğullarından", role: { tr: "Satın Alma Sorumlusu", en: "Purchasing Manager" } },
            ].map((member, index) => (
              <Reveal as="article" className="team-card" delay={index * 70} key={member.name}>
                <div className="team-card__avatar" aria-hidden="true"><span>{initials(member.name)}</span></div>
                <div className="team-card__body"><h3>{member.name}</h3><p className="team-card__role">{t(member.role)}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft" id="belgeler">
        <div className="container">
          <SectionHead eyebrow={{ tr: "Belgelerimiz", en: "Documents" }} title={{ tr: "Mevzuata tam uyum", en: "Fully compliant" }} text={{ tr: "Gerekli yetki belgeleri ve kalite sertifikalarımız güncel olarak tutulur.", en: "Our required operating licences and quality certificates are kept up to date." }} />
          <Gallery images={DOCUMENTS} variant="gallery--docs" />
        </div>
      </section>

      <section className="section" id="hesaplar">
        <div className="container">
          <SectionHead eyebrow={{ tr: "Ödeme Bilgileri", en: "Payment Details" }} title={{ tr: "Banka hesaplarımız", en: "Our bank accounts" }} text={{ tr: "Ödeme öncesi IBAN bilgisini resmî kanallarımızdan doğrulayın.", en: "Please verify IBAN details through our official channels before payment." }} />
          <div className="grid-2-cards">
            {[["Garanti BBVA", "TR57 0006 2001 3450 0006 2976 79"], ["Türkiye İş Bankası", "TR26 0006 4000 0012 4202 9432 41"]].map(([bank, iban]) => <Reveal className="bank-card" key={iban}><div className="bank-card__brand"><h3>{bank}</h3><span className="bank-card__currency">TL</span></div><dl><div className="bank-row"><dt>{t("Hesap Sahibi", "Account holder")}</dt><dd>Akdoğan Seyahat Turizm</dd></div><div className="bank-row"><dt>IBAN</dt><dd className="iban">{iban}</dd></div></dl></Reveal>)}
          </div>
        </div>
      </section>

      <section className="section section--soft" id="kvkk">
        <div className="container container--narrow">
          <SectionHead eyebrow={{ tr: "KVKK", en: "Data Protection" }} title={{ tr: "Kişisel Verilerin Korunması", en: "Data Protection Notice" }} />
          <div className="prose"><p>{t("Kişisel verileriniz, hizmetlerin planlanması, sözleşme süreçleri, iletişim ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir. Verileriniz yalnızca gerekli olduğu ölçüde yetkili kişi ve kurumlarla paylaşılır.", "Your personal data is processed to plan services, fulfil contract processes, communicate and meet legal obligations. It is shared with authorised parties only where necessary.")}</p><p>{t("KVKK kapsamındaki başvurularınız için info@akdoganturizm.com adresinden veya 0262 642 91 03 numarasından bize ulaşabilirsiniz.", "For requests under data protection law, contact us at info@akdoganturizm.com or 0262 642 91 03.")}</p><Link to="/iletisim">{t("İletişim bilgileri", "Contact details")} →</Link></div>
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
