import { useAdminData } from "../useAdminData";

const KART_IKONLARI = {
  hizmet: (
    <svg viewBox="0 0 24 24"><path d="M3 13.5 5.5 6h13L21 13.5" /><path d="M4 13.5h16v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5Z" /><circle cx="7.5" cy="18.5" r="1.4" /><circle cx="16.5" cy="18.5" r="1.4" /></svg>
  ),
  galeri: (
    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="m21 16-5.5-5.5L4 21" /></svg>
  ),
  sayfa: (
    <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></svg>
  ),
  ceviri: (
    <svg viewBox="0 0 24 24"><path d="m5 8 6 12M9 8h8M9 8c0 5-2 8-6 10" /><path d="M14 21l4-9 4 9M15.1 18h5.8" /></svg>
  ),
};

export function AdminPanel() {
  const { site, i18n } = useAdminData();

  return (
    <div>
      <h1>Genel Bakış</h1>

      <div className="akdadmin-kartlar">
        <div className="akdadmin-kart">
          <div className="akdadmin-kart__ikon akdadmin-kart__ikon--kirmizi">{KART_IKONLARI.hizmet}</div>
          <strong>{site?.hizmetler?.length ?? 0}</strong>
          <span>Hizmet</span>
        </div>
        <div className="akdadmin-kart">
          <div className="akdadmin-kart__ikon akdadmin-kart__ikon--mavi">{KART_IKONLARI.galeri}</div>
          <strong>{site?.galeri?.length ?? 0}</strong>
          <span>Galeri görseli</span>
        </div>
        <div className="akdadmin-kart">
          <div className="akdadmin-kart__ikon akdadmin-kart__ikon--mor">{KART_IKONLARI.sayfa}</div>
          <strong>{Object.keys(site?.sayfalar ?? {}).length}</strong>
          <span>Düzenlenebilir sayfa</span>
        </div>
        <div className="akdadmin-kart">
          <div className="akdadmin-kart__ikon akdadmin-kart__ikon--yesil">{KART_IKONLARI.ceviri}</div>
          <strong>{Object.keys(i18n.text ?? {}).length}</strong>
          <span>Çeviri satırı</span>
        </div>
      </div>

      <section className="akdadmin-bolum">
        <h2>Nasıl çalışır?</h2>
        <ol className="akdadmin-adimlar">
          <li>Soldaki sekmelerden içeriği düzenleyin — değişiklikler anında bu tarayıcıda saklanır.</li>
          <li>Üstteki <strong>"site.json indir"</strong> / <strong>"Çevirileri indir"</strong> ile güncel dosyaları indirin.</li>
          <li>
            İndirilen dosyaları sırasıyla <code>public/assets/data/site.json</code> ve{" "}
            <code>public/assets/i18n/{"{ru,ar,de}"}.json</code> yerine koyun.
          </li>
          <li><code>git add -A && git commit && git push</code> ile yayınlayın — Netlify otomatik derler.</li>
        </ol>
        <p className="akdadmin-bolum__aciklama">
          Bu site sunucusuz (statik) yayınlandığı için panel canlı sunucuya
          doğrudan yazamaz; yukarıdaki indir → repo → deploy akışı içerik
          güncellemesinin tek yoludur.
        </p>
      </section>

      <section className="akdadmin-bolum">
        <h2>Form gönderimleri (Talepler)</h2>
        <p className="akdadmin-bolum__aciklama">
          Teklif, iş başvurusu ve yorum formları doğrudan <strong>Netlify
          Forms</strong>'a gider; bu panelde ayrıca listelenmez (sunucusuz
          mimaride mümkün değil). Gönderimleri görmek için Netlify hesabınızda
          ilgili sitenin <strong>Forms</strong> sekmesini açın.
        </p>
      </section>
    </div>
  );
}
