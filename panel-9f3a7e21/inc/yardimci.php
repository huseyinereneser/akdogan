<?php
/** yardimci.php — küçük yardımcı fonksiyonlar */

/** HTML kaçışı (XSS koruması) */
function e(?string $s): string {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** POST/GET'ten kırpılmış string al */
function girdi(string $anahtar, string $kaynak = 'post'): string {
    $dizi = $kaynak === 'get' ? $_GET : $_POST;
    return isset($dizi[$anahtar]) ? trim((string)$dizi[$anahtar]) : '';
}

/** Başka sayfaya yönlendir ve dur */
function git(string $hedef): void {
    header('Location: ' . $hedef, true, 303);
    exit;
}

/** Anahtar-değer güvenli slug (dosya/id için) */
function slug(string $s): string {
    $tr = ['ç','ğ','ı','İ','ö','ş','ü','Ç','Ğ','Ö','Ş','Ü'];
    $en = ['c','g','i','i','o','s','u','c','g','o','s','u'];
    $s = str_replace($tr, $en, $s);
    $s = strtolower($s);
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    return trim($s, '-') ?: ('oge-' . substr(md5((string)microtime(true)), 0, 6));
}

/** Türkçe tarih: 04.09.2026 15:30 */
function tarih_tr($zaman): string {
    $t = is_numeric($zaman) ? (int)$zaman : strtotime((string)$zaman);
    return $t ? date('d.m.Y H:i', $t) : '-';
}

/** Rastgele güvenli kimlik */
function kimlik(int $bayt = 8): string {
    try { return bin2hex(random_bytes($bayt)); }
    catch (\Throwable $e) { return substr(md5(uniqid('', true)), 0, $bayt * 2); }
}

/** Flash mesaj koy / al */
function flash_koy(string $tur, string $mesaj): void {
    $_SESSION['flash'][] = ['tur' => $tur, 'mesaj' => $mesaj];
}
function flash_al(): array {
    $f = $_SESSION['flash'] ?? [];
    unset($_SESSION['flash']);
    return $f;
}

/**
 * İstemci IP'si. Vekil başlıkları (X-Forwarded-For, CF-Connecting-IP) yalnızca
 * GUVENILEN_VEKIL açıkken dikkate alınır; aksi halde sahtelenebildikleri için
 * yok sayılır ve doğrudan bağlantı adresi kullanılır.
 */
function istemci_ip(): string {
    if (GUVENILEN_VEKIL) {
        foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR'] as $b) {
            if (!empty($_SERVER[$b])) {
                $ip = trim(explode(',', $_SERVER[$b])[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP)) return $ip;
            }
        }
    }
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
}

/** CSV/E-tablo formül enjeksiyonuna karşı bir hücreyi zararsız hale getir */
function csv_guvenli(string $s): string {
    return preg_match('/^[=\-+@\t\r]/', $s) ? "'" . $s : $s;
}

/** Yalnızca http(s) şemalı bağlantıya izin ver; geçersizse boş döndür */
function guvenli_url(string $s): string {
    $s = trim($s);
    if ($s === '') return '';
    return preg_match('#^https?://[^\s<>"]+$#i', $s) ? $s : '';
}

/**
 * İşlem günlüğüne bir satır ekle (kim, ne zaman, ne yaptı).
 * Oturum açık değilse (giriş denemesi, kurulum, kurtarma) uid/ad "-" olur.
 */
