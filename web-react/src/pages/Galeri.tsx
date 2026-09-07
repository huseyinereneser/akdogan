import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Gallery, type GalleryFilter, type GalleryImage } from "@/components/Gallery";

const FILTERS: GalleryFilter[] = [
  { key: "filo", label: { tr: "Araç Filosu", en: "Fleet" } },
  { key: "personel", label: { tr: "Personel Servisi", en: "Staff Shuttle" } },
  { key: "ogrenci", label: { tr: "Öğrenci Servisi", en: "School Shuttle" } },
  { key: "vip", label: { tr: "VIP Transfer", en: "VIP Transfer" } },
  { key: "organizasyon", label: { tr: "Organizasyon", en: "Events" } },
];

const IMAGES: GalleryImage[] = [
  { src: "/assets/img/fleet-temsili.jpg", category: "filo", caption: { tr: "Araç filomuzdan bir görünüm", en: "A view of our vehicle fleet" } },
  { src: "/assets/img/personel-ic-temsili.jpg", category: "personel", caption: { tr: "Sabah vardiyası personel servisi", en: "Morning-shift staff shuttle" } },
  { src: "/assets/img/ogrenci-servisi-temsili.jpg", category: "ogrenci", caption: { tr: "Okul servisi güzergâhı", en: "A school shuttle route" } },
  { src: "/assets/img/vip-temsili.jpg", category: "vip", caption: { tr: "Havalimanı karşılama hizmeti", en: "Airport meet-and-greet service" } },
  { src: "/assets/img/fleet-2-temsili.jpg", category: "filo", caption: { tr: "0 km araçlarımız", en: "Our zero-km vehicles" } },
  { src: "/assets/img/ekip-ofis-temsili.jpg", category: "organizasyon", caption: { tr: "Kurumsal gezi organizasyonu", en: "A corporate trip organisation" } },
  { src: "/assets/img/personel-yolcu-temsili.jpg", category: "personel", caption: { tr: "Toplanma noktası düzeni", en: "Pickup point layout" } },
  { src: "/assets/img/arac-kiralama-temsili.jpg", category: "filo", caption: { tr: "Periyodik araç bakımı", en: "Periodic vehicle maintenance" } },
  { src: "/assets/img/vip-ic-temsili.jpg", category: "vip", caption: { tr: "Özel üretim VIP araç iç mekân", en: "Purpose-built VIP vehicle interior" } },
  { src: "/assets/img/ogrenci-servisi-2-temsili.jpg", category: "ogrenci", caption: { tr: "Okul önünde servis filosu", en: "Shuttle fleet outside the school" } },
  { src: "/assets/img/ofis-toplanti-temsili.jpg", category: "organizasyon", caption: { tr: "Etkinlik ulaşım planlaması", en: "Event transport planning" } },
  { src: "/assets/img/road-temsili.jpg", category: "filo", caption: { tr: "Garajımızdan bir kare", en: "A shot from our garage" } },
];

export default function Galeri() {
  return (
    <>
      <PageMeta title={{ tr: "Galeri | Akdoğan Turizm", en: "Gallery | Akdoğan Turizm" }} />

      <PageHero
        bg="/assets/img/fleet-temsili.jpg"
        bgAlt={{ tr: "Araç filosu (temsili görsel)", en: "Vehicle fleet (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Galeri", en: "Gallery" } },
        ]}
        eyebrow={{ tr: "Galeri", en: "Gallery" }}
        title={{ tr: "Filomuzdan ve sahadan kareler", en: "Shots from our fleet and the field" }}
        lead={{
          tr: "Araçlarımız, ekibimiz ve günlük operasyonumuzdan görüntüler.",
          en: "Photos of our vehicles, our team and our day-to-day operations.",
        }}
      />

      <section className="section">
        <div className="container">
          <Gallery images={IMAGES} filters={FILTERS} />
        </div>
      </section>

      <CtaSection
        title={{ tr: "Filomuzu yakından görmek ister misiniz?", en: "Would you like to see our fleet up close?" }}
        text={{
          tr: "Randevu alarak Gebze'deki merkezimizde araçlarımızı yerinde inceleyebilirsiniz.",
          en: "Book an appointment and inspect our vehicles in person at our centre in Gebze.",
        }}
        actions={[
          { label: { tr: "İletişime Geç", en: "Get in Touch" }, to: "/iletisim" },
          { label: { tr: "0262 642 91 03", en: "0262 642 91 03" }, href: "tel:+902626429103", variant: "light" },
        ]}
      />
    </>
  );
}
