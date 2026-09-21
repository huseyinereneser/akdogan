import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useSiteData, pageText, waLink } from "@/lib/site";
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
  { value: "Diğer", label: { tr: "Diğer", en: "Other" } },
];

const POSITION_OPTIONS: SelectOption[] = [
  { value: "", label: { tr: "Seçiniz", en: "Select" } },
  { value: "Servis Şoförü (Personel Taşıma)", label: { tr: "Servis Şoförü (Personel Taşıma)", en: "Shuttle Driver (Personnel Transport)" } },
  { value: "Okul Servisi Şoförü", label: { tr: "Okul Servisi Şoförü", en: "School Shuttle Driver" } },
  { value: "Servis Rehber Personeli", label: { tr: "Servis Rehber Personeli", en: "Shuttle Chaperone" } },
  { value: "Operasyon / Planlama Uzmanı", label: { tr: "Operasyon / Planlama Uzmanı", en: "Operations / Planning Specialist" } },
  { value: "Diğer", label: { tr: "Diğer", en: "Other" } },
];

export default function Iletisim() {
  const { t } = useI18n();
  const [otherOpen, setOtherOpen] = useState(false);
  const [ikOtherOpen, setIkOtherOpen] = useState(false);
  const site = useSiteData();
  const cms = pageText(site, "iletisim");
  const contact = site?.iletisim ?? {};
  const phone = contact.telefon || "0262 642 91 03";
  const gsm = contact.gsm || "0546 881 46 71";
  const whatsapp = contact.whatsapp || "0532 051 36 06";
  const email = contact.eposta || "info@akdoganturizm.com";

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
        bg="/assets/img/road-2-temsili.jpg"
        bgAlt={{ tr: "Yolda seyir hâlindeki servis aracı (temsili görsel)", en: "A shuttle on the road (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "İletişim", en: "Contact" } },
        ]}
        eyebrow={{ tr: "İletişim", en: "Contact" }}
        title={cms("hero_baslik", { tr: "Bize ulaşın", en: "Get in touch" })}
        lead={cms("hero_metin", {
          tr: "Ulaşım ihtiyacınızı anlatın; en kısa sürede size özel bir çözüm ve fiyat teklifiyle dönüş yapalım.",
          en: "Tell us what you need; we will get back to you with a tailored solution and quote as soon as possible.",
        })}
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
                      {contact.adres || "Mevlana Mah. Soma Maden Şehitleri Blv., 41400 Gebze / Kocaeli"}
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
                      <a href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a>
                      <br />
                      <a href={`tel:${gsm.replace(/\D/g, "")}`}>{gsm}</a>
                      <br />
                      <a href={waLink(whatsapp)}>{whatsapp} (WhatsApp)</a>
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
                      <a href={`mailto:${email}`}>{email}</a>
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
                      tr={(contact.saatler_tr || "").trim() ? contact.saatler_tr.split(/\s*·\s*/).join("<br>") : "Hafta içi 09.00 – 19.00<br>Cumartesi 09.30 – 19.00<br>Pazar kapalı"}
                      en={(contact.saatler_en || "").trim() ? contact.saatler_en.split(/\s*·\s*/).join("<br>") : "Weekdays 09:00 – 19:00<br>Saturday 09:30 – 19:00<br>Sunday closed"}
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
              tr: "Merkezimiz Mevlana Mahallesi, Soma Maden Şehitleri Bulvarı üzerindedir.",
              en: "Our centre is on Soma Maden Şehitleri Boulevard, in the Mevlana district.",
            }}
          />
          <Reveal className="map">
            <iframe
              title={t("Akdoğan Turizm konumu — Gebze / Kocaeli", "Akdoğan Turizm location — Gebze / Kocaeli")}
              src="https://www.google.com/maps?q=Mevlana%20Mah.%20Soma%20Maden%20%C5%9Eehitleri%20Blv.%20Gebze%20Kocaeli&hl=tr&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Reveal>
        </div>
      </section>

      <section className="section section--soft" id="insan-kaynaklari">
        <div className="container">
          <div className="contact-layout">
            <Reveal>
              <p className="eyebrow">{t("İnsan Kaynakları", "Human Resources")}</p>
              <h2>{t("Ekibimize katılın", "Join our team")}</h2>
              <p style={{ marginTop: 20, color: "var(--text-muted)" }}>
                {t(
                  "Büyüyen filomuz ve artan proje sayımızla ekibimizi genişletiyoruz. Servis şoförü, okul servisi şoförü, rehber personel ve operasyon uzmanı pozisyonları için başvuruları sürekli değerlendiriyoruz; açık pozisyon olmasa dahi başvurunuz kayıtlarımızda tutulur.",
                  "As our fleet grows and our projects increase, we are expanding our team. We review applications for shuttle driver, school shuttle driver, chaperone and operations specialist roles on an ongoing basis; even with no open position, your application is kept on file."
                )}
              </p>

              <div className="info-list">
                <div className="info-item">
                  <span className="info-item__icon">
                    <svg viewBox="0 0 24 24" {...stroke}>
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m2 7 10 6 10-6" />
                    </svg>
                  </span>
                  <div>
                    <h4>{t("Özgeçmiş gönderin", "Send your CV")}</h4>
                    <p>
                      <a href={`mailto:${email}?subject=${encodeURIComponent("İş Başvurusu")}`}>{email}</a>
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-item__icon">
                    <svg viewBox="0 0 24 24" {...stroke}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <h4>{t("Şahsen başvuru", "Apply in person")}</h4>
                    <p>{contact.adres || "Mevlana Mah. Soma Maden Şehitleri Blv., 41400 Gebze / Kocaeli"}</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal className="form-card" delay={120}>
              <h3>{t("İş başvurusu", "Job application")}</h3>
              <p style={{ marginTop: 10, color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                {t("Zorunlu alanları doldurup formu gönderin.", "Fill in the required fields and submit the form.")}
              </p>

              <AkForm formName="basvuru" multipart style={{ marginTop: 28 }}>
                {({ status, busy }) => (
                  <>
                    <Field
                      id="ik-ad"
                      name="ad"
                      label={{ tr: "Ad Soyad", en: "Full name" }}
                      required
                      autoComplete="name"
                      placeholder={{ tr: "Adınız ve soyadınız", en: "Your name and surname" }}
                      error={{ tr: "Lütfen ad soyad girin.", en: "Please enter your full name." }}
                    />
                    <Field
                      id="ik-telefon"
                      name="telefon"
                      type="tel"
                      label={{ tr: "Telefon", en: "Phone" }}
                      required
                      autoComplete="tel"
                      placeholder={{ tr: "05XX XXX XX XX", en: "05XX XXX XX XX" }}
                      error={{ tr: "Geçerli bir telefon numarası girin.", en: "Please enter a valid phone number." }}
                    />
                    <Field
                      id="ik-eposta"
                      name="eposta"
                      type="email"
                      full
                      label={{ tr: "E-posta", en: "Email" }}
                      required
                      autoComplete="email"
                      placeholder={{ tr: "ornek@eposta.com", en: "e.g. name@email.com" }}
                      error={{ tr: "Geçerli bir e-posta adresi girin.", en: "Please enter a valid email address." }}
                    />
                    <SelectField
                      id="ik-pozisyon"
                      name="pozisyon"
                      required
                      label={{ tr: "Başvurulan pozisyon", en: "Position applied for" }}
                      options={POSITION_OPTIONS}
                      toggleValue="Diğer"
                      onToggle={setIkOtherOpen}
                      error={{ tr: "Lütfen bir pozisyon seçin.", en: "Please select a position." }}
                    />
                    <Field
                      id="ik-deneyim"
                      name="deneyim"
                      type="number"
                      min={0}
                      max={60}
                      label={{ tr: "Deneyim (yıl)", en: "Experience (years)" }}
                      placeholder={{ tr: "Örn. 5", en: "e.g. 5" }}
                    />
                    <ConditionalField
                      open={ikOtherOpen}
                      id="ik-pozisyon-diger"
                      name="pozisyon_diger"
                      required
                      label={{ tr: "Hangi pozisyon için başvuruyorsunuz?", en: "Which position are you applying for?" }}
                      placeholder={{
                        tr: "Başvurmak istediğiniz görevi yazın",
                        en: "Write the role you want to apply for",
                      }}
                      error={{ tr: "Lütfen pozisyonu yazın.", en: "Please write the position." }}
                    />
                    <Field
                      id="ik-belgeler"
                      name="belgeler"
                      full
                      label={{ tr: "Sahip olduğunuz belgeler", en: "Certificates you hold" }}
                      placeholder={{
                        tr: "Örn. E sınıfı ehliyet, SRC-2, psikoteknik",
                        en: "e.g. class E licence, SRC-2, psychotechnical",
                      }}
                    />
                    <TextAreaField
                      id="ik-mesaj"
                      name="mesaj"
                      label={{ tr: "Kısa özgeçmiş", en: "Brief CV" }}
                      required
                      placeholder={{
                        tr: "Daha önce çalıştığınız yerler, görevleriniz ve sizinle nasıl iletişime geçebileceğimiz.",
                        en: "Where you have worked before, your roles and how we can reach you.",
                      }}
                      error={{ tr: "Lütfen kısa bir özgeçmiş yazın.", en: "Please write a brief CV." }}
                    />
                    <FileField
                      id="ik-dosya"
                      name="dosya[]"
                      label={{ tr: "CV / belge ekleyin", en: "Attach a CV / document" }}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      hint={{
                        tr: "Özgeçmişinizi, sürücü belgesi veya SRC sertifikanızın fotoğrafını ekleyebilirsiniz. PDF, Word veya görsel · toplam en fazla 10 MB.",
                        en: "You can attach your CV or a photo of your driving licence or SRC certificate. PDF, Word or image · 10 MB total maximum.",
                      }}
                    />
                    <SubmitBlock
                      status={status}
                      busy={busy}
                      label={{ tr: "Başvuruyu Gönder", en: "Submit application" }}
                      note={{
                        tr: "Formu göndererek, başvurunuzun değerlendirilmesi amacıyla bilgilerinizin işlenmesini kabul etmiş olursunuz.",
                        en: "By submitting this form, you agree to your information being processed for the purpose of evaluating your application.",
                      }}
                      okMsg={{
                        tr: "Başvurunuz alındı. Uygun bir pozisyon olduğunda sizinle iletişime geçeceğiz.",
                        en: "Your application has been received. We will contact you when a suitable position opens.",
                      }}
                      errMsg={{
                        tr: "Şu an gönderilemedi. Lütfen info@akdoganturizm.com adresine yazın.",
                        en: "It could not be sent right now. Please e-mail info@akdoganturizm.com.",
                      }}
                    />
                  </>
                )}
              </AkForm>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection
        title={{ tr: "Acil bir talebiniz mi var?", en: "Have an urgent request?" }}
        text={{
          tr: "Telefonla doğrudan bize ulaşın; operasyon ekibimiz size hemen yardımcı olsun.",
          en: "Call us directly; our operations team will help you right away.",
        }}
        actions={[
          { label: { tr: phone, en: phone }, href: `tel:${phone.replace(/\D/g, "")}` },
          { label: { tr: "WhatsApp'tan Yaz", en: "Message on WhatsApp" }, href: waLink(whatsapp), variant: "light" },
        ]}
      />
    </>
  );
}