function gunluk_yaz(string $eylem, string $detay = ''): void {
    $satir = json_encode([
        't'     => date('c'),
        'uid'   => $_SESSION['uid'] ?? '-',
        'ad'    => $_SESSION['ad'] ?? '-',
        'ip'    => istemci_ip(),
        'eylem' => $eylem,
        'detay' => $detay,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($satir === false) return;

    @file_put_contents(GUNLUK_DOSYA, $satir . "\n", FILE_APPEND | LOCK_EX);

    // Dosya şişerse en son 2000 satıra indir
    if ((int)@filesize(GUNLUK_DOSYA) > 512 * 1024) {
        $hepsi = @file(GUNLUK_DOSYA, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
        if (count($hepsi) > 2000) {
            @file_put_contents(GUNLUK_DOSYA, implode("\n", array_slice($hepsi, -2000)) . "\n", LOCK_EX);
        }
    }
}

/** Günlüğü en yeni önce olacak şekilde oku (en fazla $adet satır) */
function gunluk_oku(int $adet = 300): array {
    $hepsi = @file(GUNLUK_DOSYA, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];
    $hepsi = array_slice($hepsi, -$adet);
    $cikti = [];
    foreach (array_reverse($hepsi) as $s) {
        $d = json_decode($s, true);
        if (is_array($d)) $cikti[] = $d;
    }
    return $cikti;
}

/** İşlem günlüğü kodunu (ör. "hizmet-ekle") okunur Türkçe etikete çevir */
function gunluk_etiket(string $eylem): string {
    static $etiket = [
        'giris' => 'Giriş', 'giris-basarisiz' => 'Başarısız giriş', 'cikis' => 'Çıkış',
        'kurulum' => 'İlk kurulum', 'parola-kurtarma' => 'Parola kurtarma',
        'parola-kurtarma-basarisiz' => 'Parola kurtarma (başarısız)', 'sifre-degistir' => 'Şifre değiştirdi',
        'hesap-guncelle' => 'Hesap bilgisini güncelledi', 'oturum-sifirla' => 'Diğer oturumları kapattı',
        '2fa-acildi' => 'İki adımlı doğrulamayı açtı', '2fa-kapandi' => 'İki adımlı doğrulamayı kapattı',
        'ayarlar-kaydet' => 'Ayarları kaydetti', 'sayfa-metin-kaydet' => 'Sayfa metinlerini kaydetti',
        'sayfa-yapi' => 'Sayfa yapısını değiştirdi',
        'hizmet-ekle' => 'Hizmet ekledi', 'hizmet-duzenle' => 'Hizmet düzenledi', 'hizmet-sil' => 'Hizmet sildi', 'hizmet-sirala' => 'Hizmet sıraladı',
        'galeri-yukle' => 'Galeriye görsel yükledi', 'galeri-duzenle' => 'Galeriyi düzenledi', 'galeri-cikar' => 'Görseli galeriden çıkardı',
        'galeri-kategori' => 'Galeri kategorilerini düzenledi',
        'medya-sil' => 'Medya dosyası sildi', 'medya-yukle' => 'Medya dosyası yükledi', 'logo-degistir' => 'Logo/favicon değiştirdi',
        'kullanici-ekle' => 'Kullanıcı ekledi', 'kullanici-rol' => 'Kullanıcı rolü değiştirdi', 'kullanici-sil' => 'Kullanıcı sildi',
        'talep-sil' => 'Talep sildi', 'talep-tumu-okundu' => 'Tüm talepleri okundu yaptı',
        'talep-geri-al' => 'Silinen talebi geri aldı', 'talep-not' => 'Talebe not ekledi',
        'talep-yanit' => 'Talebi yanıtlandı işaretledi', 'talep-ata' => 'Talebi bir kişiye atadı',
        'surum-geri-yukle' => 'Sürüm geri yükledi',
        'yedek-indir' => 'Yedek indirdi', 'yedek-geri-yukle' => 'Yedekten geri yükledi',
        'gunluk-temizle' => 'Günlüğü temizledi',
        'bakim-ac' => 'Siteyi bakım moduna aldı', 'bakim-kapa' => 'Bakım modunu kapattı',
        'seo-kaydet' => 'SEO ayarlarını kaydetti', 'sitemap-uret' => 'sitemap.xml üretti',
        'robots-kaydet' => 'robots.txt kaydetti',
        'ceviri-kaydet' => 'Çevirileri güncelledi', 'ceviri-derle' => 'Çeviri sözlüklerini derledi',
        '2fa-yedek-kod' => 'Yeni 2FA yedek kodları üretti',
    ];
    return $etiket[$eylem] ?? $eylem;
}
