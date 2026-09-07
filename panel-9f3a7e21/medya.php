<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();
require __DIR__ . '/inc/gorsel.php';

$korunan = ['logo.png', 'logo-light.png', 'favicon.png', 'favicon.svg'];

$logoHedefleri = ['logo.png', 'logo-light.png', 'favicon.png'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $eylem = girdi('eylem');

    if ($eylem === 'sil') {
        $ad = basename(girdi('ad'));
        if (in_array($ad, $korunan, true)) {
            flash_koy('hata', 'Logo ve favicon dosyaları buradan silinemez.');
        } else {
            $yol = YUKLEME_DIZIN . '/' . $ad;
            if (is_file($yol) && @unlink($yol)) {
                gunluk_yaz('medya-sil', $ad);
                flash_koy('basari', $ad . ' silindi.');
            } else {
                flash_koy('hata', 'Silinemedi.');
            }
        }
        git('medya.php');
    }

    if ($eylem === 'yukle') {
        $eklendi = 0;
        $d = $_FILES['gorseller'] ?? null;
        if ($d && is_array($d['name'])) {
            $adet = min(count($d['name']), YUKLEME_AZAMI);
            for ($k = 0; $k < $adet; $k++) {
                if (($d['error'][$k] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) continue;
                $tek = [
                    'name' => $d['name'][$k], 'type' => $d['type'][$k], 'tmp_name' => $d['tmp_name'][$k],
                    'error' => $d['error'][$k], 'size' => $d['size'][$k],
                ];
                $s = gorsel_yukle($tek, 'medya');
                if ($s['ok']) $eklendi++;
                else flash_koy('hata', $tek['name'] . ': ' . $s['hata']);
            }
        }
        if ($eklendi) {
            gunluk_yaz('medya-yukle', $eklendi . ' dosya');
            flash_koy('basari', "$eklendi görsel yüklendi. Kullanmak için Hizmetler / Galeri bölümünden seçin.");
        }
        git('medya.php');
    }

    if ($eylem === 'logo') {
        yonetici_gerekli();
        $hedef = basename(girdi('hedef'));
        if (!in_array($hedef, $logoHedefleri, true)) {
            flash_koy('hata', 'Geçersiz hedef dosya.');
        } elseif (($_FILES['dosya']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            flash_koy('hata', 'Bir dosya seçin.');
        } else {
            $s = gorsel_yukle($_FILES['dosya'], 'yeni-' . pathinfo($hedef, PATHINFO_FILENAME), true);
            if (!$s['ok']) {
                flash_koy('hata', $s['hata']);
            } else {
                $gecici = SITE_KOK . '/' . $s['yol'];
                if (@rename($gecici, YUKLEME_DIZIN . '/' . $hedef)) {
                    @chmod(YUKLEME_DIZIN . '/' . $hedef, 0664);
                    gunluk_yaz('logo-degistir', $hedef);
                    flash_koy('basari', $hedef . ' güncellendi. Değişikliği görmek için sitede Ctrl+F5 yapın.');
                } else {
                    @unlink($gecici);
                    flash_koy('hata', $hedef . ' değiştirilemedi (assets/img yazılabilir mi?).');
                }
            }
        }
        git('medya.php');
    }
}

$liste = medya_listesi();
uksort($liste, fn($a, $b) => strcmp($a, $b));
$yetim = array_filter($liste, fn($b) => empty($b['kullanim']) && !in_array('x', $b['kullanim']));

$baslik = 'Medya'; $aktif = 'medya';
include __DIR__ . '/inc/ust.php';
?>

<div class="kart">
  <h2>Görsel yükle</h2>
  <p class="ipucu">Buradan yüklenen görseller yeniden kodlanır ve küçültülür; sonra
    Hizmetler veya Galeri bölümünden seçebilirsiniz.</p>
  <form method="post" enctype="multipart/form-data">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="yukle">
    <div class="alan">
      <label>Dosya(lar) — en fazla <?= YUKLEME_AZAMI ?> adet, her biri <?= DOSYA_AZAMI_MB ?> MB'a kadar</label>
      <input type="file" name="gorseller[]" accept="image/*" multiple required>
    </div>
    <button class="btn btn--ana" type="submit">Yükle</button>
  </form>
</div>

<?php if (yonetici_mi()): ?>
<div class="kart">
  <h2>Logo / favicon değiştir</h2>
  <p class="ipucu">Yeni görsel PNG olarak kaydedilir (şeffaflık korunur) ve mevcut
    dosyanın <b>üzerine yazılır</b>. En iyi sonuç için doğru en-boy oranında bir dosya seçin.</p>
  <form method="post" enctype="multipart/form-data" data-onay="Seçili dosyanın üzerine yazılsın mı?">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="logo">
    <div class="alan-ikili">
      <div class="alan">
        <label>Hedef</label>
        <select name="hedef">
          <?php foreach ($logoHedefleri as $h): ?>
            <option value="<?= e($h) ?>"><?= e($h) ?></option>
          <?php endforeach; ?>
        </select>
      </div>
      <div class="alan">
        <label>Yeni görsel (JPG / PNG / WebP)</label>
        <input type="file" name="dosya" accept="image/*" required>
      </div>
    </div>
    <button class="btn btn--ana" type="submit">Değiştir</button>
  </form>
</div>
<?php endif; ?>

<div class="kart kart--ince">
  <b><?= count($liste) ?></b> görsel dosyası. "Kullanılmıyor" olarak işaretlenenler
  hiçbir sayfada veya içerik alanında geçmiyor — güvenle silinebilir. Silmeden önce
  kontrol edin; geri alınamaz.
</div>

<div class="kart" style="padding:0">
<div class="tablo-sar">
<table class="liste">
  <thead><tr><th>Önizleme</th><th>Dosya</th><th>Boyut</th><th>Durum</th><th></th></tr></thead>
  <tbody>
  <?php foreach ($liste as $ad => $b): ?>
    <tr>
      <td><img src="<?= e('../assets/img/' . $ad) ?>" alt="" style="width:70px;height:48px;object-fit:cover;border-radius:4px;background:var(--img-bg)"></td>
      <td><?= e($ad) ?></td>
      <td><?= number_format($b['boyut'] / 1024, 0, ',', '.') ?> KB</td>
      <td>
        <?php if (in_array($ad, $korunan, true)): ?>
          <span class="rozet rozet--okundu">sistem</span>
        <?php elseif (!empty($b['kullanim'])): ?>
          <span class="rozet rozet--okundu">kullanımda</span>
        <?php else: ?>
          <span class="rozet rozet--uyari">kullanılmıyor</span>
        <?php endif; ?>
      </td>
      <td>
        <?php if (!in_array($ad, $korunan, true)): ?>
        <form method="post" style="margin:0" data-onay="<?= e($ad) ?> dosyasını kalıcı olarak silmek istiyor musunuz?">
          <?= csrf_alan() ?>
          <input type="hidden" name="eylem" value="sil">
          <input type="hidden" name="ad" value="<?= e($ad) ?>">
          <button class="btn btn--sade" style="padding:6px 12px;color:var(--err-tx)" type="submit">Sil</button>
        </form>
        <?php endif; ?>
      </td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table>
</div>
</div>

<?php include __DIR__ . '/inc/alt.php'; ?>
