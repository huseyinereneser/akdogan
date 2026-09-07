<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();
yonetici_gerekli();

/*
 * ceviri.php — RU / AR / DE çeviri sözlüğü editörü.
 * Kaynak: tools/i18n-translations.json  { text: {...}, html: {...} }
 * Çıktı : assets/i18n/{ru,ar,de}.json   { t: {...}, h: {...} }
 * (tools/i18n-build.js ile aynı işi yapar; Node gerektirmez.)
 */

const CEVIRI_DILLER = ['ru', 'ar', 'de'];

function ceviri_kaynak_oku(): array {
    $d = json_oku(CEVIRI_KAYNAK);
    return [
        'text' => is_array($d['text'] ?? null) ? $d['text'] : [],
        'html' => is_array($d['html'] ?? null) ? $d['html'] : [],
    ];
}

/** Kaynağı 2 boşluk girintili yaz (mevcut dosya biçimiyle uyumlu) */
function ceviri_kaynak_yaz(array $kaynak): bool {
    $json = json_encode($kaynak, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) return false;
    // JSON_PRETTY_PRINT 4 boşluk kullanır; kaynağı 2 boşluğa indir
    $json = preg_replace_callback('/^(?: {4})+/m', fn($m) => str_repeat(' ', (int) (strlen($m[0]) / 2)), $json);
    $gecici = CEVIRI_KAYNAK . '.tmp' . kimlik(4);
    if (@file_put_contents($gecici, $json . "\n", LOCK_EX) === false) return false;
    if (!@rename($gecici, CEVIRI_KAYNAK)) { @unlink($gecici); return false; }
    return true;
}

