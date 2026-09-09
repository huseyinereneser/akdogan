<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();
require __DIR__ . '/inc/gorsel.php';

$liste = hizmet_oku();
$duzenleId = girdi('id', 'get');

// -- Kaydet / sil / sırala ------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $eylem = girdi('eylem');

    if ($eylem === 'sirala') {
        $sira = $_POST['sira'] ?? [];
        foreach ($liste as &$h) {
            if (isset($sira[$h['id']])) $h['sira'] = (int)$sira[$h['id']];
        }
        unset($h);
        hizmet_yaz($liste);
        gunluk_yaz('hizmet-sirala');
        flash_koy('basari', 'Sıralama kaydedildi.');
        git('hizmetler.php');
    }

    if ($eylem === 'sil') {
        $id = girdi('id');
        $liste = array_values(array_filter($liste, fn($h) => $h['id'] !== $id));
        hizmet_yaz($liste);
        gunluk_yaz('hizmet-sil', $id);
        flash_koy('basari', 'Hizmet silindi.');
        git('hizmetler.php');
    }

    if ($eylem === 'kaydet') {
        $id = girdi('id');
        $yeni = ($id === '');
        if ($yeni) {
            $id = slug(girdi('tr_baslik')) ?: ('hizmet-' . kimlik(3));
            $mevcutIdler = array_column($liste, 'id');
            while (in_array($id, $mevcutIdler, true)) $id .= '-' . kimlik(2);  // aynı başlık mevcut hizmeti ezmesin
        }

        // görsel yükleme
        $gorselYol = girdi('mevcut_gorsel');
        if (girdi('gorsel_sil') === '1') $gorselYol = '';
        if (!empty($_FILES['gorsel']['name'])) {
            $sonuc = gorsel_yukle($_FILES['gorsel'], 'hizmet-' . $id);
            if ($sonuc['ok']) $gorselYol = $sonuc['yol'];
            else flash_koy('hata', 'Görsel: ' . $sonuc['hata']);
        }

        $kayit = [
            'id'     => $id,
            'sira'   => (int)(girdi('sira') ?: (count($liste) + 1)),
            'gorsel' => $gorselYol,
            'tr' => ['baslik' => girdi('tr_baslik'), 'ozet' => girdi('tr_ozet'), 'detay' => girdi('tr_detay')],
            'en' => ['baslik' => girdi('en_baslik'), 'ozet' => girdi('en_ozet'), 'detay' => girdi('en_detay')],
        ];

        $bulundu = false;
        foreach ($liste as &$h) { if ($h['id'] === $id) { $h = $kayit; $bulundu = true; } }
        unset($h);
        if (!$bulundu) $liste[] = $kayit;

        hizmet_yaz($liste);
        gunluk_yaz($yeni ? 'hizmet-ekle' : 'hizmet-duzenle', $id . ' · ' . girdi('tr_baslik'));
        flash_koy('basari', 'Hizmet kaydedildi ve sitede güncellendi.');
        git('hizmetler.php');
    }
}

// -- Düzenleme ekranı ---------------------------------------------------
$duzenle = null;
if ($duzenleId === 'yeni') {
    $duzenle = ['id' => '', 'sira' => count($liste) + 1, 'gorsel' => '',
                'tr' => ['baslik'=>'','ozet'=>'','detay'=>''], 'en' => ['baslik'=>'','ozet'=>'','detay'=>'']];
} elseif ($duzenleId) {
    foreach ($liste as $h) if ($h['id'] === $duzenleId) $duzenle = $h;
}

$baslik = 'Hizmetler'; $aktif = 'hizmetler';
include __DIR__ . '/inc/ust.php';

if ($duzenle !== null):
    $d = $duzenle;
