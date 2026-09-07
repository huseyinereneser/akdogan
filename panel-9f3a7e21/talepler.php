<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();

// id => görünen ad (talep atama için)
$kullanicilar = [];
foreach (kullanici_oku() as $u) $kullanicilar[$u['id']] = $u['ad'] ?? ($u['kadi'] ?? $u['id']);

function talep_yolu(string $id): string {
    $id = preg_replace('/[^A-Za-z0-9\-]/', '', $id);
    return TALEP_DIZIN . '/' . $id . '.json';
}

/** Sayfa/filtre bağlantısı üret (mevcut q + durum korunur) */
function talep_baglanti(array $degis = []): string {
    $s = array_merge([
        'q'      => trim((string)($_GET['q'] ?? '')),
        'durum'  => (string)($_GET['durum'] ?? ''),
        'atanan' => (string)($_GET['atanan'] ?? ''),
        's'      => (int)($_GET['s'] ?? 1),
    ], $degis);
    if ((int)($s['s'] ?? 1) <= 1) unset($s['s']);         // 1. sayfa için parametre yazma
    $s = array_filter($s, fn($v) => $v !== '' && $v !== null);
    return 'talepler.php' . ($s ? '?' . http_build_query($s) : '');
}

// -- İşlemler ----------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $id  = girdi('id');
    $yol = talep_yolu($id);
    $eylem = girdi('eylem');

    if ($eylem === 'okundu' && is_file($yol)) {
        $d = json_oku($yol); $d['okundu'] = true; json_yaz($yol, $d);
    } elseif ($eylem === 'okunmadi' && is_file($yol)) {
        $d = json_oku($yol); $d['okundu'] = false; json_yaz($yol, $d);
    } elseif ($eylem === 'not' && is_file($yol)) {
        $d = json_oku($yol);
        $d['not'] = mb_substr(girdi('not'), 0, 2000);
        json_yaz($yol, $d);
        gunluk_yaz('talep-not', $id);
        flash_koy('basari', 'Not kaydedildi.');
    } elseif ($eylem === 'yanit' && is_file($yol)) {
        $d = json_oku($yol);
        $d['yanitlandi'] = empty($d['yanitlandi']);
        if (!empty($d['yanitlandi'])) $d['okundu'] = true;
        json_yaz($yol, $d);
        gunluk_yaz('talep-yanit', $id . ($d['yanitlandi'] ? ' · yanıtlandı' : ' · geri alındı'));
    } elseif ($eylem === 'ata' && is_file($yol)) {
        $d = json_oku($yol);
        $atan = girdi('atanan');
        $d['atanan'] = ($atan !== '' && isset($kullanicilar[$atan])) ? $atan : '';
        json_yaz($yol, $d);
        gunluk_yaz('talep-ata', $id . ' → ' . ($d['atanan'] !== '' ? ($kullanicilar[$d['atanan']] ?? $d['atanan']) : '(kaldırıldı)'));
    } elseif ($eylem === 'sil' && is_file($yol)) {
        talep_geri_donusume($id, json_oku($yol));
        @unlink($yol);
        gunluk_yaz('talep-sil', $id);
        flash_koy('basari', 'Talep silindi — aşağıdaki "Silinen talepler"den geri alınabilir.');
    } elseif ($eylem === 'geri-al') {
        if (talep_geri_al($id)) { gunluk_yaz('talep-geri-al', $id); flash_koy('basari', 'Talep geri alındı.'); }
        else flash_koy('hata', 'Talep geri alınamadı.');
    } elseif ($eylem === 'tumu-okundu') {
        foreach (glob(TALEP_DIZIN . '/*.json') ?: [] as $f) {
            $d = json_oku($f); if (empty($d['okundu'])) { $d['okundu'] = true; json_yaz($f, $d); }
        }
        gunluk_yaz('talep-tumu-okundu');
        flash_koy('basari', 'Tüm talepler okundu olarak işaretlendi.');
    } elseif ($eylem === 'okunmuslari-sil') {
        $n = 0;
        foreach (glob(TALEP_DIZIN . '/*.json') ?: [] as $f) {
            $d = json_oku($f);
            if (!empty($d['okundu'])) { talep_geri_donusume(basename($f, '.json'), $d); @unlink($f); $n++; }
        }
        gunluk_yaz('talep-sil', "okunmuşlar ($n)");
        flash_koy('basari', "$n okunmuş talep silindi (geri dönüşüme taşındı).");
    }
    talep_sayaci_bosalt();
    git(talep_baglanti());
}

