import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { CtaSection } from "@/components/CtaSection";
import type { Pair } from "@/i18n/I18nProvider";

interface ProjectCat {
  id: string;
  img: string;
  count: Pair;
  title: Pair;
  desc: Pair;
}

const CATS: ProjectCat[] = [
  {
    id: "personel-projeleri",
    img: "/assets/img/personel-ic-temsili.jpg",
    count: { tr: "3 Proje", en: "3 Projects" },
    title: { tr: "Personel Taşıma Projeleri", en: "Personnel Transport Projects" },
    desc: {
      tr: "Fabrika ve kurum personelinin vardiya düzenine göre planlanan düzenli servis projeleri.",
      en: "Regular shuttle projects for factory and organisation staff, planned around their shift schedule.",
    },
  },
  {
    id: "ogrenci-projeleri",
    img: "/assets/img/ogrenci-servisi-temsili.jpg",
    count: { tr: "1 Proje", en: "1 Project" },
    title: { tr: "Öğrenci Taşıma Projeleri", en: "Student Transport Projects" },
    desc: {
      tr: "Okul öncesi ve zorunlu eğitim kapsamındaki öğrencilerin rehber personel eşliğinde taşınması.",
      en: "Transport of pre-school and compulsory-education students with a chaperone on board.",
    },
  },
  {
    id: "vip-projeleri",
    img: "/assets/img/vip-temsili.jpg",
    count: { tr: "1 Proje", en: "1 Project" },
    title: { tr: "VIP Taşıma Projeleri", en: "VIP Transport Projects" },
    desc: {
      tr: "Havalimanı karşılama, misafir ağırlama ve üst düzey yönetici transferi projeleri.",
      en: "Airport meet-and-greet, guest hosting and executive transfer projects.",
    },
  },
];

interface Project {
  img: string;
  title: Pair;
  desc: Pair;
  type: Pair;
}

interface ProjectGroup {
  id: string;
  soft: boolean;
  catNo: Pair;
  title: Pair;
  items: Project[];
}

const meta = (label: Pair, value: Pair): Pair => ({
  tr: `<strong>${label.tr}</strong> ${value.tr}`,
  en: `<strong>${label.en}</strong> ${value.en}`,
});

const ROUTE: Pair = { tr: "Güzergâh:", en: "Route:" };
const START: Pair = { tr: "Başlangıç:", en: "Started:" };
const STATUS: Pair = { tr: "Durum:", en: "Status:" };
const TYPE: Pair = { tr: "Tür:", en: "Type:" };
const DASH: Pair = { tr: "[—]", en: "[—]" };
const YEAR: Pair = { tr: "[Yıl]", en: "[Year]" };
const ONGOING: Pair = { tr: "Devam ediyor", en: "Ongoing" };

function projectMeta(kind: Pair): Pair[] {
  return [meta(TYPE, kind), meta(ROUTE, DASH), meta(START, YEAR), meta(STATUS, ONGOING)];
}

const PERSONNEL: Pair = { tr: "Personel taşıma", en: "Personnel transport" };
const STUDENT: Pair = { tr: "Öğrenci taşıma", en: "Student transport" };
const VIP: Pair = { tr: "VIP taşıma", en: "VIP transport" };

const GROUPS: ProjectGroup[] = [
  {
    id: "personel-projeleri",
    soft: true,
    catNo: { tr: "Kategori 01", en: "Category 01" },
    title: { tr: "Personel Taşıma Projeleri", en: "Personnel Transport Projects" },
    items: [
      {
        img: "/assets/img/personel-ic-temsili.jpg",
        title: {
          tr: "[Proje adı — örn. Organize Sanayi Bölgesi personel servisi]",
          en: "[Project name — e.g. Organised Industrial Zone staff shuttle]",
        },
        desc: {
          tr: "[Projenin kapsamını buraya yazın: kaç güzergâh, hangi vardiyalar, günde kaç sefer, hangi araç tipleri kullanılıyor.]",
          en: "[Describe the project's scope here: how many routes, which shifts, how many trips per day, which vehicle types are used.]",
        },
        type: PERSONNEL,
      },
      {
        img: "/assets/img/personel-yolcu-temsili.jpg",
        title: {
          tr: "[Proje adı — örn. Üretim tesisi vardiyalı servis projesi]",
          en: "[Project name — e.g. Manufacturing plant shift shuttle project]",
        },
        desc: { tr: "[Projenin kapsamını buraya yazın.]", en: "[Describe the project's scope here.]" },
        type: PERSONNEL,
      },
      {
        img: "/assets/img/ogrenci-servisi-2-temsili.jpg",
        title: {
          tr: "[Proje adı — örn. Kamu kurumu personel servis hizmeti]",
          en: "[Project name — e.g. Public institution staff shuttle service]",
        },
        desc: { tr: "[Projenin kapsamını buraya yazın.]", en: "[Describe the project's scope here.]" },
        type: PERSONNEL,
      },
    ],
  },
  {
    id: "ogrenci-projeleri",
    soft: false,
    catNo: { tr: "Kategori 02", en: "Category 02" },
    title: { tr: "Öğrenci Taşıma Projeleri", en: "Student Transport Projects" },
    items: [
      {
        img: "/assets/img/vip-ic-temsili.jpg",
        title: {
          tr: "[Proje adı — örn. Çoban Yıldızları İlköğretim Okulu servis hizmeti]",
          en: "[Project name — e.g. Çoban Yıldızları Primary School shuttle service]",
        },
        desc: {
          tr: "[Projenin kapsamını buraya yazın: kaç öğrenci, kaç güzergâh, rehber personel sayısı, servis saatleri.]",
          en: "[Describe the project's scope here: how many students, how many routes, number of chaperones, service hours.]",
        },
        type: STUDENT,
      },
    ],
  },
  {
    id: "vip-projeleri",
    soft: true,
    catNo: { tr: "Kategori 03", en: "Category 03" },
    title: { tr: "VIP Taşıma Projeleri", en: "VIP Transport Projects" },
    items: [
      {
        img: "/assets/img/fleet-2-temsili.jpg",
        title: {
          tr: "[Proje adı — örn. Kurumsal misafir karşılama ve transfer projesi]",
          en: "[Project name — e.g. Corporate guest meet-and-greet and transfer project]",
        },
        desc: {
          tr: "[Projenin kapsamını buraya yazın: havalimanı karşılama, araç tipi, hizmet süresi.]",
          en: "[Describe the project's scope here: airport meet-and-greet, vehicle type, service duration.]",
        },
        type: VIP,
      },
    ],
  },
];