?>
  <div class="kart">
    <a href="hizmetler.php" class="ipucu">← Hizmet listesine dön</a>
    <h2 style="margin-top:8px"><?= $d['id'] === '' ? 'Yeni hizmet' : 'Hizmeti düzenle' ?></h2>

    <form method="post" enctype="multipart/form-data">
      <?= csrf_alan() ?>
      <input type="hidden" name="eylem" value="kaydet">
      <input type="hidden" name="id" value="<?= e($d['id']) ?>">
      <input type="hidden" name="sira" value="<?= (int)$d['sira'] ?>">
      <input type="hidden" name="mevcut_gorsel" value="<?= e($d['gorsel']) ?>">

      <div class="alan">
        <label>Görsel</label>
        <div class="gorsel-yukleyici">
          <img id="onizleme" class="gorsel-yukleyici__preview" src="<?= e('../' . ($d['gorsel'] ?: 'assets/img/favicon.png')) ?>" alt="">
          <label class="gorsel-yukleyici__drop">
            <span class="gorsel-yukleyici__icon">↑</span>
            <strong>Görseli buraya sürükleyin</strong>
            <small>veya bilgisayarınızdan dosya seçin · JPG, PNG, WebP</small>
            <span class="gorsel-yukleyici__button">Dosya seç</span>
            <span class="gorsel-yukleyici__name" data-dosya-adi>Mevcut görsel korunacak</span>
            <input type="file" name="gorsel" accept="image/*" data-onizleme="#onizleme">
          </label>
        </div>
        <div class="gorsel-yukleyici__actions">
          <label>
            <input type="checkbox" name="gorsel_sil" value="1"> Görseli sil
          </label>
        </div>
        <p class="ipucu">Dosya seçerek görseli değiştirebilir, kutuyu işaretleyerek kaldırabilirsiniz.</p>
      </div>

      <div class="sekmeler" data-grup="h">
        <button type="button" class="aktif" data-sekme="tr">Türkçe</button>
        <button type="button" data-sekme="en">English</button>
      </div>

      <div class="alan-baslik ceviri-hizmet-baslik"><span></span><button type="button" class="btn btn--ceviri" data-ceviri-butonu>TR → EN</button></div>
      <div class="sekme-govde aktif ceviri-hizmet-form" data-grup="h" data-sekme="tr">
        <div class="alan"><label>Başlık (TR)</label><input type="text" name="tr_baslik" value="<?= e($d['tr']['baslik']) ?>" required></div>
        <div class="alan"><label>Kısa açıklama (TR) — kartlarda görünür</label><textarea name="tr_ozet"><?= e($d['tr']['ozet']) ?></textarea></div>
        <div class="alan"><label>Detay metni (TR) — hizmet sayfasında görünür</label><textarea name="tr_detay" style="min-height:140px"><?= e($d['tr']['detay']) ?></textarea></div>
      </div>
      <div class="sekme-govde ceviri-hizmet-hedef" data-grup="h" data-sekme="en">
        <div class="alan"><label>Title (EN)</label><input type="text" name="en_baslik" value="<?= e($d['en']['baslik']) ?>"></div>
        <div class="alan"><label>Short description (EN)</label><textarea name="en_ozet"><?= e($d['en']['ozet']) ?></textarea></div>
        <div class="alan"><label>Detail text (EN)</label><textarea name="en_detay" style="min-height:140px"><?= e($d['en']['detay']) ?></textarea></div>
      </div>

      <div class="btn-satir">
        <button class="btn btn--ana" type="submit">Kaydet</button>
        <a class="btn btn--sade" href="hizmetler.php">Vazgeç</a>
      </div>
    </form>
  </div>
<?php else: ?>

  <div class="sayfa-baslik" style="margin-top:-6px">
    <span class="ipucu">Sıralamayı sürükleyerek değiştirin, sonra "Sıralamayı kaydet"e basın.</span>
    <a class="btn btn--ana" href="hizmetler.php?id=yeni">+ Yeni hizmet</a>
  </div>

  <form method="post">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="sirala">
    <div class="siralanabilir">
      <?php foreach ($liste as $h): ?>
        <div class="oge">
          <span class="tut" title="Sürükle">⋮⋮</span>
          <img src="<?= e('../' . ($h['gorsel'] ?: 'assets/img/favicon.png')) ?>" alt="">
          <div class="ad">
            <b><?= e($h['tr']['baslik']) ?></b><br>
            <span class="ipucu"><?= e(mb_strimwidth($h['tr']['ozet'] ?? '', 0, 90, '…')) ?></span>
          </div>
          <input type="hidden" name="sira[<?= e($h['id']) ?>]" value="<?= (int)$h['sira'] ?>" data-sira>
          <a class="btn btn--sade" style="padding:6px 12px" href="hizmetler.php?id=<?= e($h['id']) ?>">Düzenle</a>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="btn-satir">
      <button class="btn btn--ana" type="submit">Sıralamayı kaydet</button>
    </div>
  </form>

  <div class="kart kart--ince" style="margin-top:20px">
    <h2>Hizmet sil</h2>
    <?php foreach ($liste as $h): ?>
      <form method="post" style="display:inline-block;margin:0 8px 8px 0" data-onay="'<?= e($h['tr']['baslik']) ?>' hizmetini silmek istiyor musunuz?">
        <?= csrf_alan() ?>
        <input type="hidden" name="eylem" value="sil">
        <input type="hidden" name="id" value="<?= e($h['id']) ?>">
        <button class="btn btn--sade" style="color:var(--err-tx)" type="submit"><?= e($h['tr']['baslik']) ?> ✕</button>
      </form>
    <?php endforeach; ?>
  </div>

<?php endif; ?>
<?php include __DIR__ . '/inc/alt.php'; ?>
