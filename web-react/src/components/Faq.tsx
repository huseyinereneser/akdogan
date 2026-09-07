import { useLayoutEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "./Reveal";
import type { Pair } from "@/i18n/I18nProvider";

export interface FaqItem {
  q: Pair;
  a: Pair;
}

export function Faq({ items }: { items: FaqItem[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Reveal className="faq">
      {items.map((item, i) => (
        <FaqRow
          key={i}
          item={item}
          open={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
          t={t}
        />
      ))}
    </Reveal>
  );
}

function FaqRow({
  item,
  open,
  onToggle,
  t,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
  t: (p: Pair) => string;
}) {
  const answerRef = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(0);

  useLayoutEffect(() => {
    setMax(open ? answerRef.current?.scrollHeight ?? 0 : 0);
  }, [open, t, item.a]);

  return (
    <div className={"faq__item" + (open ? " is-open" : "")}>
      <button
        className="faq__q"
        type="button"
        aria-expanded={open}
        onClick={onToggle}
      >
        {t(item.q)}
      </button>
      <div className="faq__a" ref={answerRef} style={{ maxHeight: max }}>
        <p>{t(item.a)}</p>
      </div>
    </div>
  );
}
