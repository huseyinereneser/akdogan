import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { CtaSection } from "@/components/CtaSection";
import { Gallery, type GalleryFilter, type GalleryImage } from "@/components/Gallery";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { AkForm, Field, TextAreaField, SubmitBlock } from "@/components/form/form";
import { siteAsset, useSiteData, pageText } from "@/lib/site";

const FILTERS: GalleryFilter[] = [
  { key: "filo", label: { tr: "Araç Filosu", en: "Fleet" } },
  { key: "personel", label: { tr: "Personel Servisi", en: "Staff Shuttle" } },
  { key: "ogrenci", label: { tr: "Öğrenci Servisi", en: "School Shuttle" } },
  { key: "vip", label: { tr: "VIP Transfer", en: "VIP Transfer" } },
];

const IMAGES: GalleryImage[] = [
  { src: "/assets/img/filo-01.jpg", category: "filo", caption: { tr: "Servis filomuz ve sürücü ekibimiz", en: "Our shuttle fleet and driver team" } },
  { src: "/assets/img/filo-02.jpg", category: "filo", caption: { tr: "Sıralı araç filomuz", en: "Our fleet lined up" } },
  { src: "/assets/img/filo-03.jpg", category: "filo", caption: { tr: "Mercedes Sprinter servis aracı", en: "Mercedes Sprinter shuttle" } },
  { src: "/assets/img/filo-04.jpg", category: "filo", caption: { tr: "Volkswagen Crafter minibüs filosu", en: "Volkswagen Crafter minibus fleet" } },
  { src: "/assets/img/filo-05.jpg", category: "filo", caption: { tr: "Servis minibüsümüz", en: "One of our shuttle minibuses" } },
  { src: "/assets/img/filo-06.jpg", category: "filo", caption: { tr: "Personel servis aracımız", en: "One of our personnel shuttles" } },
  { src: "/assets/img/personel-ic-temsili.jpg", category: "personel", caption: { tr: "Sabah vardiyası personel servisi", en: "Morning-shift staff shuttle" } },
  { src: "/assets/img/ogrenci-servisi-temsili.jpg", category: "ogrenci", caption: { tr: "Okul servisi güzergâhı", en: "A school shuttle route" } },
  { src: "/assets/img/vip-temsili.jpg", category: "vip", caption: { tr: "Havalimanı karşılama hizmeti", en: "Airport meet-and-greet service" } },
  { src: "/assets/img/personel-yolcu-temsili.jpg", category: "personel", caption: { tr: "Toplanma noktası düzeni", en: "Pickup point layout" } },
  { src: "/assets/img/vip-ic-temsili.jpg", category: "vip", caption: { tr: "Özel üretim VIP araç iç mekân", en: "Purpose-built VIP vehicle interior" } },
  { src: "/assets/img/ogrenci-servisi-2-temsili.jpg", category: "ogrenci", caption: { tr: "Okul önünde servis filosu", en: "Shuttle fleet outside the school" } },
];

const VIDEO_COVERS = ["hero-temsili.jpg", "fleet-2-temsili.jpg", "personel-ic-temsili.jpg"];

