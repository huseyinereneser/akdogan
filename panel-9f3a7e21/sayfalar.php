<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();

$sayfalar = sayfa_oku();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $eylem = girdi('eylem') ?: 'metin';

    // -- Metinleri kaydet (Yönetici + Editör) --------------------------
    if ($eylem === 'metin') {
        $tr = $_POST['tr'] ?? [];
        $en = $_POST['en'] ?? [];
        foreach ($sayfalar as $sk => &$sayfa) {
            foreach (($sayfa['alanlar'] ?? []) as $ak => &$alan) {
                $yol = $sk . '.' . $ak;
                if (isset($tr[$yol])) $alan['tr'] = trim($tr[$yol]);
                if (isset($en[$yol])) $alan['en'] = trim($en[$yol]);
            }
            unset($alan);
        }
        unset($sayfa);
        if (sayfa_yaz($sayfalar)) {
            gunluk_yaz('sayfa-metin-kaydet');
            flash_koy('basari', 'Sayfa metinleri kaydedildi ve sitede güncellendi.');
        } else {
            flash_koy('hata', 'Kaydedilemedi (yazma izni?).');
        }
        git('sayfalar.php');
    }

    // -- Yapı değişiklikleri (yalnızca Yönetici) ----------------------
    yonetici_gerekli();

    if ($eylem === 'alan-ekle') {
        $sk = girdi('sayfa');
        $ad = girdi('ad');
        $ak = slug(girdi('anahtar') ?: $ad);
        if (!isset($sayfalar[$sk])) {
            flash_koy('hata', 'Bilinmeyen bölüm.');
        } elseif ($ad === '' || $ak === '') {
            flash_koy('hata', 'Alan etiketi girin.');
        } elseif (isset($sayfalar[$sk]['alanlar'][$ak])) {
            flash_koy('hata', "Bu bölümde '$ak' anahtarı zaten var.");
        } else {
            $sayfalar[$sk]['alanlar'][$ak] = ['ad' => $ad, 'tr' => '', 'en' => ''];
            sayfa_yaz($sayfalar);
            gunluk_yaz('sayfa-yapi', "alan ekle: $sk.$ak");
            flash_koy('basari', "Alan eklendi: $sk.$ak — sitede görünmesi için ilgili sayfa HTML'ine  data-cms-metin='$sk.$ak'  özniteliğini ekleyin.");
        }
        git('sayfalar.php');
    }

    if ($eylem === 'alan-sil') {
        $sk = girdi('sayfa'); $ak = girdi('anahtar');
        if (isset($sayfalar[$sk]['alanlar'][$ak])) {
            unset($sayfalar[$sk]['alanlar'][$ak]);
            sayfa_yaz($sayfalar);
            gunluk_yaz('sayfa-yapi', "alan sil: $sk.$ak");
            flash_koy('basari', 'Alan silindi. (Sürüm Geçmişi\'nden geri alınabilir.)');
        } else {
            flash_koy('hata', 'Alan bulunamadı.');
        }
        git('sayfalar.php');
    }

    if ($eylem === 'bolum-ekle') {
        $ad = girdi('etiket');
        $sk = slug($ad);
        if ($ad === '' || $sk === '') {
            flash_koy('hata', 'Bölüm adı girin.');
        } elseif (isset($sayfalar[$sk])) {
            flash_koy('hata', "'$sk' bölümü zaten var.");
        } else {
            $sayfalar[$sk] = ['etiket_tr' => $ad, 'alanlar' => []];
            sayfa_yaz($sayfalar);
            gunluk_yaz('sayfa-yapi', "bölüm ekle: $sk");
            flash_koy('basari', "Bölüm eklendi: $sk");
        }
        git('sayfalar.php');
    }

    if ($eylem === 'bolum-sil') {
        $sk = girdi('sayfa');
        if (isset($sayfalar[$sk])) {
            unset($sayfalar[$sk]);
            sayfa_yaz($sayfalar);
            gunluk_yaz('sayfa-yapi', "bölüm sil: $sk");
            flash_koy('basari', 'Bölüm silindi. (Sürüm Geçmişi\'nden geri alınabilir.)');
        } else {
            flash_koy('hata', 'Bölüm bulunamadı.');
        }
        git('sayfalar.php');
    }

    git('sayfalar.php');
}

$baslik = 'Sayfa Metinleri'; $aktif = 'sayfalar';
include __DIR__ . '/inc/ust.php';
?>

<div class="kart kart--ince">
  Bu metinler sitedeki sabit alanlarda görünür. Boş bıraktığınız alanda sitedeki
  <b>varsayılan metin</b> kullanılır. İngilizce alanı boşsa o dilde Türkçe metin gösterilir.
</div>

