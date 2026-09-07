<?php
/**
 * kurtarma.php — parola kurtarma.
 *
 * E-posta gönderimine güvenmez: paylaşımlı hostlarda mail() çoğu zaman
 * çalışmaz. Bunun yerine "sunucuya erişebilen kişi = sitenin sahibi"
 * mantığını kullanır (kurulum.php'yi silme mantığının aynısı):
 *
 *   1. Hosting dosya yöneticisi / FTP ile
 *      panel-9f3a7e21/veri/kurtarma.izin  adında (içeriği önemsiz) bir
 *      dosya oluşturun.
 *   2. Bu sayfaya girip e-posta + yeni şifre yazın.
 *   3. Şifre güncellenir ve kurtarma.izin dosyası otomatik silinir.
 */
require __DIR__ . '/inc/on.php';

if (!empty($_SESSION['uid'])) git('index.php');

// Kurulum hiç yapılmadıysa önce o
if (count(kullanici_oku()) === 0 && !kurulum_kilitli()) git('kurulum.php');

$izinVar = is_file(KURTARMA_IZNI);
$hata = '';

if ($izinVar && $_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $eposta = mb_strtolower(girdi('eposta'));
    $sifre  = girdi('sifre');
    $sifre2 = girdi('sifre2');
    $anahtar = istemci_ip() . '|kurtarma|' . $eposta;

    $kilitDk = kilitli_mi($anahtar);
    if ($kilitDk > 0) {
        $hata = "Çok fazla deneme. Lütfen $kilitDk dakika sonra tekrar deneyin.";
    } elseif (!filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
        $hata = 'Geçerli bir e-posta girin.';
    } elseif (sifre_sorunu($sifre) !== null) {
        $hata = sifre_sorunu($sifre);
    } elseif ($sifre !== $sifre2) {
        $hata = 'Şifreler eşleşmiyor.';
    } else {
        $liste = kullanici_oku();
        $bulundu = false;
        foreach ($liste as &$u) {
            if (mb_strtolower($u['eposta'] ?? '') === $eposta) {
                $u['sifre_hash'] = password_hash($sifre, PASSWORD_DEFAULT);
                oturum_muhurle($u);                 // varsa açık oturumları düşür
                unset($u['totp_secret'], $u['totp_aktif'], $u['totp_yedek']);  // authenticator da kaybolmuşsa kilitlenme
                $bulundu = true;
            }
        }
        unset($u);

        if ($bulundu) {
            if (kullanici_yaz($liste)) {
                deneme_sifirla($anahtar);
                @unlink(KURTARMA_IZNI);             // tek kullanımlık
                gunluk_yaz('parola-kurtarma', $eposta);
            } else {
                $hata = 'Kaydedilemedi — veri klasörünün yazma izni olduğundan emin olun.';
            }
        } else {
            password_hash($sifre, PASSWORD_DEFAULT);   // "hesap yok" ile "hesap var" arasındaki zamanlama farkını gizle
            deneme_ekle($anahtar);
            gunluk_yaz('parola-kurtarma-basarisiz', $eposta);
        }

        // E-posta sızıntısını önlemek için: hesap bulunsa da bulunmasa da
        // uzaktan bakan biri aynı sonucu görür.
        if ($hata === '') {
            flash_koy('basari', 'İşlem alındı. Bu e-posta kayıtlıysa şifresi güncellendi (varsa iki adımlı doğrulama da kapatıldı) ve kurtarma.izin dosyası silindi. Yeni şifrenizle giriş yapmayı deneyin.');
            git('login.php');
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
<title>Parola Kurtarma · Akdoğan Turizm Yönetim</title>
<link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<div class="giris-sar">
  <div class="giris-kutu">
    <img src="../assets/img/logo.png" alt="Akdoğan Turizm" width="170">
    <h1>Parola kurtarma</h1>

    <?php foreach (flash_al() as $f): ?>
      <div class="uyari uyari--<?= e($f['tur']) ?>"><?= e($f['mesaj']) ?></div>
    <?php endforeach; ?>
    <?php if ($hata): ?><div class="uyari uyari--hata"><?= e($hata) ?></div><?php endif; ?>

    <?php if (!$izinVar): ?>
      <div class="uyari uyari--uyari" style="margin-bottom:0">
        <p style="margin:0 0 10px"><b>Bu sayfa şu an kapalı.</b> Açmak için sunucuya erişmeniz gerekir:</p>
        <ol style="margin:0;padding-left:20px">
          <li>Hosting <b>Dosya Yöneticisi</b> (veya FTP) ile
              <code>panel-9f3a7e21/veri/</code> klasörüne girin.</li>
          <li>İçi boş, adı <code>kurtarma.izin</code> olan bir dosya oluşturun.</li>
          <li>Bu sayfayı <b>yenileyin</b> — şifre sıfırlama formu görünecek.</li>
        </ol>
        <p class="ipucu" style="margin-top:10px">Şifre güncellenince bu dosya otomatik silinir; kapı tekrar kilitlenir.</p>
      </div>
      <p class="ipucu" style="text-align:center;margin-top:16px"><a href="login.php">← Girişe dön</a></p>
    <?php else: ?>
      <form method="post" autocomplete="off">
        <?= csrf_alan() ?>
        <div class="alan"><label>Hesabın e-postası</label><input type="email" name="eposta" required autofocus></div>
        <div class="alan"><label>Yeni şifre (en az <?= SIFRE_ASGARI ?> karakter<?= SIFRE_KARMASIK ? ', harf + rakam' : '' ?>)</label><input type="password" name="sifre" required></div>
        <div class="alan"><label>Yeni şifre (tekrar)</label><input type="password" name="sifre2" required></div>
        <button class="btn btn--ana" type="submit" style="width:100%;justify-content:center">Şifreyi sıfırla</button>
        <p class="ipucu" style="text-align:center;margin-top:16px"><a href="login.php">← Girişe dön</a></p>
      </form>
    <?php endif; ?>
  </div>
</div>
</body>
</html>
