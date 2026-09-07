import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { CtaSection } from "@/components/CtaSection";
import type { Pair } from "@/i18n/I18nProvider";

interface Member {
  name: string;
  role: Pair;
}

const TEAM: Member[] = [
  { name: "Aslan Akdoğan", role: { tr: "Yönetim Kurulu Başkanı", en: "Chairman of the Board" } },
  { name: "Kübra Helvacı", role: { tr: "Muhasebe", en: "Accounting" } },
  { name: "Olcay Önsal", role: { tr: "Proje Sorumlusu", en: "Project Manager" } },
  { name: "Dilan Avcıoğullarından", role: { tr: "Satın Alma Sorumlusu", en: "Purchasing Manager" } },
];

const CHECKS: Pair[] = [
  {
    tr: "<strong>Trafik sicili incelemesi.</strong> İşe alım öncesi ve çalışma süresince düzenli kontrol.",
    en: "<strong>Driving record check.</strong> Reviewed before hiring and at regular intervals throughout employment.",
  },
  {
    tr: "<strong>Mesleki yeterlilik belgeleri.</strong> SRC ve psikoteknik dâhil mevzuatın gerektirdiği tüm belgeler.",
    en: "<strong>Professional qualification certificates.</strong> All documents required by law, including SRC and psychotechnical assessment.",
  },
  {
    tr: "<strong>Öğrenci taşımacılığı deneyimi.</strong> Okul servislerinde görevli sürücülerde ek tecrübe şartı.",
    en: "<strong>Student transport experience.</strong> Drivers assigned to school routes must have additional experience.",
  },
  {
    tr: "<strong>Yolcu iletişimi.</strong> Nazik, sakin ve kural odaklı bir hizmet anlayışı.",
    en: "<strong>Passenger communication.</strong> A courteous, calm and rule-focused approach to service.",
  },
];

export default function Kadromuz() {
  const { t, tHtml } = useI18n();

  return (
    <>
      <PageMeta title={{ tr: "Kadromuz | Akdoğan Turizm", en: "Our Team | Akdoğan Turizm" }} />

      <PageHero
        bg="/assets/img/ofis-toplanti-temsili.jpg"
        bgAlt={{ tr: "Ofis toplantısı (temsili görsel)", en: "Office meeting (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Kurumsal", en: "Corporate" }, to: "/hakkimizda" },
          { label: { tr: "Kadromuz", en: "Our Team" } },
        ]}
        eyebrow={{ tr: "Kadromuz", en: "Our Team" }}
        title={{ tr: "İşi yürüten ekip", en: "The team behind the operation" }}
        lead={{
          tr: "Hizmetin kalitesini araçlar kadar, o araçları planlayan ve takip eden insanlar belirler. Ekibimizle tanışın.",
          en: "The quality of a service is shaped as much by the people who plan and follow up on the vehicles as by the vehicles themselves. Meet our team.",
        }}
      />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow={{ tr: "Yönetim & Ofis", en: "Management & Office" }}
            title={{ tr: "Yönetim kadromuz", en: "Our management team" }}
            text={{
              tr: "Tüm proje ve operasyon süreçleri bu ekip tarafından planlanıp takip ediliyor.",
              en: "All project and operations processes are planned and tracked by this team.",
            }}
          />

          <div className="grid-auto grid-auto--4col">
            {TEAM.map((m, i) => (
              <Reveal as="article" className="team-card" delay={i * 80} key={m.name}>
                <div
                  className="ph ph--ratio-1-1"
                  data-label={t("Fotoğraf · 800×800", "Photo · 800×800")}
                />
                <div className="team-card__body">
                  <h3>{m.name}</h3>
                  <p className="team-card__role">{t(m.role)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="split">
            <Reveal>
              <p className="eyebrow">{t("Sürücü Kadromuz", "Our Driver Team")}</p>
              <h2>
                {t(
                  "Direksiyonun arkasındaki en önemli kriter: güven",
                  "The most important criterion behind the wheel: trust"
                )}
              </h2>
              <p className="lead" style={{ marginTop: 22 }}>
                {t(
                  "Sürücülerimizi yalnızca deneyime göre değil; trafik siciline, sahip olduğu belgelere ve yolcuyla kurduğu iletişime göre seçiyoruz.",
                  "We choose our drivers not only by experience, but by their driving record, the certifications they hold and how they communicate with passengers."
                )}
              </p>
              <ul className="checklist">
                {CHECKS.map((c, i) => (
                  <li key={i}>
                    <span dangerouslySetInnerHTML={{ __html: tHtml(c) }} />
                  </li>
                ))}
              </ul>
              <div className="btn-row">
                <Link className="btn btn--outline" to="/insan-kaynaklari">
                  {t("Ekibimize katılın", "Join our team")}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <img
                className="media media--4-3"
                src="/assets/img/surucu-arac-temsili.jpg"
                alt={t("Sürücü ve araç (temsili görsel)", "Driver and vehicle (representative image)")}
                loading="lazy"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaSection
        title={{ tr: "Ekibimize katılmak ister misiniz?", en: "Would you like to join our team?" }}
        text={{
          tr: "Sürücü ve ofis pozisyonları için başvurularınızı değerlendiriyoruz.",
          en: "We welcome applications for both driver and office positions.",
        }}
        actions={[
          { label: { tr: "İnsan Kaynakları", en: "Human Resources" }, to: "/insan-kaynaklari" },
          { label: { tr: "0262 642 91 03", en: "0262 642 91 03" }, href: "tel:+902626429103", variant: "light" },
        ]}
      />
    </>
  );
}
