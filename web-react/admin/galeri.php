<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();
require __DIR__ . '/inc/gorsel.php';

$veri = galeri_oku();
$galeri = $veri['galeri'] ?? [];
$kategoriler = $veri['kategoriler'] ?? [];
$katAnahtarlari = array_map(fn($k) => $k['anahtar'], $kategoriler);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $eylem = girdi('eylem');

    if ($eylem === 'yukle') {
        $eklendi = 0;
        $dosyalar = $_FILES['gorseller'] ?? null;
        if ($dosyalar && is_array($dosyalar['name'])) {
            $adet = min(count($dosyalar['name']), YUKLEME_AZAMI);
            for ($k = 0; $k < $adet; $k++) {
                if ($dosyalar['error'][$k] !== UPLOAD_ERR_OK) continue;
                $tek = [
                    'name' => $dosyalar['name'][$k], 'type' => $dosyalar['type'][$k],
                    'tmp_name' => $dosyalar['tmp_name'][$k], 'error' => $dosyalar['error'][$k],
                    'size' => $dosyalar['size'][$k],
                ];
                $s = gorsel_yukle($tek, 'galeri');
                if ($s['ok']) {
                    $galeri[] = [
                        'id' => 'g' . kimlik(4),
                        'sira' => count($galeri) + 1,
                        'dosya' => $s['yol'],
                        'kategori' => in_array(girdi('kategori'), $katAnahtarlari, true) ? girdi('kategori') : ($katAnahtarlari[0] ?? 'filo'),
                        'baslik_tr' => '', 'baslik_en' => '',
                    ];
                    $eklendi++;
                } else {
                    flash_koy('hata', $tek['name'] . ': ' . $s['hata']);
                }
            }
        }
        $veri['galeri'] = $galeri;
        galeri_yaz($veri);
        gunluk_yaz('galeri-yukle', $eklendi . ' görsel');
        flash_koy('basari', "$eklendi görsel eklendi.");
        git('galeri.php');
    }

    if ($eylem === 'kaydet') {
        $sira = $_POST['sira'] ?? [];
        $btr  = $_POST['baslik_tr'] ?? [];
        $ben  = $_POST['baslik_en'] ?? [];
        $kat  = $_POST['kategori'] ?? [];
        foreach ($galeri as &$g) {
            $id = $g['id'];
            if (isset($sira[$id])) $g['sira'] = (int)$sira[$id];
            if (isset($btr[$id]))  $g['baslik_tr'] = trim($btr[$id]);
            if (isset($ben[$id]))  $g['baslik_en'] = trim($ben[$id]);
            if (isset($kat[$id]) && in_array($kat[$id], $katAnahtarlari, true)) $g['kategori'] = $kat[$id];
            if (!empty($_POST['gorsel_sil'][$id])) {
                $g['dosya'] = '';
            } elseif (!empty($_FILES['gorsel']['name'][$id])) {
                $tek = [
                    'name' => $_FILES['gorsel']['name'][$id], 'type' => $_FILES['gorsel']['type'][$id],
                    'tmp_name' => $_FILES['gorsel']['tmp_name'][$id], 'error' => $_FILES['gorsel']['error'][$id],
                    'size' => $_FILES['gorsel']['size'][$id],
                ];
                $s = gorsel_yukle($tek, 'galeri-' . $id);
                if ($s['ok']) $g['dosya'] = $s['yol'];
                else flash_koy('hata', 'Görsel: ' . $s['hata']);
            }
        }
        unset($g);
        usort($galeri, fn($a, $b) => $a['sira'] <=> $b['sira']);
        $veri['galeri'] = array_values($galeri);
        galeri_yaz($veri);
        gunluk_yaz('galeri-duzenle', count($galeri) . ' görsel');
        flash_koy('basari', 'Galeri kaydedildi ve sitede güncellendi.');
        git('galeri.php');
    }

    if ($eylem === 'sil') {
        $id = girdi('id');
        $veri['galeri'] = array_values(array_filter($galeri, fn($g) => $g['id'] !== $id));
        galeri_yaz($veri);
        gunluk_yaz('galeri-cikar', $id);
        flash_koy('basari', 'Görsel galeriden çıkarıldı. (Dosya "Medya" bölümünden silinebilir.)');
        git('galeri.php');
    }

    if ($eylem === 'kategori-ekle') {
        $adTr    = girdi('ad_tr');
        $anahtar = slug(girdi('anahtar') ?: $adTr);
        if ($adTr === '' || $anahtar === '') {
            flash_koy('hata', 'Kategori adı girin.');
        } elseif (in_array($anahtar, $katAnahtarlari, true)) {
            flash_koy('hata', 'Bu anahtar (' . $anahtar . ') zaten var.');
        } else {
            $kategoriler[] = ['anahtar' => $anahtar, 'ad_tr' => $adTr, 'ad_en' => girdi('ad_en') ?: $adTr];
            $veri['kategoriler'] = $kategoriler;
            galeri_yaz($veri);
            gunluk_yaz('galeri-kategori', 'ekle: ' . $anahtar);
            flash_koy('basari', 'Kategori eklendi.');
        }
        git('galeri.php');
    }

    if ($eylem === 'kategori-kaydet') {
        $atr = $_POST['kat_ad_tr'] ?? [];
        $aen = $_POST['kat_ad_en'] ?? [];
        foreach ($kategoriler as &$k) {
            $a = $k['anahtar'];
            if (isset($atr[$a]) && trim($atr[$a]) !== '') $k['ad_tr'] = trim($atr[$a]);
            if (isset($aen[$a])) $k['ad_en'] = trim($aen[$a]);
        }
        unset($k);
        $veri['kategoriler'] = $kategoriler;
        galeri_yaz($veri);
        gunluk_yaz('galeri-kategori', 'adlar güncellendi');
        flash_koy('basari', 'Kategori adları kaydedildi.');
        git('galeri.php');
    }

    if ($eylem === 'kategori-sil') {
        $a = girdi('anahtar');
        $kullanan = array_filter($galeri, fn($g) => ($g['kategori'] ?? '') === $a);
        if (count($kategoriler) <= 1) {
            flash_koy('hata', 'En az bir kategori kalmalı.');
        } elseif ($kullanan) {
            flash_koy('hata', 'Bu kategoride ' . count($kullanan) . ' görsel var — önce onları başka kategoriye taşıyın.');
        } else {
            $veri['kategoriler'] = array_values(array_filter($kategoriler, fn($k) => $k['anahtar'] !== $a));
            galeri_yaz($veri);
            gunluk_yaz('galeri-kategori', 'sil: ' . $a);
            flash_koy('basari', 'Kategori silindi.');
        }
        git('galeri.php');
    }
}

