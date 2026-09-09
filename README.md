# Akdoğan Turizm — Kurumsal Web Sitesi

React + Vite ile geliştirilen tek sayfa uygulaması. Tüm kaynak kod
[`web-react/`](web-react/) klasöründedir.

> Not: Eski statik HTML sitesi ve PHP yönetim paneli bu depodan kaldırıldı.
> Geçmiş sürüme `git log` üzerinden ulaşılabilir.

## Çalıştırma

```bash
cd web-react
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc + vite build → dist/
npm run preview   # dist/ önizleme
```

## Yayın

Netlify üzerinden yayınlanır — ayarlar kökteki [`netlify.toml`](netlify.toml)
dosyasındadır (`base = "web-react"`, `publish = "web-react/dist"`).

## Ayrıntılar

Yığın, klasör yapısı, i18n (TR/EN/RU/AR/DE + RTL) ve form yapılandırması için
[`web-react/README.md`](web-react/README.md) dosyasına bakın.
