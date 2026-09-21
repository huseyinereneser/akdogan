import { useAdminData } from "../useAdminData";
import { Alan } from "../fields";
import type { SiteGaleriKategori, SiteGaleriOge } from "../types";

function bosGorsel(sira: number, kategori: string): SiteGaleriOge {
  return { id: `g${Date.now()}`, sira, dosya: "", kategori, baslik_tr: "", baslik_en: "" };
}

function bosKategori(): SiteGaleriKategori {
  return { anahtar: "", ad_tr: "", ad_en: "" };
}

export function AdminGaleri() {
  const { site, siteyiGuncelle } = useAdminData();
  if (!site) return null;

  const liste = [...site.galeri].sort((a, b) => a.sira - b.sira);

  const guncelle = (i: number, degisiklik: Partial<SiteGaleriOge>) => {
    siteyiGuncelle((onceki) => ({
      ...onceki,
      galeri: onceki.galeri.map((g) => (g === liste[i] ? { ...g, ...degisiklik } : g)),
    }));
  };

  const sil = (i: number) => {
    if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return;
    siteyiGuncelle((onceki) => ({ ...onceki, galeri: onceki.galeri.filter((g) => g !== liste[i]) }));
  };

  const ekle = () => {
    siteyiGuncelle((onceki) => ({
      ...onceki,
      galeri: [
        ...onceki.galeri,
        bosGorsel((onceki.galeri.length ? Math.max(...onceki.galeri.map((g) => g.sira)) : 0) + 1, onceki.galeri_kategoriler[0]?.anahtar ?? ""),
      ],
    }));
  };

  const kategoriGuncelle = (i: number, degisiklik: Partial<SiteGaleriKategori>) => {
    siteyiGuncelle((onceki) => ({
      ...onceki,
      galeri_kategoriler: onceki.galeri_kategoriler.map((k, idx) => (idx === i ? { ...k, ...degisiklik } : k)),
    }));
  };

  const kategoriSil = (i: number) => {
    siteyiGuncelle((onceki) => ({ ...onceki, galeri_kategoriler: onceki.galeri_kategoriler.filter((_, idx) => idx !== i) }));
  };

  return (
    <div>
      <h1>Galeri</h1>

      <section className="akdadmin-bolum">
        <h2>Kategoriler</h2>
        {site.galeri_kategoriler.map((k, i) => (
          <div key={i} className="akdadmin-menu-satir">
            <input placeholder="anahtar" value={k.anahtar} onChange={(e) => kategoriGuncelle(i, { anahtar: e.target.value })} />
            <input placeholder="ad (TR)" value={k.ad_tr} onChange={(e) => kategoriGuncelle(i, { ad_tr: e.target.value })} />
            <input placeholder="name (EN)" value={k.ad_en} onChange={(e) => kategoriGuncelle(i, { ad_en: e.target.value })} />
            <button className="akdadmin-btn akdadmin-btn--tehlike" onClick={() => kategoriSil(i)}>Sil</button>
          </div>
        ))}
        <button className="akdadmin-btn" onClick={() => siteyiGuncelle((onceki) => ({ ...onceki, galeri_kategoriler: [...onceki.galeri_kategoriler, bosKategori()] }))}>
          + Yeni kategori
        </button>
      </section>

      <section className="akdadmin-bolum">
        <h2>Görseller</h2>
        <div className="akdadmin-galeri-izgara">
          {liste.map((g, i) => (
            <div key={g.id} className="akdadmin-galeri-kart">
              {g.dosya && <img className="akdadmin-onizleme akdadmin-onizleme--buyuk" src={`/${g.dosya}`} alt="" />}
              <Alan etiket="Dosya yolu" value={g.dosya} onChange={(v) => guncelle(i, { dosya: v })} />
              <label className="akdadmin-alan">
                <span>Kategori</span>
                <select value={g.kategori} onChange={(e) => guncelle(i, { kategori: e.target.value })}>
                  {site.galeri_kategoriler.map((k) => (
                    <option key={k.anahtar} value={k.anahtar}>{k.ad_tr || k.anahtar}</option>
                  ))}
                </select>
              </label>
              <Alan etiket="Başlık (TR)" value={g.baslik_tr} onChange={(v) => guncelle(i, { baslik_tr: v })} />
              <Alan etiket="Başlık (EN)" value={g.baslik_en} onChange={(v) => guncelle(i, { baslik_en: v })} />
              <Alan etiket="Sıra" tip="number" value={String(g.sira)} onChange={(v) => guncelle(i, { sira: Number(v) || 0 })} />
              <button className="akdadmin-btn akdadmin-btn--tehlike" onClick={() => sil(i)}>Sil</button>
            </div>
          ))}
        </div>
        <button className="akdadmin-btn akdadmin-btn--birincil" onClick={ekle}>
          + Yeni görsel ekle
        </button>
      </section>
    </div>
  );
}
