<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();
yonetici_gerekli();

$bakim = json_oku(BAKIM_JSON);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $eylem = girdi('eylem');

    if ($eylem === 'ac') {
        $veri = [
            'mesaj_tr'   => mb_substr(girdi('mesaj_tr'), 0, 600),
            'mesaj_en'   => mb_substr(girdi('mesaj_en'), 0, 600),
            'baslangic'  => time(),
            'baslatan'   => $kullanici['ad'] ?? '',
        ];
        $yazildi = json_yaz(BAKIM_JSON, $veri)
            && @file_put_contents(BAKIM_ISARET, date('c') . "\n", LOCK_EX) !== false;
        if ($yazildi) {
            gunluk_yaz('bakim-ac');
            flash_koy('basari', 'Site bakım moduna alındı. Ziyaretçiler bakım sayfasını görüyor; siz panele erişmeye devam edebilirsiniz.');
        } else {
            flash_koy('hata', 'Bakım modu açılamadı — veri klasörünün yazma izni yok gibi görünüyor.');
        }
        git('bakim.php');
    }

    if ($eylem === 'kapa') {
        @unlink(BAKIM_ISARET);
        $veri = $bakim;
        $veri['bitis'] = time();
        json_yaz(BAKIM_JSON, $veri);
        gunluk_yaz('bakim-kapa');
        flash_koy('basari', is_file(BAKIM_ISARET)
            ? 'Bakım işareti silinemedi — dosya izinlerini kontrol edin.'
            : 'Bakım modu kapatıldı. Site yeniden yayında.');
        git('bakim.php');
    }
}

$baslik = 'Bakım Modu'; $aktif = 'bakim';
include __DIR__ . '/inc/ust.php';

$sunucu = is_file(SITE_KOK . '/.htaccess') && strpos((string) @file_get_contents(SITE_KOK . '/.htaccess'), 'bakim.aktif') !== false;
$bakimAcik = is_file(BAKIM_ISARET);
?>

<div class="kart kart--ince">
  Bakım modu açıkken sitenin bütün sayfaları ziyaretçilere <b>bakim.php</b> sayfasını
  <b>503</b> durum koduyla gösterir (arama motorları "geçici" olarak anlar). Yönetim
  paneli, <code>assets/</code> klasörü ve form işleyicisi (<code>gonder.php</code>) açık kalır.
  <?php if (!$sunucu): ?>
    <div class="uyari uyari--uyari" style="margin:10px 0 0">
      <b>Dikkat:</b> Sitenin kök dizinindeki <code>.htaccess</code> dosyasında bakım yönlendirmesi
      bulunamadı. Bu özellik yalnızca Apache'de ve <code>.htaccess</code> kuralı yüklüyken çalışır.
      Kural için proje ile gelen kök <code>.htaccess</code> dosyasını yükleyin.
    </div>
  <?php endif; ?>
</div>

<div class="kart" style="max-width:620px">
  <h2>Durum:
    <?php if ($bakimAcik): ?>
      <span class="rozet" style="background:var(--warn-bg);color:var(--warn-tx)">Bakım modunda</span>
    <?php else: ?>
      <span class="rozet rozet--ok2">Yayında</span>
    <?php endif; ?>
  </h2>

  <?php if ($bakimAcik): ?>
    <p class="ipucu">
      <?= !empty($bakim['baslangic']) ? 'Başlangıç: ' . e(tarih_tr($bakim['baslangic'])) : '' ?>
      <?= !empty($bakim['baslatan']) ? ' · ' . e($bakim['baslatan']) : '' ?>
    </p>
    <form method="post" data-onay="Bakım modu kapatılsın ve site yeniden yayına alınsın mı?">
      <?= csrf_alan() ?>
      <input type="hidden" name="eylem" value="kapa">
      <button class="btn btn--ana" type="submit">Bakımı kaldır — siteyi yayına al</button>
    </form>
  <?php else: ?>
    <form method="post" data-onay="Site bakım moduna alınsın mı? Ziyaretçiler siteyi göremeyecek.">
      <?= csrf_alan() ?>
      <input type="hidden" name="eylem" value="ac">
      <div class="alan">
        <label>Bakım mesajı (Türkçe)</label>
        <textarea name="mesaj_tr" placeholder="Sitemiz kısa süreli bakımda. Lütfen birazdan tekrar deneyin."><?= e($bakim['mesaj_tr'] ?? '') ?></textarea>
      </div>
      <div class="alan">
        <label>Bakım mesajı (İngilizce)</label>
        <textarea name="mesaj_en" placeholder="Our website is briefly down for maintenance. Please check back soon."><?= e($bakim['mesaj_en'] ?? '') ?></textarea>
      </div>
      <button class="btn btn--kirmizi" type="submit">Siteyi bakıma al</button>
    </form>
  <?php endif; ?>
</div>

<div class="kart" style="max-width:620px">
  <h2>Önizleme</h2>
  <p class="ipucu">Bakım sayfasını yeni sekmede açar (bakım modu kapalıyken de görüntülenebilir).</p>
  <a class="btn btn--sade" href="../bakim.php" target="_blank" rel="noopener">Bakım sayfasını gör ↗</a>
</div>

<?php include __DIR__ . '/inc/alt.php'; ?>
