import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useI18n } from "@/i18n/I18nProvider";
import type { Pair } from "@/i18n/I18nProvider";

/* ------------------------------------------------------------------ *
 * Gönderim + doğrulama (orijinal assets/js/main.js · 8. bölüm)
 * ------------------------------------------------------------------ */

type Status = "idle" | "ok" | "error";

function validateForm(form: HTMLFormElement): boolean {
  let valid = true;
  let firstBad: HTMLElement | null = null;

  form
    .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      "[required]"
    )
    .forEach((input) => {
      const field = input.closest(".field");
      const value = input.value.trim();
      let ok = value !== "";
      if (ok && input instanceof HTMLInputElement && input.type === "email") {
        ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }
      if (ok && input instanceof HTMLInputElement && input.type === "tel") {
        ok = value.replace(/\D/g, "").length >= 10;
      }
      field?.classList.toggle("has-error", !ok);
      if (!ok) {
        valid = false;
        if (!firstBad) firstBad = input;
      }
    });

  const oversize = form.querySelector<HTMLElement>(".filefield[data-oversize]");
  if (oversize) {
    valid = false;
    oversize.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  (firstBad as HTMLElement | null)?.focus();
  return valid;
}

interface AkFormProps {
  /** gonder.php'deki gizli "form" alanı: teklif | basvuru | yorum. */
  formName: string;
  multipart?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
  children: (state: { status: Status; busy: boolean }) => ReactNode;
}

export function AkForm({
  formName,
  multipart,
  className,
  style,
  id,
  children,
}: AkFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [busy, setBusy] = useState(false);

  // Alan yazıldıkça hata sınıfını temizle.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const clear = (e: Event) => {
      const t = e.target as HTMLElement | null;
      t?.closest?.(".field")?.classList.remove("has-error");
    };
    form.addEventListener("input", clear);
    form.addEventListener("change", clear);
    return () => {
      form.removeEventListener("input", clear);
      form.removeEventListener("change", clear);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || busy) return;
    if (!validateForm(form)) return;

    setBusy(true);
    const data = new FormData(form);
    data.set("ajax", "1");
    data.set("form", formName);
    try {
      const r = await fetch(form.getAttribute("action") || "/gonder.php", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const res = await r.json().catch(() => ({ ok: false }));
      if (res && res.ok === true) {
        form.reset();
        form
          .querySelectorAll<HTMLElement>(".filefield[data-oversize]")
          .forEach((f) => f.removeAttribute("data-oversize"));
        setStatus("ok");
        const ok = form.querySelector(".form-status--ok");
        ok?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      id={id}
      ref={formRef}
      className={"form-grid" + (className ? " " + className : "")}
      style={style}
      method="post"
      action="/gonder.php"
      encType={multipart ? "multipart/form-data" : undefined}
      noValidate
      onSubmit={onSubmit}
    >
      <input type="hidden" name="form" value={formName} />
      <div className="hp" aria-hidden="true">
        <label>
          Web sitesi
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {children({ status, busy })}
    </form>
  );
}

/* ------------------------------------------------------------------ *
 * Alan bileşenleri
 * ------------------------------------------------------------------ */

interface FieldProps {
  id: string;
  name: string;
  label: Pair;
  required?: boolean;
  full?: boolean;
  type?: "text" | "email" | "tel" | "number";
  placeholder?: Pair;
  autoComplete?: string;
  error?: Pair;
  min?: number;
  max?: number;
}

export function Field({
  id,
  name,
  label,
  required,
  full,
  type = "text",
  placeholder,
  autoComplete,
  error,
  min,
  max,
}: FieldProps) {
  const { t } = useI18n();
  return (
    <div className={"field" + (full ? " field--full" : "")}>
      <label htmlFor={id}>
        <span>{t(label)}</span> {required && <span className="req">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder ? t(placeholder) : undefined}
        autoComplete={autoComplete}
        required={required}
        min={min}
        max={max}
      />
      {error && <span className="field__error">{t(error)}</span>}
    </div>
  );
}

interface TextAreaProps {
  id: string;
  name: string;
  label: Pair;
  required?: boolean;
  placeholder?: Pair;
  error?: Pair;
}

export function TextAreaField({
  id,
  name,
  label,
  required,
  placeholder,
  error,
}: TextAreaProps) {
  const { t } = useI18n();
  return (
    <div className="field field--full">
      <label htmlFor={id}>
        <span>{t(label)}</span> {required && <span className="req">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        placeholder={placeholder ? t(placeholder) : undefined}
      />
      {error && <span className="field__error">{t(error)}</span>}
    </div>
  );
}

export interface SelectOption {
  value: string;
  label: Pair;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: Pair;
  required?: boolean;
  full?: boolean;
  options: SelectOption[];
  error?: Pair;
  /** "Diğer" seçilince açılacak koşullu alanın değeri. */
  toggleValue?: string;
  onToggle?: (open: boolean) => void;
}

export function SelectField({
  id,
  name,
  label,
  required,
  full,
  options,
  error,
  toggleValue,
  onToggle,
}: SelectFieldProps) {
  const { t } = useI18n();
  return (
    <div className={"field" + (full ? " field--full" : "")}>
      <label htmlFor={id}>
        <span>{t(label)}</span> {required && <span className="req">*</span>}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        onChange={(e) => toggleValue && onToggle?.(e.target.value === toggleValue)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.label)}
          </option>
        ))}
      </select>
      {error && <span className="field__error">{t(error)}</span>}
    </div>
  );
}

