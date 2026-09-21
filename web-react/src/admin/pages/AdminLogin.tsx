import { useState, type FormEvent } from "react";
import { useAdminAuth } from "../AdminAuth";

export function AdminLogin() {
  const { girisYap, sifreTanimliMi } = useAdminAuth();
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState(false);
  const [goster, setGoster] = useState(false);

  if (!sifreTanimliMi) {
    return (
      <div className="akdadmin-login">
        <div className="akdadmin-login__form-alani">
          <div className="akdadmin-login__kutu akdadmin-login__kutu--tek">
            <h1>Panel şifresi tanımlı değil</h1>
            <p className="akdadmin-login__not">
              <code>web-react/.env</code> dosyasında{" "}
              <code>VITE_ADMIN_PASSWORD</code> tanımlayıp geliştirme
              sunucusunu (veya derlemeyi) yeniden başlatın.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const gonder = (e: FormEvent) => {
    e.preventDefault();
    const ok = girisYap(kullaniciAdi, sifre);
    setHata(!ok);
    if (!ok) setSifre("");
  };

  return (
    <div className="akdadmin-login">
      <aside className="akdadmin-login__tanitim" aria-hidden="true">
        <div className="akdadmin-login__tanitim-icerik">
          <div className="akdadmin-login__monogram">A</div>
          <div className="akdadmin-login__marka">AKDOĞAN TURİZM</div>
          <h2>
            Her yolculuk,
            <br />
            tek merkezde.
          </h2>
          <p>Site içeriğinizi ve ayarlarınızı tek bir panelden yönetin.</p>
          <div className="akdadmin-login__guven">
            <span className="akdadmin-login__guven-ikon">✓</span>
            <span>
              <strong>Yalnızca bu tarayıcı</strong>
              <small>Gerçek kullanıcı doğrulaması yapılmaz</small>
            </span>
          </div>
        </div>
      </aside>

      <main className="akdadmin-login__form-alani">
        <form className="akdadmin-login__kutu" onSubmit={gonder}>
          <div className="akdadmin-login__etiket">YÖNETİM PANELİ</div>
          <h1>Tekrar hoş geldiniz</h1>
          <p className="akdadmin-login__aciklama">
            Devam etmek için yönetici hesabınızla giriş yapın.
          </p>

          <label htmlFor="akd-kadi">Kullanıcı adı</label>
          <input
            id="akd-kadi"
            type="text"
            autoFocus
            autoCapitalize="off"
            spellCheck={false}
            value={kullaniciAdi}
            onChange={(e) => {
              setKullaniciAdi(e.target.value);
              setHata(false);
            }}
          />

          <label htmlFor="akd-sifre">Şifre</label>
          <div className="akdadmin-sifre-alani">
            <input
              id="akd-sifre"
              type={goster ? "text" : "password"}
              value={sifre}
              onChange={(e) => {
                setSifre(e.target.value);
                setHata(false);
              }}
            />
            <button
              type="button"
              className={`akdadmin-sifre-goster${goster ? " is-acik" : ""}`}
              onClick={() => setGoster((g) => !g)}
              aria-label={goster ? "Şifreyi gizle" : "Şifreyi göster"}
              title={goster ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {goster ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="m3 3 18 18M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-3.2 3.8M6.2 6.8C3.8 8.4 2.5 12 2.5 12s3.5 6 9.5 6c1.1 0 2.1-.2 3-.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
              )}
            </button>
          </div>

          {hata && (
            <p className="akdadmin-login__hata">Kullanıcı adı veya şifre hatalı.</p>
          )}

          <button
            className="akdadmin-btn akdadmin-btn--birincil akdadmin-login__buton"
            type="submit"
          >
            <span aria-hidden="true">♢</span> Güvenli giriş yap
          </button>

          <p className="akdadmin-login__not">
            Bu panel yalnızca bu tarayıcıda çalışır; gerçek bir kullanıcı
            doğrulaması yapılmaz. Kurumsal tanıtım sitesi için basit bir
            erişim kapısıdır.
          </p>
        </form>
      </main>
    </div>
  );
}
