import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { CtaSection } from "@/components/CtaSection";
import { useSiteData, pageText } from "@/lib/site";
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
  route: Pair;
  year: Pair;
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
const ONGOING: Pair = { tr: "Devam ediyor", en: "Ongoing" };

function projectMeta(p: Project): Pair[] {
  return [meta(TYPE, p.type), meta(ROUTE, p.route), meta(START, p.year), meta(STATUS, ONGOING)];
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
          tr: "Organize Sanayi Bölgesi Personel Servisi",
          en: "Organised Industrial Zone Staff Shuttle",
        },
        desc: {
          tr: "Organize sanayi bölgesindeki üretim tesisleri için üç vardiya düzenine göre planlanan personel servisi. Sekiz güzergâhta günde 24 sefer düzenleniyor; il merkezi ve çevre ilçelerden toplama 27+1 ve 19+1 koltuklu araçlarla yapılıyor.",
          en: "Staff shuttle for production plants in the organised industrial zone, planned around a three-shift schedule. Twenty-four trips a day run across eight routes, picking staff up from the city centre and nearby districts with 27+1 and 19+1 seat vehicles.",
        },
        type: PERSONNEL,
        route: { tr: "İl merkezi ve çevre ilçeler – OSB", en: "City centre and nearby districts – industrial zone" },
        year: { tr: "2016", en: "2016" },
      },
      {
        img: "/assets/img/personel-yolcu-temsili.jpg",
        title: {
          tr: "Refrakter Üretim Tesisi Vardiyalı Servis Projesi",
          en: "Refractory Plant Shift Shuttle Project",
        },
        desc: {
          tr: "Kesintisiz üretim yapan refrakter tesisi için gündüz ve gece vardiyalarına göre kurgulanan servis. Dört güzergâhta günde 12 sefer yapılıyor; hafta sonu ve resmi tatillerde azaltılmış planla hizmet sürüyor.",
          en: "Shuttle built around day and night shifts for a refractory plant running continuous production. Twelve trips a day operate on four routes, with a reduced plan at weekends and on public holidays.",
        },
        type: PERSONNEL,
        route: { tr: "İlçe merkezi – üretim tesisi", en: "District centre – production plant" },
        year: { tr: "2013", en: "2013" },
      },
      {
        img: "/assets/img/ogrenci-servisi-2-temsili.jpg",
        title: {
          tr: "Kamu Kurumu Personel Servis Hizmeti",
          en: "Public Institution Staff Shuttle Service",
        },
        desc: {
          tr: "Kamu kurumunun merkez binası için mesai başlangıç ve bitiş saatlerine göre sabah–akşam çift yönlü servis. Beş güzergâhta günde 10 sefer düzenleniyor; tüm araçlarda araç takip sistemi ve kamera bulunuyor.",
          en: "Two-way morning and evening shuttle for the head office of a public institution, timed to working hours. Ten trips a day run on five routes, with a vehicle tracking system and camera in every vehicle.",
        },
        type: PERSONNEL,
        route: { tr: "İl merkezi içi", en: "Within the city centre" },
        year: { tr: "2019", en: "2019" },
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
          tr: "Çoban Yıldızları İlköğretim Okulu Servis Hizmeti",
          en: "Çoban Yıldızları Primary School Shuttle Service",
        },
        desc: {
          tr: "İlköğretim öğrencilerinin evden okula ve okuldan eve taşınması. Yedi güzergâhta yaklaşık 180 öğrenci, her araçta bir rehber personel eşliğinde taşınıyor; seferler sabah 07.30–08.30 ve öğleden sonra 15.00–16.30 saatleri arasında yapılıyor.",
          en: "Home-to-school and school-to-home transport for primary school students. Around 180 students travel on seven routes, each vehicle staffed with a chaperone; trips run between 07:30–08:30 in the morning and 15:00–16:30 in the afternoon.",
        },
        type: STUDENT,
        route: { tr: "Mahalle güzergâhları – okul", en: "Neighbourhood routes – school" },
        year: { tr: "2011", en: "2011" },
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
          tr: "Kurumsal Misafir Karşılama ve Transfer Projesi",
          en: "Corporate Guest Meet-and-Greet and Transfer Project",
        },
        desc: {
          tr: "Yurt dışından gelen iş misafirlerinin İstanbul ve Sabiha Gökçen havalimanlarından karşılanması ile otel ve tesis transferlerinin yürütülmesi. VIP donanımlı minivan ve sedan araçlarla, ziyaret programına göre günlük tahsisli hizmet veriliyor.",
          en: "Meeting international business guests at Istanbul and Sabiha Gökçen airports and handling their hotel and facility transfers. Service is provided with VIP-equipped minivans and sedans, allocated per day according to the visit schedule.",
        },
        type: VIP,
        route: { tr: "Havalimanları – otel / tesis", en: "Airports – hotel / facility" },
        year: { tr: "2015", en: "2015" },
      },
    ],
  },
];

export default function Projeler() {
  const { t, tHtml } = useI18n();
  const cms = pageText(useSiteData(), "projeler");

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
        title={cms("hero_baslik", { tr: "Sahada yürüttüğümüz taşıma projeleri", en: "Transport projects we run in the field" })}
        lead={cms("hero_metin", {
          tr: "Her proje kendi güzergâh planı, araç tahsisi ve operasyon takibiyle ayrı ayrı yönetilir. Aşağıda hizmet türüne göre projelerimizi bulabilirsiniz.",
          en: "Each project is managed separately with its own route plan, vehicle allocation and operational tracking. You can find our projects below, grouped by service type.",
        })}
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
                      {projectMeta(p).map((m, j) => (
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
