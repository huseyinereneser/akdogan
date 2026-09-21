import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import type { Pair } from "@/i18n/I18nProvider";

/** Basit çeviri listesi yardımcıları */
const dataProcessed: Pair[] = [
  {
    tr: "<strong>Kimlik bilgileri:</strong> ad, soyad, T.C. kimlik numarası (yalnızca yasal zorunluluk halinde).",
    en: "<strong>Identity information:</strong> first and last name, national ID number (only where legally required).",
  },
  {
    tr: "<strong>İletişim bilgileri:</strong> telefon numarası, e-posta adresi, adres, servis biniş noktası.",
    en: "<strong>Contact information:</strong> phone number, email address, home address, shuttle pickup point.",
  },
  {
    tr: "<strong>Müşteri işlem bilgileri:</strong> talep ve şikâyet kayıtları, sözleşme bilgileri, sefer kayıtları.",
    en: "<strong>Customer transaction information:</strong> request and complaint records, contract details, trip records.",
  },
  {
    tr: "<strong>Öğrenci ve veli bilgileri:</strong> öğrencinin adı, okulu, sınıfı, veli iletişim bilgileri.",
    en: "<strong>Student and parent information:</strong> the student's name, school, class, and parent contact details.",
  },
  {
    tr: "<strong>Çalışan adayı bilgileri:</strong> özgeçmiş, eğitim ve deneyim bilgileri, sürücü belgesi bilgileri.",
    en: "<strong>Job applicant information:</strong> CV, education and experience details, driving licence information.",
  },
  {
    tr: "<strong>İşlem güvenliği bilgileri:</strong> web sitesi üzerinden iletilen form kayıtları.",
    en: "<strong>Transaction security information:</strong> records of forms submitted through our website.",
  },
];

const purposes: Pair[] = [
  { tr: "Personel, öğrenci ve VIP taşıma hizmetlerinin planlanması ve yürütülmesi.", en: "Planning and carrying out personnel, student and VIP transport services." },
  { tr: "Güzergâh oluşturulması, sefer planlaması ve operasyonun takibi.", en: "Building routes, planning trips and tracking operations." },
  { tr: "Sözleşme süreçlerinin yürütülmesi, faturalandırma ve tahsilat işlemleri.", en: "Carrying out contract processes, invoicing and collection procedures." },
  { tr: "Talep, öneri ve şikâyetlerin karşılanması; müşteri iletişiminin sağlanması.", en: "Handling requests, suggestions and complaints; maintaining customer communication." },
  { tr: "Yolcu ve araç güvenliğinin sağlanması.", en: "Ensuring passenger and vehicle safety." },
  { tr: "Çalışan adayı başvurularının değerlendirilmesi.", en: "Evaluating job applications." },
  {
    tr: "İlgili mevzuattan doğan yükümlülüklerin yerine getirilmesi ve yetkili kurumlara bilgi verilmesi.",
    en: "Fulfilling obligations arising from applicable legislation and reporting to authorised bodies.",
  },
];

const grounds: Pair[] = [
  { tr: "Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması.", en: "It is directly related to the establishment or performance of a contract." },
  { tr: "Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması.", en: "It is mandatory for the data controller to fulfil a legal obligation." },
  {
    tr: "İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması.",
    en: "It is mandatory for the data controller's legitimate interests, provided this does not harm the data subject's fundamental rights and freedoms.",
  },
  { tr: "Gerekli hallerde ilgili kişinin açık rızasının bulunması.", en: "The data subject's explicit consent exists, where required." },
];

const rights: Pair[] = [
  { tr: "Kişisel verilerinizin işlenip işlenmediğini öğrenme.", en: "To learn whether your personal data is being processed." },
  { tr: "İşlenmişse buna ilişkin bilgi talep etme.", en: "To request information about it, if it has been processed." },
  { tr: "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme.", en: "To learn the purpose of processing and whether it is used in accordance with that purpose." },
  { tr: "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme.", en: "To know the third parties to whom it is transferred, domestically or abroad." },
  { tr: "Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme.", en: "To request correction if it has been processed incompletely or incorrectly." },
  { tr: "Mevzuatta öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme.", en: "To request its deletion or destruction within the conditions set out in legislation." },
  {
    tr: "Düzeltme, silme ve yok edilme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme.",
    en: "To request that any correction, deletion or destruction be notified to the third parties to whom the data was transferred.",
  },
  {
    tr: "Münhasıran otomatik sistemler ile analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme.",
    en: "To object to a result that is to your detriment arising solely from analysis by automated systems.",
  },
  {
    tr: "Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.",
    en: "To request compensation for damages if you suffer loss due to unlawful processing.",
  },
];