// -- Listele -------------------------------------------------------
$q      = trim((string)girdi('q', 'get'));
$durum  = girdi('durum', 'get');                      // '' | okunmadi | okundu
$atanan = girdi('atanan', 'get');                     // '' | '-' (atanmamış) | <uid>
$sayfa  = max(1, (int)girdi('s', 'get'));

$dosyalar = glob(TALEP_DIZIN . '/*.json') ?: [];
rsort($dosyalar);                                     // dosya adı zamanla başlar → en yeni önce

$tumu = [];
foreach ($dosyalar as $f) {
    $d = json_oku($f);
    if ($d) $tumu[] = $d;
}
$okunmamis = count(array_filter($tumu, fn($t) => empty($t['okundu'])));

// Arama + durum süzgeci
$ql = mb_strtolower($q);
$suzulmus = array_values(array_filter($tumu, function ($t) use ($ql, $durum, $atanan) {
    if ($durum === 'okunmadi' && !empty($t['okundu'])) return false;
    if ($durum === 'okundu'   &&  empty($t['okundu'])) return false;
    if ($atanan === '-' && !empty($t['atanan'])) return false;
    if ($atanan !== '' && $atanan !== '-' && ($t['atanan'] ?? '') !== $atanan) return false;
    if ($ql !== '') {
        $havuz = mb_strtolower(($t['ad'] ?? '') . ' ' . ($t['eposta'] ?? '') . ' ' .
                               ($t['telefon'] ?? '') . ' ' . ($t['govde'] ?? ''));
        if (mb_strpos($havuz, $ql) === false) return false;
    }
    return true;
}));

$toplam   = count($suzulmus);
$sonSayfa = max(1, (int)ceil($toplam / TALEP_SAYFA));
$sayfa    = min($sayfa, $sonSayfa);
$gorunen  = array_slice($suzulmus, ($sayfa - 1) * TALEP_SAYFA, TALEP_SAYFA);
$suzuluyor = ($q !== '' || $durum !== '' || $atanan !== '');

$turAd = ['teklif' => 'Teklif', 'basvuru' => 'İş Başvurusu', 'yorum' => 'Yorum'];

$baslik = 'Talepler'; $aktif = 'talepler';
include __DIR__ . '/inc/ust.php';
?>

<div class="sayfa-baslik" style="margin-top:-6px">
  <span class="ipucu">
    <?= count($tumu) ?> talep · <?= $okunmamis ?> okunmamış
    <?= $suzuluyor ? ' · süzülen: ' . $toplam : '' ?>
  </span>
  <div class="btn-satir" style="margin:0">
    <a class="btn btn--sade" href="talep-disa-aktar.php">CSV indir</a>
    <?php if ($okunmamis): ?>
    <form method="post" style="margin:0" data-onay="Tüm talepleri okundu olarak işaretle?">
      <?= csrf_alan() ?><input type="hidden" name="eylem" value="tumu-okundu">
      <button class="btn btn--sade" type="submit">Tümünü okundu yap</button>
    </form>
    <?php endif; ?>
    <?php if (count($tumu) - $okunmamis > 0): ?>
    <form method="post" style="margin:0" data-onay="Okunmuş tüm talepler silinsin mi? (Aşağıdaki Silinen talepler'den geri alınabilir)">
      <?= csrf_alan() ?><input type="hidden" name="eylem" value="okunmuslari-sil">
      <button class="btn btn--sade" style="color:var(--err-tx)" type="submit">Okunmuşları sil</button>
    </form>
    <?php endif; ?>
  </div>
</div>

