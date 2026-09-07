<?php
require __DIR__ . '/inc/on.php';

// Zaten girişliyse panele
if (!empty($_SESSION['uid'])) git('index.php');

// Hiç kullanıcı yoksa kuruluma yönlendir (kurulum daha önce tamamlanmadıysa)
if (count(kullanici_oku()) === 0 && !kurulum_kilitli()) git('kurulum.php');

// İki adımlı doğrulama bekleyen oturum 5 dakikada zaman aşımına uğrar
if (!empty($_SESSION['2fa_bekleyen']) && (time() - (int)($_SESSION['2fa_bekleyen']['t'] ?? 0) > 300)) {
    unset($_SESSION['2fa_bekleyen']);
}

$hata = '';
$kimlikAnahtari = istemci_ip();
$asama = !empty($_SESSION['2fa_bekleyen']) ? 'kod' : 'sifre';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();

    // ------------------------------------------- 2. AŞAMA: TOTP kodu ---
    if ($asama === 'kod') {
        if (girdi('vazgec') === '1') { unset($_SESSION['2fa_bekleyen']); git('login.php'); }

        $bek = $_SESSION['2fa_bekleyen'];
        $u = null;
        foreach (kullanici_oku() as $k) if ($k['id'] === ($bek['id'] ?? '')) $u = $k;

        if (!$u || empty($u['totp_aktif']) || empty($u['totp_secret'])) {
            unset($_SESSION['2fa_bekleyen']);
            git('login.php');
        }

        $kodAnahtar = '2fa|' . $u['id'];
        if (kilitli_mi($kodAnahtar, AZAMI_DENEME) > 0) {
            $hata = 'Çok fazla hatalı kod. Lütfen bir süre sonra tekrar deneyin.';
        } elseif (totp_dogrula($u['totp_secret'], girdi('kod'))) {
            deneme_sifirla($kodAnahtar);
            unset($_SESSION['2fa_bekleyen']);
            giris_yap($u);
            giris_gecmisi_ekle($u['id']);
            gunluk_yaz('giris', 'başarılı · 2FA');
            git('index.php');
        } else {
            $yedek = $u['totp_yedek'] ?? [];
            if ($yedek && totp_yedek_tuket($yedek, girdi('kod'))) {
                // Yedek kod ile giriş — kullanılan kod kalıcı olarak silinir
                $liste = kullanici_oku();
                foreach ($liste as &$k) if ($k['id'] === $u['id']) $k['totp_yedek'] = $yedek;
                unset($k);
                kullanici_yaz($liste);
                deneme_sifirla($kodAnahtar);
                unset($_SESSION['2fa_bekleyen']);
                giris_yap($u);
                giris_gecmisi_ekle($u['id']);
                gunluk_yaz('giris', 'başarılı · 2FA yedek kod');
                flash_koy('uyari', 'Yedek kod ile giriş yaptınız. Kalan yedek kod: ' . count($yedek)
                    . '. "Hesabım" sayfasından yeni kod üretebilirsiniz.');
                git('index.php');
            }
            deneme_ekle($kodAnahtar);
            gunluk_yaz('giris-basarisiz', ($u['kadi'] ?? $u['id']) . ' · 2FA kodu');
            $hata = 'Doğrulama kodu veya yedek kod hatalı.';
        }
    }

    // ---------------------------------- 1. AŞAMA: kullanıcı + şifre ---
    else {
        $kadi   = girdi('kadi');
        $sifre  = girdi('sifre');
        $anahtar      = $kimlikAnahtari . '|' . mb_strtolower($kadi);
        $hesapAnahtar = 'hesap|' . mb_strtolower($kadi);   // IP değişse de hesabı korur

        $kilitDk = max(kilitli_mi($anahtar), kilitli_mi($hesapAnahtar, AZAMI_HESAP_DEN));
        if ($kilitDk > 0) {
            $hata = "Çok fazla hatalı deneme. Lütfen $kilitDk dakika sonra tekrar deneyin.";
        } else {
            $u = kullanici_bul($kadi);
            if ($u && !empty($u['sifre_hash']) && password_verify($sifre, $u['sifre_hash'])) {
                deneme_sifirla($anahtar);
                deneme_sifirla($hesapAnahtar);
                // hash algoritması eskiyse tazele
                if (password_needs_rehash($u['sifre_hash'], PASSWORD_DEFAULT)) {
                    $liste = kullanici_oku();
                    foreach ($liste as &$k) if ($k['id'] === $u['id']) $k['sifre_hash'] = password_hash($sifre, PASSWORD_DEFAULT);
                    unset($k);
                    kullanici_yaz($liste);
                }
                if (!empty($u['totp_aktif']) && !empty($u['totp_secret'])) {
                    $_SESSION['2fa_bekleyen'] = ['id' => $u['id'], 't' => time()];
                    git('login.php');   // 2. aşamayı göster
                }
                giris_yap($u);
                giris_gecmisi_ekle($u['id']);
                gunluk_yaz('giris', 'başarılı');
                git('index.php');
            } else {
                if (!$u || empty($u['sifre_hash'])) password_hash($sifre, PASSWORD_DEFAULT);  // kullanıcı adı geçerli/geçersiz zamanlamasını eşitle
                deneme_ekle($anahtar);
                deneme_ekle($hesapAnahtar);
                gunluk_yaz('giris-basarisiz', $kadi !== '' ? $kadi : '(kullanıcı adı boş)');
                $kalan = AZAMI_DENEME - (int)(json_oku(kilit_dosya($anahtar))['sayi'] ?? 0);
                $hata = 'Kullanıcı adı veya şifre hatalı.' . ($kalan > 0 && $kalan <= 2 ? " ($kalan deneme hakkınız kaldı)" : '');
            }
        }
    }
}
?><!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<script src="assets/tema.js"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Giriş · Akdoğan Turizm Yönetim</title>
<link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<div class="giris-sar">
  <form class="giris-kutu" method="post" autocomplete="off">
    <img src="../assets/img/logo.png" alt="Akdoğan Turizm" width="170">
    <?php foreach (flash_al() as $f): ?>
      <div class="uyari uyari--<?= e($f['tur']) ?>"><?= e($f['mesaj']) ?></div>
    <?php endforeach; ?>
    <?php if ($hata): ?><div class="uyari uyari--hata"><?= e($hata) ?></div><?php endif; ?>
    <?= csrf_alan() ?>

    <?php if ($asama === 'kod'): ?>
      <h1>İki adımlı doğrulama</h1>
      <p class="ipucu" style="margin-top:-6px">Authenticator uygulamanızdaki 6 haneli kodu ya da
        telefonunuza erişemiyorsanız bir yedek kodu (örn. <code>a1b2-c3d4</code>) girin.</p>
      <div class="alan"><label>Doğrulama kodu veya yedek kod</label>
        <input type="text" name="kod" autocomplete="one-time-code" maxlength="12" required autofocus autocapitalize="off" spellcheck="false">
      </div>
      <button class="btn btn--ana" type="submit" style="width:100%;justify-content:center">Doğrula</button>
      <button class="btn btn--sade" type="submit" name="vazgec" value="1" style="width:100%;justify-content:center;margin-top:8px">Vazgeç</button>
    <?php else: ?>
      <h1>Yönetim paneline giriş</h1>
      <div class="alan"><label>Kullanıcı adı</label><input type="text" name="kadi" required autofocus autocapitalize="off" spellcheck="false"></div>
      <div class="alan"><label>Şifre</label><input type="password" name="sifre" required></div>
      <button class="btn btn--ana" type="submit" style="width:100%;justify-content:center">Giriş yap</button>
      <p class="ipucu" style="text-align:center;margin-top:16px"><a href="kurtarma.php">Şifremi unuttum</a></p>
    <?php endif; ?>
  </form>
</div>
</body>
</html>
