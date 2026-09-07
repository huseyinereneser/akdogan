import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
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
import type { Pair } from "@/i18n/I18nProvider";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const CULTURE_CHECKS: Pair[] = [
  {
    tr: "<strong>Dakiklik.</strong> Sefer saatlerine bağlılık, işimizin en temel kuralı.",
    en: "<strong>Punctuality.</strong> Sticking to trip times is the most basic rule of our work.",
  },
  {
    tr: "<strong>İletişim.</strong> Yolcuyla ve merkezle açık, nazik ve düzenli iletişim.",
    en: "<strong>Communication.</strong> Clear, courteous and regular communication with passengers and with the office.",
  },
  {
    tr: "<strong>Kurallara uyum.</strong> Trafik kuralları ve şirket prosedürlerinde tavizsizlik.",
    en: "<strong>Following the rules.</strong> No compromise on traffic rules and company procedures.",
  },
  {
    tr: "<strong>Süreklilik.</strong> Uzun soluklu çalışmayı hedefleyen bir ekip kuruyoruz.",
    en: "<strong>Continuity.</strong> We are building a team that aims to work with us for the long term.",
  },
];

interface Position {
  no: string;
  title: Pair;
  desc: Pair;
  tag: Pair;
}

const POSITIONS: Position[] = [
  {
    no: "01",
    title: { tr: "Servis Şoförü (Personel Taşıma)", en: "Shuttle Driver (Personnel Transport)" },
    desc: {
      tr: "SRC belgesi, psikoteknik raporu ve temiz trafik sicili aranmaktadır.",
      en: "An SRC certificate, a psychotechnical report and a clean driving record are required.",
    },
    tag: { tr: "Tam zamanlı", en: "Full-time" },
  },
  {
    no: "02",
    title: { tr: "Okul Servisi Şoförü", en: "School Shuttle Driver" },
    desc: {
      tr: "Öğrenci taşımacılığı deneyimi ve ilgili mevzuatın gerektirdiği belgeler.",
      en: "Student transport experience and the documents required by the relevant regulations.",
    },
    tag: { tr: "Tam zamanlı", en: "Full-time" },
  },
  {
    no: "03",
    title: { tr: "Servis Rehber Personeli", en: "Shuttle Chaperone" },
    desc: {
      tr: "Öğrencilerin araca biniş ve inişinde refakat; veli iletişimi.",
      en: "Accompanying students as they board and get off the vehicle; communication with parents.",
    },
    tag: { tr: "Yarı zamanlı", en: "Part-time" },
  },
  {
    no: "04",
    title: { tr: "Operasyon / Planlama Uzmanı", en: "Operations / Planning Specialist" },
    desc: {
      tr: "Güzergâh planlaması, sefer takibi ve müşteri iletişimi.",
      en: "Route planning, trip tracking and customer communication.",
    },
    tag: { tr: "Tam zamanlı", en: "Full-time" },
  },
];

const POSITION_OPTIONS: SelectOption[] = [
  { value: "", label: { tr: "Seçiniz", en: "Select" } },
  { value: "Servis Şoförü (Personel Taşıma)", label: { tr: "Servis Şoförü (Personel Taşıma)", en: "Shuttle Driver (Personnel Transport)" } },
  { value: "Okul Servisi Şoförü", label: { tr: "Okul Servisi Şoförü", en: "School Shuttle Driver" } },
  { value: "Servis Rehber Personeli", label: { tr: "Servis Rehber Personeli", en: "Shuttle Chaperone" } },
  { value: "Operasyon / Planlama Uzmanı", label: { tr: "Operasyon / Planlama Uzmanı", en: "Operations / Planning Specialist" } },
  { value: "Diğer", label: { tr: "Diğer", en: "Other" } },
];