/** Çalışma zamanı sözlüklerini üret. Dönüş: rapor [dil => [t,h]] */
function ceviri_derle(array $kaynak): array {
    $rapor = [];
    if (!is_dir(I18N_CIKTI_DIZIN)) @mkdir(I18N_CIKTI_DIZIN, 0775, true);
    foreach (CEVIRI_DILLER as $l) {
        $t = []; $h = [];
        foreach ($kaynak['text'] as $en => $v) {
            if (is_array($v) && isset($v[$l]) && $v[$l] !== '') $t[$en] = $v[$l];
        }
        foreach ($kaynak['html'] as $en => $v) {
            if (is_array($v) && isset($v[$l]) && $v[$l] !== '') $h[$en] = $v[$l];
        }
        $json = json_encode(['t' => $t, 'h' => $h], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        @file_put_contents(I18N_CIKTI_DIZIN . '/' . $l . '.json', $json . "\n", LOCK_EX);
        $rapor[$l] = ['t' => count($t), 'h' => count($h)];
    }
    return $rapor;
}

/** Sayfalarda geçen ama kaynakta olmayan dizgeler (i18n-build.js §3 ile aynı mantık) */
function ceviri_eksik_tara(array $kaynak): array {
    $dosyalar = glob(SITE_KOK . '/*.html') ?: [];
    foreach (['_partials/header.html', '_partials/footer.html'] as $p) {
        if (is_file(SITE_KOK . '/' . $p)) $dosyalar[] = SITE_KOK . '/' . $p;
    }
    $coz  = fn($s) => str_replace(['&amp;', '&lt;', '&gt;', '&quot;', '&#39;', '&nbsp;'], ['&', '<', '>', '"', "'", ' '], $s);
    $norm = fn($s) => trim(preg_replace('/\s+/', ' ', $s));
    $duz  = fn($s) => trim(preg_replace('/\s+/', ' ', preg_replace('/<[^>]*>/', '', $s)));

    $gT = []; $gH = [];
    foreach ($dosyalar as $p) {
        $html = @file_get_contents($p);
        if ($html === false) continue;
        if (preg_match_all('/\sdata-en="([^"]*)"/', $html, $m)) foreach ($m[1] as $x) $gT[$norm($coz($x))] = 1;
        if (preg_match_all('/\sdata-en-[a-z-]+="([^"]*)"/', $html, $m)) foreach ($m[1] as $x) $gT[$norm($coz($x))] = 1;
        if (preg_match('/data-title-en="([^"]*)"/', $html, $m)) $gT[$norm($coz($m[1]))] = 1;
        if (preg_match_all('/<(\w+)[^>]*\sdata-l="en"[^>]*>([\s\S]*?)<\/\1>/', $html, $m)) {
            foreach ($m[2] as $x) $gH[$duz($coz($x))] = 1;
        }
    }
    $eksikT = []; $eksikH = [];
    foreach (array_keys($gT) as $s) if ($s !== '' && !array_key_exists($s, $kaynak['text'])) $eksikT[] = $s;
    foreach (array_keys($gH) as $s) if ($s !== '' && !array_key_exists($s, $kaynak['html'])) $eksikH[] = $s;
    sort($eksikT); sort($eksikH);
    return ['text' => $eksikT, 'html' => $eksikH];
}

/**
 * "t[Bir Anahtar][ru]" gibi düz form adlarını iç içe diziye çevirir.
 * parse_str / normal POST ayrıştırması max_input_vars'a takıldığı için,
 * form tek bir JSON alanı olarak gelir ve burada açılır.
 */
function ic_form_ac(array $duz): array {
    $out = [];
    foreach ($duz as $ham => $deger) {
        if (!is_string($ham) || $ham === '') continue;
        if (!preg_match('/^([^\[\]]+)/', $ham, $m)) continue;
        $yol = [$m[1]];
        if (preg_match_all('/\[([^\[\]]*)\]/', substr($ham, strlen($m[1])), $mm)) {
            foreach ($mm[1] as $seg) $yol[] = $seg;
        }
        $ref = &$out;
        $son = count($yol) - 1;
        foreach ($yol as $i => $seg) {
            if ($i === $son) {
                if ($seg === '') $ref[] = $deger; else $ref[$seg] = $deger;
            } elseif ($seg === '') {
                $ref[] = [];
                $ref = &$ref[array_key_last($ref)];
            } else {
                if (!isset($ref[$seg]) || !is_array($ref[$seg])) $ref[$seg] = [];
                $ref = &$ref[$seg];
            }
        }
        unset($ref);
    }
    return $out;
}

$kaynak = ceviri_kaynak_oku();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $eylem = girdi('eylem');

    if ($eylem === 'derle') {
        $rapor = ceviri_derle($kaynak);
        gunluk_yaz('ceviri-derle');
        $ozet = [];
        foreach ($rapor as $l => $r) $ozet[] = strtoupper($l) . ': ' . $r['t'] . '+' . $r['h'];
        flash_koy('basari', 'Sözlükler yeniden derlendi — ' . implode(' · ', $ozet) . '.');
        git('ceviri.php');
    }

    if ($eylem === 'kaydet') {
        $P = ic_form_ac(json_decode((string) ($_POST['veri'] ?? ''), true) ?: []);
        if (!$P) {
            flash_koy('hata', 'Form verisi alınamadı — tarayıcıda JavaScript kapalı olabilir.');
            git('ceviri.php');
        }
        $sil = $P['sil'] ?? [];
        foreach (['text' => 't', 'html' => 'h'] as $tur => $anahtar) {
            $gelen = $P[$anahtar] ?? [];
            if (!is_array($gelen)) continue;
            foreach ($gelen as $en => $vals) {
                if (!is_string($en) || $en === '') continue;
                if (!empty($sil[$tur][$en])) { unset($kaynak[$tur][$en]); continue; }
                $kaynak[$tur][$en] = [
                    'ru' => trim((string) ($vals['ru'] ?? '')),
                    'ar' => trim((string) ($vals['ar'] ?? '')),
                    'de' => trim((string) ($vals['de'] ?? '')),
                ];
            }
        }

        // Yeni anahtar
        $yeniEn  = trim((string) ($P['yeni_en'] ?? ''));
        $yeniTur = ($P['yeni_tur'] ?? '') === 'html' ? 'html' : 'text';
        if ($yeniEn !== '') {
            $kaynak[$yeniTur][$yeniEn] = [
                'ru' => trim((string) ($P['yeni_ru'] ?? '')),
                'ar' => trim((string) ($P['yeni_ar'] ?? '')),
                'de' => trim((string) ($P['yeni_de'] ?? '')),
            ];
        }

        if (ceviri_kaynak_yaz($kaynak)) {
            $rapor = ceviri_derle($kaynak);
            gunluk_yaz('ceviri-kaydet', ($yeniEn !== '' ? 'yeni: ' . mb_substr($yeniEn, 0, 40) : ''));
            $ozet = [];
            foreach ($rapor as $l => $r) $ozet[] = strtoupper($l) . ': ' . $r['t'] . '+' . $r['h'];
            flash_koy('basari', 'Çeviriler kaydedildi ve sözlükler yeniden derlendi — ' . implode(' · ', $ozet) . '.');
        } else {
            flash_koy('hata', 'Kaydedilemedi — ' . CEVIRI_KAYNAK . ' dosyasının yazma izni yok gibi görünüyor.');
        }
        git('ceviri.php');
    }
}

