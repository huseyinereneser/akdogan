import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead, ReasonList, type Reason } from "@/components/SectionHead";
import { CtaSection } from "@/components/CtaSection";
import type { Pair } from "@/i18n/I18nProvider";

interface Ref {
  name: string;
  sector: Pair;
}

const REFS: Ref[] = [
  { name: "Çoban Yıldızları İlköğretim Okulu", sector: { tr: "Eğitim", en: "Education" } },
  { name: "Aydınlar Refrakter", sector: { tr: "Refrakter / Üretim", en: "Refractory / Manufacturing" } },
  { name: "Planet Plastik", sector: { tr: "Plastik", en: "Plastics" } },
  { name: "Cavitech Denizcilik", sector: { tr: "Denizcilik", en: "Maritime" } },
  { name: "Betasan", sector: { tr: "Üretim", en: "Manufacturing" } },
  { name: "CPS", sector: { tr: "Sanayi", en: "Industry" } },
  { name: "Else Plastik", sector: { tr: "Plastik", en: "Plastics" } },
  { name: "Özverler", sector: { tr: "Sanayi", en: "Industry" } },
];

const APPROACH: Reason[] = [
  {
    no: "01",
    title: { tr: "Tek muhatap", en: "Single point of contact" },
    text: {
      tr: "Her kurum için bir proje sorumlusu atıyoruz; tüm talep ve bildirimler tek noktadan yönetiliyor.",
      en: "We assign a project manager to each organisation; all requests and notices are handled from a single point.",
    },
  },
  {
    no: "02",
    title: { tr: "Şeffaf raporlama", en: "Transparent reporting" },
    text: {
      tr: "Sefer, doluluk ve aksama kayıtlarını düzenli olarak kurumla paylaşıyoruz.",
      en: "We regularly share trip, occupancy and disruption records with your organisation.",
    },
  },
  {
    no: "03",
    title: { tr: "Hızlı müdahale", en: "Rapid response" },
    text: {
      tr: "Arıza veya beklenmedik bir durumda yedek araç planımız devreye giriyor, sefer aksamıyor.",
      en: "If a breakdown or unexpected situation occurs, our backup vehicle plan kicks in and the trip is not disrupted.",
    },
  },
  {
    no: "04",
    title: { tr: "Sözleşmeye sadakat", en: "Commitment to the contract" },
    text: {
      tr: "Taahhüt ettiğimiz araç sayısı, sefer düzeni ve hizmet standardı yıl boyunca değişmez.",
      en: "The number of vehicles, trip schedule and service standard we commit to stay unchanged throughout the year.",
    },
  },
];

export default function Referanslar() {
  const { t } = useI18n();

  return (
    <>
      <PageMeta title={{ tr: "Referanslarımız | Akdoğan Turizm", en: "Our References | Akdoğan Turizm" }} />

      <PageHero
        bg="/assets/img/ekip-ofis-temsili.jpg"
        bgAlt={{ tr: "Kurumsal ekip toplantısı (temsili görsel)", en: "Corporate team meeting (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Referanslar", en: "References" } },
        ]}
        eyebrow={{ tr: "Referanslarımız", en: "Our References" }}
        title={{ tr: "Bize güvenen kurumlar", en: "Organisations that trust us" }}
        lead={{
          tr: "2010'dan bu yana eğitim, üretim, denizcilik ve plastik sektörlerinden birçok kuruluşun ulaşım ihtiyacını yönetiyoruz.",
          en: "Since 2010 we have managed the transport needs of many organisations in the education, manufacturing, maritime and plastics sectors.",
        }}
      />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow={{ tr: "İş Ortaklarımız", en: "Our Business Partners" }}
            title={{ tr: "Hizmet verdiğimiz kurumlar", en: "Organisations we serve" }}
            text={{
              tr: "Uzun soluklu iş birlikleri kuruyoruz; referanslarımızın çoğu ilk sözleşmeden bu yana bizimle çalışmaya devam ediyor.",
              en: "We build long-term partnerships; most of our references have continued working with us since their first contract.",
            }}
          />

          <Reveal className="ref-grid">
            {REFS.map((r) => (
              <div className="ref-item" key={r.name}>
                <span className="ref-item__mark">LOGO</span>
                <span className="ref-item__name">{r.name}</span>
                <span className="ref-item__sector">{t(r.sector)}</span>
              </div>
            ))}
          </Reveal>

          <p className="form-note" style={{ marginTop: 24 }}>
            {t(
              "Referans listemiz ve sektörler yalnızca bilgilendirme amaçlıdır. Detaylı referans bilgisi için bizimle iletişime geçebilirsiniz.",
              "Our reference list and sectors are for informational purposes only. Please contact us for detailed reference information."
            )}
          </p>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHead
            eyebrow={{ tr: "İş Birliği Anlayışımız", en: "Our Approach to Partnership" }}
            title={{ tr: "Referansımız, birlikte geçirdiğimiz yıllar", en: "Our reference is the years we've spent together" }}
          />
          <ReasonList items={APPROACH} />
        </div>
      </section>

      <CtaSection
        title={{ tr: "Referanslarımız arasına katılın.", en: "Join our references." }}
        text={{
          tr: "Kurumunuzun ulaşım ihtiyacını değerlendirelim, size özel bir teklif hazırlayalım.",
          en: "Let us assess your organisation's transport needs and prepare a tailored quote.",
        }}
        actions={[
          { label: { tr: "Teklif Al", en: "Get a Quote" }, to: "/iletisim#teklif" },
          { label: { tr: "Projelerimiz", en: "Our Projects" }, to: "/projeler", variant: "light" },
        ]}
      />
    </>
  );
}
