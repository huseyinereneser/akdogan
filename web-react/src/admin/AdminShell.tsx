import { useRef, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAdminAuth } from "./AdminAuth";
import { useAdminData } from "./useAdminData";

const IKONLAR: Record<string, ReactNode> = {
  genel: (
    <svg viewBox="0 0 24 24"><path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z" fill="none" /></svg>
  ),
  ayarlar: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  ),
  hizmetler: (
    <svg viewBox="0 0 24 24"><path d="M3 13.5 5.5 6h13L21 13.5" /><path d="M4 13.5h16v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5Z" /><circle cx="7.5" cy="18.5" r="1.4" /><circle cx="16.5" cy="18.5" r="1.4" /></svg>
  ),
  galeri: (
    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.6" /><path d="m21 16-5.5-5.5L4 21" /></svg>
  ),
  sayfalar: (
    <svg viewBox="0 0 24 24"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></svg>
  ),
  ceviriler: (
    <svg viewBox="0 0 24 24"><path d="m5 8 6 12M9 8h8M9 8c0 5-2 8-6 10" /><path d="M14 21l4-9 4 9M15.1 18h5.8" /></svg>
  ),
};

const SEKMELER = [
  { to: "/admin", uc: true, etiket: "Genel Bakış", ikon: "genel" },
  { to: "/admin/ayarlar", etiket: "Ayarlar", ikon: "ayarlar" },
  { to: "/admin/hizmetler", etiket: "Hizmetler", ikon: "hizmetler" },
  { to: "/admin/galeri", etiket: "Galeri", ikon: "galeri" },
  { to: "/admin/sayfalar", etiket: "Sayfa Metinleri", ikon: "sayfalar" },
  { to: "/admin/ceviriler", etiket: "Çeviriler", ikon: "ceviriler" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { cikisYap } = useAdminAuth();
  const { siteIndir, i18nIndir, siteIceAktar, i18nIceAktar, hata, yukleniyor } = useAdminData();
  const siteDosyaRef = useRef<HTMLInputElement>(null);
  const i18nDosyaRef = useRef<HTMLInputElement>(null);
  const { pathname } = useLocation();

  const aktifSekme =
    SEKMELER.find((s) => (s.uc ? pathname === s.to : pathname.startsWith(s.to))) ?? SEKMELER[0];

  return (
    <div className="akdadmin-shell">
      <aside className="akdadmin-sidebar">
        <div className="akdadmin-sidebar__marka">
          <div className="akdadmin-sidebar__marka-ikon">A</div>
          <div className="akdadmin-sidebar__marka-metin">
            <strong>Akdoğan Turizm</strong>
            <span>Yönetim Paneli</span>
          </div>
        </div>
        <nav>
          <span className="akdadmin-sidebar__nav-etiket">İçerik</span>
          {SEKMELER.map((s) => (
            <NavLink key={s.to} to={s.to} end={s.uc} className="akdadmin-sidebar__link">
              <span className="akdadmin-sidebar__link-ikon">{IKONLAR[s.ikon]}</span>
              {s.etiket}
            </NavLink>
          ))}
        </nav>
        <div className="akdadmin-sidebar__alt">
          <div className="akdadmin-sidebar__kullanici">
            <div className="akdadmin-sidebar__avatar">Y</div>
            <div className="akdadmin-sidebar__kullanici-metin">
              <strong>Yönetici</strong>
              <span>Yerel oturum</span>
            </div>
          </div>
          <button className="akdadmin-btn akdadmin-btn--ikon" onClick={cikisYap} title="Çıkış yap" aria-label="Çıkış yap">
            <svg viewBox="0 0 24 24"><path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>
          </button>
        </div>
      </aside>

      <div className="akdadmin-main">
        <div className="akdadmin-topbar">
          <div className="akdadmin-topbar__baslik">
            <span className="akdadmin-topbar__kirinti">Panel / {aktifSekme.etiket}</span>
            <strong>{aktifSekme.etiket}</strong>
            <p>
              Değişiklikler yalnızca bu tarayıcıda saklanır. Siteye yansıması için <strong>indirin</strong>, dosyaları repoya koyup deploy edin.
            </p>
          </div>
          <div className="akdadmin-topbar__aksiyonlar">
            <button className="akdadmin-btn" onClick={() => siteDosyaRef.current?.click()}>
              <svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
              site.json içe aktar
            </button>
            <input
              ref={siteDosyaRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => {
                const dosya = e.target.files?.[0];
                if (dosya) siteIceAktar(dosya).catch((err) => alert(String(err?.message || err)));
                e.target.value = "";
              }}
            />
            <button className="akdadmin-btn" onClick={() => i18nDosyaRef.current?.click()}>
              <svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
              çeviri içe aktar
            </button>
            <input
              ref={i18nDosyaRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => {
                const dosya = e.target.files?.[0];
                if (dosya) i18nIceAktar(dosya).catch((err) => alert(String(err?.message || err)));
                e.target.value = "";
              }}
            />
            <span className="akdadmin-topbar__ayrac" aria-hidden="true" />
            <button className="akdadmin-btn akdadmin-btn--birincil" onClick={siteIndir}>
              <svg viewBox="0 0 24 24"><path d="M12 4v12M7 11l5 5 5-5" /><path d="M4 20h16" /></svg>
              site.json indir
            </button>
            <button className="akdadmin-btn akdadmin-btn--birincil" onClick={i18nIndir}>
              <svg viewBox="0 0 24 24"><path d="M12 4v12M7 11l5 5 5-5" /><path d="M4 20h16" /></svg>
              Çevirileri indir
            </button>
          </div>
        </div>

        {hata && <p className="akdadmin-hata">Yükleme hatası: {hata}</p>}
        {yukleniyor ? <p className="akdadmin-yukleniyor">Yükleniyor…</p> : <div className="akdadmin-icerik">{children}</div>}
      </div>
    </div>
  );
}
