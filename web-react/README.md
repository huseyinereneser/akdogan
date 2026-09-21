# Akdoğan Turizm — React sürümü

Sitenin tamamı bu klasördedir (Vite + React) — yönetim paneli dahil, tek
uygulama, tek deployment. Ayrı bir backend/sunucu yoktur (site sadece tanıtım
amaçlı statik bir site olduğu için); PHP tabanlı panel tamamen kaldırılmıştır.

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

## Yönetim paneli (`/admin`)

Ayrı bir backend/sunucu yok — panel bu React uygulamasının içinde, istemci
tarafında çalışan bir rotadır (`src/admin/`). `npm run dev` çalışırken
**http://localhost:5173/admin** adresinden, canlıda ise
**https://siteadresi.com/admin** adresinden aynı şekilde erişilir; ayrı bir
sunucu başlatmaya gerek yoktur.

- **Giriş:** basit bir şifre kapısı (`.env` → `VITE_ADMIN_PASSWORD`).
  Sunucu-taraflı doğrulama olmadığından bu **gerçek bir güvenlik önlemi
  değildir** — derlenen JS içinde görülebilir/aşılabilir. Tanıtım sitesi için
  meraklı ziyaretçiyi caydırma amaçlıdır; hassas veri barındırmaz.
- **Ne düzenlenir:** iletişim/sosyal/SEO/görünüm ayarları, menü ve ana sayfa
  bölüm görünürlüğü, hizmetler, galeri, sayfa metinleri, RU/AR/DE çevirileri.
- **Kalıcılık:** statik hosting'te (Netlify) sunucuya kalıcı yazma imkânı
  yoktur. Panel değişiklikleri yalnızca o an açık olan tarayıcıda
  (`localStorage`) saklanır. Siteye yansıtmak için:
  1. Panelde düzenleyin.
  2. Üstteki **"site.json indir"** / **"Çevirileri indir"** ile dosyaları indirin.
  3. İndirilenleri `public/assets/data/site.json` ve
     `public/assets/i18n/{ru,ar,de}.json` yerine koyun.
  4. `git add -A && git commit && git push` — Netlify otomatik derler.
- **Form gönderimleri (Talepler):** panelde listelenmez; Netlify Forms'un
  kendi panosundan (sitenizin Netlify hesabı → *Forms* sekmesi) görüntülenir.

## Taşıma durumu

| Alan | Durum |
| --- | --- |
| Ortak kabuk (header, footer, tema, mobil menü, dil menüsü) | ✅ tamam |
| Dil menüsü — hover ile açılma + açılış animasyonu | ✅ tamam |
| i18n çekirdeği (context, sözlük yükleme, RTL, rakamlar) | ✅ tamam |
| 16 sayfanın tamamı (ana sayfa + 15 alt sayfa + 404) | ✅ tamam |
| Formlar (teklif / İK başvuru / yorum) → Netlify Forms | ✅ tamam |
| Yönetim paneli (`/admin`, backend'siz, istemci taraflı) | ✅ tamam |
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
                      SubmitBlock (doğrulama + Netlify Forms POST)
  admin/              /admin paneli (backend'siz, bkz. "Yönetim paneli")
  lib/nav.ts          ana menü verisi
  pages/              16 sayfa bileşeni (Home, Hakkimizda, … , NotFound)
public/assets/        css / img / i18n / data (eski kökten kopya)
```