$eksik = ceviri_eksik_tara($kaynak);

// Dil başına eksik (kaynak girdisi var ama o dil boş)
$eksikSayi = [];
foreach (CEVIRI_DILLER as $l) {
    $n = 0;
    foreach ($kaynak['text'] as $v) if (empty($v[$l])) $n++;
    foreach ($kaynak['html'] as $v) if (empty($v[$l])) $n++;
    $eksikSayi[$l] = $n;
}

$toplamAnahtar = count($kaynak['text']) + count($kaynak['html']);

$baslik = 'Çeviriler'; $aktif = 'ceviri';
include __DIR__ . '/inc/ust.php';
?>

<div class="kart kart--ince">
  Sitede Türkçe ve İngilizce metinler doğrudan sayfa HTML'inde durur. <b>Rusça, Arapça
  ve Almanca</b> metinler bu sözlükten gelir. Bir alanı boş bırakırsanız o dilde
  İngilizce metin gösterilir. Kaydettiğinizde <code>assets/i18n/{ru,ar,de}.json</code>
  dosyaları otomatik yeniden üretilir — ayrıca <code>node</code> çalıştırmanıza gerek yok.
  <br><span class="ipucu">Yeni bir <b>dil</b> eklemek için <code>assets/i18n/languages.json</code>,
  bir bayrak SVG'si ve <code>style.css</code>'te <code>.flag--xx</code> kuralı gerekir — o adım elle yapılır.</span>
</div>

<div class="kart">
  <h2>Durum</h2>
  <p>Sözlükte <b><?= $toplamAnahtar ?></b> anahtar var
    (<?= count($kaynak['text']) ?> kısa metin + <?= count($kaynak['html']) ?> HTML blok).</p>
  <p>Eksik çeviri —
    <?php foreach (CEVIRI_DILLER as $l): ?>
      <span class="rozet <?= $eksikSayi[$l] ? '' : 'rozet--ok2' ?>" style="<?= $eksikSayi[$l] ? 'background:var(--warn-bg);color:var(--warn-tx)' : '' ?>">
        <?= strtoupper($l) ?>: <?= $eksikSayi[$l] ?>
      </span>
    <?php endforeach; ?>
  </p>
  <?php if ($eksik['text'] || $eksik['html']): ?>
    <details>
      <summary style="cursor:pointer;color:var(--baslik)">
        Sayfalarda geçen ama sözlükte olmayan <?= count($eksik['text']) + count($eksik['html']) ?> dizge
      </summary>
      <p class="ipucu" style="margin:8px 0 4px">Bunları aşağıdaki "Yeni çeviri anahtarı" ile ekleyin
        (İngilizce anahtarı birebir kopyalayın):</p>
      <pre style="white-space:pre-wrap;font:12px/1.6 ui-monospace,Consolas,monospace;background:var(--pre-bg);color:var(--ink);padding:10px;border-radius:6px;max-height:260px;overflow:auto"><?php
        foreach ($eksik['text'] as $s) echo 'text  ' . e($s) . "\n";
        foreach ($eksik['html'] as $s) echo 'html  ' . e($s) . "\n";
      ?></pre>
    </details>
  <?php else: ?>
    <p class="ipucu" style="margin:0">Tüm sayfa dizgeleri sözlükte mevcut. ✓</p>
  <?php endif; ?>
  <form method="post" style="margin-top:12px">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="derle">
    <button class="btn btn--sade" type="submit">Sözlükleri şimdi yeniden derle</button>
  </form>
</div>