<form method="get" class="kart kart--ince" style="display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end">
  <div class="alan" style="flex:1;min-width:200px;margin:0">
    <label>Ara — ad, e-posta, telefon, mesaj</label>
    <input type="search" name="q" value="<?= e($q) ?>" placeholder="ör. Ahmet, @firma.com, servis…">
  </div>
  <div class="alan" style="margin:0">
    <label>Durum</label>
    <select name="durum" style="width:auto">
      <option value="">Hepsi</option>
      <option value="okunmadi" <?= $durum === 'okunmadi' ? 'selected' : '' ?>>Okunmamış</option>
      <option value="okundu"   <?= $durum === 'okundu'   ? 'selected' : '' ?>>Okunmuş</option>
    </select>
  </div>
  <div class="alan" style="margin:0">
    <label>Atanan</label>
    <select name="atanan" style="width:auto">
      <option value="">Herkes</option>
      <option value="-" <?= $atanan === '-' ? 'selected' : '' ?>>Atanmamış</option>
      <?php foreach ($kullanicilar as $uid => $uad): ?>
        <option value="<?= e($uid) ?>" <?= $atanan === $uid ? 'selected' : '' ?>><?= e($uad) ?></option>
      <?php endforeach; ?>
    </select>
  </div>
  <button class="btn btn--ana" type="submit">Uygula</button>
  <?php if ($suzuluyor): ?><a class="btn btn--sade" href="talepler.php">Temizle</a><?php endif; ?>
</form>

<?php if (!$tumu): ?>
  <div class="kart">Henüz talep yok. Sitedeki formlardan gelen mesajlar burada listelenir.</div>
<?php elseif (!$gorunen): ?>
  <div class="kart">Bu süzgeçle eşleşen talep yok. <a href="talepler.php">Süzgeci temizle</a>.</div>
<?php else: ?>
  <div class="kart" style="padding:0">
  <div class="tablo-sar">
  <table class="liste">
    <thead><tr>
      <th>Durum</th><th>Tür</th><th>Ad / İletişim</th><th>Tarih</th><th>Detay</th><th></th>
    </tr></thead>
    <tbody>
    <?php foreach ($gorunen as $t): ?>
      <tr class="<?= empty($t['okundu']) ? 'okunmadi' : '' ?>">
        <td>
          <?php if (empty($t['okundu'])): ?>
            <span class="rozet rozet--yeni">Yeni</span>
          <?php else: ?>
            <span class="rozet rozet--okundu">Okundu</span>
          <?php endif; ?>
          <?php if (!empty($t['yanitlandi'])): ?><br><span class="rozet rozet--ok2">Yanıtlandı</span><?php endif; ?>
          <?php if (!empty($t['atanan']) && isset($kullanicilar[$t['atanan']])): ?><br><span class="rozet rozet--kisi"><?= e($kullanicilar[$t['atanan']]) ?></span><?php endif; ?>
          <?php if (!empty($t['not'])): ?><br><span class="rozet" title="Dahili not var">✎ not</span><?php endif; ?>
        </td>
        <td><?= e($turAd[$t['tur']] ?? $t['tur']) ?></td>
        <td>
          <b><?= e($t['ad']) ?></b><br>
          <a href="mailto:<?= e($t['eposta']) ?>"><?= e($t['eposta']) ?></a>
          <?= $t['telefon'] ? '<br><a href="tel:' . e(preg_replace('/\s/', '', $t['telefon'])) . '">' . e($t['telefon']) . '</a>' : '' ?>
        </td>
        <td><?= e(tarih_tr($t['zaman'] ?? 0)) ?></td>
        <td>
          <details>
            <summary style="cursor:pointer;color:var(--baslik)">Mesajı gör</summary>
            <pre style="white-space:pre-wrap;font:inherit;margin:8px 0 0;color:var(--ink-soft)"><?= e($t['govde'] ?? '') ?></pre>
            <?php if (!empty($t['ekler'])): ?>
              <p class="ipucu">Ekler (e-postada): <?= e(implode(', ', $t['ekler'])) ?></p>
            <?php endif; ?>
            <?php if (empty($t['mail'])): ?>
              <p class="ipucu" style="color:var(--err-tx)">⚠ Bu talebin e-postası gönderilemedi (yalnızca panele kaydedildi).</p>
            <?php endif; ?>

            <form method="post" style="margin:12px 0 0">
              <?= csrf_alan() ?>
              <input type="hidden" name="id" value="<?= e($t['id']) ?>">
              <input type="hidden" name="eylem" value="not">
              <label class="ipucu" style="display:block;margin-bottom:4px">Dahili not — yalnızca panelde görünür</label>
              <textarea name="not" style="width:100%;min-height:64px;font:inherit"><?= e($t['not'] ?? '') ?></textarea>
              <div class="btn-satir" style="margin:6px 0 0;gap:8px">
                <button class="btn btn--sade" style="padding:6px 12px" type="submit">Notu kaydet</button>
              </div>
            </form>
            <form method="post" style="margin:6px 0 0">
              <?= csrf_alan() ?>
              <input type="hidden" name="id" value="<?= e($t['id']) ?>">
              <input type="hidden" name="eylem" value="yanit">
              <button class="btn btn--sade" style="padding:6px 12px" type="submit"><?= !empty($t['yanitlandi']) ? '“Yanıtlandı” işaretini kaldır' : 'Yanıtlandı olarak işaretle' ?></button>
            </form>
            <form method="post" style="margin:8px 0 0">
              <?= csrf_alan() ?>
              <input type="hidden" name="id" value="<?= e($t['id']) ?>">
              <input type="hidden" name="eylem" value="ata">
              <label class="ipucu" style="display:block;margin-bottom:4px">Atanan kişi</label>
              <select name="atanan" data-otomatik-gonder style="width:auto">
                <option value="">— atanmamış —</option>
                <?php foreach ($kullanicilar as $uid => $uad): ?>
                  <option value="<?= e($uid) ?>" <?= ($t['atanan'] ?? '') === $uid ? 'selected' : '' ?>><?= e($uad) ?></option>
                <?php endforeach; ?>
              </select>
              <noscript><button class="btn btn--sade" style="padding:6px 12px;margin-left:6px" type="submit">Ata</button></noscript>
            </form>
          </details>
        </td>
        <td style="white-space:nowrap">
          <form method="post" style="display:inline;margin:0">
            <?= csrf_alan() ?>
            <input type="hidden" name="id" value="<?= e($t['id']) ?>">
            <input type="hidden" name="eylem" value="<?= empty($t['okundu']) ? 'okundu' : 'okunmadi' ?>">
            <button class="btn btn--sade" style="padding:6px 12px" type="submit"><?= empty($t['okundu']) ? 'Okundu' : 'Geri al' ?></button>
          </form>
          <form method="post" style="display:inline;margin:0" data-onay="Bu talebi kalıcı olarak silmek istiyor musunuz?">
            <?= csrf_alan() ?>
            <input type="hidden" name="id" value="<?= e($t['id']) ?>">
            <input type="hidden" name="eylem" value="sil">
            <button class="btn btn--sade" style="padding:6px 12px;color:var(--err-tx)" type="submit">Sil</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
  </div>

  <?php if ($sonSayfa > 1): ?>
  <div class="btn-satir" style="justify-content:space-between;align-items:center">
    <span class="ipucu">Sayfa <?= $sayfa ?> / <?= $sonSayfa ?></span>
    <span style="display:flex;gap:8px">
      <?php if ($sayfa > 1): ?>
        <a class="btn btn--sade" href="<?= e(talep_baglanti(['s' => $sayfa - 1])) ?>">← Önceki</a>
      <?php endif; ?>
      <?php if ($sayfa < $sonSayfa): ?>
        <a class="btn btn--sade" href="<?= e(talep_baglanti(['s' => $sayfa + 1])) ?>">Sonraki →</a>
      <?php endif; ?>
    </span>
  </div>
  <?php endif; ?>
