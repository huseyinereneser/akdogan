<?php
/**
 * kurulum.php — ilk yönetici hesabını oluşturur.
 *
 * Yalnızca hiç kullanıcı yokken VE kurulum kilidi (veri/kurulum.kilit)
 * yazılmamışken çalışır. İlk hesap oluşturulur oluşturulmaz kilit yazılır ve
 * bu sayfa kalıcı olarak devre dışı kalır — dosyayı silmeyi unutsanız bile
 * bir daha yeni yönetici açılamaz. Yine de güvenlik için dosyayı sunucudan
 * silmeniz önerilir.
 */
require __DIR__ . '/inc/on.php';

// Kurulum tamamlandıysa buraya giriş yok
if (kurulum_kilitli() || count(kullanici_oku()) > 0) {
    kurulum_kilidi_yaz();
    flash_koy('uyari', 'Kurulum zaten tamamlanmış. Giriş yapın.');
    git('login.php');
}

$hata = '';
$ad = $kadi = $eposta = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $ad     = girdi('ad');
    $kadi   = mb_strtolower(trim(girdi('kadi')));
    $eposta = mb_strtolower(girdi('eposta'));
    $sifre  = girdi('sifre');
    $sifre2 = girdi('sifre2');

    if ($ad === '' || !filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
        $hata = 'Ad ve geçerli bir e-posta girin.';
    } elseif (!preg_match('/^[a-z0-9._-]{3,32}$/', $kadi)) {
        $hata = 'Kullanıcı adı 3-32 karakter olmalı; sadece harf, rakam, nokta, tire ve alt çizgi.';
    } elseif (sifre_sorunu($sifre) !== null) {
        $hata = sifre_sorunu($sifre);
    } elseif ($sifre !== $sifre2) {
        $hata = 'Şifreler eşleşmiyor.';
    } else {
        $yonetici = [
            'id'          => kimlik(6),
            'ad'          => $ad,
            'eposta'      => $eposta,
            'kadi'        => $kadi,
            'sifre_hash'  => password_hash($sifre, PASSWORD_DEFAULT),
            'rol'         => 'yonetici',
            'olusturma'   => date('c'),
        ];
        oturum_muhurle($yonetici);

        if (kullanici_yaz([$yonetici])) {
            kurulum_kilidi_yaz();
            gunluk_yaz('kurulum', $kadi);
            flash_koy('basari', 'Yönetici hesabı oluşturuldu. Güvenlik için kurulum.php dosyasını sunucudan silin, sonra giriş yapın.');
            git('login.php');
        }
        $hata = 'Kaydedilemedi — panelin veri klasörünün (panel-9f3a7e21/veri/) yazma izni yok gibi görünüyor.';
    }
}
?><!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<script src="assets/tema.js"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Kurulum · Akdoğan Turizm Yönetim</title>
<link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<div class="giris-sar">
  <form class="giris-kutu" method="post" autocomplete="off">
    <img src="../assets/img/logo.png" alt="Akdoğan Turizm" width="170">
    <h1>İlk yönetici hesabı</h1>
    <p class="ipucu">Bu ekran yalnızca bir kez görünür. Hesap oluşturulunca kurulum kalıcı olarak kapanır.</p>
    <?php if ($hata): ?><div class="uyari uyari--hata"><?= e($hata) ?></div><?php endif; ?>
    <?= csrf_alan() ?>
    <div class="alan"><label>Ad Soyad</label><input type="text" name="ad" value="<?= e($ad) ?>" required autofocus></div>
    <div class="alan"><label>Kullanıcı adı (girişte kullanılır)</label><input type="text" name="kadi" value="<?= e($kadi) ?>" required pattern="[a-z0-9._-]{3,32}" autocapitalize="off" spellcheck="false"></div>
    <div class="alan"><label>E-posta</label><input type="email" name="eposta" value="<?= e($eposta) ?>" required></div>
    <div class="alan"><label>Şifre (en az <?= SIFRE_ASGARI ?> karakter<?= SIFRE_KARMASIK ? ', harf + rakam' : '' ?>)</label><input type="password" name="sifre" required></div>
    <div class="alan"><label>Şifre (tekrar)</label><input type="password" name="sifre2" required></div>
    <button class="btn btn--ana" type="submit" style="width:100%;justify-content:center">Hesabı oluştur</button>
  </form>
</div>
</body>
</html>
