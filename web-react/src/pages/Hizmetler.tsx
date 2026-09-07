import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { Faq, type FaqItem } from "@/components/Faq";
import { CtaSection } from "@/components/CtaSection";
import type { Pair } from "@/i18n/I18nProvider";

interface ServiceDetail {
  id: string;
  no: Pair;
  title: Pair;
  short: Pair;
  lead: Pair;
  body: Pair;
  checks: Pair[];
  img: string;
  imgAlt: Pair;
}

const SERVICES: ServiceDetail[] = [
  {
    id: "personel-tasimaciligi",
    no: { tr: "HİZMET 01", en: "SERVICE 01" },
    title: { tr: "Personel Taşımacılığı", en: "Personnel Transport" },
    short: {
      tr: "Vardiya düzenine göre planlanan, mevzuata uygun kurumsal servis hizmeti.",
      en: "Corporate shuttle service planned around your shift schedule, fully compliant with regulations.",
    },
    lead: {
      tr: "Kamu ve özel kuruluşlara yönelik, yasal yükümlülüklere tam uyumlu düzenli personel servis hizmeti.",
      en: "Regular personnel shuttle service for public and private organisations, fully compliant with legal obligations.",
    },
    body: {
      tr: "Personelinizin işe geliş ve gidişini bir lojistik problemi olmaktan çıkarıyoruz. Toplanma noktalarını, vardiya saatlerini ve trafik yoğunluğunu birlikte değerlendirerek en verimli güzergâh planını oluşturuyor; sefer takibini merkezi olarak yönetiyoruz.",
      en: "We take your staff's daily commute off your plate. Pickup points, shift times and traffic patterns are assessed together to build the most efficient route plan, with trips monitored centrally.",
    },
    checks: [
      {
        tr: "<strong>Mevzuata tam uyum.</strong> Araç, sürücü ve belge yükümlülüklerinin eksiksiz takibi.",
        en: "<strong>Full regulatory compliance.</strong> Complete tracking of vehicle, driver and document obligations.",
      },
      {
        tr: "<strong>Vardiya bazlı planlama.</strong> Gündüz, gece ve dönüşümlü vardiyalara uygun sefer düzeni.",
        en: "<strong>Shift-based planning.</strong> Trip schedules suited to day, night and rotating shifts.",
      },
      {
        tr: "<strong>Güzergâh optimizasyonu.</strong> Toplanma noktalarının en kısa yolculuk süresine göre kurgulanması.",
        en: "<strong>Route optimisation.</strong> Pickup points built around the shortest journey time.",
      },
      {
        tr: "<strong>Düzenli raporlama.</strong> Sefer, doluluk ve devamlılık verilerinin kurumla paylaşılması.",
        en: "<strong>Regular reporting.</strong> Trip, occupancy and attendance data shared with your organisation.",
      },
    ],
    img: "/assets/img/personel-ic-temsili.jpg",
    imgAlt: { tr: "Servis aracında oturan personel (temsili görsel)", en: "Staff seated in a shuttle (representative image)" },
  },
  {
    id: "ogrenci-tasimaciligi",
    no: { tr: "HİZMET 02", en: "SERVICE 02" },
    title: { tr: "Öğrenci Taşımacılığı", en: "Student Transport" },
    short: {
      tr: "Okul öncesi ve tüm kademelerde güvenli, rehber personel eşliğinde servis.",
      en: "Safe shuttle service with a chaperone on board, for pre-school and all grade levels.",
    },
    lead: {
      tr: "Okul öncesi ve diğer kademelerdeki öğrencilerin evden okula, okuldan eve güvenli ve konforlu şekilde taşınması.",
      en: "Safe, comfortable home-to-school transport for pre-school and other grade levels.",
    },
    body: {
      tr: "Öğrenci taşımacılığı, taşıdığımız sorumluluğun en yüksek olduğu alandır. Bu nedenle araç seçiminden sürücü ve rehber personel belirlenmesine kadar her adımı güvenlik önceliğiyle kurguluyor; velilerle düzenli iletişim kanalı açık tutuyoruz.",
      en: "Student transport is where our responsibility is highest. That is why, from vehicle selection to choosing drivers and chaperones, every step is built around safety, and we keep an open communication channel with parents.",
    },
    checks: [
      {
        tr: "<strong>Rehber personel.</strong> Öğrencilerin araca biniş ve inişinde refakat.",
        en: "<strong>On-board chaperone.</strong> Accompanies students when boarding and getting off the vehicle.",
      },
      {
        tr: "<strong>Güvenlik donanımı.</strong> Emniyet kemeri, ilk yardım seti ve mevzuatın gerektirdiği tüm ekipman.",
        en: "<strong>Safety equipment.</strong> Seat belts, a first-aid kit and all equipment required by regulation.",
      },
      {
        tr: "<strong>Deneyimli sürücüler.</strong> Gerekli belgelere sahip, öğrenci taşımacılığı tecrübesi olan ekip.",
        en: "<strong>Experienced drivers.</strong> A team holding the required certifications with student transport experience.",
      },
      {
        tr: "<strong>Veli iletişimi.</strong> Güzergâh, saat ve olası değişikliklerde hızlı bilgilendirme.",
        en: "<strong>Parent communication.</strong> Prompt updates on the route, timing and any changes.",
      },
    ],
    img: "/assets/img/ogrenci-servisi-temsili.jpg",
    imgAlt: { tr: "Okul servisi minibüsü (temsili görsel)", en: "A school shuttle minibus (representative image)" },
  },
  {
    id: "vip-transfer",
    no: { tr: "HİZMET 03", en: "SERVICE 03" },
    title: { tr: "VIP Transfer Hizmetleri", en: "VIP Transfer Services" },
    short: {
      tr: "Havalimanı karşılama ve misafir transferinde protokol standardı.",
      en: "Protocol-grade standard for airport meet-and-greet and guest transfers.",
    },
    lead: {
      tr: "Son model, özel üretim araç filomuzla havalimanı karşılama ve misafir / personel transferi.",
      en: "Airport meet-and-greet and guest / staff transfer with our late-model, purpose-built fleet.",
    },
    body: {
      tr: "Yurt dışından gelen misafirinizi karşılamak, üst düzey yöneticinizi toplantıya yetiştirmek ya da bir delegasyonu şehir içinde ağırlamak gerektiğinde; kurumunuzun temsil standardına uygun bir transfer hizmeti sunuyoruz.",
      en: "When you need to welcome an overseas guest, get an executive to a meeting on time, or host a delegation around the city, we provide a transfer service that matches your organisation's standard of representation.",
    },
    checks: [
      {
        tr: "<strong>Havalimanı karşılama.</strong> Uçuş takibi, isimlik ile karşılama ve bagaj desteği.",
        en: "<strong>Airport meet-and-greet.</strong> Flight tracking, name-board pickup and luggage assistance.",
      },
      {
        tr: "<strong>Özel üretim araçlar.</strong> Geniş iç hacim, yüksek konfor ve sessiz yolculuk.",
        en: "<strong>Purpose-built vehicles.</strong> Spacious interiors, high comfort and a quiet ride.",
      },
      {
        tr: "<strong>Protokol standardı.</strong> Kurumsal görünüm ve iletişim eğitimi almış sürücüler.",
        en: "<strong>Protocol standard.</strong> Drivers trained in corporate presentation and communication.",
      },
      {
        tr: "<strong>Esnek programlama.</strong> Saatlik, günlük veya çok duraklı transfer planları.",
        en: "<strong>Flexible scheduling.</strong> Hourly, daily or multi-stop transfer plans.",
      },
    ],
    img: "/assets/img/vip-temsili.jpg",
    imgAlt: { tr: "Siyah VIP transfer minibüsü (temsili görsel)", en: "A black VIP transfer minibus (representative image)" },
  },
  {
    id: "arac-kiralama",
    no: { tr: "HİZMET 04", en: "SERVICE 04" },
    title: { tr: "Araç Kiralama", en: "Vehicle Rental" },
    short: {
      tr: "Günlük, aylık ve uzun dönem; sürücülü veya sürücüsüz esnek kiralama.",
      en: "Daily, monthly and long-term; flexible rental with or without a driver.",
    },
    lead: {
      tr: "Kurumsal filo ihtiyaçlarınız için günlük, aylık ve uzun dönem araç kiralama seçenekleri.",
      en: "Daily, monthly and long-term rental options for your corporate fleet needs.",
    },
    body: {
      tr: "Filo yatırımı yapmadan, ihtiyaç duyduğunuz süre boyunca ihtiyaç duyduğunuz araca sahip olun. Bakım, sigorta ve takip süreçlerini biz yönetelim; siz işinize odaklanın.",
      en: "Get the vehicle you need for as long as you need it, without a fleet investment. Let us handle maintenance, insurance and tracking so you can focus on your business.",
    },
    checks: [
      {
        tr: "<strong>Esnek süre.</strong> Günlük, haftalık, aylık ve uzun dönem kiralama.",
        en: "<strong>Flexible duration.</strong> Daily, weekly, monthly and long-term rental.",
      },
      {
        tr: "<strong>Sürücülü veya sürücüsüz.</strong> İhtiyaca göre iki seçenek.",
        en: "<strong>With or without a driver.</strong> Two options depending on your needs.",
      },
      {
        tr: "<strong>Bakım bize ait.</strong> Periyodik bakım, lastik ve muayene takibi tarafımızca yapılır.",
        en: "<strong>We handle maintenance.</strong> Periodic servicing, tyres and inspection tracking are on us.",
      },
      {
        tr: "<strong>Geniş araç seçeneği.</strong> Binek araçtan minibüs ve otobüse kadar farklı segmentler.",
        en: "<strong>Wide vehicle range.</strong> From passenger cars to minibuses and coaches.",
      },
    ],
    img: "/assets/img/arac-kiralama-temsili.jpg",
    imgAlt: { tr: "Sıra hâlinde park etmiş kiralık araçlar (temsili görsel)", en: "Rental vehicles parked in a row (representative image)" },
  },
  {
    id: "sehir-ici-tasimacilik",
    no: { tr: "HİZMET 05", en: "SERVICE 05" },
    title: { tr: "Şehir İçi Yolcu Taşımacılığı", en: "Intercity & Local Passenger Transport" },
    short: {
      tr: "0 km araçlarla şehir içi grup transferleri ve organizasyon ulaşımı.",
      en: "Local group transfers and event transport with our zero-km vehicles.",
    },
    lead: {
      tr: "0 km araçlarımızla şehir içi yolcu taşımacılığında modern ve kaliteli hizmet.",
      en: "Modern, quality local passenger transport with our zero-km vehicles.",
    },
    body: {
      tr: "Grup transferleri, fuar ve etkinlik ulaşımı, şantiye ve tesis arası geçişler… Şehir içinde toplu ulaşım gerektiren her senaryoda konforlu ve zamanında bir çözüm sunuyoruz.",
      en: "Group transfers, fair and event transport, moves between sites and facilities — for any scenario that needs collective transport within the city, we provide a comfortable, on-time solution.",
    },
    checks: [
      {
        tr: "<strong>Yeni araç filosu.</strong> Düzenli yenilenen, bakımlı ve konforlu araçlar.",
        en: "<strong>New fleet.</strong> Regularly renewed, well-maintained and comfortable vehicles.",
      },
      {
        tr: "<strong>Grup transferi.</strong> Küçük ekiplerden kalabalık gruplara uygun kapasite seçenekleri.",
        en: "<strong>Group transfer.</strong> Capacity options from small teams to large groups.",
      },
      {
        tr: "<strong>Etkinlik ulaşımı.</strong> Fuar, seminer ve kurumsal etkinliklerde toplu taşıma planı.",
        en: "<strong>Event transport.</strong> Collective transport plans for fairs, seminars and corporate events.",
      },
      {
        tr: "<strong>Zaman planlaması.</strong> Şehir içi trafiği hesaba katan gerçekçi program.",
        en: "<strong>Time planning.</strong> A realistic schedule that accounts for city traffic.",
      },
    ],
    img: "/assets/img/sehirici-temsili.jpg",
    imgAlt: { tr: "Şehir içinde seyir hâlindeki otobüs (temsili görsel)", en: "A coach travelling through the city (representative image)" },
  },
  {
    id: "turizm-organizasyonlari",
    no: { tr: "HİZMET 06", en: "SERVICE 06" },
    title: { tr: "Turizm Organizasyonları", en: "Tour Organisations" },
    short: {
      tr: "Kurumsal geziler, tur programları ve etkinlik ulaşımının tam planlaması.",
      en: "Full planning of corporate trips, tour programmes and event transport.",
    },
    lead: {
      tr: "Kurumsal geziler, tur programları ve etkinlik ulaşımında planlamadan uygulamaya tam kapsamlı organizasyon.",
      en: "Full-scope organisation of corporate trips, tour programmes and event transport, from planning to delivery.",
    },
    body: {
      tr: "Personel motivasyon gezisi, bayi toplantısı ya da kültür turu… Programın kurgulanmasından araç planlamasına, mola noktalarından zaman çizelgesine kadar tüm süreci sizin adınıza yönetiyoruz.",
      en: "Staff incentive trips, dealer meetings or culture tours — from shaping the programme to vehicle planning, rest stops and the timetable, we manage the entire process for you.",
    },
    checks: [
      {
        tr: "<strong>Program kurgusu.</strong> Güzergâh, konaklama ve zaman planının birlikte hazırlanması.",
        en: "<strong>Programme design.</strong> Route, accommodation and timetable prepared together.",
      },
      {
        tr: "<strong>Kurumsal geziler.</strong> Personel motivasyon ve bayi organizasyonlarında ulaşım yönetimi.",
        en: "<strong>Corporate trips.</strong> Transport management for staff incentive trips and dealer events.",
      },
      {
        tr: "<strong>Tur planlaması.</strong> Kültür ve gezi turlarında rehber koordinasyonu.",
        en: "<strong>Tour planning.</strong> Guide coordination for culture and sightseeing tours.",
      },
      {
        tr: "<strong>Tek muhatap.</strong> Organizasyon boyunca tek noktadan iletişim ve destek.",
        en: "<strong>Single point of contact.</strong> One communication and support channel throughout the organisation.",
      },
    ],
    img: "/assets/img/turizm-temsili.jpg",
    imgAlt: { tr: "Tur otobüsü (temsili görsel)", en: "A tour coach (representative image)" },
  },
];

