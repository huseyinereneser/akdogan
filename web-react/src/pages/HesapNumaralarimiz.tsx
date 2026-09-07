import { useI18n } from "@/i18n/I18nProvider";
import { PageMeta } from "@/components/PageMeta";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { CtaSection } from "@/components/CtaSection";
import type { Pair } from "@/i18n/I18nProvider";

interface BankAccount {
  bank: string;
  currency: string;
  holder: string;
  branch: string;
  no: string;
  iban: string;
}

const ACCOUNTS: BankAccount[] = [
  {
    bank: "Garanti BBVA",
    currency: "TL",
    holder: "Akdoğan Seyahat Turizm",
    branch: "000004",
    no: "6297679",
    iban: "TR57 0006 2001 3450 0006 2976 79",
  },
  {
    bank: "Türkiye İş Bankası",
    currency: "TL",
    holder: "Akdoğan Seyahat Turizm",
    branch: "000004",
    no: "124202943241",
    iban: "TR26 0006 4000 0012 4202 9432 41",
  },
];

const ROWS: { label: Pair; key: keyof BankAccount }[] = [
  { label: { tr: "Hesap Sahibi", en: "Account Holder" }, key: "holder" },
  { label: { tr: "Şube", en: "Branch" }, key: "branch" },
  { label: { tr: "Hesap No", en: "Account No." }, key: "no" },
  { label: { tr: "IBAN", en: "IBAN" }, key: "iban" },
];

export default function HesapNumaralarimiz() {
  const { t, tHtml } = useI18n();

  return (
    <>
      <PageMeta
        title={{ tr: "Hesap Numaralarımız | Akdoğan Turizm", en: "Bank Accounts | Akdoğan Turizm" }}
      />

      <PageHero
        bg="/assets/img/ofis-toplanti-temsili.jpg"
        bgAlt={{ tr: "Ofis toplantısı (temsili görsel)", en: "Office meeting (representative image)" }}
        crumbs={[
          { label: { tr: "Ana Sayfa", en: "Home" }, to: "/" },
          { label: { tr: "Kurumsal", en: "Corporate" }, to: "/hakkimizda" },
          { label: { tr: "Hesap Numaralarımız", en: "Bank Accounts" } },
        ]}
        eyebrow={{ tr: "Hesap Numaralarımız", en: "Bank Accounts" }}
        title={{ tr: "Ödeme bilgileri", en: "Payment details" }}
      />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow={{ tr: "Banka Hesapları", en: "Bank Accounts" }}
            title={{ tr: "IBAN bilgilerimiz", en: "Our IBAN details" }}
            text={{
              tr: "Havale ve EFT işlemlerinizde açıklama kısmına kurum adınızı yazmayı unutmayın.",
              en: "Please remember to include your organisation's name in the description field of your transfer or EFT.",
            }}
          />

          <Reveal className="grid-auto">
            {ACCOUNTS.map((a) => (
              <div className="bank-card" key={a.iban}>
                <div className="bank-card__brand">
                  <h3>{a.bank}</h3>
                  <span className="bank-card__currency">{a.currency}</span>
                </div>
                <dl>
                  {ROWS.map((r) => (
                    <div className="bank-row" key={r.key}>
                      <dt>{t(r.label)}</dt>
                      <dd className={r.key === "iban" ? "iban" : undefined}>{a[r.key]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </Reveal>

          <Reveal as="div" className="notice">
            <span
              dangerouslySetInnerHTML={{
                __html: tHtml(
                  '<strong>Ödeme yaparken dikkat</strong> Hesap bilgilerimiz yalnızca bu sayfada ve resmî yazışmalarımızda yer alır. Size ulaşan farklı bir IBAN talebini işleme almadan önce <a href="tel:+902626429103" style="color:inherit;text-decoration:underline">0262 642 91 03</a> numaralı hattımızdan teyit alın. Dekontunuzu <a href="mailto:info@akdoganturizm.com" style="color:inherit;text-decoration:underline">info@akdoganturizm.com</a> adresine iletebilirsiniz.',
                  '<strong>A note on payments</strong> Our account details appear only on this page and in our official correspondence. Before acting on any different IBAN sent to you, please confirm it by calling <a href="tel:+902626429103" style="color:inherit;text-decoration:underline">0262 642 91 03</a>. You can send your payment receipt to <a href="mailto:info@akdoganturizm.com" style="color:inherit;text-decoration:underline">info@akdoganturizm.com</a>.'
                ),
              }}
            />
          </Reveal>
        </div>
      </section>

      <CtaSection
        title={{ tr: "Fatura veya ödeme sorunuz mu var?", en: "Have a billing or payment question?" }}
        text={{
          tr: "Muhasebe birimimiz mesai saatleri içinde size yardımcı olur.",
          en: "Our accounting team is happy to help during business hours.",
        }}
        actions={[
          { label: { tr: "0262 642 91 03", en: "0262 642 91 03" }, href: "tel:+902626429103" },
          { label: { tr: "E-posta Gönder", en: "Send an Email" }, href: "mailto:info@akdoganturizm.com", variant: "light" },
        ]}
      />
    </>
  );
}
