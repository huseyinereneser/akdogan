# Yönetim Paneli — Kurulum ve Kullanım

Bu panel **PHP** gerektirir (paylaşımlı hosting'lerin çoğunda hazır gelir).
Veritabanı gerekmez; her şey `panel-9f3a7e21/veri/` altında JSON dosyalarında
tutulur.

**Klasör adı zaten değiştirildi.** Panel varsayılan `yonetim/` adı yerine
tahmin edilmesi zor `panel-9f3a7e21/` adıyla geliyor — aşağıdaki adımlarda
bunu kullanın.

---

## 1. Kurulum (tek seferlik, ~5 dakika)

1. **Tüm siteyi** (bu `panel-9f3a7e21/` klasörü dahil) hosting'e yükleyin.
2. `panel-9f3a7e21/veri/` klasörünün **yazma izni** olduğundan emin olun
   (cPanel Dosya Yöneticisi → sağ tık → İzinler → `755` veya `775`).
   Aynı şekilde `assets/img/` ve `assets/data/` yazılabilir olmalı
   (görsel yükleme ve içerik kaydı için).
3. Tarayıcıdan **`siteadresiniz.com/panel-9f3a7e21/kurulum.php`** adresine gidin.
4. İlk **Yönetici** hesabını oluşturun (ad, e-posta, en az 8 karakter şifre).
5. **`panel-9f3a7e21/kurulum.php` dosyasını sunucudan SİLİN.** (Bir daha
   çalışmaz ama dosyayı bırakmayın — `users.json` boş kaldığı sürece herkes
   yeni bir yönetici hesabı açabilir.)
6. Artık `siteadresiniz.com/panel-9f3a7e21/` adresinden giriş yapabilirsiniz.

### Klasörü tekrar yeniden adlandırmak isterseniz

Panelin **içindeki** bağlantılar göreli (relative) olduğu için sorun çıkmaz,
ama site kökündeki `gonder.php` klasör adını **sabit metin** olarak içeriyor
(`$talepDizin` satırı) — panel klasörünü tekrar yeniden adlandırırsanız
`gonder.php` içindeki bu satırı da yeni adla güncelleyin, yoksa form
talepleri panelde "Talepler" bölümüne düşmeyi bırakır (e-posta göndermeye
devam eder, sadece panel kaydı kesilir).

Panel zaten `noindex` ile işaretli — Google'a düşmez.

---

## 2. Formların panele düşmesi

`gonder.php` (sitenin kökünde) form gönderimlerini hem e-posta olarak yollar
hem de `panel-9f3a7e21/veri/talepler/` altına kaydeder. Panelde **Talepler**
bölümünde görürsünüz.

- Panelde **İletişim & Ayarlar → Form bildirimi e-postası** alanını doldurun;
  formlar artık bu adrese gider. (`gonder.php` bu ayarı otomatik okur —
  dosyayı elle düzenlemeniz gerekmez.)
- Alanı boş bırakırsanız `gonder.php` içindeki varsayılan `$ALICI` adresi
  kullanılır.
- İsterseniz **İletişim & Ayarlar → Bildirimler (Telegram)** bölümüne bir bot
  anahtarı + chat id girin; her yeni talep e-postanın yanında Telegram mesajı
  olarak da gelir. (Bu bilgiler sunucuda kalır, sitede yayınlanmaz.)

---

## 3. Ne nasıl güncellenir?

| Bölüm | Ne yapar |
|---|---|
| **Talepler** | Formlardan gelen mesajlar. Ara/süz (durum **ve atanan kişiye göre**), sayfalama, okundu/okunmadı, **dahili not**, **"yanıtlandı" işareti**, **kişiye atama**, sil, **okunmuşları toplu sil**, CSV (Excel) indir. Silinen talepler sayfanın altında **son 50 kayıtla geri alınabilir**. |
| **İletişim & Ayarlar** | Telefon, adres, e-posta, sosyal medya, SEO metinleri, varsayılan tema, form bildirimi e-postası, **Telegram bildirim botu** (yeni talepler anında Telegram'a düşer). Bağlantılar/e-postalar sunucu tarafında doğrulanır. *(Yalnızca Yönetici)* |
| **SEO & Sitemap** | Sayfa bazlı `<title>` + meta açıklama + `og:image` (TR/EN), tek tıkla `sitemap.xml` üretimi, `robots.txt` düzenleme. *(Yalnızca Yönetici)* |
| **Çeviriler** | Rusça / Arapça / Almanca sözlüğü (`tools/i18n-translations.json`) panelden düzenlenir; kaydedince `assets/i18n/{ru,ar,de}.json` otomatik yeniden üretilir (Node gerekmez). Sayfalarda geçip sözlükte olmayan dizgeleri raporlar. *(Yalnızca Yönetici)* |
| **Hizmetler** | Hizmetlerin başlık/özet/detay/görseli. TR + EN. Sürükleyerek sırala, ekle/sil. |
| **Galeri** | Görsel yükle (çoklu), başlık (TR/EN), kategori, sürükle-sırala, çıkar. **Kategorileri ekle / adını değiştir / sil.** |
| **Sayfa Metinleri** | Ana sayfa / Hakkımızda / İletişim sabit metinleri (TR + EN). **Yönetici** ayrıca bölüm/alan ekleyip silebilir (yeni alanın sitede görünmesi için ilgili HTML'e `data-cms-metin="bölüm.anahtar"` eklenmelidir). |
| **Medya** | Yüklü tüm görseller; **yeni görsel yükleme**, "kullanılmıyor" olanları silme, **logo/favicon değiştirme** *(logo/favicon yalnızca Yönetici)*. |
| **Sürüm Geçmişi** | Her içerik kaydının önceki hâli (bölüm başına son 20). Yanlış düzenleme/silmeyi tek tıkla geri al. |
| **Kullanıcılar** | Yönetici/Editör hesapları; her hesabın **son giriş** tarihi/IP'si. *(Yalnızca Yönetici)* |
| **Bakım Modu** | Tek tıkla siteyi ziyaretçilere kapatıp "bakımdayız" sayfası (503) gösterir; panel açık kalır. TR/EN mesaj. *(Yalnızca Yönetici — kök `.htaccess` gerekir, bkz. bölüm 4)* |
| **Yedek** | Tüm içeriği (SEO dahil) tek `.json` dosyası olarak indir / geri yükle. *(Yalnızca Yönetici)* |
| **İşlem Günlüğü** | Kim ne zaman giriş yaptı, neyi değiştirdi. *(Yalnızca Yönetici)* |
| **Hesabım** | Kendi ad/e-posta bilginiz, şifreniz, **iki adımlı doğrulama (2FA)** + **yedek kurtarma kodları**, **son girişler** listesi ve "diğer cihazlardan çıkış". Şifre değişince diğer cihazlardaki oturumlar kapanır. |

**Kaydettiğiniz anda** site güncellenir; ayrı bir "yayınla" adımı yoktur.
Teknik olarak panel `assets/data/site.json` dosyasını yazar, site de onu okur.

Panel arayüzü yalnızca açık modda çalışır.

### Yetki seviyeleri

- **Yönetici** — her şeye erişir.
- **Editör** — yalnızca içerik (Hizmetler, Galeri, Sayfa Metinleri, Medya,
  Talepler). İletişim & Ayarlar ile Kullanıcılar bölümlerini göremez.

---

## 4. Güvenlik özeti (kurulu gelir)

- Şifreler `password_hash` ile saklanır — düz metin yoktur.
- 5 hatalı girişten sonra o e-posta+IP 15 dakika kilitlenir; ayrıca **hesap
  bazlı** kilit (20 deneme) IP değiştirilerek yapılan dağıtık denemeleri de durdurur.
- Şifre değiştiğinde / parola kurtarıldığında **diğer tüm oturumlar geçersiz olur**.
- 30 dakika hareketsizlikte oturum otomatik kapanır.
- Tüm formlarda CSRF anahtarı (çıkış dâhil); silme işlemlerinde onay penceresi.
- Güvenlik başlıkları (CSP, `X-Frame-Options`, HSTS…) ve **HTTPS zorunluluğu PHP
  tarafında** uygulanır — sunucu Apache değilse bile geçerlidir (bkz. `inc/on.php`).
- `panel-9f3a7e21/veri/` klasörü `.htaccess` **ve** `web.config` ile tarayıcıya
  kapalıdır. Panel ana sayfası bu klasörün gerçekten kapalı olup olmadığını
  kendi kendine sınar; açıksa büyük bir uyarı gösterir.
- Vekil (Cloudflare vb.) başlıklarına yalnızca `inc/on.php` içindeki
  `GUVENILEN_VEKIL` açıkken güvenilir — böylece IP sahtelemesiyle kilit
  atlatılamaz.
- CSV dışa aktarımı formül enjeksiyonuna karşı korunur.
- Panel sayfaları `noindex`.
- Yüklenen görseller GD ile yeniden kodlanır (gömülü zararlı içerik temizlenir),
  rastgele adla kaydedilir, otomatik küçültülür. `assets/img/` klasöründe betik
  çalıştırma `.htaccess` ile ayrıca kapatılmıştır.
- **İşlem günlüğü:** her giriş ve içerik değişikliği (kim, ne zaman, hangi IP)
  `veri/gunluk.jsonl` içine yazılır; panelde **İşlem Günlüğü** bölümünden okunur.
- **Sürüm geçmişi:** içerik dosyalarının her kaydından önceki hâli
  `veri/surumler/` altında saklanır (bölüm başına 20). Yanlış bir değişikliği
  panelden geri alabilirsiniz.
- **İki adımlı doğrulama (2FA):** her kullanıcı kendi hesabında **Hesabım**
  bölümünden açabilir (Google Authenticator / Authy / Microsoft Authenticator vb.).
  Açılışta **10 tek kullanımlık yedek kod** verilir (telefon kaybında girişte kod
  yerine kullanılır); Hesabım'dan yeni set üretilebilir. Telefon kaybolursa: bir
  Yönetici **Kullanıcılar** bölümünden ilgili hesabın 2FA'sını sıfırlayabilir; tek
  yönetici kendini kilitlerse **Parola kurtarma** (bkz. bölüm 5) şifreyle birlikte
  2FA'yı da kapatır.
- **Giriş geçmişi:** her hesabın son 10 girişi (tarih, IP, tarayıcı) **Hesabım**
  sayfasında; Yönetici tüm hesapların son girişini **Kullanıcılar** listesinde görür.
- **Bakım modu:** yalnızca sitenin **kök dizinindeki `.htaccess`** dosyası projedeki
  bakım kuralını içeriyorsa çalışır (Apache). Bu dosyayı da hosting'e yükleyin.
  nginx/LiteSpeed kullanıyorsanız kural yok sayılır — bu durumda Bakım Modu ekranı
  bir uyarı gösterir.
- İlk yönetici oluşturulunca `veri/kurulum.kilit` dosyası yazılır; `kurulum.php`
  bir daha çalışmaz (dosyayı silmeyi unutsanız bile).

**Sizin yapmanız gerekenler:**
- İlk yönetici hesabını oluşturduktan sonra yine de `kurulum.php`'yi sunucudan
  silin (güvenlik için ikinci kat; `kurulum.kilit` zaten devreye girer).
- ~~`yonetim` klasörünü yeniden adlandırın~~ — yapıldı, klasör artık
  `panel-9f3a7e21` adında.
- Siteyi **HTTPS** ile yayınlayın. Panel zaten HTTPS'e yönlendirir; sertifikanız
  hazır değilse geçici olarak `inc/on.php` içindeki `HTTPS_ZORUNLU` değerini
  `false` yapabilirsiniz.
- Cloudflare / yük dengeleyici arkasındaysanız `inc/on.php` içindeki
  `GUVENILEN_VEKIL` değerini `true` yapın (ziyaretçi IP'leri ve kilit doğru çalışsın).
- Şifrenizi güçlü seçin, paylaşmayın.

### `inc/on.php` içindeki ayarlar

| Sabit | Varsayılan | Ne işe yarar |
|---|---|---|
| `HTTPS_ZORUNLU` | `true` | Panele yalnızca HTTPS ile izin verir (localhost hariç). |
| `GUVENILEN_VEKIL` | `false` | `true` ise `X-Forwarded-For` / `CF-Connecting-IP` başlıkları dikkate alınır. Yalnızca güvendiğiniz bir ters vekil arkasındaysanız açın. |
| `AZAMI_HESAP_DEN` | `20` | Hesap bazlı kilit eşiği (dağıtık kaba kuvvet denemelerine karşı). |
| `PANEL_IP_LISTESI` | `''` (boş) | Doldurursanız panele yalnızca bu IP'lerden erişilir (virgülle ayırın). localhost her zaman serbest. |
| `SIFRE_ASGARI` | `8` | Asgari panel şifresi uzunluğu. |
| `SIFRE_KARMASIK` | `false` | `true` ise şifre en az bir harf **ve** bir rakam içermek zorunda. |

---

## 5. Parola kurtarma (tek yönetici şifresini unuttuysa)

E-posta gönderimi paylaşımlı hostlarda güvenilmez olduğu için kurtarma,
**sunucuya erişebilen kişi = sitenin sahibi** mantığıyla çalışır:

1. Hosting **Dosya Yöneticisi** (veya FTP) ile `panel-9f3a7e21/veri/` klasörüne
   girin ve içi boş, adı **`kurtarma.izin`** olan bir dosya oluşturun.
2. Tarayıcıdan `siteadresiniz.com/panel-9f3a7e21/kurtarma.php` adresine gidin
   (giriş ekranındaki **"Şifremi unuttum"** bağlantısı da buraya götürür).
3. Hesabın e-postasını ve yeni şifreyi yazın.
4. Şifre güncellenir, `kurtarma.izin` dosyası **otomatik silinir** ve kapı
   tekrar kilitlenir. Değişiklik İşlem Günlüğü'ne yazılır.

`kurtarma.izin` dosyası yokken bu sayfa hiçbir işe yaramaz.

---

## 6. Sorun giderme

| Belirti | Olası neden / çözüm |
|---|---|
| `kurulum.php` "yazılamadı" diyor | `panel-9f3a7e21/veri/` klasörüne yazma izni verin (755/775). |
| Görsel yüklenmiyor | `assets/img/` yazılabilir değil, ya da PHP `GD` eklentisi kapalı (host'tan açtırın). |
| Kaydediyorum ama sitede değişmiyor | `assets/data/` yazılabilir mi? Tarayıcıda Ctrl+F5 yapın (önbellek). |
| Panel bağlantıları çalışmıyor | Klasörü yeniden adlandırdıysanız yeni adresten girin; eski yer imini güncelleyin. |
| Talepler boş ama form maili geliyor | `panel-9f3a7e21/veri/talepler/` yazılabilir değil. İzin verin. |
| Şifremi unuttum | Yukarıdaki **"Parola kurtarma"** adımlarını izleyin. |
| Beyaz sayfa | Host'ta PHP hata kaydına bakın (cPanel → Errors). PHP 7.4+ gerekli. |

---

## 7. Yedekleme

**En pratik yol — panelden:** **Yedek** bölümü → *Yedeği indir (.json)*. Bu tek
dosya ayarları, hizmetleri, galeriyi, sayfa metinlerini, kullanıcıları ve tüm
talepleri içerir. Geri yüklemek için aynı bölümdeki *Yedekten geri yükle*'yi
kullanın (önceki içerik Sürüm Geçmişi'ne düşer). Ayda bir indirin.

**Görseller ayrı:** `.json` yedeği `assets/img/` içindeki görselleri **içermez**.
O klasörü hosting dosya yöneticisi / FTP ile ayrıca indirin.

**Elle (alternatif):** şu iki klasörü kopyalamak da yeterlidir —
- `panel-9f3a7e21/veri/` — kullanıcılar, ayarlar, hizmetler, galeri, sayfa metinleri, talepler, günlük, sürümler
- `assets/img/` — görseller
