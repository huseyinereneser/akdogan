# Akdoğan Turizm — Kurumsal Web Sitesi

Statik (HTML/CSS/JS) kurumsal web sitesi. Çerçeve veya derleme adımı yok —
dosyaları herhangi bir web sunucusuna kopyalayarak yayına alabilirsiniz.

## Dosya yapısı

```
index.html                  Ana sayfa
hakkimizda.html             Şirket hikayesi, zaman çizelgesi, misyon/vizyon, değerler
kadromuz.html               Yönetim kadrosu ve sürücü kadrosu
belgeler.html               Yetki belgeleri, sigorta ve yasal evraklar
hesap-numaralarimiz.html    Banka / IBAN bilgileri
kvkk.html                   KVKK aydınlatma metni
hizmetler.html              6 hizmetin detayı (#anchor bağlantılı) + SSS
projeler.html               Personel / öğrenci / VIP taşıma projeleri
referanslar.html            Hizmet verilen kurumlar
galeri.html                 Filtreli foto galeri + ışık kutusu
videolar.html               Tanıtım videoları
haberler.html               Haber ve duyurular
yorumlar.html               Müşteri yorumları + yorum formu
iletisim.html               İletişim bilgileri, form ve harita
insan-kaynaklari.html       İş başvurusu formu ve açık pozisyonlar
tesekkurler.html            Form gönderimi sonrası teşekkür sayfası (JS'siz akış)
gonder.php                  Form e-posta işleyicisi ($ALICI adresini düzenleyin)

panel-9f3a7e21/             Yönetim paneli (PHP) — kurulum: panel-9f3a7e21/KURULUM.md
                             (klasör tahmin edilmesi zor bir adla adlandırıldı)
  veri/                     JSON içerik deposu (tarayıcıya kapalı)
assets/
  data/site.json           Panelin ürettiği içerik — sitenin ön yüzü bunu okur
  js/icerik.js             site.json'u okuyup data-cms* alanlarını günceller

_partials/
  header.html               ORTAK header (topbar + menü + dil menüsü) — tek kaynak
  footer.html               ORTAK footer — tek kaynak
  boot.html                 <head>'e giren tema/dil/yön ön uygulama betiği
tools/
  sync-partials.js          Partial'ları tüm sayfalara senkronize eder
  i18n-translations.json    Çeviri kaynağı: { "İngilizce": { ru, ar, de } }
  i18n-build.js             Kaynaktan assets/i18n/{ru,ar,de}.json üretir + eksik denetimi
assets/
  css/style.css             Tüm tasarım sistemi (renk, tipografi, bileşenler, RTL)
  js/main.js                Menü, animasyon, galeri, SSS, form + dil değiştirici
  i18n/languages.json       Dil listesi/konfigürasyonu (bkz. "Çok dilli yapı")
  i18n/ru.json ar.json de.json   Üretilmiş çalışma zamanı sözlükleri (elle düzenlemeyin)
  img/flags/*.svg           Dil menüsü bayrakları
  img/                      Görseller buraya (bkz. GORSELLER-BURAYA.txt)
```

## Header / footer düzenleme — ÖNEMLİ

Menü ve footer 15 sayfada tekrar ediyor. **Bunları tek tek düzenlemeyin.**
Bunun yerine:

1. `_partials/header.html` veya `_partials/footer.html` dosyasını düzenleyin.
2. Şu komutu çalıştırın:

```powershell
node tools/sync-partials.js
```

Betik her sayfadaki `<!-- #HEADER --> … <!-- /#HEADER -->` ve
`<!-- #FOOTER --> … <!-- /#FOOTER -->` bloklarının içini günceller ve
bulunduğunuz sayfayı menüde otomatik olarak vurgular.

Bu bir derleme adımı **değildir** — sayfalar her zaman tam ve statik HTML
olarak kalır, betiği çalıştırmasanız da site çalışır.

**Bir sayfayı menüden kaldırmak için:** `_partials/header.html` (ve gerekirse
`footer.html`) içindeki ilgili `<a>` satırını silin, betiği çalıştırın.

## Çok dilli yapı (TR · EN · RU · AR · DE)

Navbar'daki dil menüsü (bayrak + kısaltma + ok) 5 dil sunar. Varsayılan
**Türkçe**; seçim tarayıcıda `localStorage` (`akd-lang`, `akd-dir`) ile
saklanır ve sayfa yenilenmeden uygulanır. **Arapça** seçilince sitenin yönü
otomatik olarak RTL'ye (`<html dir="rtl">`) döner.

**Nasıl çalışır**

