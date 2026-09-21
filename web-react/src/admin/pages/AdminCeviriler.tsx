import { useMemo, useState } from "react";
import { useAdminData } from "../useAdminData";

export function AdminCeviriler() {
  const { i18n, i18nGuncelle } = useAdminData();
  const [filtre, setFiltre] = useState("");
  const [yeniAnahtar, setYeniAnahtar] = useState("");

  const anahtarlar = useMemo(() => {
    const hepsi = Object.keys(i18n.text ?? {});
    const f = filtre.trim().toLowerCase();
    return f ? hepsi.filter((a) => a.toLowerCase().includes(f)) : hepsi;
  }, [i18n, filtre]);

  const guncelle = (anahtar: string, dil: "ru" | "ar" | "de", deger: string) => {
    i18nGuncelle((onceki) => ({
      text: { ...onceki.text, [anahtar]: { ...onceki.text[anahtar], [dil]: deger } },
    }));
  };

  const sil = (anahtar: string) => {
    i18nGuncelle((onceki) => {
      const kopya = { ...onceki.text };
      delete kopya[anahtar];
      return { text: kopya };
    });
  };

  const ekle = () => {
    const anahtar = yeniAnahtar.trim();
    if (!anahtar || i18n.text[anahtar]) return;
    i18nGuncelle((onceki) => ({ text: { ...onceki.text, [anahtar]: { ru: "", ar: "", de: "" } } }));
    setYeniAnahtar("");
  };

  return (
    <div>
      <h1>Çeviriler (RU / AR / DE)</h1>
      <p className="akdadmin-bolum__aciklama">
        Anahtar, arayüzde <code>t()</code> ile kullanılan tam İngilizce metindir
        — birebir eşleşmezse çeviri uygulanmaz. TR/EN metinleri bu tablonun
        dışında, ilgili bileşenlerin kodunda tutulur.
      </p>

      <input
        className="akdadmin-arama"
        placeholder={`Ara… (${anahtarlar.length}/${Object.keys(i18n.text ?? {}).length})`}
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}
      />

      <div className="akdadmin-ceviri-tablo">
        <div className="akdadmin-ceviri-satir akdadmin-ceviri-satir--baslik">
          <span>İngilizce anahtar</span>
          <span>RU</span>
          <span>AR</span>
          <span>DE</span>
          <span />
        </div>
        {anahtarlar.map((anahtar) => (
          <div key={anahtar} className="akdadmin-ceviri-satir">
            <span className="akdadmin-ceviri-anahtar" title={anahtar}>{anahtar}</span>
            <input value={i18n.text[anahtar]?.ru ?? ""} onChange={(e) => guncelle(anahtar, "ru", e.target.value)} />
            <input value={i18n.text[anahtar]?.ar ?? ""} onChange={(e) => guncelle(anahtar, "ar", e.target.value)} dir="rtl" />
            <input value={i18n.text[anahtar]?.de ?? ""} onChange={(e) => guncelle(anahtar, "de", e.target.value)} />
            <button className="akdadmin-btn akdadmin-btn--tehlike" onClick={() => sil(anahtar)}>Sil</button>
          </div>
        ))}
      </div>

      <div className="akdadmin-menu-satir">
        <input placeholder="Yeni İngilizce anahtar" value={yeniAnahtar} onChange={(e) => setYeniAnahtar(e.target.value)} />
        <button className="akdadmin-btn akdadmin-btn--birincil" onClick={ekle}>+ Ekle</button>
      </div>
    </div>
  );
}
