# Akdoğan Turizm — React sürümü

Sitenin tamamı bu klasördedir (Vite + React). Eski statik HTML sürümü ve
kökteki PHP paneli kaldırıldı; yerine buradaki `admin/` klasörü geçti.

## Yığın

- **Vite 5** + **React 18** + **TypeScript**
- **React Router 6** — tüm sayfalar tek uygulamada
- Tasarım: mevcut `assets/css/style.css` olduğu gibi kullanılıyor (kopyası
  `public/assets/` altında)
- i18n: `src/i18n/` — 5 dil (TR/EN/RU/AR/DE) + RTL + Arap-Hint rakamları.
  RU/AR/DE sözlükleri eski `assets/i18n/{ru,ar,de}.json` dosyalarından
  değiştirilmeden okunur.

## Komutlar

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc + vite build → dist/
npm run preview   # dist/ önizleme
```

### Formlar

Varsayılan hedef **Netlify Forms**'tur (arka uç gerektirmez). Form tanımları
`public/__forms.html` içinde; React formu FormData'yı `/` adresine POST eder ve
`form-name` ile eşleştirir. Netlify panelinde gönderimler _Forms_ sekmesinde
görünür; e-posta bildirimi oradan açılır.

Yerelde eski `gonder.php` ile test için `.env.example` → `.env` kopyalayıp
`VITE_FORMS_MODE=php` yapın.

## Yönetim paneli (`admin/`)

PHP tabanlı, veritabanısız içerik paneli. **Yalnızca yerelde çalışır** (Netlify
statik hosting PHP çalıştırmaz) — içerik burada düzenlenir, sonuç `git` ile
yayınlanır.

```powershell
cd "web-react/admin"
php -S localhost:8000        # -t verme; boşluklu yol PHP'nin dahili sunucusunu bozuyor
```

Sonra: **http://localhost:8000/** → giriş ekranı.

- Panel doğrudan `web-react/public/assets/data/site.json` dosyasını ve
  `web-react/public/assets/img/` görsellerini düzenler (yol ayarı:
  `admin/inc/on.php` → `SITE_KOK`).
- React uygulaması bu `site.json`'u çalışma anında `fetch` eder
  (`src/lib/site.ts`), yani panelde kaydettiğin an `npm run dev` sayfaları
  güncellenir.
- **Yayınlama akışı:** panelde düzenle → `git add -A && git commit` →
  `git push` → Netlify yeniden derler.
- `admin/veri/` içindeki içerik dosyaları (`ayarlar/hizmetler/galeri/sayfalar.json`)
  git'te izlenir; hassas dosyalar (`users.json`, `talepler/`, `gunluk.jsonl`,
  kilitler) `.gitignore` ile hariç tutulur.
- Panel verisi `site.json` ile eşitlenmiştir (4 hizmet, 11 galeri). İçerik
  dosyalarını elden düzenlersen ikisini tutarlı tut.

## Taşıma durumu

| Alan | Durum |
| --- | --- |
| Ortak kabuk (header, footer, tema, mobil menü, dil menüsü) | ✅ tamam |
| Dil menüsü — hover ile açılma + açılış animasyonu | ✅ tamam |
| i18n çekirdeği (context, sözlük yükleme, RTL, rakamlar) | ✅ tamam |
| 16 sayfanın tamamı (ana sayfa + 15 alt sayfa + 404) | ✅ tamam |
| Formlar (teklif / İK başvuru / yorum) → Netlify Forms (veya `gonder.php`) | ✅ tamam |
| `_redirects` (SPA fallback), `robots.txt`, `sitemap.xml` → `public/` | ✅ tamam |
| Galeri filtre + ışık kutusu, SSS akordiyon, dosya yükleme alanı | ✅ tamam |
| DE/RTL doğrulaması (Playwright ekran görüntüleri, konsol hatası yok) | ✅ tamam |
| CMS köprüsü (`icerik.js` → `site.json` içerik enjeksiyonu) | ⏳ sonraki adım |
| Kalıcı SEO (prerender / SSG / react-helmet) | ⏳ değerlendirilecek |

### Notlar
- `skip-link` görünmez deseni RTL'de yatay taşma yapıyordu; `left:-9999px`
  yerine `clip-path` kullanan modern desene çevrildi (yalnızca bu klasördeki
  `public/assets/css/style.css` kopyasında).
- Çeviri sözlükleri kısmen dolu; AR/RU/DE'de karşılığı olmayan dizeler
  İngilizce'ye düşer (orijinal davranışın aynısı).
- Google Maps iframe'i geliştirmede yavaş/boş görünebilir; canlı ortamda
  yüklenir.

## Yapı

```
src/
  main.tsx            uygulama girişi (Router + I18nProvider)
  App.tsx             rota tablosu (16 rota)
  i18n/               dil listesi, sağlayıcı, çeviri yardımcıları, <T>/<Html>
  hooks/              useTheme, useStuckHeader, useMediaQuery
  components/         Layout, Header, Footer, LangMenu, ThemeToggle, CallFab,
                      Reveal, CountUp, PageMeta, PageHero, SectionHead,
                      StatsBand, CtaSection, Gallery, Faq
  components/form/    AkForm + Field/TextArea/Select/Conditional/FileField/
                      SubmitBlock (doğrulama + gonder.php AJAX)
  lib/nav.ts          ana menü verisi
  pages/              16 sayfa bileşeni (Home, Hakkimizda, … , NotFound)
public/assets/        css / img / i18n / data (eski kökten kopya)
```
