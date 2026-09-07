import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { Gallery, type GalleryImage } from "@/components/Gallery";
import { CtaSection } from "@/components/CtaSection";

const DOCS: GalleryImage[] = [
  {
    src: "/assets/img/belgeler/akdogan_turizm_marka_tescil.jpg",
    ratio: "media--3-4",
    caption: { tr: "Marka Tescil Belgesi", en: "Trademark Registration Certificate" },
  },
  {
    src: "/assets/img/belgeler/akdoganturizm-gto.jpg",
    ratio: "media--3-4",
    caption: { tr: "Ticaret Odası (GTO) Belgesi", en: "Chamber of Commerce (GTO) Certificate" },
  },
  {
    src: "/assets/img/belgeler/akdoganturizm-meslekibelge.jpg",
    ratio: "media--3-4",
    caption: { tr: "Mesleki Yeterlilik Belgesi", en: "Professional Competency Certificate" },
  },
  {
    src: "/assets/img/belgeler/akdoganturizm-iso9001.jpg",
    ratio: "media--3-4",
    caption: { tr: "ISO 9001 – Kalite Yönetim Sistemi", en: "ISO 9001 – Quality Management System" },
  },
  {
    src: "/assets/img/belgeler/akdoganturizm-iso10002.jpg",
    ratio: "media--3-4",
    caption: {
      tr: "ISO 10002 – Müşteri Memnuniyeti Yönetim Sistemi",
      en: "ISO 10002 – Customer Satisfaction Management System",
    },
  },
  {
    src: "/assets/img/belgeler/akdoganturizm-iso45001.jpg",
    ratio: "media--3-4",
    caption: {
      tr: "ISO 45001 – İş Sağlığı ve Güvenliği Yönetim Sistemi",
      en: "ISO 45001 – Occupational Health & Safety Management System",
    },
  },
  {
    src: "/assets/img/belgeler/akdoganturizm-iso14001.jpg",
    ratio: "media--3-4",
    caption: { tr: "ISO 14001 – Çevre Yönetim Sistemi", en: "ISO 14001 – Environmental Management System" },
  },
];

export default function Belgeler() {
  const { tHtml } = useI18n();

  return (
    <>
      <PageMeta
        title={{ tr: "Belgelerimiz | Akdoğan Turizm", en: "Certificates & Documents | Akdoğan Turizm" }}
      />

      <PageHero
        bg="/assets/img/ofis-toplanti-temsili.jpg"
        bgAlt={{ tr: "Ofis toplantısı (temsili görsel)", en: "Office meeting (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Kurumsal", en: "Corporate" }, to: "/hakkimizda" },
          { label: { tr: "Belgelerimiz", en: "Certificates & Documents" } },
        ]}
        eyebrow={{ tr: "Belgelerimiz", en: "Certificates & Documents" }}
        title={{ tr: "Mevzuata tam uyum", en: "Fully compliant" }}
        lead={{
          tr: "Taşımacılık faaliyetimiz için gerekli tüm yetki belgeleri, sigorta poliçeleri ve yasal evraklar güncel olarak tutulmaktadır.",
          en: "All operating licences, insurance policies and legal documents required for our transport activity are kept up to date.",
        }}
      />

      <section className="section">
        <div className="container container--narrow">
          <SectionHead
            eyebrow={{ tr: "Yasal Evraklar", en: "Legal Documents" }}
            title={{ tr: "Sahip olduğumuz belgeler", en: "Documents we hold" }}
            text={{
              tr: "Hizmet sözleşmesi öncesinde talep eden kurumlarla belgelerimizin güncel kopyalarını paylaşıyoruz.",
              en: "We share up-to-date copies of our documents with organisations that request them before entering a service agreement.",
            }}
          />

          <Gallery images={DOCS} variant="gallery--docs" />

          <Reveal as="div" className="notice">
            <span
              dangerouslySetInnerHTML={{
                __html: tHtml(
                  '<strong>Belge talebi</strong> Sözleşme öncesi incelemek üzere belgelerimizin güncel kopyalarını talep edebilirsiniz. <a href="/iletisim" style="color:inherit;text-decoration:underline">İletişim sayfasından</a> veya 0262 642 91 03 numaralı hattan bize ulaşın.',
                  '<strong>Document requests</strong> You can request up-to-date copies of our documents for review before signing an agreement. Reach us via our <a href="/iletisim" style="color:inherit;text-decoration:underline">contact page</a> or on 0262 642 91 03.'
                ),
              }}
            />
          </Reveal>
        </div>
      </section>

      <CtaSection
        title={{ tr: "Belgelerimizi incelemek ister misiniz?", en: "Would you like to review our documents?" }}
        text={{
          tr: "Kurumsal satın alma süreçleriniz için gerekli tüm evrakı hazırlayıp iletebiliriz.",
          en: "We can prepare and send all documents needed for your corporate procurement process.",
        }}
        actions={[
          { label: { tr: "İletişime Geç", en: "Get in Touch" }, to: "/iletisim#teklif" },
          { label: { tr: "0262 642 91 03", en: "0262 642 91 03" }, href: "tel:+902626429103", variant: "light" },
        ]}
      />
    </>
  );
}