usort($galeri, fn($a, $b) => ($a['sira'] ?? 0) <=> ($b['sira'] ?? 0));

$baslik = 'Galeri'; $aktif = 'galeri';
include __DIR__ . '/inc/ust.php';
?>

<div class="kart">
  <h2>Görsel yükle</h2>
  <form method="post" enctype="multipart/form-data">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="yukle">
    <div class="galeri-yukleme">
      <label class="gorsel-yukleyici__drop gorsel-yukleyici__drop--galeri">
        <span class="gorsel-yukleyici__icon">↑</span>
        <strong>Görseli buraya sürükleyin</strong>
        <small>veya bilgisayarınızdan dosya seçin · JPG, PNG, WebP</small>
        <span class="gorsel-yukleyici__button">Dosya seç</span>
        <span class="gorsel-yukleyici__name" data-dosya-adi><?= YUKLEME_AZAMI ?> adede kadar görsel seçebilirsiniz</span>
        <input type="file" name="gorseller[]" accept="image/jpeg,image/png,image/webp" multiple required data-dosya-listesi>
      </label>
      <div class="galeri-yukleme__alt">
        <div>
          <label for="galeri-kategori">Kategori</label>
          <select id="galeri-kategori" name="kategori">
            <?php foreach ($kategoriler as $k): ?>
              <option value="<?= e($k['anahtar']) ?>"><?= e($k['ad_tr']) ?></option>
            <?php endforeach; ?>
          </select>
        </div>
        <p class="ipucu">Görseller yüklendikten sonra başlık ve sıralama bilgilerini aşağıdaki listeden düzenleyebilirsiniz.</p>
      </div>
    </div>
    <button class="btn btn--ana" type="submit">Yükle</button>
  </form>
</div>

<div class="kart">
  <div class="kart__baslik"><h2>Kategoriler</h2><a class="btn btn--sade" href="#gorseller">Görsellere geç ↓</a></div>
  <p class="ipucu">Adları düzenleyip kaydedin. Yeni kategori ekleyebilir; içinde görsel
    olmayan kategorileri silebilirsiniz.</p>
  <form method="post">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="kategori-kaydet">
    <div class="tablo-sar">
    <table class="liste">
      <thead><tr><th>Anahtar</th><th>Ad (TR)</th><th>Ad (EN)</th><th></th></tr></thead>
      <tbody>
      <?php foreach ($kategoriler as $k): $kul = count(array_filter($galeri, fn($g) => ($g['kategori'] ?? '') === $k['anahtar'])); ?>
        <tr>
          <td><code><?= e($k['anahtar']) ?></code><br><span class="ipucu"><?= $kul ?> görsel</span></td>
          <td><input type="text" name="kat_ad_tr[<?= e($k['anahtar']) ?>]" value="<?= e($k['ad_tr'] ?? '') ?>"></td>
          <td><input type="text" name="kat_ad_en[<?= e($k['anahtar']) ?>]" value="<?= e($k['ad_en'] ?? '') ?>"></td>
          <td style="white-space:nowrap">
            <?php if ($kul === 0 && count($kategoriler) > 1): ?>
              <button class="btn btn--sade" style="padding:6px 12px;color:var(--err-tx)" type="submit"
                      form="kat-sil-<?= e($k['anahtar']) ?>">Sil</button>
            <?php endif; ?>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
    </div>
    <div class="btn-satir"><button class="btn btn--ana" type="submit">Adları kaydet</button></div>
  </form>

  <?php foreach ($kategoriler as $k): ?>
    <form method="post" id="kat-sil-<?= e($k['anahtar']) ?>" data-onay="'<?= e($k['ad_tr'] ?? $k['anahtar']) ?>' kategorisi silinsin mi?" style="display:none">
      <?= csrf_alan() ?>
      <input type="hidden" name="eylem" value="kategori-sil">
      <input type="hidden" name="anahtar" value="<?= e($k['anahtar']) ?>">
    </form>
  <?php endforeach; ?>

  <form method="post" style="margin-top:14px">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="kategori-ekle">
    <div class="alan-ikili">
      <div class="alan"><label>Yeni kategori adı (TR)</label><input type="text" name="ad_tr" required></div>
      <div class="alan"><label>Ad (EN) — boşsa TR kullanılır</label><input type="text" name="ad_en"></div>
    </div>
    <button class="btn btn--sade" type="submit">+ Kategori ekle</button>
  </form>
 </div>

