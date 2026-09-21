import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaSection } from "@/components/CtaSection";
import { useSiteData, pageText } from "@/lib/site";

export default function Haberler() {
  const { t, tHtml } = useI18n();
  const cms = pageText(useSiteData(), "haberler");

  return (
    <>
      <PageMeta title={{ tr: "Haberler | Akdoğan Turizm", en: "News | Akdoğan Turizm" }} />

      <PageHero
        bg="/assets/img/road-2-temsili.jpg"
        bgAlt={{ tr: "Yolda servis aracı (temsili görsel)", en: "A shuttle on the road (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Medya", en: "Media" }, to: "/galeri" },
          { label: { tr: "Haberler", en: "News" } },
        ]}
        eyebrow={{ tr: "Haberler", en: "News" }}
        title={cms("hero_baslik", { tr: "Bizden haberler", en: "News from us" })}
        lead={cms("hero_metin", {
          tr: "Filo yenilemeleri, yeni projeler ve şirketimize dair duyurular bu sayfada yayımlanır.",
          en: "Fleet renewals, new projects and company announcements are published on this page.",
        })}
      />

      <section className="section">
        <div className="container">
          <div className="container--narrow" style={{ margin: "0 auto" }}>
            <Reveal as="div" className="notice">
              <strong>{t("Şu anda yayınlanmış bir duyurumuz yok.", "No announcements yet")}</strong>
              <span
                dangerouslySetInnerHTML={{
                  __html: tHtml(
                    'Paylaşacak gerçek bir haberimiz olduğunda bu sayfa güncellenecek. O zamana kadar bize <a href="/iletisim">iletişim sayfasından</a> veya WhatsApp hattımızdan doğrudan ulaşabilirsiniz.',
                    'This page will be updated as soon as we have real news to share. In the meantime you can reach us directly through the <a href="/iletisim">contact page</a> or WhatsApp.'
                  ),
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection
        title={{ tr: "Gelişmelerden haberdar olun.", en: "Stay up to date." }}
        text={{
          tr: "Yeni projelerimiz ve duyurularımız için bizi takip edin.",
          en: "Follow us for our new projects and announcements.",
        }}
        actions={[
          { label: { tr: "İletişime Geç", en: "Get in Touch" }, to: "/iletisim#teklif" },
          { label: { tr: "Projelerimiz", en: "Our Projects" }, to: "/projeler", variant: "light" },
        ]}
      />
    </>
  );
}