const FAQS: FaqItem[] = [
  {
    q: { tr: "Hangi bölgelerde hizmet veriyorsunuz?", en: "Which areas do you serve?" },
    a: {
      tr: "Merkezimiz Gebze / Kocaeli'dedir. Kocaeli ve çevre iller başta olmak üzere Marmara Bölgesi genelinde hizmet veriyoruz. Şehirler arası transfer ve turizm organizasyonlarında ise Türkiye geneline hizmet sunabiliyoruz.",
      en: "Our base is in Gebze / Kocaeli. We serve Kocaeli and neighbouring provinces, and the wider Marmara Region. For intercity transfers and tour organisations, we can serve the whole of Türkiye.",
    },
  },
  {
    q: { tr: "Personel servisi için nasıl teklif alabilirim?", en: "How can I get a quote for staff shuttle service?" },
    a: {
      tr: "İletişim sayfamızdaki formu doldurabilir ya da doğrudan telefonla bize ulaşabilirsiniz. Personel sayınız, vardiya düzeniniz ve toplanma noktalarınız hakkında bilgi aldıktan sonra size özel bir güzergâh planı ve fiyat teklifi hazırlıyoruz.",
      en: "You can fill in the form on our contact page or reach us directly by phone. After we learn about your staff numbers, shift schedule and pickup points, we prepare a tailored route plan and price quote for you.",
    },
  },
  {
    q: { tr: "Araçlarınız hangi güvenlik standartlarına sahip?", en: "What safety standards do your vehicles meet?" },
    a: {
      tr: "Filomuzdaki tüm araçların periyodik bakımları düzenli olarak yapılır. Araç ve sürücülerimiz, ilgili mevzuatın öngördüğü belge ve yükümlülükleri eksiksiz taşır. Öğrenci taşımacılığında kullanılan araçlarda ek güvenlik donanımı ve rehber personel bulunur.",
      en: "All vehicles in our fleet undergo regular periodic maintenance. Our vehicles and drivers carry every document and obligation required by applicable regulation, in full. Vehicles used for student transport carry additional safety equipment and a chaperone.",
    },
  },
  {
    q: { tr: "Kısa süreli veya tek seferlik hizmet alabilir miyim?", en: "Can I get short-term or one-off service?" },
    a: {
      tr: "Evet. Tek seferlik havalimanı transferi, etkinlik ulaşımı, günübirlik gezi ya da kısa dönem araç kiralama gibi ihtiyaçlarınız için de hizmet veriyoruz.",
      en: "Yes. We also serve needs such as a one-off airport transfer, event transport, a day trip, or short-term vehicle rental.",
    },
  },
  {
    q: { tr: "Sözleşme süreci nasıl işliyor?", en: "How does the contract process work?" },
    a: {
      tr: "İhtiyaç analizi ve saha değerlendirmesinin ardından hizmet kapsamını, sefer planını ve ticari koşulları içeren bir teklif sunuyoruz. Karşılıklı mutabakat sağlandığında yazılı sözleşme imzalanır ve belirlenen tarihte hizmet başlar.",
      en: "After a needs analysis and on-site assessment, we present a proposal covering the scope of service, trip plan and commercial terms. Once we reach mutual agreement, a written contract is signed and service begins on the agreed date.",
    },
  },
];