<form method="post" data-json-topla>
  <?= csrf_alan() ?>
  <input type="hidden" name="eylem" value="kaydet">
  <input type="hidden" name="veri" data-json-hedef>

  <div class="kart">
    <h2>Yeni çeviri anahtarı</h2>
    <div class="alan-ikili">
      <div class="alan"><label>İngilizce anahtar</label>
        <input type="text" name="yeni_en" placeholder="Örn: Request a quote"></div>
      <div class="alan"><label>Tür</label>
        <select name="yeni_tur">
          <option value="text">Kısa metin</option>
          <option value="html">HTML blok</option>
        </select>
      </div>
    </div>
    <div class="alan"><label>Rusça</label><input type="text" name="yeni_ru"></div>
    <div class="alan"><label>Arapça</label><input type="text" name="yeni_ar" dir="rtl"></div>
    <div class="alan"><label>Almanca</label><input type="text" name="yeni_de"></div>
    <p class="ipucu">Bu form da aşağıdaki "Tümünü kaydet" ile birlikte kaydedilir.</p>
  </div>

  <div class="kart">
    <div class="sayfa-baslik" style="margin:0 0 10px">
      <h2 style="margin:0">Kısa metinler <span class="ipucu">(<span id="tSay"><?= count($kaynak['text']) ?></span>)</span></h2>
      <input type="search" placeholder="Ara…" data-filtre="#tListe" data-filtre-sayac="#tSay" style="max-width:220px">
    </div>
    <div id="tListe">
      <?php foreach ($kaynak['text'] as $en => $v): ?>
        <div class="alan filtre-oge" style="border-bottom:1px solid var(--line);padding-bottom:10px">
          <label style="word-break:break-word"><?= e($en) ?></label>
          <div class="alan-ikili" style="margin-bottom:0">
            <input type="text" name="t[<?= e($en) ?>][ru]" value="<?= e($v['ru'] ?? '') ?>" placeholder="Rusça">
            <input type="text" name="t[<?= e($en) ?>][ar]" value="<?= e($v['ar'] ?? '') ?>" placeholder="Arapça" dir="rtl">
          </div>
          <div style="display:flex;gap:10px;align-items:center;margin-top:8px">
            <input type="text" name="t[<?= e($en) ?>][de]" value="<?= e($v['de'] ?? '') ?>" placeholder="Almanca" style="flex:1">
            <label class="ipucu" style="display:flex;align-items:center;gap:5px;margin:0;white-space:nowrap">
              <input type="checkbox" name="sil[text][<?= e($en) ?>]" value="1" style="width:auto"> sil
            </label>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <div class="kart">
    <div class="sayfa-baslik" style="margin:0 0 10px">
      <h2 style="margin:0">HTML bloklar <span class="ipucu">(<span id="hSay"><?= count($kaynak['html']) ?></span>)</span></h2>
      <input type="search" placeholder="Ara…" data-filtre="#hListe" data-filtre-sayac="#hSay" style="max-width:220px">
    </div>
    <p class="ipucu">Bu alanlarda bağlantı / <code>&lt;strong&gt;</code> gibi HTML etiketleri kullanılabilir.</p>
    <div id="hListe">
      <?php foreach ($kaynak['html'] as $en => $v): ?>
        <div class="alan filtre-oge" style="border-bottom:1px solid var(--line);padding-bottom:10px">
          <label style="word-break:break-word"><?= e($en) ?></label>
          <textarea name="h[<?= e($en) ?>][ru]" placeholder="Rusça"><?= e($v['ru'] ?? '') ?></textarea>
          <textarea name="h[<?= e($en) ?>][ar]" placeholder="Arapça" dir="rtl"><?= e($v['ar'] ?? '') ?></textarea>
          <textarea name="h[<?= e($en) ?>][de]" placeholder="Almanca"><?= e($v['de'] ?? '') ?></textarea>
          <label class="ipucu" style="display:flex;align-items:center;gap:5px;margin:6px 0 0">
            <input type="checkbox" name="sil[html][<?= e($en) ?>]" value="1" style="width:auto"> bu anahtarı sil
          </label>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <div class="btn-satir">
    <button class="btn btn--ana" type="submit">Tümünü kaydet</button>
  </div>
</form>

<?php include __DIR__ . '/inc/alt.php'; ?>
