# Akdoğan Turizm — React sürümü

Mevcut statik site (`../`) React'a taşınıyor. Bu klasör bağımsızdır; eski site
çalışmaya devam eder.

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

Formlar (`gonder.php`) ve panelin ürettiği `assets/data/site.json` için
geliştirmede PHP sunucusu gerekir; `vite.config.ts` içindeki `proxy`
`http://localhost:8000` adresine yönlendirir (`php -S localhost:8000` eski kökte).

## Taşıma durumu

| Alan | Durum |
| --- | --- |
| Ortak kabuk (header, footer, tema, mobil menü, dil menüsü) | ✅ tamam |
| Dil menüsü — hover ile açılma + açılış animasyonu | ✅ tamam |
| i18n çekirdeği (context, sözlük yükleme, RTL, rakamlar) | ✅ tamam |
| 16 sayfanın tamamı (ana sayfa + 15 alt sayfa + 404) | ✅ tamam |
| Formlar (teklif / İK başvuru / yorum) → `gonder.php` AJAX | ✅ tamam |
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