export default function Hizmetler() {
  const { t, tHtml } = useI18n();

  return (
    <>
      <PageMeta
        title={{
          tr: "Hizmetlerimiz | Akdoğan Turizm",
          en: "Our Services | Akdoğan Turizm",
        }}
      />

      <PageHero
        bg="/assets/img/road-2-temsili.jpg"
        bgAlt={{ tr: "Yolda seyir hâlindeki servis aracı (temsili görsel)", en: "A shuttle on the road (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Hizmetler", en: "Services" } },
        ]}
        eyebrow={{ tr: "Hizmetlerimiz", en: "Our Services" }}
        title={{ tr: "Kurumsal ulaşımda uçtan uca çözüm", en: "End-to-end solutions in corporate transport" }}
        lead={{
          tr: "Personel servisinden VIP transfere, araç kiralamadan turizm organizasyonlarına kadar tüm ulaşım ihtiyaçlarınız tek bir çatı altında.",
          en: "From staff shuttles to VIP transfer, from vehicle rental to tour organisations — all your transport needs under one roof.",
        }}
      />

      {/* HIZLI ERİŞİM */}
      <section className="section section--tight">
        <div className="container">
          <Reveal className="grid-3">
            {SERVICES.map((s, i) => (
              <a className="service-card" href={`#${s.id}`} key={s.id}>
                <p className="service-card__no">{String(i + 1).padStart(2, "0")}</p>
                <h3>{t(s.title)}</h3>
                <p>{t(s.short)}</p>
                <span className="link-arrow">{t("İncele", "View")}</span>
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      {/* HİZMET DETAYLARI */}
      {SERVICES.map((s, i) => (
        <section
          className={"service-detail" + (i % 2 ? " service-detail--alt" : "")}
          id={s.id}
          key={s.id}
        >
          <div className="container">
            <div className="split">
              <Reveal>
                <span className="service-detail__no">{t(s.no)}</span>
                <h2>{t(s.title)}</h2>
                <p className="lead" style={{ marginTop: 22 }}>
                  {t(s.lead)}
                </p>
                <p style={{ color: "var(--text-muted)" }}>{t(s.body)}</p>
                <ul className="checklist">
                  {s.checks.map((c, j) => (
                    <li key={j}>
                      <span dangerouslySetInnerHTML={{ __html: tHtml(c) }} />
                    </li>
                  ))}
                </ul>
                <div className="btn-row">
                  <Link className="btn btn--dark" to="/iletisim#teklif">
                    {t("Bu hizmet için teklif al", "Get a quote for this service")}
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <img className="media media--4-3" src={s.img} alt={t(s.imgAlt)} loading="lazy" />
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* SSS */}
      <section className="section">
        <div className="container container--narrow">
          <SectionHead
            eyebrow={{ tr: "Sıkça Sorulan Sorular", en: "Frequently Asked Questions" }}
            title={{ tr: "Merak edilenler", en: "Common questions" }}
          />
          <Faq items={FAQS} />
        </div>
      </section>

      <CtaSection
        title={{ tr: "İhtiyacınıza uygun çözümü birlikte belirleyelim.", en: "Let's find the right solution for your needs together." }}
        text={{
          tr: "Hangi hizmete ihtiyacınız olduğundan emin değil misiniz? Bizi arayın, birlikte değerlendirelim.",
          en: "Not sure which service you need? Give us a call and let's work it out together.",
        }}
        actions={[
          { label: { tr: "Teklif Al", en: "Get a Quote" }, to: "/iletisim#teklif" },
          { label: { tr: "0262 642 91 03", en: "0262 642 91 03" }, href: "tel:+902626429103", variant: "light" },
        ]}
      />
    </>
  );
}