- **TR** = sayfa HTML'indeki varsayılan metin (JS olmadan da görünen dil).
- **EN** = `data-en` / `data-en-<öznitelik>` öznitelikleri (sayfa içinde gömülü).
- **RU · AR · DE** = `assets/i18n/<kod>.json` sözlükleri; anahtar İngilizce metindir.
- İç içe biçimlendirme (`<strong>`, `<a>`) içeren metinler `data-l="tr"` /
  `data-l="en"` kardeş `<span>`'leriyle işaretlenir.
- `assets/js/main.js` seçilen dile göre metinleri, öznitelikleri, `<title>`'ı
  ve yönü günceller; `assets/js/icerik.js` panel içeriğini (site.json) TR/EN
  için uygular, diğer dillerde çeviri katmanına bırakır.

**Çeviri düzenleme / ekleme**

1. Tek kaynak: `tools/i18n-translations.json`
   — `{ "text": { "<İngilizce>": { "ru": "…", "ar": "…", "de": "…" } },
        "html": { "<İngilizce düz metin>": { "ru": "<b>…</b>", … } } }`
2. Derleyin:

```powershell
node tools/i18n-build.js
```

   Betik `assets/i18n/{ru,ar,de}.json` dosyalarını üretir **ve** sayfalarda
   geçtiği hâlde kaynakta bulunmayan dizgeleri listeler. Bu bir derleme adımı
   değildir — site betiği çalıştırmasanız da (TR/EN ile) çalışır.

**Yeni dil eklemek** (örn. Fransızca `fr`)

1. `assets/i18n/languages.json` → `diller` dizisine kayıt ekleyin
   (`kod`, `kisa`, `ad`, `yon` `"ltr"`/`"rtl"`, `bayrak`, `htmlLang`).
2. `assets/img/flags/fr.svg` bayrağını ekleyin ve
   `assets/css/style.css` içine `.flag--fr { background-image: url("../img/flags/fr.svg"); }`.
3. `tools/i18n-translations.json` içindeki her girdiye `"fr": "…"` yazın,
   `node tools/i18n-build.js` çalıştırın (eksikleri betik listeler).

Menü ve boot betiği dil listesinden bağımsızdır; `sync-partials.js` dışında
sayfa dosyalarına dokunmak gerekmez.

## Yerel önizleme

```powershell
python -m http.server 8000
# Ardından: http://localhost:8000
```

## Yayına almadan önce yapılacaklar

### Öncelikli — bunlar yapılmadan yayına almayın

1. **`hesap-numaralarimiz.html` — TAMAMLANDI.** Gerçek IBAN'lar girili.
   Sayfaya ayrıca `noindex` eklendi (gerçek banka bilgilerinin arama
   motorlarında/sahtecilik amaçlı taramada çıkmasını önlemek için) —
   kararınız farklıysa `<meta name="robots">` satırını kaldırıp sayfayı
   `sitemap.xml`'e ekleyin.
2. **`kvkk.html`** — Metin genel bir taslaktır, hukuki danışmanlık değildir.
   Bir avukata/KVKK danışmanına inceletin, `[ ]` alanlarını doldurun.
   *(Bu, yalnızca bir avukatın yapabileceği bir iş — otomatik doldurulmadı.)*
3. **`yorumlar.html` — kısmen tamamlandı.** Sahte `[Ad Soyad]` kartları
   kaldırıldı; artık dürüst bir "henüz yorum yok" mesajı ve çalışan yorum
   formu var. Sayfa, yeterli gerçek yorum toplanana kadar menüde tam adıyla
   görünmüyor (menüde doğrudan forma giden bir "Yorum Bırak" bağlantısı var).
   **Yapmanız gereken:** çalıştığınız kurumlardan **yazılı izinli** gerçek
   geri bildirim toplayıp kartları geri ekleyin (adımlar `yorumlar.html`
   içindeki yorumda), sonra `_partials/header.html`'de tam bağlantıyı geri açın.
4. **`haberler.html` — kısmen tamamlandı.** Sahte haber kartları kaldırıldı;
   dürüst bir "henüz duyuru yok" mesajı var, sayfa menüden kaldırıldı ve
   `noindex` eklendi. **Yapmanız gereken:** gerçek bir haberiniz olduğunda
   `haberler.html` içindeki yorumdaki adımları izleyip kartları geri ekleyin.
5. **`projeler.html`** — kontrol edildi, içerik doldurulmuş görünüyor; yine de
   yayına almadan önce proje adları/yıllarının gerçek olduğunu doğrulayın.

### Genel

6. **Logo — TAMAMLANDI.** `akdoganturizm.jpg` dosyasından üretildi:
   - `assets/img/logo.png` — şeffaf zeminli, açık zeminler için (header)
   - `assets/img/logo-light.png` — gri swoosh beyaza çevrildi, koyu zemin için (footer)
   - `assets/img/favicon.png` — logodaki üçgen amblemden kırpıldı
   İkisi de 440×148 px'e küçültüldü (~20 KB). Vektör (SVG) sürümünüz varsa
   onu koymanız daha da iyi olur — her ölçekte net görünür.
