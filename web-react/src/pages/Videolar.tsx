import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaSection } from "@/components/CtaSection";
import type { Pair } from "@/i18n/I18nProvider";

interface VideoCard {
  cover: string;
  title: Pair;
  meta: Pair;
}

const VIDEOS: VideoCard[] = [
  {
    cover: "/assets/img/hero-temsili.jpg",
    title: { tr: "[Video başlığı — örn. Kurumsal tanıtım filmi]", en: "[Video title — e.g. Corporate promotional film]" },
    meta: { tr: "[Süre] · [Yayın tarihi]", en: "[Duration] · [Publish date]" },
  },
  {
    cover: "/assets/img/fleet-2-temsili.jpg",
    title: { tr: "[Video başlığı — örn. Araç filomuz]", en: "[Video title — e.g. Our vehicle fleet]" },
    meta: { tr: "[Süre] · [Yayın tarihi]", en: "[Duration] · [Publish date]" },
  },
  {
    cover: "/assets/img/personel-ic-temsili.jpg",
    title: {
      tr: "[Video başlığı — örn. Öğrenci servisi güvenlik uygulamalarımız]",
      en: "[Video title — e.g. Our student shuttle safety practices]",
    },
    meta: { tr: "[Süre] · [Yayın tarihi]", en: "[Duration] · [Publish date]" },
  },
];

export default function Videolar() {
  const { t } = useI18n();

  return (
    <>
      <PageMeta title={{ tr: "Videolar | Akdoğan Turizm", en: "Videos | Akdoğan Turizm" }} />

      <PageHero
        bg="/assets/img/fleet-2-temsili.jpg"
        bgAlt={{ tr: "Araç filosu (temsili görsel)", en: "Vehicle fleet (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Medya", en: "Media" }, to: "/galeri" },
          { label: { tr: "Videolar", en: "Videos" } },
        ]}
        eyebrow={{ tr: "Videolar", en: "Videos" }}
        title={{ tr: "Tanıtım videolarımız", en: "Our promotional videos" }}
        lead={{
          tr: "Filomuzu, hizmet standartlarımızı ve sahadaki çalışma düzenimizi videolarla yakından görebilirsiniz.",
          en: "See our fleet, our service standards and how we operate in the field, up close in video.",
        }}
      />

      <section className="section">
        <div className="container">
          <div className="grid-auto">
            {VIDEOS.map((v, i) => (
              <Reveal className="video-card" delay={i * 80} key={i}>
                <img
                  className="media media--16-9"
                  src={v.cover}
                  alt={t("Video kapak görseli (temsili görsel)", "Video cover image (representative)")}
                  loading="lazy"
                />
                <span className="video-card__play" aria-hidden="true" />
                <p className="video-card__title">{t(v.title)}</p>
                <p className="video-card__meta">{t(v.meta)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        title={{ tr: "Filomuzu fotoğraflarla da görebilirsiniz.", en: "You can also see our fleet in photos." }}
        text={{
          tr: "Araçlarımız ve sahadan kareler için galeri sayfamıza göz atın.",
          en: "Visit our gallery page for shots of our vehicles and the field.",
        }}
        actions={[
          { label: { tr: "Foto Galeri", en: "Photo Gallery" }, to: "/galeri" },
          { label: { tr: "Teklif Al", en: "Get a Quote" }, to: "/iletisim#teklif", variant: "light" },
        ]}
      />
    </>
  );
}
