import { useState } from "react";
import { useAdminData } from "../useAdminData";
import { Alan, AlanOnayKutusu, AlanTextarea, Bolum } from "../fields";
import type { SiteData } from "../types";

function alanGuncelle<K extends keyof SiteData>(
  siteyiGuncelle: (f: (onceki: SiteData) => SiteData) => void,
  bolum: K,
  anahtar: string,
  deger: string
) {
  siteyiGuncelle((onceki) => ({
    ...onceki,
    [bolum]: { ...(onceki[bolum] as Record<string, unknown>), [anahtar]: deger },
  }));
}

export function AdminAyarlar() {
  const { site, siteyiGuncelle } = useAdminData();
  const [yeniGorselAnahtar, setYeniGorselAnahtar] = useState("");

  if (!site) return null;

  return (
    <div>
      <h1>Ayarlar</h1>

      <Bolum baslik="İletişim">
        <div className="akdadmin-izgara">
          <Alan etiket="Telefon" value={site.iletisim.telefon ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "iletisim", "telefon", v)} />
          <Alan etiket="GSM" value={site.iletisim.gsm ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "iletisim", "gsm", v)} />
          <Alan etiket="WhatsApp" value={site.iletisim.whatsapp ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "iletisim", "whatsapp", v)} />
          <Alan etiket="E-posta" value={site.iletisim.eposta ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "iletisim", "eposta", v)} />
        </div>
        <AlanTextarea etiket="Adres" value={site.iletisim.adres ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "iletisim", "adres", v)} satir={2} />
        <div className="akdadmin-izgara">
          <Alan etiket="Çalışma saatleri (TR)" value={site.iletisim.saatler_tr ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "iletisim", "saatler_tr", v)} />
          <Alan etiket="Çalışma saatleri (EN)" value={site.iletisim.saatler_en ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "iletisim", "saatler_en", v)} />
        </div>
      </Bolum>

      <Bolum baslik="Sosyal Medya">
        <div className="akdadmin-izgara">
          {(["facebook", "instagram", "x", "youtube", "linkedin"] as const).map((k) => (
            <Alan key={k} etiket={k} value={site.sosyal[k] ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "sosyal", k, v)} />
          ))}
        </div>
      </Bolum>

      <Bolum baslik="SEO">
        <div className="akdadmin-izgara">
          <Alan etiket="Başlık (TR)" value={site.seo.baslik_tr ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "seo", "baslik_tr", v)} />
          <Alan etiket="Başlık (EN)" value={site.seo.baslik_en ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "seo", "baslik_en", v)} />
        </div>
        <AlanTextarea etiket="Açıklama (TR)" value={site.seo.aciklama_tr ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "seo", "aciklama_tr", v)} satir={2} />
        <AlanTextarea etiket="Açıklama (EN)" value={site.seo.aciklama_en ?? ""} onChange={(v) => alanGuncelle(siteyiGuncelle, "seo", "aciklama_en", v)} satir={2} />
      </Bolum>

      <Bolum baslik="Görünüm" aciklama="Vurgu rengi ve köşe yuvarlaklığı.">
        <div className="akdadmin-izgara">
          <label className="akdadmin-alan">
            <span>Vurgu rengi</span>
            <input type="color" value={site.gorunum.accent ?? "#e31e25"} onChange={(e) => alanGuncelle(siteyiGuncelle, "gorunum", "accent", e.target.value)} />
          </label>
          <label className="akdadmin-alan">
            <span>Vurgu rengi (koyu)</span>
            <input type="color" value={site.gorunum.accent_dark ?? "#b8171d"} onChange={(e) => alanGuncelle(siteyiGuncelle, "gorunum", "accent_dark", e.target.value)} />
          </label>
          <label className="akdadmin-alan">
            <span>Köşe yuvarlaklığı (px)</span>
            <input
              type="number"
              min={0}
              max={24}
              value={site.gorunum.radius ?? 4}
              onChange={(e) =>
                siteyiGuncelle((onceki) => ({ ...onceki, gorunum: { ...onceki.gorunum, radius: Number(e.target.value) } }))
              }
            />
          </label>
        </div>
      </Bolum>

      <Bolum baslik="Logo">
        <Alan etiket="Logo yolu" value={site.marka.logo ?? ""} onChange={(v) => siteyiGuncelle((onceki) => ({ ...onceki, marka: { ...onceki.marka, logo: v } }))} />
      </Bolum>

      <Bolum baslik="Sayfa görselleri" aciklama="assets/img/ altındaki mevcut bir dosyanın yolunu yazın (görsel yükleme yok — dosyayı önce repoya ekleyin).">
        <div className="akdadmin-gorsel-liste">
          {Object.entries(site.gorseller).map(([anahtar, deger]) => (
            <div key={anahtar} className="akdadmin-gorsel-satir">
              <span className="akdadmin-gorsel-anahtar">{anahtar}</span>
              <input
                value={deger}
                onChange={(e) =>
                  siteyiGuncelle((onceki) => ({ ...onceki, gorseller: { ...onceki.gorseller, [anahtar]: e.target.value } }))
                }
              />
              {deger && <img className="akdadmin-onizleme" src={`/${deger}`} alt="" />}
              <button
                type="button"
                className="akdadmin-btn akdadmin-btn--tehlike"
                onClick={() =>
                  siteyiGuncelle((onceki) => {
                    const kopya = { ...onceki.gorseller };
                    delete kopya[anahtar];
                    return { ...onceki, gorseller: kopya };
                  })
                }
              >
                Sil
              </button>
            </div>
          ))}
        </div>
        <div className="akdadmin-gorsel-satir">
          <input placeholder="yeni anahtar (ör. page_yeni)" value={yeniGorselAnahtar} onChange={(e) => setYeniGorselAnahtar(e.target.value)} />
          <button
            type="button"
            className="akdadmin-btn"
            onClick={() => {
              const anahtar = yeniGorselAnahtar.trim();
              if (!anahtar) return;
              siteyiGuncelle((onceki) => ({ ...onceki, gorseller: { ...onceki.gorseller, [anahtar]: "" } }));
              setYeniGorselAnahtar("");
            }}
          >
            Ekle
          </button>
        </div>
      </Bolum>

      <Bolum baslik="Menü" aciklama="Menü öğeleri sabittir (sitedeki sayfalarla eşleşir); yalnızca etiket ve görünürlük düzenlenebilir.">
        {Object.entries(site.menu).map(([anahtar, oge]) => (
          <div key={anahtar} className="akdadmin-menu-satir">
            <span className="akdadmin-gorsel-anahtar">{anahtar}</span>
            <input
              value={oge.tr}
              onChange={(e) =>
                siteyiGuncelle((onceki) => ({ ...onceki, menu: { ...onceki.menu, [anahtar]: { ...onceki.menu[anahtar], tr: e.target.value } } }))
              }
            />
            <input
              value={oge.en}
              onChange={(e) =>
                siteyiGuncelle((onceki) => ({ ...onceki, menu: { ...onceki.menu, [anahtar]: { ...onceki.menu[anahtar], en: e.target.value } } }))
              }
            />
            <AlanOnayKutusu
              etiket="Görünür"
              value={oge.aktif !== false}
              onChange={(v) =>
                siteyiGuncelle((onceki) => ({ ...onceki, menu: { ...onceki.menu, [anahtar]: { ...onceki.menu[anahtar], aktif: v } } }))
              }
            />
          </div>
        ))}
      </Bolum>

      <Bolum baslik="Ana sayfa bölümleri" aciklama="Ana sayfada hangi bölümlerin görüneceğini seçin.">
        <div className="akdadmin-izgara">
          {Object.entries(site.bolumler).map(([anahtar, deger]) => (
            <AlanOnayKutusu
              key={anahtar}
              etiket={anahtar}
              value={deger}
              onChange={(v) => siteyiGuncelle((onceki) => ({ ...onceki, bolumler: { ...onceki.bolumler, [anahtar]: v } }))}
            />
          ))}
        </div>
      </Bolum>
    </div>
  );
}
