<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();
yonetici_gerekli();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    if (girdi('eylem') === 'temizle') {
        @file_put_contents(GUNLUK_DOSYA, '');
        gunluk_yaz('gunluk-temizle');
        flash_koy('basari', 'İşlem günlüğü temizlendi.');
    }
    git('gunluk.php');
}

$kayitlar = gunluk_oku(400);

$baslik = 'İşlem Günlüğü'; $aktif = 'gunluk';
include __DIR__ . '/inc/ust.php';
?>

<div class="sayfa-baslik" style="margin-top:-6px">
  <span class="ipucu">Son <?= count($kayitlar) ?> işlem · en yeni üstte</span>
  <?php if ($kayitlar): ?>
  <form method="post" style="margin:0" data-onay="Tüm işlem günlüğü kalıcı olarak silinsin mi?">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="temizle">
    <button class="btn btn--sade" style="color:var(--err-tx)" type="submit">Kayıtları temizle</button>
  </form>
  <?php endif; ?>
</div>

<?php if (!$kayitlar): ?>
  <div class="kart">Henüz kayıt yok. Girişler ve içerik değişiklikleri burada listelenir.</div>
<?php else: ?>
  <div class="kart" style="padding:0">
  <div class="tablo-sar">
  <table class="liste">
    <thead><tr><th>Tarih</th><th>Kullanıcı</th><th>İşlem</th><th>Ayrıntı</th><th>IP</th></tr></thead>
    <tbody>
    <?php foreach ($kayitlar as $k): ?>
      <tr>
        <td style="white-space:nowrap"><?= e(tarih_tr($k['t'] ?? '')) ?></td>
        <td><?= e($k['ad'] ?? '-') ?></td>
        <td><?= e(gunluk_etiket($k['eylem'] ?? '-')) ?></td>
        <td><?= e($k['detay'] ?? '') ?></td>
        <td style="white-space:nowrap"><span class="ipucu"><?= e($k['ip'] ?? '-') ?></span></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
  </div>
<?php endif; ?>

<?php include __DIR__ . '/inc/alt.php'; ?>
