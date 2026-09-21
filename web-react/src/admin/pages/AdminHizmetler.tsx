import { useAdminData } from "../useAdminData";
import { Alan, AlanTextarea } from "../fields";
import type { SiteHizmet } from "../types";

function bosHizmet(sira: number): SiteHizmet {
  return {
    id: `hizmet-${Date.now()}`,
    sira,
    gorsel: "",
    tr: { baslik: "", ozet: "", detay: "" },
    en: { baslik: "", ozet: "", detay: "" },
  };
}

export function AdminHizmetler() {
  const { site, siteyiGuncelle } = useAdminData();
  if (!site) return null;

  const liste = [...site.hizmetler].sort((a, b) => a.sira - b.sira);

  const guncelle = (i: number, degisiklik: Partial<SiteHizmet>) => {
    siteyiGuncelle((onceki) => {
      const yeni = onceki.hizmetler.map((h) => (h === liste[i] ? { ...h, ...degisiklik } : h));
      return { ...onceki, hizmetler: yeni };
    });
  };

  const dilGuncelle = (i: number, dil: "tr" | "en", alan: keyof SiteHizmet["tr"], deger: string) => {
    guncelle(i, { [dil]: { ...liste[i][dil], [alan]: deger } } as Partial<SiteHizmet>);
  };

  const sil = (i: number) => {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    siteyiGuncelle((onceki) => ({ ...onceki, hizmetler: onceki.hizmetler.filter((h) => h !== liste[i]) }));
  };

  const taşi = (i: number, yon: -1 | 1) => {
    const hedef = i + yon;
    if (hedef < 0 || hedef >= liste.length) return;
    const yeniSiralar = liste.map((h, idx) => {
      if (idx === i) return { ...h, sira: liste[hedef].sira };
      if (idx === hedef) return { ...h, sira: liste[i].sira };
      return h;
    });
    siteyiGuncelle((onceki) => ({
      ...onceki,
      hizmetler: onceki.hizmetler.map((h) => yeniSiralar.find((y) => y.id === h.id) ?? h),
    }));
  };

  const ekle = () => {
    siteyiGuncelle((onceki) => ({
      ...onceki,
      hizmetler: [...onceki.hizmetler, bosHizmet((onceki.hizmetler.length ? Math.max(...onceki.hizmetler.map((h) => h.sira)) : 0) + 1)],
    }));
  };

  return (
    <div>
      <h1>Hizmetler</h1>
      {liste.map((h, i) => (
        <section key={h.id} className="akdadmin-bolum">
          <div className="akdadmin-kart-baslik">
            <h2>{h.tr.baslik || "(başlıksız hizmet)"}</h2>
            <div className="akdadmin-kart-aksiyonlar">
              <button className="akdadmin-btn" onClick={() => taşi(i, -1)} disabled={i === 0}>↑</button>
              <button className="akdadmin-btn" onClick={() => taşi(i, 1)} disabled={i === liste.length - 1}>↓</button>
              <button className="akdadmin-btn akdadmin-btn--tehlike" onClick={() => sil(i)}>Sil</button>
            </div>
          </div>
          <div className="akdadmin-izgara">
            <Alan etiket="Kimlik (id)" value={h.id} onChange={(v) => guncelle(i, { id: v })} />
            <Alan etiket="Görsel yolu" value={h.gorsel ?? ""} onChange={(v) => guncelle(i, { gorsel: v })} />
          </div>
          <div className="akdadmin-iki-dil">
            <div>
              <h3>Türkçe</h3>
              <Alan etiket="Başlık" value={h.tr.baslik} onChange={(v) => dilGuncelle(i, "tr", "baslik", v)} />
              <AlanTextarea etiket="Özet" value={h.tr.ozet} onChange={(v) => dilGuncelle(i, "tr", "ozet", v)} satir={2} />
              <AlanTextarea etiket="Detay" value={h.tr.detay} onChange={(v) => dilGuncelle(i, "tr", "detay", v)} satir={4} />
            </div>
            <div>
              <h3>English</h3>
              <Alan etiket="Title" value={h.en.baslik} onChange={(v) => dilGuncelle(i, "en", "baslik", v)} />
              <AlanTextarea etiket="Summary" value={h.en.ozet} onChange={(v) => dilGuncelle(i, "en", "ozet", v)} satir={2} />
              <AlanTextarea etiket="Detail" value={h.en.detay} onChange={(v) => dilGuncelle(i, "en", "detay", v)} satir={4} />
            </div>
          </div>
        </section>
      ))}
      <button className="akdadmin-btn akdadmin-btn--birincil" onClick={ekle}>
        + Yeni hizmet ekle
      </button>
    </div>
  );
}
