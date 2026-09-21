import { useState } from "react";
import { useAdminData } from "../useAdminData";
import { AlanTextarea } from "../fields";

export function AdminSayfalar() {
  const { site, siteyiGuncelle } = useAdminData();
  const anahtarlar = Object.keys(site?.sayfalar ?? {});
  const [secili, setSecili] = useState(anahtarlar[0] ?? "");

  if (!site) return null;
  const sayfa = site.sayfalar[secili];

  const alanGuncelle = (alanAnahtari: string, dil: "tr" | "en", deger: string) => {
    siteyiGuncelle((onceki) => ({
      ...onceki,
      sayfalar: {
        ...onceki.sayfalar,
        [secili]: {
          ...onceki.sayfalar[secili],
          alanlar: {
            ...onceki.sayfalar[secili].alanlar,
            [alanAnahtari]: { ...onceki.sayfalar[secili].alanlar[alanAnahtari], [dil]: deger },
          },
        },
      },
    }));
  };

  return (
    <div>
      <h1>Sayfa Metinleri</h1>
      <label className="akdadmin-alan akdadmin-alan--tam">
        <span>Sayfa</span>
        <select value={secili} onChange={(e) => setSecili(e.target.value)}>
          {anahtarlar.map((a) => (
            <option key={a} value={a}>{site.sayfalar[a].etiket_tr}</option>
          ))}
        </select>
      </label>

      {sayfa &&
        Object.entries(sayfa.alanlar).map(([alanAnahtari, alan]) => (
          <section key={alanAnahtari} className="akdadmin-bolum">
            <h2>{alan.ad}</h2>
            <div className="akdadmin-iki-dil">
              <AlanTextarea etiket="Türkçe" value={alan.tr} onChange={(v) => alanGuncelle(alanAnahtari, "tr", v)} satir={3} />
              <AlanTextarea etiket="English" value={alan.en} onChange={(v) => alanGuncelle(alanAnahtari, "en", v)} satir={3} />
            </div>
          </section>
        ))}
    </div>
  );
}