7. **Görseller** — hâlâ bekliyor. Tüm görseller `assets/img/*-temsili.*`
   (stok/temsili) — gerçek araç, ofis ve ekip fotoğrafı yok. Liste için
   `assets/img/GORSELLER-BURAYA.txt`'e bakın. Ayrıca sosyal medya paylaşım
   kartı için bir `assets/img/og-image.jpg` (1200×630) ekleyip `index.html`
   içindeki yorumlu `og:image` satırını açın.
8. **Sosyal medya** — hâlâ bekliyor. `_partials/footer.html` içindeki
   `href="#"` bağlantılarına gerçek hesap adreslerinizi yazıp
   `node tools/sync-partials.js` çalıştırın.
9. **İstatistikler** — hâlâ bekliyor. `index.html` ve `hakkimizda.html`
   içindeki `data-count` değerleri örnektir (3500 yolcu, 120 araç, 60 iş
   ortağı). Gerçek rakamlarla güncelleyin veya bandı kaldırın.
10. **Zaman çizelgesi** — hâlâ bekliyor. `hakkimizda.html` içindeki
    2013 / 2016 / 2019 kilometre taşları örnektir.
11. **Belgeler** — `belgeler.html` içindeki liste, sektörde yaygın belge
    türlerinden oluşan bir taslaktır. Firmanızda fiilen bulunanları bırakın.
12. **Formlar — TAMAMLANDI.** `gonder.php` içindeki `$ALICI` zaten
    `info@akdoganturizm.com` olarak ayarlı. Yönetim panelinde
    **İletişim & Ayarlar → Form bildirimi e-postası** doldurulursa `gonder.php`
    onu otomatik kullanır (dosyayı elle düzenlemeye gerek yok). Sunucuda
    PHP + `mail()` aktif olduğundan emin olun. Detay aşağıda "Formlar" bölümünde.
13. **Harita** — hâlâ bekliyor. `iletisim.html` içindeki iframe adres araması
    yapıyor. Tam konum için Google Maps → "Paylaş → Harita yerleştir"
    bağlantısını yapıştırın.
14. **Alan adı** — `index.html`, `sitemap.xml` ve `robots.txt` içinde
    `https://www.akdoganturizm.com/` kullanılıyor; gerçek alan adınız
    farklıysa üçünde de güncelleyin.
15. **Yönetim paneli güvenliği — kısmen tamamlandı.** Klasör tahmin
    edilebilir `yonetim` adından `panel-9f3a7e21` gibi rastgele bir ada
    çevrildi (bkz. aşağıdaki "Yönetim paneli" bölümü). **Yapmanız gereken:**
    siteyi yayına aldıktan sonra `panel-9f3a7e21/kurulum.php` adresinden ilk
    yönetici hesabınızı oluşturup o dosyayı silin — `users.json` hâlâ boş
    olduğu için bu adım henüz yapılmadı ve dosya bilerek silinmedi (aksi halde
    hiç yönetici hesabı oluşturamazdınız).
16. **SEO/teknik — TAMAMLANDI.** `robots.txt`, `sitemap.xml` ve site
    tasarımıyla uyumlu bir `404.html` eklendi.

## Yönetim paneli

`panel-9f3a7e21/` — PHP tabanlı, veritabanısız (JSON) içerik yönetimi.
Kurulum, yetkiler, güvenlik ve sorun giderme: **`panel-9f3a7e21/KURULUM.md`**.

Klasör zaten tahmin edilmesi zor bir adla adlandırıldı (varsayılan `yonetim`
adı **kullanılmıyor**). Özet: `panel-9f3a7e21/kurulum.php` adresine gidip ilk
yöneticiyi oluştur → dosyayı sunucudan sil. (Henüz yapılmadı — `users.json`
boş, yani panelde şu an hiç hesap yok.) Klasörü tekrar yeniden adlandırırsanız
`gonder.php` içindeki `$talepDizin` satırını da güncelleyin (detay
`panel-9f3a7e21/KURULUM.md` içinde).
Panelde yapılan değişiklikler `assets/data/site.json`'a yazılır; sitedeki
`assets/js/icerik.js` bunu okuyup `data-cms*` işaretli alanları günceller
(HTML dosyalarına dokunulmaz).

Panel ayrıca şunları içerir: **Sürüm Geçmişi** (her içerik kaydının önceki
hâli, tek tıkla geri alma), **Yedek** (tüm içeriği tek `.json` olarak indir /
geri yükle), **İşlem Günlüğü** (kim ne zaman ne değiştirdi) ve **Parola
kurtarma** (`veri/kurtarma.izin` dosyası + `kurtarma.php` — ayrıntı
`KURULUM.md`).

