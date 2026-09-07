import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface CountUpProps {
  value: number;
  /** Sabit ekler (ör. "+"). */
  suffix?: string;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** İstatistik bandı sayacı — görünüme girince 0'dan hedefe (easeOutCubic). */
export function CountUp({ value, suffix }: CountUpProps) {
  const { lang } = useI18n();
  const ref = useRef<HTMLSpanElement | null>(null);
  // IntersectionObserver yoksa ya da hareket azaltılmışsa doğrudan hedef değer.
  const [display, setDisplay] = useState(() =>
    typeof IntersectionObserver === "undefined" || prefersReducedMotion()
      ? value
      : 0
  );
  const done = useRef(false);

  const fmt = (n: number) => {
    const s = n.toLocaleString("tr-TR");
    return lang === "ar"
      ? s.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩".charAt(+d))
      : s;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;

    if (typeof IntersectionObserver === "undefined" || prefersReducedMotion()) {
      setDisplay(value);
      done.current = true;
      return;
    }

    const run = () => {
      if (done.current) return;
      done.current = true;
      const duration = 1400;
      let start: number | null = null;
      const step = (now: number) => {
        if (start === null) start = now;
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(value * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    // Eşiği düşük tutup alt kenardan biraz erken tetikliyoruz; böylece
    // bant viewport'tan uzun olsa bile sayaç mutlaka çalışır.
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.disconnect();
          run();
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);

    // Güvenlik ağı: 3 sn içinde hiç tetiklenmediyse (kısa sayfa, gözlemci
    // kaçırması vb.) yine de hedef değeri göster.
    const safety = window.setTimeout(() => {
      if (done.current) return;
      obs.disconnect();
      done.current = true;
      setDisplay(value);
    }, 3000);

    return () => {
      obs.disconnect();
      window.clearTimeout(safety);
    };
  }, [value]);

  return (
    <>
      <span ref={ref} data-count={value}>
        {fmt(display)}
      </span>
      {suffix ? <span className="plus">{suffix}</span> : null}
    </>
  );
}