export default function Projeler() {
  const { t, tHtml } = useI18n();

  return (
    <>
      <PageMeta title={{ tr: "Projelerimiz | Akdoğan Turizm", en: "Our Projects | Akdoğan Turizm" }} />

      <PageHero
        bg="/assets/img/fleet-temsili.jpg"
        bgAlt={{ tr: "Araç filosu (temsili görsel)", en: "Vehicle fleet (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Projeler", en: "Projects" } },
        ]}
        eyebrow={{ tr: "Projelerimiz", en: "Our Projects" }}
        title={{ tr: "Sahada yürüttüğümüz taşıma projeleri", en: "Transport projects we run in the field" }}
        lead={{
          tr: "Her proje kendi güzergâh planı, araç tahsisi ve operasyon takibiyle ayrı ayrı yönetilir. Aşağıda hizmet türüne göre projelerimizi bulabilirsiniz.",
          en: "Each project is managed separately with its own route plan, vehicle allocation and operational tracking. You can find our projects below, grouped by service type.",
        }}
      />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow={{ tr: "Kategoriler", en: "Categories" }}
            title={{ tr: "Üç ana proje grubu", en: "Three main project groups" }}
            text={{
              tr: "Yürüttüğümüz projeleri taşıma türüne göre grupluyoruz.",
              en: "We group the projects we run by transport type.",
            }}
          />

          <div className="grid-auto">
            {CATS.map((c) => (
              <a className="project-cat" href={`#${c.id}`} key={c.id}>
                <img className="media media--16-9" src={c.img} alt={t(c.title)} loading="lazy" />
                <div className="project-cat__body">
                  <span className="project-cat__count">{t(c.count)}</span>
                  <h3>{t(c.title)}</h3>
                  <p>{t(c.desc)}</p>
                  <span className="link-arrow">{t("Projeleri gör", "See projects")}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {GROUPS.map((g) => (
        <section
          className={"section" + (g.soft ? " section--soft" : "")}
          id={g.id}
          key={g.id}
        >
          <div className="container">
            <SectionHead eyebrow={g.catNo} title={g.title} />
            <Reveal>
              {g.items.map((p, i) => (
                <article className="project-item" key={i}>
                  <img className="media media--4-3" src={p.img} alt={t("Proje görseli (temsili görsel)", "Project image (representative)")} loading="lazy" />
                  <div>
                    <h3>{t(p.title)}</h3>
                    <p style={{ marginTop: 12, color: "var(--text-muted)" }}>{t(p.desc)}</p>
                    <div className="project-item__meta">
                      {projectMeta(p.type).map((m, j) => (
                        <span key={j} dangerouslySetInnerHTML={{ __html: tHtml(m) }} />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>
      ))}

      <CtaSection
        title={{ tr: "Kurumunuz için yeni bir proje kuralım.", en: "Let's set up a new project for your organisation." }}
        text={{
          tr: "İhtiyacınızı paylaşın, güzergâh planını ve araç tahsisini birlikte belirleyelim.",
          en: "Share your needs, and let's work out the route plan and vehicle allocation together.",
        }}
        actions={[
          { label: { tr: "Teklif Al", en: "Get a Quote" }, to: "/iletisim#teklif" },
          { label: { tr: "Referanslarımız", en: "Our References" }, to: "/referanslar", variant: "light" },
        ]}
      />
    </>
  );
}