<form method="post">
  <?= csrf_alan() ?>
  <input type="hidden" name="eylem" value="metin">
  <?php foreach ($sayfalar as $sk => $sayfa): ?>
    <div class="kart">
      <h2><?= e($sayfa['etiket_tr'] ?? $sk) ?> <span class="ipucu"><?= e($sk) ?></span></h2>
      <?php if (empty($sayfa['alanlar'])): ?>
        <p class="ipucu" style="margin:0">Bu bölümde alan yok.</p>
      <?php endif; ?>
      <?php foreach (($sayfa['alanlar'] ?? []) as $ak => $alan): $yol = $sk . '.' . $ak; ?>
        <div class="alan">
          <label><?= e($alan['ad'] ?? $ak) ?> <span class="ipucu"><?= e($yol) ?></span></label>
          <div class="sekmeler" data-grup="<?= e($yol) ?>">
            <button type="button" class="aktif" data-sekme="tr">TR</button>
            <button type="button" data-sekme="en">EN</button>
          </div>
          <div class="sekme-govde aktif" data-grup="<?= e($yol) ?>" data-sekme="tr">
            <textarea name="tr[<?= e($yol) ?>]"><?= e($alan['tr'] ?? '') ?></textarea>
          </div>
          <div class="sekme-govde" data-grup="<?= e($yol) ?>" data-sekme="en">
            <textarea name="en[<?= e($yol) ?>]"><?= e($alan['en'] ?? '') ?></textarea>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  <?php endforeach; ?>

  <div class="btn-satir">
    <button class="btn btn--ana" type="submit">Tümünü kaydet</button>
  </div>
</form>

<?php if (yonetici_mi()): ?>
<div class="kart">
  <h2>Yapı — bölüm ve alanlar</h2>
  <p class="ipucu">Yeni bir alanın sitede görünebilmesi için ilgili sayfanın HTML'inde
    <code>data-cms-metin="bölüm.anahtar"</code> özniteliği bulunmalıdır. Silinen bölüm/alan
    <b>Sürüm Geçmişi</b>'nden geri alınabilir.</p>

  <?php foreach ($sayfalar as $sk => $sayfa): ?>
    <div class="kart kart--ince" style="margin:10px 0">
      <div class="sayfa-baslik" style="margin:0 0 6px">
        <b><?= e($sayfa['etiket_tr'] ?? $sk) ?></b> <span class="ipucu"><?= e($sk) ?></span>
        <?php if (empty($sayfa['alanlar'])): ?>
          <form method="post" style="margin:0" data-onay="'<?= e($sk) ?>' bölümü silinsin mi?">
            <?= csrf_alan() ?>
            <input type="hidden" name="eylem" value="bolum-sil">
            <input type="hidden" name="sayfa" value="<?= e($sk) ?>">
            <button class="btn btn--sade" style="padding:4px 10px;color:var(--err-tx)" type="submit">Bölümü sil</button>
          </form>
        <?php endif; ?>
      </div>
      <?php foreach (($sayfa['alanlar'] ?? []) as $ak => $alan): ?>
        <div class="btn-satir" style="margin:0 0 4px;justify-content:space-between;align-items:center">
          <span><?= e($alan['ad'] ?? $ak) ?> <span class="ipucu"><?= e($sk . '.' . $ak) ?></span></span>
          <form method="post" style="margin:0" data-onay="'<?= e($alan['ad'] ?? $ak) ?>' alanı silinsin mi?">
            <?= csrf_alan() ?>
            <input type="hidden" name="eylem" value="alan-sil">
            <input type="hidden" name="sayfa" value="<?= e($sk) ?>">
            <input type="hidden" name="anahtar" value="<?= e($ak) ?>">
            <button class="btn btn--sade" style="padding:4px 10px;color:var(--err-tx)" type="submit">Sil</button>
          </form>
        </div>
      <?php endforeach; ?>
      <form method="post" style="margin:8px 0 0;display:flex;flex-wrap:wrap;gap:8px;align-items:flex-end">
        <?= csrf_alan() ?>
        <input type="hidden" name="eylem" value="alan-ekle">
        <input type="hidden" name="sayfa" value="<?= e($sk) ?>">
        <div class="alan" style="margin:0;flex:1;min-width:180px"><label>Yeni alan etiketi</label><input type="text" name="ad" required></div>
        <div class="alan" style="margin:0;min-width:150px"><label>Anahtar (boşsa etiketten üretilir)</label><input type="text" name="anahtar" pattern="[A-Za-z0-9_-]+"></div>
        <button class="btn btn--sade" type="submit">+ Alan ekle</button>
      </form>
    </div>
  <?php endforeach; ?>

  <form method="post" style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:flex-end">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="bolum-ekle">
    <div class="alan" style="margin:0;flex:1;min-width:220px"><label>Yeni bölüm adı</label><input type="text" name="etiket" required></div>
    <button class="btn btn--sade" type="submit">+ Bölüm ekle</button>
  </form>
</div>
<?php endif; ?>

<?php include __DIR__ . '/inc/alt.php'; ?>
