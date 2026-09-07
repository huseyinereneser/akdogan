<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();

$dosyalar = surumlu_dosyalar();                       // ad => etiket

// Editör yalnızca kendi düzenleyebildiği bölümlerin sürümlerini geri alabilir
$yoneticiSadece = ['ayarlar.json', 'seo.json', 'users.json'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $ad    = girdi('ad');
    $surum = basename(girdi('surum'));

    if (!isset($dosyalar[$ad])) {
        flash_koy('hata', 'Bilinmeyen bölüm.');
    } elseif (in_array($ad, $yoneticiSadece, true) && !yonetici_mi()) {
        flash_koy('hata', 'Bu bölümün sürümlerini yalnızca Yönetici geri yükleyebilir.');
    } elseif (surum_geri_yukle($ad, $surum)) {
        gunluk_yaz('surum-geri-yukle', $ad . ' ← ' . $surum);
        flash_koy('basari', $dosyalar[$ad] . ' bölümü seçtiğiniz sürüme döndürüldü ve sitede güncellendi.');
    } else {
        flash_koy('hata', 'Sürüm geri yüklenemedi (dosya bulunamadı veya yazma izni yok).');
    }
    git('surumler.php');
}

$baslik = 'Sürüm Geçmişi'; $aktif = 'surumler';
include __DIR__ . '/inc/ust.php';
?>

<div class="kart kart--ince">
  Her kayıtta, o bölümün <b>önceki hâli</b> otomatik olarak saklanır (bölüm başına
  son <?= SURUM_AZAMI ?> sürüm). Yanlış bir düzenlemeyi veya silmeyi buradan geri
  alabilirsiniz. Geri yükleme işleminin kendisi de geri alınabilir — mevcut hâl
  de listeye eklenir.
</div>

<?php foreach ($dosyalar as $ad => $etiket): ?>
  <?php
    if (in_array($ad, $yoneticiSadece, true) && !yonetici_mi()) continue;
    $liste = surum_listesi($ad);
  ?>
  <div class="kart">
    <h2><?= e($etiket) ?></h2>
    <?php if (!$liste): ?>
      <p class="ipucu" style="margin:0">Henüz kayıtlı geçmiş sürüm yok.</p>
    <?php else: ?>
      <div class="tablo-sar">
      <table class="liste">
        <thead><tr><th>Tarih</th><th>İçerik</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($liste as $s): ?>
          <tr>
            <td style="white-space:nowrap"><?= e(tarih_tr($s['zaman'])) ?></td>
            <td>
              <details>
                <summary style="cursor:pointer;color:var(--baslik)">Önizle</summary>
                <pre style="white-space:pre-wrap;font:12px/1.5 ui-monospace,Consolas,monospace;margin:8px 0 0;max-height:320px;overflow:auto;background:var(--pre-bg);color:var(--ink);padding:10px;border-radius:6px"><?= e(surum_govde($ad, $s['ad']) ?? '') ?></pre>
              </details>
            </td>
            <td style="white-space:nowrap">
              <form method="post" style="margin:0" data-onay="'<?= e($etiket) ?>' bölümünü bu sürüme döndürmek istiyor musunuz? Mevcut içerik geçmişe eklenir.">
                <?= csrf_alan() ?>
                <input type="hidden" name="eylem" value="geri-yukle">
                <input type="hidden" name="ad" value="<?= e($ad) ?>">
                <input type="hidden" name="surum" value="<?= e($s['ad']) ?>">
                <button class="btn btn--sade" style="padding:6px 12px" type="submit">Bu sürüme dön</button>
              </form>
            </td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
      </div>
    <?php endif; ?>
  </div>
<?php endforeach; ?>

<?php include __DIR__ . '/inc/alt.php'; ?>
