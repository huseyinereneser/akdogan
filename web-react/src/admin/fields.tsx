import type { ReactNode } from "react";

export function Bolum({ baslik, children, aciklama }: { baslik: string; aciklama?: string; children: ReactNode }) {
  return (
    <section className="akdadmin-bolum">
      <h2>{baslik}</h2>
      {aciklama && <p className="akdadmin-bolum__aciklama">{aciklama}</p>}
      <div className="akdadmin-bolum__govde">{children}</div>
    </section>
  );
}

export function Alan({
  etiket,
  value,
  onChange,
  tip = "text",
}: {
  etiket: string;
  value: string;
  onChange: (v: string) => void;
  tip?: string;
}) {
  return (
    <label className="akdadmin-alan">
      <span>{etiket}</span>
      <input type={tip} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function AlanTextarea({
  etiket,
  value,
  onChange,
  satir = 4,
}: {
  etiket: string;
  value: string;
  onChange: (v: string) => void;
  satir?: number;
}) {
  return (
    <label className="akdadmin-alan akdadmin-alan--tam">
      <span>{etiket}</span>
      <textarea rows={satir} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

export function AlanOnayKutusu({
  etiket,
  value,
  onChange,
}: {
  etiket: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="akdadmin-onay">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span>{etiket}</span>
    </label>
  );
}
