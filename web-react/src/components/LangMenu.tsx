import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { LangCode } from "@/i18n/languages";

/**
 * Navbar dil seçici. Tıklamayla açılır/kapanır; fareyle üzerine gelince de
 * açılır, ayrılınca kısa gecikmeyle kapanır. Açılış animasyonu style.css
 * içindeki `lang-menu-in` keyframe'i ile.
 */
export function LangMenu() {
  const { lang, meta, langs, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const closeTimer = useRef<number | null>(null);
  const toggleId = useId();

  const close = useCallback((focusToggle: boolean) => {
    setOpen(false);
    if (focusToggle) toggleRef.current?.focus();
  }, []);

  const cancelHoverClose = useCallback(() => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  // Dışarı tıklama + Escape.
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    document.addEventListener("click", onDocClick, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Klavyeyle açılışta seçili seçeneğe odak.
  const openWithFocus = useCallback(() => {
    setOpen(true);
    window.requestAnimationFrame(() => {
      const list = listRef.current;
      if (!list) return;
      const sel =
        list.querySelector<HTMLElement>('[aria-selected="true"]') ??
        (list.firstElementChild as HTMLElement | null);
      sel?.focus();
    });
  }, []);

  const onListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const opts = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>(".lang-menu__option") ?? []
    );
    const idx = opts.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      (opts[idx + 1] ?? opts[0])?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      (opts[idx - 1] ?? opts[opts.length - 1])?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      opts[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      opts[opts.length - 1]?.focus();
    } else if ((e.key === "Enter" || e.key === " ") && idx > -1) {
      e.preventDefault();
      const code = opts[idx].dataset.langSelect as LangCode;
      setLang(code);
      close(true);
    }
  };

  return (
    <div
      className="lang-menu"
      data-lang-menu
      ref={wrapRef}
      onMouseEnter={() => {
        cancelHoverClose();
        if (!open) setOpen(true);
      }}
      onMouseLeave={() => {
        cancelHoverClose();
        closeTimer.current = window.setTimeout(() => close(false), 180);
      }}
    >
      <button
        type="button"
        className="lang-menu__toggle"
        id={toggleId}
        ref={toggleRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Dil seçin"
        onClick={() => (open ? close(false) : openWithFocus())}
      >
        <span className={`flag flag--${meta.bayrak}`} aria-hidden="true" />
        <span className="lang-menu__code">{meta.kisa}</span>
        <svg
          className="lang-menu__chev"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ul
        className="lang-menu__list"
        role="listbox"
        aria-labelledby={toggleId}
        ref={listRef}
        hidden={!open}
        onKeyDown={onListKeyDown}
      >
        {langs.map((l) => (
          <li
            key={l.kod}
            role="option"
            className="lang-menu__option"
            data-lang-select={l.kod}
            aria-selected={l.kod === lang}
            tabIndex={-1}
            onClick={() => {
              setLang(l.kod);
              close(true);
            }}
          >
            <span className={`flag flag--${l.bayrak}`} aria-hidden="true" />
            <span className="lang-menu__name">{l.adEn}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