/** "Diğer" seçilince görünen koşullu alan; görünürken zorunlu olur. */
export function ConditionalField({
  open,
  ...props
}: FieldProps & { open: boolean }) {
  const { t } = useI18n();
  return (
    <div className="field field--full field--conditional" hidden={!open}>
      <label htmlFor={props.id}>
        <span>{t(props.label)}</span>{" "}
        {props.required && <span className="req">*</span>}
      </label>
      <input
        type="text"
        id={props.id}
        name={props.name}
        placeholder={props.placeholder ? t(props.placeholder) : undefined}
        required={open && props.required}
      />
      {props.error && <span className="field__error">{t(props.error)}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Dosya alanı (orijinal main.js · 10. bölüm)
 * ------------------------------------------------------------------ */

const MAX_TOTAL_BYTES = 10 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1).replace(".", ",") + " MB";
}

interface FileFieldProps {
  id: string;
  name: string;
  label: Pair;
  accept: string;
  hint: Pair;
}

export function FileField({ id, name, label, accept, hint }: FileFieldProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);

  const total = files.reduce((s, f) => s + f.size, 0);
  const oversize = total > MAX_TOTAL_BYTES;

  // Seçili dosyaları gizli input'a yaz (FormData bunları alır).
  useEffect(() => {
    const input = inputRef.current;
    if (!input || typeof DataTransfer === "undefined") return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    input.files = dt.files;
  }, [files]);

  useEffect(() => {
    wrapRef.current?.toggleAttribute("data-oversize", oversize);
  }, [oversize]);

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };

  return (
    <div className="field field--full">
      <label htmlFor={id}>
        <span>{t(label)}</span>{" "}
        <span className="opt">{t("(isteğe bağlı)", "(optional)")}</span>
      </label>
      <div
        className="filefield"
        ref={wrapRef}
        data-oversize={oversize ? "true" : undefined}
      >
        <input
          className="filefield__input"
          type="file"
          id={id}
          name={name}
          multiple
          accept={accept}
          ref={inputRef}
          onChange={(e) => {
            addFiles(e.target.files);
          }}
        />
        <label
          className={"filefield__drop" + (dragging ? " is-dragging" : "")}
          htmlFor={id}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
        >
          <span className="filefield__btn">{t("Dosya seç", "Choose file")}</span>
          <span className="filefield__note">
            {t("veya dosyaları buraya sürükleyin", "or drag your files here")}
          </span>
        </label>

        {files.length > 0 && (
          <ul className="filefield__list">
            {files.map((f, i) => (
              <li className="filefield__item" key={i}>
                <span className="filefield__name">{f.name}</span>
                <span className="filefield__size">{formatSize(f.size)}</span>
                <button
                  type="button"
                  className="filefield__remove"
                  aria-label={t(`${f.name} dosyasını kaldır`, `Remove ${f.name}`)}
                  onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {oversize && (
          <p className="filefield__msg is-visible" role="alert">
            {t(
              `Toplam dosya boyutu ${formatSize(total)}. En fazla 10 MB ekleyebilirsiniz; lütfen bazı dosyaları kaldırın.`,
              `Total file size is ${formatSize(total)}. You can attach at most 10 MB; please remove some files.`
            )}
          </p>
        )}
      </div>
      <p className="field__hint">{t(hint)}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Durum kutuları + gönder düğmesi
 * ------------------------------------------------------------------ */

export function SubmitBlock({
  status,
  busy,
  label,
  note,
  okMsg,
  errMsg,
}: {
  status: Status;
  busy: boolean;
  label: Pair;
  note: Pair;
  okMsg: Pair;
  errMsg: Pair;
}) {
  const { t } = useI18n();
  return (
    <div className="field--full">
      <button
        className={"btn btn--primary btn--block" + (busy ? " is-loading" : "")}
        type="submit"
        disabled={busy}
      >
        {t(label)}
      </button>
      <p className="form-note">{t(note)}</p>
      <div
        className={"form-status form-status--ok" + (status === "ok" ? " is-visible" : "")}
        role="status"
      >
        {t(okMsg)}
      </div>
      <div
        className={
          "form-status form-status--error" + (status === "error" ? " is-visible" : "")
        }
        role="alert"
      >
        {t(errMsg)}
      </div>
    </div>
  );
}
