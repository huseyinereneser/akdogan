import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";
import type { Pair } from "@/i18n/I18nProvider";

export interface Stat {
  /** Sabit metin (ör. "2010") veya sayaç hedefi. */
  value: number | string;
  suffix?: string;
  label: Pair;
}

const DEFAULT_STATS: Stat[] = [
  { value: "2010", label: { tr: "Kuruluş yılı", en: "Year founded" } },
  { value: 3500, suffix: "+", label: { tr: "Günlük taşınan yolcu", en: "Passengers transported daily" } },
  { value: 120, suffix: "+", label: { tr: "Filodaki araç sayısı", en: "Vehicles in the fleet" } },
  { value: 60, suffix: "+", label: { tr: "Kurumsal iş ortağı", en: "Corporate partners" } },
];

/** İstatistik bandı — birden çok sayfada aynı 4 değerle kullanılıyor. */
export function StatsBand({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  const { t } = useI18n();
  return (
    <section className="stats">
      <div className="container">
        <div className="stats__grid">
          {stats.map((s, i) => (
            <Reveal className="stat" delay={i * 80} key={i}>
              <div className="stat__value">
                {typeof s.value === "number" ? (
                  <CountUp value={s.value} suffix={s.suffix} />
                ) : (
                  s.value
                )}
              </div>
              <p className="stat__label">{t(s.label)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