const applyChannels: Pair[] = [
  {
    tr: "<strong>Yazılı başvuru:</strong> Mevlana Mah. Soma Maden Şehitleri Blv., 41400 Gebze / Kocaeli",
    en: "<strong>Written application:</strong> Mevlana Mah. Soma Maden Şehitleri Blv., 41400 Gebze / Kocaeli",
  },
  {
    tr: '<strong>E-posta:</strong> <a href="mailto:info@akdoganturizm.com" style="color:var(--blue-600)">info@akdoganturizm.com</a>',
    en: '<strong>Email:</strong> <a href="mailto:info@akdoganturizm.com" style="color:var(--blue-600)">info@akdoganturizm.com</a>',
  },
  {
    tr: '<strong>Telefon:</strong> <a href="tel:+902626429103" style="color:var(--blue-600)">0262 642 91 03</a>',
    en: '<strong>Phone:</strong> <a href="tel:+902626429103" style="color:var(--blue-600)">0262 642 91 03</a>',
  },
];

export default function Kvkk() {
  const { t, tHtml } = useI18n();
  const htmlList = (items: Pair[]) =>
    items.map((p, i) => (
      <li key={i} dangerouslySetInnerHTML={{ __html: tHtml(p) }} />
    ));

  return (
    <>
      <PageMeta
        title={{ tr: "Kişisel Verilerin Korunması | Akdoğan Turizm", en: "Data Protection (KVKK) | Akdoğan Turizm" }}
        description={{
          tr: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metnimiz.",
          en: "Our disclosure text under Law No. 6698 on the Protection of Personal Data.",
        }}
      />

      <PageHero
        bg="/assets/img/ekip-ofis-temsili.jpg"
        bgAlt={{ tr: "Kurumsal ekip (temsili görsel)", en: "Corporate team (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Kurumsal", en: "Corporate" }, to: "/hakkimizda" },
          { label: { tr: "Kişisel Verilerin Korunması", en: "Data Protection (KVKK)" } },
        ]}
        eyebrow={{ tr: "KVKK", en: "KVKK" }}
        title={{ tr: "Kişisel Verilerin Korunması", en: "Data Protection Notice" }}
        lead={{
          tr: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metnimiz.",
          en: "Our disclosure text under Law No. 6698 on the Protection of Personal Data.",
        }}
      />

      <section className="section">
        <div className="container container--narrow">
          <Reveal as="div" className="prose">
            <span className="prose__updated">
              {t("Son güncelleme: 06.09.2026", "Last updated: 06.09.2026")}
            </span>

            <h2>{t("1. Veri Sorumlusu", "1. Data Controller")}</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: tHtml(
                  '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla <strong>Akdoğan Turizm</strong> (Gebze / Kocaeli) tarafından aşağıda açıklanan kapsamda işlenmektedir.',
                  'Under Law No. 6698 on the Protection of Personal Data ("KVKK"), your personal data is processed by <strong>Akdoğan Turizm</strong> (Gebze / Kocaeli) as data controller, within the scope described below.'
                ),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: tHtml(
                  "<strong>Adres:</strong> Mevlana Mah. Soma Maden Şehitleri Blv., 41400 Gebze / Kocaeli<br><strong>Telefon:</strong> 0262 642 91 03<br><strong>E-posta:</strong> info@akdoganturizm.com",
                  "<strong>Address:</strong> Mevlana Mah. Soma Maden Şehitleri Blv., 41400 Gebze / Kocaeli<br><strong>Phone:</strong> 0262 642 91 03<br><strong>Email:</strong> info@akdoganturizm.com"
                ),
              }}
            />

            <h2>{t("2. İşlenen Kişisel Veriler", "2. Personal Data Processed")}</h2>
            <p>
              {t(
                "Faaliyetlerimiz kapsamında aşağıdaki veri kategorileri işlenebilmektedir:",
                "The following categories of data may be processed within the scope of our activities:"
              )}
            </p>
            <ul>{htmlList(dataProcessed)}</ul>

            <h2>{t("3. Kişisel Verilerin İşlenme Amaçları", "3. Purposes of Processing Personal Data")}</h2>
            <ul>{purposes.map((p, i) => <li key={i}>{t(p)}</li>)}</ul>

            <h2>
              {t(
                "4. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi",
                "4. Method of Collection and Legal Grounds"
              )}
            </h2>
            <p>
              {t(
                "Kişisel verileriniz; web sitemizdeki iletişim ve başvuru formları, telefon görüşmeleri, e-posta yazışmaları, sözleşmeler ve hizmet verdiğimiz kurumlar aracılığıyla, tamamen veya kısmen otomatik ya da otomatik olmayan yollarla toplanmaktadır.",
                "Your personal data is collected, fully or partly through automatic or non-automatic means, via the contact and application forms on our website, phone calls, email correspondence, contracts and the organisations we serve."
              )}
            </p>
            <p>
              {t(
                "Bu veriler KVKK'nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenir:",
                "This data is processed based on the following legal grounds set out in Articles 5 and 6 of the KVKK:"
              )}
            </p>
            <ul>{grounds.map((p, i) => <li key={i}>{t(p)}</li>)}</ul>

            <h2>{t("5. Kişisel Verilerin Aktarılması", "5. Transfer of Personal Data")}</h2>
            <p>
              {t(
                "Kişisel verileriniz, KVKK'nın 8. ve 9. maddelerinde belirtilen şartlar çerçevesinde ve yalnızca gerekli olduğu ölçüde; hizmet alınan kurumlara, iş ortaklarımıza, mali müşavir ve hukuk danışmanlarımıza, sigorta şirketlerine ve yasal olarak yetkili kamu kurum ve kuruluşlarına aktarılabilir. Verileriniz bunun dışında üçüncü kişilerle paylaşılmaz ve pazarlama amacıyla satılmaz.",
                "Your personal data may be transferred, within the conditions set out in Articles 8 and 9 of the KVKK and only to the extent necessary, to the organisations we serve, our business partners, our financial and legal advisers, insurance companies, and legally authorised public bodies. Beyond this, your data is not shared with third parties or sold for marketing purposes."
              )}
            </p>

            <h2>{t("6. Saklama Süresi", "6. Retention Period")}</h2>
            <p>
              {t(
                "Kişisel verileriniz, işlendikleri amaç için gerekli olan süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı süreleri kadar saklanır. Sürenin sona ermesi hâlinde verileriniz silinir, yok edilir veya anonim hâle getirilir.",
                "Your personal data is retained for as long as required for the purpose it was processed for, and for the statute-of-limitations periods set out in applicable legislation. Once that period ends, your data is deleted, destroyed or anonymised."
              )}
            </p>

            <h2>{t("7. İlgili Kişi Olarak Haklarınız", "7. Your Rights as a Data Subject")}</h2>
            <p>{t("KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:", "Under Article 11 of the KVKK, you have the following rights:")}</p>
            <ol>{rights.map((p, i) => <li key={i}>{t(p)}</li>)}</ol>

            <h2>{t("8. Başvuru Yöntemi", "8. How to Apply")}</h2>
            <p>
              {t(
                "Yukarıdaki haklarınıza ilişkin taleplerinizi, kimliğinizi tevsik edici belgelerle birlikte aşağıdaki yollardan biriyle iletebilirsiniz:",
                "You can submit requests regarding the rights above, together with documents verifying your identity, through one of the following channels:"
              )}
            </p>
            <ul>{htmlList(applyChannels)}</ul>
            <p
              dangerouslySetInnerHTML={{
                __html: tHtml(
                  "Başvurularınız, talebin niteliğine göre en kısa sürede ve en geç <strong>otuz gün</strong> içinde ücretsiz olarak sonuçlandırılır. İşlemin ayrıca bir maliyet gerektirmesi hâlinde Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret talep edilebilir.",
                  "Your applications are concluded free of charge, as soon as possible and within <strong>thirty days</strong> at the latest, depending on the nature of the request. If the process requires an additional cost, a fee may be charged according to the tariff set by the Personal Data Protection Board."
                ),
              }}
            />

            <h2>{t("9. Çerezler", "9. Cookies")}</h2>
            <p>
              {t(
                "Web sitemiz çerez kullanmaz. Yalnızca dil tercihiniz tarayıcınızın yerel deposunda (localStorage) saklanır; bu bilgi sunucuya gönderilmez, üçüncü taraflarla paylaşılmaz ve reklam/analiz amacıyla kullanılmaz. Tarayıcı ayarlarınızdan bu tercihi her zaman kaldırabilirsiniz.",
                "Our website does not use cookies. Language preference is stored in your browser's local storage (localStorage) so the site works correctly; this information is never sent to the server, shared with third parties, or used for advertising or analytics. You can remove it at any time by clearing site data in your browser settings."
              )}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
