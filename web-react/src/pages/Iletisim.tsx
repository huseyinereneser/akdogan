import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { CtaSection } from "@/components/CtaSection";
import { Html } from "@/i18n/T";
import {
  AkForm,
  Field,
  TextAreaField,
  SelectField,
  ConditionalField,
  FileField,
  SubmitBlock,
  type SelectOption,
} from "@/components/form/form";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const SERVICE_OPTIONS: SelectOption[] = [
  { value: "", label: { tr: "Seçiniz (isteğe bağlı)", en: "Select (optional)" } },
  { value: "Personel Taşımacılığı", label: { tr: "Personel Taşımacılığı", en: "Personnel Transport" } },
  { value: "Öğrenci Taşımacılığı", label: { tr: "Öğrenci Taşımacılığı", en: "Student Transport" } },
  { value: "VIP Transfer", label: { tr: "VIP Transfer", en: "VIP Transfer" } },
  { value: "Araç Kiralama", label: { tr: "Araç Kiralama", en: "Vehicle Rental" } },
  {
    value: "Şehir İçi Yolcu Taşımacılığı",
    label: { tr: "Şehir İçi Yolcu Taşımacılığı", en: "Intercity & Local Passenger Transport" },
  },
  { value: "Turizm Organizasyonları", label: { tr: "Turizm Organizasyonları", en: "Tour Organisations" } },
  { value: "Diğer", label: { tr: "Diğer", en: "Other" } },
];

