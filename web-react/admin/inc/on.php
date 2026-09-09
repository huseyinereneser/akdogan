<?php
/**
 * on.php — panelin ön yüklemesi (her PHP dosyasının en başında çağrılır)
 * Bağımlılık yok; PHP 7.4+ ve yazılabilir panel/veri/ klasörü yeterli.
 */

declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0');            // hataları ekrana basma
ini_set('log_errors', '1');

// Fallbacks for local PHP installations where mbstring is not enabled.
if (!function_exists('mb_strtolower')) {
    function mb_strtolower(string $value, ?string $encoding = null): string { return strtolower($value); }
}
if (!function_exists('mb_strtoupper')) {
    function mb_strtoupper(string $value, ?string $encoding = null): string { return strtoupper($value); }
}
if (!function_exists('mb_strlen')) {
    function mb_strlen(string $value, ?string $encoding = null): int { return strlen($value); }
}
if (!function_exists('mb_substr')) {
    function mb_substr(string $value, int $start, ?int $length = null, ?string $encoding = null): string {
        return $length === null ? substr($value, $start) : substr($value, $start, $length);
    }
}
if (!function_exists('mb_strpos')) {
    function mb_strpos(string $haystack, string $needle, int $offset = 0, ?string $encoding = null): int|false {
        return strpos($haystack, $needle, $offset);
    }
}
if (!function_exists('mb_strimwidth')) {
    function mb_strimwidth(string $value, int $start, int $width, string $trimMarker = '', ?string $encoding = null): string {
        return substr($value, $start, $width);
    }
}

// -------------------------------------------------------------- YOLLAR ------
define('PANEL_KOK', dirname(__DIR__));                 // .../web-react/admin
// React (Vite) sürümünde sitenin ön yüzü web-react/public/ altında servis edilir;
// panel doğrudan o klasördeki site.json'u ve assets/img'i düzenler.
define('SITE_KOK',  dirname(PANEL_KOK) . '/public');   // .../web-react/public
define('VERI_DIZIN', PANEL_KOK . '/veri');
define('TALEP_DIZIN', VERI_DIZIN . '/talepler');
define('KILIT_DIZIN', VERI_DIZIN . '/kilit');
define('KURULUM_KILIDI', VERI_DIZIN . '/kurulum.kilit'); // bir kez kurulunca kurulum.php kalıcı kapanır
define('KURTARMA_IZNI', VERI_DIZIN . '/kurtarma.izin'); // sunucuda elle oluşturulunca parola kurtarma açılır
define('SILINEN_TALEP_DIZIN', VERI_DIZIN . '/talepler-silinen'); // silinen talepler (geri alınabilir)
define('YUKLEME_DIZIN', SITE_KOK . '/assets/img');
define('SITE_JSON', SITE_KOK . '/assets/data/site.json');
define('CEVIRI_KAYNAK', VERI_DIZIN . '/i18n-translations.json');   // çeviri kaynağı panel/veri altında (public'e sızmaz)
define('I18N_CIKTI_DIZIN', SITE_KOK . '/assets/i18n');
define('SEO_JSON', VERI_DIZIN . '/seo.json');

// ---------------------------------------------------------- AYARLAR --------
const OTURUM_DK       = 30;   // hareketsizlik sonrası otomatik çıkış (dakika)
const AZAMI_DENEME    = 5;    // bu kadar hatalı girişten sonra (IP + kullanıcı adı)
const AZAMI_HESAP_DEN = 20;   // bu kadar hatalı girişten sonra (yalnızca hesap — dağıtık deneme)
const KILIT_DK        = 15;   // ... bu süre kadar kilitlenir (dakika)
const YUKLEME_AZAMI   = 6;    // tek seferde en fazla dosya
const DOSYA_AZAMI_MB  = 10;   // görsel başına MB
const GORSEL_GENISLIK = 1600; // yüklenen görseller bu genişliğe küçültülür
const SURUM_AZAMI     = 20;   // her içerik dosyası için saklanan geçmiş sürüm sayısı
const TALEP_SAYFA     = 25;   // Talepler listesinde sayfa başına kayıt

// Panel şifre kuralı
const SIFRE_ASGARI    = 8;    // asgari şifre uzunluğu (kurulum, kullanıcı ekleme, şifre değiştirme, kurtarma)
const SIFRE_KARMASIK  = false; // true iken şifre en az bir harf VE bir rakam içermek zorunda

// Panele erişebilecek IP'ler — virgülle ayırın (ör. '203.0.113.5, 198.51.100.0').
// Boş bırakılırsa herkese açıktır. localhost her zaman serbesttir.
const PANEL_IP_LISTESI = '';

// Panel yalnızca güvendiğiniz bir ters vekilin (Cloudflare, yük dengeleyici)
// arkasındaysa true yapın. false iken X-Forwarded-For / CF-Connecting-IP
// başlıkları YOK SAYILIR — aksi halde saldırgan kendi IP'sini sahteleyip
// kaba kuvvet kilidini ve işlem günlüğünü atlatabilir.
const GUVENILEN_VEKIL = false;

// Panele yalnızca HTTPS üzerinden izin ver (localhost hariç). Siteyi HTTPS'e
// taşımadan önce false yapmanız gerekebilir.
const HTTPS_ZORUNLU   = true;

// --------------------------------------------------------- GÜVENLİK --------
$vekilHttps = GUVENILEN_VEKIL && (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['SERVER_PORT'] ?? '') == 443)
    || $vekilHttps;

$yerelmi = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)
    || in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1'], true);

// HTTPS zorunluluğu — sunucu yapılandırmasından (.htaccess) bağımsız çalışır
if (HTTPS_ZORUNLU && !$https && !$yerelmi && ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    header('Location: https://' . ($_SERVER['HTTP_HOST'] ?? '') . ($_SERVER['REQUEST_URI'] ?? '/'), true, 301);
    exit;
}

// Panelin güvenlik başlıkları — her sunucuda geçerli
header("Content-Security-Policy: default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'");
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: no-referrer');
header('X-Robots-Tag: noindex, nofollow, noarchive');
if ($https) header('Strict-Transport-Security: max-age=31536000');

// ----------------------------------------------------------- OTURUM --------
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure'   => $https,
    ]);
    session_name('akdpanel');
    session_start();
}

require __DIR__ . '/yardimci.php';
require __DIR__ . '/depo.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/totp.php';

// -------------------------------------------------------- IP KISITI --------
if (PANEL_IP_LISTESI !== '' && !$yerelmi) {
    $izinliIpler = array_values(array_filter(array_map('trim', explode(',', PANEL_IP_LISTESI))));
    if ($izinliIpler && !in_array(istemci_ip(), $izinliIpler, true)) {
        http_response_code(403);
        header('Content-Type: text/plain; charset=utf-8');
        exit('Bu panele bu ağdan erişilemiyor.');
    }
}
