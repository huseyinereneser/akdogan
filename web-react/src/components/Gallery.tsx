import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Reveal } from "./Reveal";
import type { Pair } from "@/i18n/I18nProvider";

export interface GalleryImage {
  src: string;
  caption: Pair;
  /** Filtre kategorisi (opsiyonel). */
  category?: string;
  /** media--4-3 | media--3-4 … (varsayılan 4-3). */
  ratio?: string;
}

export interface GalleryFilter {
  key: string;
  label: Pair;
}

interface GalleryProps {
  images: GalleryImage[];
  filters?: GalleryFilter[];
  /** figure için ek sınıf (ör. gallery--docs). */
  variant?: string;
}

export function Gallery({ images, filters, variant }: GalleryProps) {
  const { t } = useI18n();
  const [active, setActive] = useState("tumu");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    document.body.classList.add("nav-open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("nav-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  const visible = (img: GalleryImage) =>
    active === "tumu" || !filters || img.category === active;

  return (
    <>
      {filters && (
        <Reveal className="filters">
          {[{ key: "tumu", label: { tr: "Tümü", en: "All" } as Pair }, ...filters].map(
            (f) => (
              <button
                key={f.key}
                type="button"
                className={"filter-btn" + (active === f.key ? " is-active" : "")}
                onClick={() => setActive(f.key)}
              >
                {t(f.label)}
              </button>
            )
          )}
        </Reveal>
      )}

      <Reveal className={"gallery" + (variant ? " " + variant : "")}>
        {images.map((img, i) => (
          <figure
            className={"gallery__item" + (visible(img) ? "" : " is-hidden")}
            key={i}
            onClick={() => setLightbox(img)}
          >
            <img
              className={"media " + (img.ratio ?? "media--4-3")}
              src={img.src}
              alt={t(img.caption)}
              loading="lazy"
            />
            <figcaption className="gallery__caption">{t(img.caption)}</figcaption>
          </figure>
        ))}
      </Reveal>

      <div
        className={"lightbox" + (lightbox ? " is-open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label={t("Görsel önizleme", "Image preview")}
        onClick={(e) => {
          if (e.target === e.currentTarget) setLightbox(null);
        }}
      >
        <button
          className="lightbox__close"
          type="button"
          aria-label={t("Kapat", "Close")}
          onClick={() => setLightbox(null)}
        >
          ×
        </button>
        <div className="lightbox__inner">
          {lightbox && (
            <>
              <img className="media lightbox__img" src={lightbox.src} alt={t(lightbox.caption)} />
              <p className="lightbox__title">{t(lightbox.caption)}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
