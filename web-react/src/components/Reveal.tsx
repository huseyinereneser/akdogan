import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

interface RevealProps {
  children: ReactNode;
  /** ms cinsinden gecikme (orijinal data-reveal-delay). */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Görünüme girince "is-visible" sınıfını ekler (orijinal [data-reveal]).
 * IntersectionObserver yoksa anında görünür.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          window.setTimeout(() => setVisible(true), delay);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, visible]);

  return (
    <Tag
      ref={ref}
      className={
        "reveal" + (visible ? " is-visible" : "") + (className ? " " + className : "")
      }
      data-reveal=""
    >
      {children}
    </Tag>
  );
}