export default function Iletisim() {
  const { t } = useI18n();
  const [otherOpen, setOtherOpen] = useState(false);

  return (
    <>
      <PageMeta
        title={{ tr: "İletişim | Akdoğan Turizm", en: "Contact | Akdoğan Turizm" }}
        description={{
          tr: "Ulaşım ihtiyacınızı anlatın; en kısa sürede size özel bir çözüm ve fiyat teklifiyle dönüş yapalım.",
          en: "Tell us what you need; we will get back to you with a tailored solution and quote as soon as possible.",
        }}
      />

      <PageHero
        bg="/assets/img/sehirici-temsili.jpg"
        bgAlt={{ tr: "Şehir içinde seyir hâlindeki otobüs (temsili görsel)", en: "A coach in the city (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "İletişim", en: "Contact" } },
        ]}
        eyebrow={{ tr: "İletişim", en: "Contact" }}
        title={{ tr: "Bize ulaşın", en: "Get in touch" }}
        lead={{
          tr: "Ulaşım ihtiyacınızı anlatın; en kısa sürede size özel bir çözüm ve fiyat teklifiyle dönüş yapalım.",
          en: "Tell us what you need; we will get back to you with a tailored solution and quote as soon as possible.",
        }}
      />

      <section className="section" id="teklif">
        <div className="container">
          <div className="contact-layout">
            <Reveal>
              <p className="eyebrow">{t("İletişim Bilgileri", "Contact Details")}</p>
              <h2>{t("Doğrudan bize ulaşın", "Reach us directly")}</h2>
              <p style={{ marginTop: 20, color: "var(--text-muted)" }}>
                {t(
                  "Telefonla arayabilir, e-posta gönderebilir veya yandaki formu doldurabilirsiniz. Mesai saatleri içinde gelen taleplere aynı gün içinde dönüş yapıyoruz.",
                  "You can call us, send an email or fill in the form. We reply to requests received during working hours the same day."
                )}
              </p>

              <div className="info-list">
                <div className="info-item">
                  <span className="info-item__icon">
                    <svg viewBox="0 0 24 24" {...stroke}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <h4>{t("Adres", "Address")}</h4>
                    <p>
                      Köşklüçesme Mah. Topçular Cad. No: 66/A
                      <br />
                      Gebze / Kocaeli
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-item__icon">
                    <svg viewBox="0 0 24 24" {...stroke}>
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1z" />
                    </svg>
                  </span>
                  <div>
                    <h4>{t("Telefon", "Phone")}</h4>
                    <p>
                      <a href="tel:+902626429103">0262 642 91 03</a>
                      <br />
                      <a href="tel:+905468814671">0546 881 46 71</a>
                      <br />
                      <a href="https://wa.me/905320513606">0532 051 36 06 (WhatsApp)</a>
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-item__icon">
                    <svg viewBox="0 0 24 24" {...stroke}>
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m2 7 10 6 10-6" />
                    </svg>
                  </span>
                  <div>
                    <h4>{t("E-posta", "Email")}</h4>
                    <p>
                      <a href="mailto:info@akdoganturizm.com">info@akdoganturizm.com</a>
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-item__icon">
                    <svg viewBox="0 0 24 24" {...stroke}>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </span>
                  <div>
                    <h4>{t("Çalışma Saatleri", "Working Hours")}</h4>
                    <Html
                      as="p"
                      tr="Hafta içi 09.00 – 19.00<br>Cumartesi 09.30 – 19.00<br>Pazar kapalı"
                      en="Weekdays 09:00 – 19:00<br>Saturday 09:30 – 19:00<br>Sunday closed"
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="form-card" delay={120}>
              <h3>{t("Teklif ve bilgi talebi", "Request a quote or information")}</h3>
              <p style={{ marginTop: 10, color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                {t(
                  "Aşağıdaki formu doldurun, ekibimiz sizinle iletişime geçsin.",
                  "Fill in the form below and our team will get in touch."
                )}
              </p>

              <AkForm formName="teklif" multipart style={{ marginTop: 28 }}>
                {({ status, busy }) => (
                  <>
                    <Field
                      id="ad"
                      name="ad"
                      label={{ tr: "Ad Soyad", en: "Full name" }}
                      required
                      autoComplete="name"
                      placeholder={{ tr: "Adınız ve soyadınız", en: "Your name and surname" }}
                      error={{ tr: "Lütfen ad soyad girin.", en: "Please enter your full name." }}
                    />
                    <Field
                      id="telefon"
                      name="telefon"
                      type="tel"
                      label={{ tr: "Telefon", en: "Phone" }}
                      required
                      autoComplete="tel"
                      placeholder={{ tr: "05XX XXX XX XX", en: "05XX XXX XX XX" }}
                      error={{ tr: "Geçerli bir telefon numarası girin.", en: "Please enter a valid phone number." }}
                    />
                    <Field
                      id="eposta"
                      name="eposta"
                      type="email"
                      full
                      label={{ tr: "E-posta", en: "Email" }}
                      required
                      autoComplete="email"
                      placeholder={{ tr: "ornek@sirket.com", en: "e.g. name@company.com" }}
                      error={{ tr: "Geçerli bir e-posta adresi girin.", en: "Please enter a valid email address." }}
                    />
                    <SelectField
                      id="hizmet"
                      name="hizmet"
                      full
                      label={{ tr: "İlgilendiğiniz hizmet", en: "Service you're interested in" }}
                      options={SERVICE_OPTIONS}
                      toggleValue="Diğer"
                      onToggle={setOtherOpen}
                    />
                    <ConditionalField
                      open={otherOpen}
                      id="hizmet-diger"
                      name="hizmet_diger"
                      required
                      label={{ tr: "Hangi hizmete ihtiyacınız var?", en: "Which service do you need?" }}
                      placeholder={{
                        tr: "Örn. şantiye personeli için gece vardiyası servisi",
                        en: "e.g. night-shift shuttle for site staff",
                      }}
                      error={{ tr: "Lütfen ihtiyacınız olan hizmeti yazın.", en: "Please tell us which service you need." }}
                    />
                    <TextAreaField
                      id="mesaj"
                      name="mesaj"
                      label={{ tr: "Mesajınız", en: "Your message" }}
                      required
                      placeholder={{
                        tr: "İhtiyacınızı kısaca anlatın: personel sayısı, güzergâh, tarih aralığı vb.",
                        en: "Briefly describe your needs: number of staff, route, date range, etc.",
                      }}
                      error={{ tr: "Lütfen mesajınızı yazın.", en: "Please write your message." }}
                    />
                    <FileField
                      id="dosya"
                      name="dosya[]"
                      label={{ tr: "Dosya ekleyin", en: "Attach a file" }}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                      hint={{
                        tr: "Personel listesi, güzergâh bilgisi, şartname veya özgeçmiş ekleyebilirsiniz. PDF, Word, Excel veya görsel · toplam en fazla 10 MB.",
                        en: "You can attach a staff list, route details, a specification or a CV. PDF, Word, Excel or image · 10 MB total maximum.",
                      }}
                    />
                    <SubmitBlock
                      status={status}
                      busy={busy}
                      label={{ tr: "Gönder", en: "Send" }}
                      note={{
                        tr: "Formu göndererek, talebinizle ilgili sizinle iletişime geçmemizi kabul etmiş olursunuz.",
                        en: "By submitting this form, you agree that we may contact you about your request.",
                      }}
                      okMsg={{
                        tr: "Talebiniz alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.",
                        en: "Your request has reached us. Our team will get back to you as soon as possible.",
                      }}
                      errMsg={{
                        tr: "Şu an gönderilemedi. Lütfen telefonla ulaşın: 0262 642 91 03",
                        en: "It could not be sent right now. Please call us on 0262 642 91 03.",
                      }}
                    />
                  </>
                )}
              </AkForm>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight section--soft">
        <div className="container">
          <SectionHead
            eyebrow={{ tr: "Konum", en: "Location" }}
            title={{ tr: "Gebze / Kocaeli", en: "Gebze / Kocaeli" }}
            text={{
              tr: "Merkezimiz Köşklüçesme Mahallesi, Topçular Caddesi üzerindedir.",
              en: "Our centre is on Topçular Caddesi, in the Köşklüçesme district.",
            }}
          />
          <Reveal className="map">
            <iframe
              title={t("Akdoğan Turizm konumu — Gebze / Kocaeli", "Akdoğan Turizm location — Gebze / Kocaeli")}
              src="https://www.google.com/maps?q=K%C3%B6%C5%9Fkl%C3%BC%C3%A7e%C5%9Fme%20Mah.%20Top%C3%A7ular%20Cad.%20No%3A66%2FA%20Gebze%20Kocaeli&hl=tr&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </section>

      <CtaSection
        title={{ tr: "Acil bir talebiniz mi var?", en: "Have an urgent request?" }}
        text={{
          tr: "Telefonla doğrudan bize ulaşın; operasyon ekibimiz size hemen yardımcı olsun.",
          en: "Call us directly; our operations team will help you right away.",
        }}
        actions={[
          { label: { tr: "0262 642 91 03", en: "0262 642 91 03" }, href: "tel:+902626429103" },
          { label: { tr: "WhatsApp'tan Yaz", en: "Message on WhatsApp" }, href: "https://wa.me/905320513606", variant: "light" },
        ]}
      />
    </>
  );
}