export default function Galeri() {
  const { t } = useI18n();
  const site = useSiteData();
  const cms = pageText(site, "galeri");
  const filters = site?.galeri_kategoriler?.length
    ? site.galeri_kategoriler.map((c: any) => ({ key: c.anahtar, label: { tr: c.ad_tr, en: c.ad_en || c.ad_tr } }))
    : FILTERS;
  const images = site?.galeri?.length
    ? site.galeri.map((g: any) => ({
        src: siteAsset(g.dosya, "/assets/img/favicon.png"),
        category: g.kategori,
        caption: { tr: g.baslik_tr || "", en: g.baslik_en || g.baslik_tr || "" },
      }))
    : IMAGES;
  return (
    <>
      <PageMeta title={{ tr: "Medya | Akdoğan Turizm", en: "Media | Akdoğan Turizm" }} />

      <PageHero
        bg="/assets/img/fleet-temsili.jpg"
        bgAlt={{ tr: "Araç filosu (temsili görsel)", en: "Vehicle fleet (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Medya", en: "Media" } },
        ]}
        eyebrow={{ tr: "Medya", en: "Media" }}
        title={cms("hero_baslik", { tr: "Filomuzdan ve sahadan kareler", en: "Shots from our fleet and the field" })}
        lead={cms("hero_metin", {
          tr: "Araçlarımız, ekibimiz ve günlük operasyonumuzdan görüntüler.",
          en: "Photos of our vehicles, our team and our day-to-day operations.",
        })}
      />

      <section className="stats stats--gold">
        <div className="container">
          <div className="stats__grid stats__grid--3">
            <Reveal className="stat">
              <div className="stat__value">{images.length}</div>
              <p className="stat__label">{t("Fotoğraf", "Photos")}</p>
            </Reveal>
            <Reveal className="stat" delay={80}>
              <div className="stat__value">{VIDEO_COVERS.length}</div>
              <p className="stat__label">{t("Tanıtım videosu", "Promotional videos")}</p>
            </Reveal>
            <Reveal className="stat" delay={160}>
              <div className="stat__value">{filters.length}</div>
              <p className="stat__label">{t("Hizmet kategorisi", "Service categories")}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <nav className="anchor-nav container" aria-label={t("Medya bölüm menüsü", "Media section menu")}>
        <a href="#galeri">{t("Foto Galeri", "Photo gallery")}</a>
        <a href="#videolar">{t("Videolar", "Videos")}</a>
        <a href="#yorum-birak">{t("Yorum Bırak", "Leave a review")}</a>
      </nav>

      <section className="section" id="galeri">
        <div className="container">
          <Gallery images={images} filters={filters} />
        </div>
      </section>

      <section className="section section--soft" id="videolar">
        <div className="container">
          <SectionHead eyebrow={{ tr: "Videolar", en: "Videos" }} title={{ tr: "Tanıtım videolarımız", en: "Our promotional videos" }} text={{ tr: "Filomuz ve hizmet standartlarımızla ilgili videolar bu alanda yayınlanır.", en: "Videos about our fleet and service standards are published here." }} />
          <div className="grid-auto">
            {VIDEO_COVERS.map((cover, index) => (
              <Reveal className="video-card" delay={index * 70} key={cover}>
                <div className="video-card__media">
                  <img className="media media--16-9" src={`/assets/img/${cover}`} alt={t("Video kapak görseli", "Video cover image")} loading="lazy" />
                  <span className="video-card__play" aria-hidden="true" />
                </div>
                <p className="video-card__title">{t("Tanıtım videosu", "Promotional video")}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="yorum-birak">
        <div className="container container--narrow">
          <SectionHead eyebrow={{ tr: "Görüşünüz", en: "Your opinion" }} title={{ tr: "Deneyiminizi paylaşın", en: "Share your experience" }} text={{ tr: "Yorumunuz yayınlanmadan önce incelenir ve onayınız alınır.", en: "Your review is checked and your approval is obtained before publication." }} />
          <Reveal className="form-card">
            <AkForm formName="yorum">{({ status, busy }) => <>
              <Field id="y-ad" name="ad" label={{ tr: "Ad Soyad", en: "Full name" }} required autoComplete="name" error={{ tr: "Lütfen ad soyad girin.", en: "Please enter your name." }} />
              <Field id="y-eposta" name="eposta" type="email" label={{ tr: "E-posta", en: "Email" }} required autoComplete="email" error={{ tr: "Geçerli bir e-posta adresi girin.", en: "Please enter a valid email address." }} />
              <TextAreaField id="y-yorum" name="yorum" label={{ tr: "Yorumunuz", en: "Your review" }} required error={{ tr: "Lütfen yorumunuzu yazın.", en: "Please write your review." }} />
              <SubmitBlock status={status} busy={busy} label={{ tr: "Yorumu Gönder", en: "Submit review" }} note={{ tr: "Yorumunuz yayınlanmadan önce onayınız alınır.", en: "Your approval is obtained before publication." }} okMsg={{ tr: "Yorumunuz bize ulaştı.", en: "Your review has reached us." }} errMsg={{ tr: "Şu an gönderilemedi.", en: "Could not be sent right now." }} />
            </>}</AkForm>
          </Reveal>
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
