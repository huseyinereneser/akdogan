<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();

/** Yardımcı: $kullanici['id'] kaydını listede güncelleyip yaz */
function hesap_guncelle(callable $degistir): void {
    global $kullanici;
    $liste = kullanici_oku();
    foreach ($liste as &$u) {
        if ($u['id'] === $kullanici['id']) $degistir($u);
    }
    unset($u);
    kullanici_yaz($liste);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $eylem = girdi('eylem');
    $liste = kullanici_oku();

    if ($eylem === 'bilgi') {
        $ad     = girdi('ad');
        $eposta = mb_strtolower(girdi('eposta'));
        if ($ad === '' || !filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
            flash_koy('hata', 'Ad ve geçerli bir e-posta girin.');
        } elseif (array_filter($liste, fn($u) => $u['id'] !== $kullanici['id'] && mb_strtolower($u['eposta'] ?? '') === $eposta)) {
            flash_koy('hata', 'Bu e-posta başka bir hesapta kayıtlı.');
        } else {
            hesap_guncelle(function (&$u) use ($ad, $eposta) { $u['ad'] = $ad; $u['eposta'] = $eposta; });
            $_SESSION['ad'] = $ad;
            gunluk_yaz('hesap-guncelle');
            flash_koy('basari', 'Hesap bilgileriniz güncellendi.');
        }
        git('hesap.php');
    }

    if ($eylem === 'sifre') {
        $eski  = girdi('eski');
        $yeni  = girdi('yeni');
        $yeni2 = girdi('yeni2');
        if (!password_verify($eski, $kullanici['sifre_hash'] ?? '')) {
            flash_koy('hata', 'Mevcut şifre yanlış.');
        } elseif (sifre_sorunu($yeni) !== null) {
            flash_koy('hata', sifre_sorunu($yeni));
        } elseif ($yeni !== $yeni2) {
            flash_koy('hata', 'Yeni şifreler eşleşmiyor.');
        } else {
            $yeniMuhur = kimlik(8);
            hesap_guncelle(function (&$u) use ($yeni, $yeniMuhur) {
                $u['sifre_hash'] = password_hash($yeni, PASSWORD_DEFAULT);
                $u['oturum_muhuru'] = $yeniMuhur;
            });
            $_SESSION['muhur'] = $yeniMuhur;   // bu oturum açık kalsın, diğerleri düşsün
            gunluk_yaz('sifre-degistir');
            flash_koy('basari', 'Şifreniz güncellendi. Varsa diğer cihazlardaki oturumlar kapatıldı.');
        }
        git('hesap.php');
    }

    if ($eylem === 'oturumlari-kapat') {
        $yeniMuhur = kimlik(8);
        hesap_guncelle(function (&$u) use ($yeniMuhur) { $u['oturum_muhuru'] = $yeniMuhur; });
        $_SESSION['muhur'] = $yeniMuhur;
        gunluk_yaz('oturum-sifirla');
        flash_koy('basari', 'Diğer tüm cihazlardaki oturumlar kapatıldı.');
        git('hesap.php');
    }

    // -- İki adımlı doğrulama --------------------------------------------
    if ($eylem === '2fa-kur') {
        $_SESSION['totp_kurulum'] = totp_gizli_uret();
        git('hesap.php');
    }
    if ($eylem === '2fa-iptal') {
        unset($_SESSION['totp_kurulum']);
        git('hesap.php');
    }
    if ($eylem === '2fa-etkinlestir') {
        $gizli = $_SESSION['totp_kurulum'] ?? '';
        if ($gizli === '') {
            flash_koy('hata', 'Kurulum oturumu bulunamadı, tekrar başlayın.');
        } elseif (!totp_dogrula($gizli, girdi('kod'))) {
            flash_koy('hata', 'Kod doğrulanamadı. Telefonunuzun saati doğru mu? Tekrar deneyin.');
        } else {
            $yedekKodlar = totp_yedek_uret();
            hesap_guncelle(function (&$u) use ($gizli, $yedekKodlar) {
                $u['totp_secret'] = $gizli;
                $u['totp_aktif'] = true;
                $u['totp_yedek'] = totp_yedek_hashle($yedekKodlar);
            });
            unset($_SESSION['totp_kurulum']);
            $_SESSION['2fa_yeni_kodlar'] = $yedekKodlar;   // sayfada bir kez gösterilir
            gunluk_yaz('2fa-acildi');
            flash_koy('basari', 'İki adımlı doğrulama etkinleştirildi. Yedek kodlarınızı aşağıdan kaydedin.');
        }
        git('hesap.php');
    }
    if ($eylem === '2fa-yeni-kod') {
        $sifre = girdi('sifre');
        $kod   = girdi('kod');
        $sifreTamam = $sifre !== '' && password_verify($sifre, $kullanici['sifre_hash'] ?? '');
        $kodTamam   = $kod !== '' && !empty($kullanici['totp_secret']) && totp_dogrula($kullanici['totp_secret'], $kod);
        if (empty($kullanici['totp_aktif'])) {
            flash_koy('hata', 'İki adımlı doğrulama açık değil.');
        } elseif (!$sifreTamam && !$kodTamam) {
            flash_koy('hata', 'Yeni kod üretmek için mevcut şifrenizi veya geçerli bir kodu girin.');
        } else {
            $yedekKodlar = totp_yedek_uret();
            hesap_guncelle(function (&$u) use ($yedekKodlar) { $u['totp_yedek'] = totp_yedek_hashle($yedekKodlar); });
            $_SESSION['2fa_yeni_kodlar'] = $yedekKodlar;
            gunluk_yaz('2fa-yedek-kod');
            flash_koy('basari', 'Yeni yedek kodlar üretildi. Eski kodlar artık geçersiz.');
        }
        git('hesap.php');
    }
    if ($eylem === '2fa-kapat') {
        $sifre = girdi('sifre');
        $kod   = girdi('kod');
        $sifreTamam = $sifre !== '' && password_verify($sifre, $kullanici['sifre_hash'] ?? '');
        $kodTamam   = $kod !== '' && !empty($kullanici['totp_secret']) && totp_dogrula($kullanici['totp_secret'], $kod);
        if (!$sifreTamam && !$kodTamam) {
            flash_koy('hata', 'Kapatmak için mevcut şifrenizi veya geçerli bir kodu girin.');
        } else {
            hesap_guncelle(function (&$u) { unset($u['totp_secret'], $u['totp_aktif'], $u['totp_yedek']); });
            gunluk_yaz('2fa-kapandi');
            flash_koy('basari', 'İki adımlı doğrulama kapatıldı.');
        }
        git('hesap.php');
    }
}