<div class="sayfa-baslik galeri-liste-baslik" id="gorseller">
  <div><h2>Görseller</h2><span class="ipucu"><?= count($galeri) ?> görsel · sürükleyerek sıralayın</span></div>
</div>
<form method="post" enctype="multipart/form-data">
  <?= csrf_alan() ?>
  <input type="hidden" name="eylem" value="kaydet">
  <div class="sayfa-baslik" style="margin-top:0">
    <span class="ipucu"><?= count($galeri) ?> görsel · sürükleyerek sıralayın</span>
    <button class="btn btn--ana" type="submit">Değişiklikleri kaydet</button>
  </div>

  <div class="siralanabilir">
    <?php foreach ($galeri as $g): ?>
      <div class="oge">
        <span class="tut" title="Sürükle">⋮⋮</span>
        <div class="galeri-onizleme">
          <img id="galeri-onizleme-<?= e($g['id']) ?>" src="<?= e('../' . ($g['dosya'] ?: 'assets/img/favicon.png')) ?>" alt="<?= e($g['baslik_tr'] ?? '') ?>">
          <button type="button" class="gorsel-incele" data-gorsel-incele="#galeri-onizleme-<?= e($g['id']) ?>">İncele</button>
        </div>
        <div>
          <label class="btn btn--sade gorsel-degistir">
            <span>Görseli değiştir</span>
            <input type="file" name="gorsel[<?= e($g['id']) ?>]" accept="image/*" data-onizleme="#galeri-onizleme-<?= e($g['id']) ?>" style="display:none">
          </label>
          <label style="display:block;margin-top:8px;font-size:.78rem">
            <input type="checkbox" name="gorsel_sil[<?= e($g['id']) ?>]" value="1"> Sil
          </label>
        </div>
        <div class="ad" style="display:grid;gap:6px">
          <input type="text" name="baslik_tr[<?= e($g['id']) ?>]" value="<?= e($g['baslik_tr'] ?? '') ?>" placeholder="Başlık (TR)">
          <input type="text" name="baslik_en[<?= e($g['id']) ?>]" value="<?= e($g['baslik_en'] ?? '') ?>" placeholder="Caption (EN)">
        </div>
        <select name="kategori[<?= e($g['id']) ?>]" style="width:auto">
          <?php foreach ($kategoriler as $k): ?>
            <option value="<?= e($k['anahtar']) ?>" <?= ($g['kategori'] ?? '') === $k['anahtar'] ? 'selected' : '' ?>><?= e($k['ad_tr']) ?></option>
          <?php endforeach; ?>
        </select>
        <input type="hidden" name="sira[<?= e($g['id']) ?>]" value="<?= (int)($g['sira'] ?? 0) ?>" data-sira>
      </div>
    <?php endforeach; ?>
  </div>

  <div class="btn-satir">
    <button class="btn btn--ana" type="submit">Değişiklikleri kaydet</button>
  </div>
</form>

<div class="kart kart--ince" style="margin-top:20px">
  <h2>Galeriden çıkar</h2>
  <?php foreach ($galeri as $g): ?>
    <form method="post" style="display:inline-block;margin:0 8px 8px 0" data-onay="Bu görseli galeriden çıkarmak istiyor musunuz?">
      <?= csrf_alan() ?>
      <input type="hidden" name="eylem" value="sil">
      <input type="hidden" name="id" value="<?= e($g['id']) ?>">
      <button class="btn btn--sade" style="color:var(--err-tx)" type="submit"><?= e($g['baslik_tr'] ?: basename($g['dosya'])) ?> ✕</button>
    </form>
  <?php endforeach; ?>
</div>

<?php include __DIR__ . '/inc/alt.php'; ?>