## Formlar

- `gonder.php` — 3 formun tamamını karşılar (gizli `form` alanı ile ayırt eder:
  `teklif` / `basvuru` / `yorum`). E-postayı `$ALICI` adresine yollar (panelde
  "Form bildirimi e-postası" doluysa onu kullanır).
- **JS açıkken:** sayfa yenilenmeden gönderir, başarı/hata mesajı yerinde çıkar.
- **JS kapalıyken:** normal POST → `gonder.php` → `tesekkurler.html` yönlendirmesi.
- Dosya ekleri (iletişim + iş başvurusu) sunucuda uzantı ve boyut yönünden
  yeniden denetlenir, e-postaya iliştirilir (dosya başına 8 MB, toplam 12 MB).
- Spam koruması: gizli "bal küpü" alanı + IP başına 15 sn hız sınırı.

### PHP yoksa — Web3Forms'a bağlamak (5 dk, kod bilgisi gerekmez)

1. https://web3forms.com → e-posta ile ücretsiz **access key** alın.
2. 3 sayfada (`iletisim.html`, `insan-kaynaklari.html`, `yorumlar.html`) form
   etiketini bulun, `action="gonder.php"` yerine:
   `action="https://api.web3forms.com/submit"` yazın.
3. Her formun içine şu satırı ekleyin:
   `<input type="hidden" name="access_key" value="BURAYA-KEY">`
4. `gonder.php` ve `tesekkurler.html` silinebilir. JS zaten bu uç noktayla da
   çalışır (JSON `{success:true}` döndürür — `main.js` içindeki `res.ok` yerine
   `res.success` kontrolü eklemeniz yeterli, ya da olduğu gibi bırakıp yalnızca
   JS'siz POST'a güvenin).

## İletişim bilgileri (sitede kullanılan)

| | |
|---|---|
| Adres | Köşklüçesme Mah. Topçular Cad. No: 66/A, Gebze / Kocaeli |
| Telefon | 0262 642 91 03 |
| GSM | 0546 881 46 71 |
| WhatsApp | 0532 051 36 06 |
| E-posta | info@akdoganturizm.com |
| Çalışma saatleri | Hafta içi 09.00–19.00 · Cumartesi 09.30–19.00 · Pazar kapalı |

Bu bilgileri değiştirmek için `_partials/` dosyalarını düzenleyip sync betiğini
çalıştırın; ayrıca `iletisim.html` gövdesinde ve `kvkk.html` içinde de geçiyor.

## Renk paleti

Tüm renkler `assets/css/style.css` başındaki `:root` bloğunda tanımlıdır.
Vurgu rengi logodan örneklenen marka kırmızısıdır (#e31e25); yapı rengi olarak
koyu lacivert korundu. Koyu zeminlerde kırmızı okunurluğu düşük kaldığı için
`--accent-on-dark` adıyla açılmış bir sürüm kullanılıyor.

| Değişken | Değer | Kullanım |
|---|---|---|
| `--navy-900` | `#081727` | Hero, footer, koyu zeminler |
| `--navy-800` | `#0d2440` | Başlıklar, koyu butonlar |
| `--blue-600` | `#1a5da5` | Bağlantılar, vurgu metinleri |
| `--accent` | `#e31e25` | Marka kırmızısı — CTA butonları, işaretler |
| `--accent-on-dark` | `#ff6266` | Koyu zeminlerde açılmış kırmızı |
| `--brand-graphite` | `#404040` | Logodaki koyu gri |
| `--gray-050` | `#f7f8fa` | Açık bölüm zeminleri |

## Teknik notlar

- Bağımlılık yok; dış kaynak Google Fonts (Inter; Arapça seçilince ek olarak
  Noto Naskh Arabic yalnızca gerektiğinde yüklenir).
- Mobil öncelikli. Menü 1120px altında hamburger panele dönüşür; dil menüsü ve
  tema düğmesi üst çubukta her ölçekte erişilebilir kalır.
- Çok dilli: TR/EN/RU/AR/DE, Arapça'da RTL. Bkz. "Çok dilli yapı".
- `prefers-reduced-motion` desteği var (animasyonlar kapanır).
- Klavye erişilebilirliği: "İçeriğe geç" bağlantısı, odak halkaları, ARIA
  etiketleri, açılır menüler `:focus-within` ile klavyeyle de açılıyor; dil
  menüsü `listbox` deseniyle ok tuşları / Esc ile kullanılabilir.
- `hesap-numaralarimiz.html` sayfasına `noindex` eklendi (arama motorlarında
  çıkmaması için); yayına hazır olduğunda kaldırabilirsiniz.