$yeniKodlar = $_SESSION['2fa_yeni_kodlar'] ?? null;
unset($_SESSION['2fa_yeni_kodlar']);   // yalnızca bir kez göster

$iki = !empty($kullanici['totp_aktif']);
$kurulumGizli = $_SESSION['totp_kurulum'] ?? '';

$baslik = 'Hesabım'; $aktif = 'hesap';
include __DIR__ . '/inc/ust.php';
?>

<div class="kart" style="max-width:460px">
  <h2>Hesap bilgileri</h2>
  <p class="ipucu">Yönetici</p>
  <form method="post" autocomplete="off">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="bilgi">
    <div class="alan"><label>Ad Soyad</label><input type="text" name="ad" value="<?= e($kullanici['ad'] ?? '') ?>" required></div>
    <div class="alan"><label>E-posta</label><input type="email" name="eposta" value="<?= e($kullanici['eposta'] ?? '') ?>" required></div>
    <p class="ipucu">Kullanıcı adınız (<b><?= e($kullanici['kadi'] ?? '—') ?></b>) değiştirilemez.</p>
    <button class="btn btn--ana" type="submit">Bilgileri kaydet</button>
  </form>
</div>

<div class="kart" style="max-width:460px">
  <h2>Şifre değiştir</h2>
  <form method="post" autocomplete="off">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="sifre">
    <div class="alan"><label>Mevcut şifre</label><input type="password" name="eski" required></div>
    <div class="alan"><label>Yeni şifre (en az <?= SIFRE_ASGARI ?> karakter<?= SIFRE_KARMASIK ? ', harf + rakam' : '' ?>)</label><input type="password" name="yeni" required></div>
    <div class="alan"><label>Yeni şifre (tekrar)</label><input type="password" name="yeni2" required></div>
    <button class="btn btn--ana" type="submit">Şifreyi güncelle</button>
  </form>
</div>

