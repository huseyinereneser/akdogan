import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import {
  AkForm,
  Field,
  TextAreaField,
  SubmitBlock,
} from "@/components/form/form";

export default function Yorumlar() {
  const { t } = useI18n();

  return (
    <>
      <PageMeta title={{ tr: "Müşteri Yorumları | Akdoğan Turizm", en: "Testimonials | Akdoğan Turizm" }} />

      <PageHero
        bg="/assets/img/ekip-ofis-temsili.jpg"
        bgAlt={{ tr: "Kurumsal ekip (temsili görsel)", en: "Corporate team (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Medya", en: "Media" }, to: "/galeri" },
          { label: { tr: "Müşteri Yorumları", en: "Testimonials" } },
        ]}
        eyebrow={{ tr: "Müşteri Yorumları", en: "Testimonials" }}
        title={{ tr: "Bizimle çalışanlar ne diyor?", en: "What do those who work with us say?" }}
        lead={{
          tr: "Hizmet verdiğimiz kurumların ve yolcularımızın geri bildirimleri, gelişmemizin en önemli kaynağı.",
          en: "Feedback from the organisations we serve and from our passengers is our most important source of improvement.",
        }}
      />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow={{ tr: "Geri Bildirimler", en: "Feedback" }}
            title={{ tr: "Kurumsal müşterilerimizden", en: "From our corporate customers" }}
            text={{
              tr: "Bu alan, izin alınmış gerçek müşteri yorumlarıyla doldurulacaktır.",
              en: "This section will be filled with real customer reviews collected with permission.",
            }}
          />
          <div className="container--narrow" style={{ margin: "0 auto" }}>
            <Reveal as="div" className="notice">
              <strong>{t("Henüz yayınlanmış bir yorum yok.", "No reviews published yet.")}</strong>{" "}
              {t(
                "Kurumsal müşterilerimizden yazılı izinle alınan geri bildirimler eklendikçe burada yer alacak. Siz de aşağıdaki formdan deneyiminizi paylaşabilirsiniz.",
                "Feedback collected from our corporate customers with written permission will appear here as it is added. You can share your own experience using the form below."
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--soft" id="yorum-birak">
        <div className="container container--narrow">
          <SectionHead
            eyebrow={{ tr: "Görüşünüz", en: "Your opinion" }}
            title={{ tr: "Deneyiminizi paylaşın", en: "Share your experience" }}
            text={{
              tr: "Hizmetimizle ilgili görüşlerinizi bize iletin. Yayınlanmasını istemiyorsanız belirtmeniz yeterli.",
              en: "Send us your thoughts about our service. If you would rather it not be published, just let us know.",
            }}
          />

          <Reveal className="form-card">
            <AkForm formName="yorum">
              {({ status, busy }) => (
                <>
                  <Field
                    id="y-ad"
                    name="ad"
                    label={{ tr: "Ad Soyad", en: "Full name" }}
                    required
                    autoComplete="name"
                    placeholder={{ tr: "Adınız ve soyadınız", en: "Your name and surname" }}
                    error={{ tr: "Lütfen ad soyad girin.", en: "Please enter your full name." }}
                  />
                  <Field
                    id="y-kurum"
                    name="kurum"
                    label={{ tr: "Kurum / Görev", en: "Organisation / role" }}
                    placeholder={{ tr: "Örn. İK Müdürü, ABC Sanayi", en: "e.g. HR Manager, ABC Industry" }}
                  />
                  <Field
                    id="y-eposta"
                    name="eposta"
                    type="email"
                    full
                    label={{ tr: "E-posta", en: "Email" }}
                    required
                    autoComplete="email"
                    placeholder={{ tr: "ornek@sirket.com", en: "e.g. name@company.com" }}
                    error={{ tr: "Geçerli bir e-posta adresi girin.", en: "Please enter a valid email address." }}
                  />
                  <TextAreaField
                    id="y-yorum"
                    name="yorum"
                    label={{ tr: "Yorumunuz", en: "Your review" }}
                    required
                    placeholder={{
                      tr: "Hizmetimizle ilgili deneyiminizi anlatın.",
                      en: "Tell us about your experience with our service.",
                    }}
                    error={{ tr: "Lütfen yorumunuzu yazın.", en: "Please write your review." }}
                  />
                  <SubmitBlock
                    status={status}
                    busy={busy}
                    label={{ tr: "Yorumu Gönder", en: "Submit review" }}
                    note={{
                      tr: "Yorumunuz, sitede yayınlanmadan önce tarafımızca incelenir ve onayınız alınır.",
                      en: "Your review is checked by us and your approval is obtained before it is published on the site.",
                    }}
                    okMsg={{
                      tr: "Yorumunuz bize ulaştı. Paylaştığınız için teşekkür ederiz.",
                      en: "Your review has reached us. Thank you for sharing it.",
                    }}
                    errMsg={{
                      tr: "Şu an gönderilemedi. Lütfen daha sonra tekrar deneyin.",
                      en: "It could not be sent right now. Please try again later.",
                    }}
                  />
                </>
              )}
            </AkForm>
          </Reveal>
        </div>
      </section>
    </>
  );
}
