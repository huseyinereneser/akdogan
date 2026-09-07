<?php
/**
 * auth.php — oturum, giriş, kaba kuvvet kilidi, CSRF, rol kontrolü
 */

// -------------------------------------------------------------- CSRF -------
function csrf_belirtec(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = kimlik(16);
    return $_SESSION['csrf'];
}
function csrf_alan(): string {
    return '<input type="hidden" name="csrf" value="' . e(csrf_belirtec()) . '">';
}
function csrf_dogrula(): void {
    $gonderilen = $_POST['csrf'] ?? '';
    if (!is_string($gonderilen) || !hash_equals($_SESSION['csrf'] ?? '', $gonderilen)) {
        http_response_code(400);
        exit('Oturum doğrulaması başarısız. Sayfayı yenileyip tekrar deneyin.');
    }
}

// ------------------------------------------------------ KABA KUVVET --------
function kilit_dosya(string $kimlik): string {
    return KILIT_DIZIN . '/' . md5($kimlik) . '.json';
}
function kilitli_mi(string $kimlik, int $esik = AZAMI_DENEME): int {
    $d = json_oku(kilit_dosya($kimlik));
    if (($d['sayi'] ?? 0) >= $esik) {
        $kalan = ((int)($d['son'] ?? 0) + KILIT_DK * 60) - time();
        if ($kalan > 0) return (int)ceil($kalan / 60);
        @unlink(kilit_dosya($kimlik));
    }
    return 0;
}
function deneme_ekle(string $kimlik): void {
    $d = json_oku(kilit_dosya($kimlik));
    json_yaz(kilit_dosya($kimlik), [
        'sayi' => (int)($d['sayi'] ?? 0) + 1,
        'son'  => time(),
    ]);
}
function deneme_sifirla(string $kimlik): void {
    @unlink(kilit_dosya($kimlik));
}

// ---------------------------------------------------- ŞİFRE KURALI --------
/** Şifre panel kuralına uygun mu? Uygunsa null, değilse hata metni döndürür. */
function sifre_sorunu(string $sifre): ?string {
    if (strlen($sifre) < SIFRE_ASGARI) {
        return 'Şifre en az ' . SIFRE_ASGARI . ' karakter olmalı.';
    }
    if (SIFRE_KARMASIK && (!preg_match('/[A-Za-z]/', $sifre) || !preg_match('/\d/', $sifre))) {
        return 'Şifre en az bir harf ve bir rakam içermeli.';
    }
    return null;
}

// -------------------------------------------------- GİRİŞ GEÇMİŞİ ---------
/**
 * Başarılı girişte kullanıcı kaydına son giriş bilgisini işler (kullanıcı
 * başına son 10). Sürüm anlık görüntüsü üretmemek için users.json'a
 * doğrudan yazar — bu üst veri geçmişe alınacak kadar önemli değil.
 */
function giris_gecmisi_ekle(string $uid): void {
    $yol = VERI_DIZIN . '/users.json';
    $d = json_oku($yol);
    $liste = $d['kullanicilar'] ?? [];
    if (!$liste) return;
    $ua = substr(trim((string)($_SERVER['HTTP_USER_AGENT'] ?? '')), 0, 200);
    $degisti = false;
    foreach ($liste as &$u) {
        if (($u['id'] ?? '') === $uid) {
            $g = $u['giris_gecmisi'] ?? [];
            array_unshift($g, ['t' => time(), 'ip' => istemci_ip(), 'ua' => $ua]);
            $u['giris_gecmisi'] = array_slice($g, 0, 10);
            $degisti = true;
        }
    }
    unset($u);
    if ($degisti) json_yaz($yol, ['kullanicilar' => array_values($liste)]);
}

// --------------------------------------------------------- KULLANICI ------
function kullanici_bul(string $epostaVeyaAd): ?array {
    $k = mb_strtolower(trim($epostaVeyaAd));
    foreach (kullanici_oku() as $u) {
        if (mb_strtolower($u['eposta'] ?? '') === $k || mb_strtolower($u['kadi'] ?? '') === $k) {
            return $u;
        }
    }
    return null;
}

function giris_yap(array $kullanici): void {
    session_regenerate_id(true);
    $_SESSION['uid']  = $kullanici['id'];
    $_SESSION['ad']   = $kullanici['ad'] ?? $kullanici['eposta'];
    $_SESSION['rol']  = $kullanici['rol'] ?? 'editor';
    $_SESSION['muhur'] = $kullanici['oturum_muhuru'] ?? '';  // şifre değişince diğer oturumları düşür
    $_SESSION['son_hareket'] = time();
    unset($_SESSION['csrf']); // yeni belirteç üretilecek
}

/** Kullanıcı kaydına yeni bir oturum mührü bas (mevcut tüm oturumları geçersiz kılar) */
function oturum_muhurle(array &$kullanici): void {
    $kullanici['oturum_muhuru'] = kimlik(8);
}

function cikis_yap(): void {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

/** Giriş zorunlu — değilse login'e at. Sayfaların en başında çağrılır. */
function oturum_gerekli(): array {
    if (empty($_SESSION['uid'])) git('login.php');

    // hareketsizlik zaman aşımı
    if (time() - (int)($_SESSION['son_hareket'] ?? 0) > OTURUM_DK * 60) {
        cikis_yap();
        session_start();
        flash_koy('uyari', 'Oturum süresi doldu, lütfen tekrar giriş yapın.');
        git('login.php');
    }
    $_SESSION['son_hareket'] = time();

    // kullanıcı hâlâ var mı? oturum mührü tutuyor mu?
    foreach (kullanici_oku() as $u) {
        if ($u['id'] === $_SESSION['uid']) {
            if (($u['oturum_muhuru'] ?? '') !== ($_SESSION['muhur'] ?? '')) {
                cikis_yap();
                session_start();
                flash_koy('uyari', 'Şifre değiştiği için oturumunuz kapatıldı. Lütfen tekrar giriş yapın.');
                git('login.php');
            }
            $_SESSION['rol'] = $u['rol'] ?? 'editor';
            return $u;
        }
    }
    cikis_yap();
    session_start();
    git('login.php');
}

function yonetici_mi(): bool { return ($_SESSION['rol'] ?? '') === 'yonetici'; }

/** Sadece yönetici erişebilir — değilse panele geri at */
function yonetici_gerekli(): void {
    if (!yonetici_mi()) {
        flash_koy('hata', 'Bu bölüme yalnızca Yönetici erişebilir.');
        git('index.php');
    }
}