export default function InsanKaynaklari() {
  const { t, tHtml } = useI18n();
  const [otherOpen, setOtherOpen] = useState(false);

  return (
    <>
      <PageMeta title={{ tr: "İnsan Kaynakları | Akdoğan Turizm", en: "Human Resources | Akdoğan Turizm" }} />

      <PageHero
        bg="/assets/img/surucu-arac-temsili.jpg"
        bgAlt={{ tr: "Sürücü ve araç (temsili görsel)", en: "Driver and vehicle (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "İletişim", en: "Contact" }, to: "/iletisim" },
          { label: { tr: "İnsan Kaynakları", en: "Human Resources" } },
        ]}
        eyebrow={{ tr: "İnsan Kaynakları", en: "Human Resources" }}
        title={{ tr: "Ekibimize katılın", en: "Join our team" }}
        lead={{
          tr: "Büyüyen filomuz ve artan proje sayımızla birlikte ekibimizi genişletiyoruz. Başvurunuzu değerlendirmekten memnuniyet duyarız.",
          en: "As our fleet grows and our number of projects increases, we are expanding our team. We would be glad to consider your application.",
        }}
      />

      <section className="section">
        <div className="container">
          <div className="split">
            <Reveal>
              <p className="eyebrow">{t("Çalışma Kültürümüz", "Our Working Culture")}</p>
              <h2>{t("Bizimle çalışmak ne demek?", "What does working with us mean?")}</h2>
              <p className="lead" style={{ marginTop: 22 }}>
                {t(
                  "Taşımacılık, her sabah yüzlerce insanın gününü belirleyen bir iş. Ekibimizden beklediğimiz temel şey bu sorumluluğun farkında olmak.",
                  "Transport is a job that shapes the day of hundreds of people every morning. The core thing we expect from our team is to be aware of that responsibility."
                )}
              </p>
              <ul className="checklist">
                {CULTURE_CHECKS.map((c, i) => (
                  <li key={i}>
                    <span dangerouslySetInnerHTML={{ __html: tHtml(c) }} />
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <img
                className="media media--4-3"
                src="/assets/img/ofis-toplanti-temsili.jpg"
                alt={t("Ofis toplantısı (temsili görsel)", "Office meeting (representative image)")}
                loading="lazy"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container container--narrow">
          <SectionHead
            eyebrow={{ tr: "Pozisyonlar", en: "Positions" }}
            title={{ tr: "Değerlendirdiğimiz görevler", en: "Roles we consider" }}
            text={{
              tr: "Aşağıdaki pozisyonlar için sürekli başvuru kabul ediyoruz. Açık pozisyon olmasa dahi başvurunuz kayıtlarımızda tutulur.",
              en: "We accept applications for the positions below on an ongoing basis. Even when there is no open position, your application is kept on file.",
            }}
          />
          <Reveal className="doc-list">
            {POSITIONS.map((p) => (
              <div className="doc-item" key={p.no}>
                <span className="doc-item__no">{p.no}</span>
                <div className="doc-item__main">
                  <h3>{t(p.title)}</h3>
                  <p>{t(p.desc)}</p>
                </div>
                <span className="doc-item__tag">{t(p.tag)}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section" id="basvuru">
        <div className="container">
          <div className="contact-layout">
            <Reveal>
              <p className="eyebrow">{t("Başvuru", "Application")}</p>
              <h2>{t("Başvuru formu", "Application form")}</h2>
              <p style={{ marginTop: 20, color: "var(--text-muted)" }}>
                {t(
                  "Formu doldurun ya da özgeçmişinizi doğrudan e-posta ile gönderin. Uygun bir pozisyon açıldığında sizinle iletişime geçeriz.",
                  "Fill in the form or email your CV directly. We will contact you when a suitable position opens."
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
                    <h4>{t("Özgeçmiş Gönderin", "Send your CV")}</h4>
                    <p>
                      <a href="mailto:info@akdoganturizm.com?subject=%C4%B0%C5%9F%20Ba%C5%9Fvurusu">
                        info@akdoganturizm.com
                      </a>
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
                    <h4>{t("Şahsen Başvuru", "Apply in person")}</h4>
                    <p>
                      Köşklüçesme Mah. Topçular Cad.
                      <br />
                      No: 66/A, Gebze / Kocaeli
                    </p>
                  </div>
                </div>
              </div>

              <div className="notice" style={{ marginTop: 36 }}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: tHtml(
                      '<strong>Kişisel verileriniz</strong> Başvuru formuyla ilettiğiniz bilgiler yalnızca işe alım süreçlerinde kullanılır. Detaylar için <a href="/kvkk" style="color:inherit;text-decoration:underline">KVKK aydınlatma metnimizi</a> inceleyebilirsiniz.',
                      '<strong>Your personal data</strong> The information you send via the application form is used only in recruitment processes. For details, see our <a href="/kvkk" style="color:inherit;text-decoration:underline">KVKK disclosure notice</a>.'
                    ),
                  }}
                />
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
                      onToggle={setOtherOpen}
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
                      open={otherOpen}
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
    </>
  );
}