<?php endif; ?>

<?php $silinenler = silinen_talepler(); ?>
<?php if ($silinenler): ?>
<div class="kart kart--ince" style="margin-top:20px">
  <h2>Silinen talepler <span class="ipucu">(en yeni 50 · geri alınabilir)</span></h2>
  <div class="tablo-sar">
  <table class="liste">
    <thead><tr><th>Silinme</th><th>Ad / İletişim</th><th>Geliş tarihi</th><th></th></tr></thead>
    <tbody>
    <?php foreach ($silinenler as $t): ?>
      <tr>
        <td style="white-space:nowrap"><?= e(tarih_tr($t['silinme'] ?? 0)) ?></td>
        <td><b><?= e($t['ad'] ?? '') ?></b><br><span class="ipucu"><?= e($t['eposta'] ?? '') ?></span></td>
        <td style="white-space:nowrap"><?= e(tarih_tr($t['zaman'] ?? 0)) ?></td>
        <td>
          <form method="post" style="margin:0">
            <?= csrf_alan() ?>
            <input type="hidden" name="id" value="<?= e($t['id'] ?? '') ?>">
            <input type="hidden" name="eylem" value="geri-al">
            <button class="btn btn--sade" style="padding:6px 12px" type="submit">Geri al</button>
          </form>
        </td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  </div>
</div>
<?php endif; ?>

<?php include __DIR__ . '/inc/alt.php'; ?>