<div class="kart" style="max-width:460px">
  <h2>İki adımlı doğrulama (2FA)</h2>
  <?php if ($iki): ?>
    <?php $kalanYedek = count($kullanici['totp_yedek'] ?? []); ?>
    <p><span class="rozet rozet--ok2">Etkin ✓</span> Girişte şifrenizin yanında telefonunuzdaki koda da ihtiyacınız var.</p>
    <p class="ipucu">Kalan yedek kod: <b><?= $kalanYedek ?></b><?= $kalanYedek === 0 ? ' — telefonunuzu kaybederseniz giriş yapamazsınız, hemen yeni kod üretin.' : '' ?></p>
    <form method="post" autocomplete="off" style="margin-bottom:14px">
      <?= csrf_alan() ?>
      <input type="hidden" name="eylem" value="2fa-yeni-kod">
      <div class="alan"><label>Yeni yedek kod üret — onay için şifreniz <span class="ipucu">(veya 6 haneli kod)</span></label><input type="password" name="sifre"></div>
      <div class="alan"><label>Doğrulama kodu (şifre yerine)</label><input type="text" name="kod" inputmode="numeric" pattern="[0-9]*" maxlength="6"></div>
      <button class="btn btn--sade" type="submit">Yeni yedek kodlar üret</button>
    </form>
    <form method="post" autocomplete="off" data-onay="İki adımlı doğrulama kapatılsın mı?">
      <?= csrf_alan() ?>
      <input type="hidden" name="eylem" value="2fa-kapat">
      <div class="alan"><label>Kapatmak için mevcut şifreniz <span class="ipucu">(veya 6 haneli bir kod)</span></label><input type="password" name="sifre"></div>
      <div class="alan"><label>Doğrulama kodu (şifre yerine)</label><input type="text" name="kod" inputmode="numeric" pattern="[0-9]*" maxlength="6"></div>
      <button class="btn btn--kirmizi" type="submit">2FA'yı kapat</button>
    </form>
  <?php elseif ($kurulumGizli !== ''): ?>
    <p class="ipucu">Authenticator uygulamanıza (Google Authenticator, Authy, Microsoft Authenticator…)
      aşağıdaki anahtarı elle ekleyin, sonra ürettiği 6 haneli kodu girip doğrulayın.</p>
    <div class="alan">
      <label>Kurulum anahtarı</label>
      <input type="text" value="<?= e($kurulumGizli) ?>" readonly data-tiklayinca-sec style="font-family:ui-monospace,Consolas,monospace;letter-spacing:2px">
    </div>
    <p class="ipucu" style="word-break:break-all">otpauth bağlantısı:<br><code><?= e(totp_uri($kurulumGizli, $kullanici['eposta'] ?? $kullanici['kadi'] ?? 'hesap')) ?></code></p>
    <form method="post" autocomplete="off">
      <?= csrf_alan() ?>
      <input type="hidden" name="eylem" value="2fa-etkinlestir">
      <div class="alan"><label>Uygulamadaki 6 haneli kod</label><input type="text" name="kod" inputmode="numeric" pattern="[0-9]*" maxlength="6" required></div>
      <div class="btn-satir">
        <button class="btn btn--ana" type="submit">Etkinleştir</button>
        <button class="btn btn--sade" type="submit" name="eylem" value="2fa-iptal" formnovalidate>İptal</button>
      </div>
    </form>
  <?php else: ?>
    <p class="ipucu">Şu an kapalı. Etkinleştirirseniz her girişte telefonunuzdaki 6 haneli kod istenir.</p>
    <form method="post">
      <?= csrf_alan() ?>
      <input type="hidden" name="eylem" value="2fa-kur">
      <button class="btn btn--ana" type="submit">Kur</button>
    </form>
  <?php endif; ?>
</div>

<?php if ($yeniKodlar): ?>
<div class="kart" style="max-width:460px;border-color:var(--ok-bd)">
  <h2>Yedek kodlarınız</h2>
  <p class="ipucu">Bu liste <b>yalnızca şimdi</b> gösterilir. Yazdırın veya şifre yöneticinize
    kaydedin. Telefonunuza erişemediğinizde girişte kod yerine bunlardan birini
    kullanabilirsiniz; her kod bir kez çalışır.</p>
  <pre style="font:14px/1.9 ui-monospace,Consolas,monospace;background:var(--pre-bg);color:var(--ink);padding:12px 16px;border-radius:8px;margin:0;letter-spacing:1px"><?php foreach ($yeniKodlar as $k) echo e($k) . "\n"; ?></pre>
</div>
<?php endif; ?>

<div class="kart" style="max-width:460px">
  <h2>Oturumlar</h2>
  <p class="ipucu">Genel bir bilgisayarda oturum açık kaldıysa, bu düğme sizinki dışındaki
    tüm oturumları kapatır.</p>
  <form method="post" data-onay="Diğer tüm cihazlardaki oturumlar kapatılsın mı?">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="oturumlari-kapat">
    <button class="btn btn--sade" type="submit">Diğer cihazlardan çıkış yap</button>
  </form>
</div>

<div class="kart" style="max-width:640px">
  <h2>Son girişler</h2>
  <?php $gecmis = $kullanici['giris_gecmisi'] ?? []; ?>
  <?php if (!$gecmis): ?>
    <p class="ipucu" style="margin:0">Bu hesapta henüz kayıtlı giriş yok.</p>
  <?php else: ?>
    <div class="tablo-sar">
    <table class="liste">
      <thead><tr><th>Tarih</th><th>IP</th><th>Cihaz / tarayıcı</th></tr></thead>
      <tbody>
      <?php foreach ($gecmis as $g): ?>
        <tr>
          <td style="white-space:nowrap"><?= e(tarih_tr($g['t'] ?? 0)) ?></td>
          <td style="white-space:nowrap"><span class="ipucu"><?= e($g['ip'] ?? '-') ?></span></td>
          <td><span class="ipucu"><?= e($g['ua'] ?? '-') ?></span></td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
    </div>
    <p class="ipucu">Tanımadığınız bir giriş görürseniz şifrenizi değiştirin ve
      "Diğer cihazlardan çıkış yap" düğmesini kullanın.</p>
  <?php endif; ?>
</div>

<?php include __DIR__ . '/inc/alt.php'; ?>
