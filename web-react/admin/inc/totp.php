<?php
/**
 * totp.php — RFC 6238 tabanlı iki adımlı doğrulama (TOTP). Bağımlılık yok.
 * Google Authenticator, Authy, 1Password, Microsoft Authenticator vb. ile uyumlu
 * (SHA1, 6 hane, 30 sn periyot).
 */

const TOTP_HARITA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';   // Base32 (RFC 4648)

/** Base32 metni ham baytlara çöz */
function taban32_coz(string $b32): string {
    $b32 = strtoupper(preg_replace('/[^A-Za-z2-7]/', '', $b32));
    if ($b32 === '') return '';
    $bit = '';
    foreach (str_split($b32) as $c) {
        $v = strpos(TOTP_HARITA, $c);
        if ($v === false) continue;
        $bit .= str_pad(decbin($v), 5, '0', STR_PAD_LEFT);
    }
    $cikti = '';
    foreach (str_split($bit, 8) as $bayt) {
        if (strlen($bayt) === 8) $cikti .= chr(bindec($bayt));
    }
    return $cikti;
}

/** Yeni rastgele gizli anahtar (16 Base32 karakter ≈ 80 bit) */
function totp_gizli_uret(int $uzunluk = 16): string {
    $s = '';
    for ($i = 0; $i < $uzunluk; $i++) $s .= TOTP_HARITA[random_int(0, 31)];
    return $s;
}

/** Belirli bir 30 sn'lik adım için 6 haneli kod */
function totp_kod(string $gizli, ?int $adim = null): string {
    $anahtar = taban32_coz($gizli);
    if ($anahtar === '') return '';
    $adim = $adim ?? (int) floor(time() / 30);
    $veri = pack('J', $adim);                       // 8 baytlık big-endian sayaç
    $ozet = hash_hmac('sha1', $veri, $anahtar, true);
    $ofset = ord($ozet[strlen($ozet) - 1]) & 0x0F;
    $parca = ((ord($ozet[$ofset]) & 0x7F) << 24)
           | ((ord($ozet[$ofset + 1]) & 0xFF) << 16)
           | ((ord($ozet[$ofset + 2]) & 0xFF) << 8)
           | (ord($ozet[$ofset + 3]) & 0xFF);
    return str_pad((string) ($parca % 1000000), 6, '0', STR_PAD_LEFT);
}

/** Kullanıcının girdiği kodu ±1 adım toleransla doğrula */
function totp_dogrula(string $gizli, string $kod): bool {
    $kod = preg_replace('/\D/', '', $kod);
    if (strlen($kod) !== 6 || $gizli === '') return false;
    $simdi = (int) floor(time() / 30);
    for ($d = -1; $d <= 1; $d++) {
        $beklenen = totp_kod($gizli, $simdi + $d);
        if ($beklenen !== '' && hash_equals($beklenen, $kod)) return true;
    }
    return false;
}

/** Authenticator uygulamasına elle/QR ile girilecek otpauth:// URI'si */
function totp_uri(string $gizli, string $hesap, string $yayinci = 'Akdogan Turizm'): string {
    return 'otpauth://totp/' . rawurlencode($yayinci . ':' . $hesap)
         . '?secret=' . $gizli
         . '&issuer=' . rawurlencode($yayinci)
         . '&period=30&digits=6&algorithm=SHA1';
}

// -------------------------------------------------- YEDEK KODLAR ----------
/** Telefon kaybında kullanılacak tek seferlik yedek kodlar (biçim: a1b2-c3d4) */
function totp_yedek_uret(int $adet = 10): array {
    $kodlar = [];
    for ($i = 0; $i < $adet; $i++) {
        $ham = bin2hex(random_bytes(4));                    // 8 onaltılık
        $kodlar[] = substr($ham, 0, 4) . '-' . substr($ham, 4, 4);
    }
    return $kodlar;
}

/** Yedek kodları saklamak için karma dizisine çevir */
function totp_yedek_hashle(array $kodlar): array {
    return array_map(
        fn($k) => password_hash(preg_replace('/[^a-z0-9]/', '', strtolower((string)$k)), PASSWORD_DEFAULT),
        $kodlar
    );
}

/**
 * Girilen kodu yedek karma listesinde arar. Bulursa o karmayı listeden
 * çıkarır (referansla) ve true döndürür. Kod tek kullanımlıktır.
 */
function totp_yedek_tuket(array &$hashler, string $girilen): bool {
    $g = preg_replace('/[^a-z0-9]/', '', strtolower($girilen));
    if (strlen($g) < 6) return false;
    foreach ($hashler as $i => $h) {
        if (is_string($h) && password_verify($g, $h)) {
            unset($hashler[$i]);
            $hashler = array_values($hashler);
            return true;
        }
    }
    return false;
}
