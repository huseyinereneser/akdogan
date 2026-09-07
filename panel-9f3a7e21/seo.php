<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();
yonetici_gerekli();

/** Site kökündeki yayınlanabilir sayfalar: [dosyaAdi => tamYol] */
function seo_sayfa_listesi(): array {
    $haric = ['404.html', 'tesekkurler.html'];
    $out = [];
    foreach (glob(SITE_KOK . '/*.html') ?: [] as $f) {
        $ad = basename($f);
        if (in_array($ad, $haric, true)) continue;
        $out[$ad] = $f;
    }
    ksort($out);
    // index.html en başta olsun
    if (isset($out['index.html'])) {
        $ilk = ['index.html' => $out['index.html']];
        unset($out['index.html']);
        $out = $ilk + $out;
    }
    return $out;
}

$DEGISIM = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
$ONCELIK = ['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3'];

$seo = seo_oku();
$seo += [
    'site_url'      => 'https://www.akdoganturizm.com',
    'varsayilan_og' => '',
    'robots'        => "User-agent: *\nAllow: /\n\nSitemap: https://www.akdoganturizm.com/sitemap.xml\n",
    'sayfalar'      => [],
    'sitemap_uretim'=> 0,
];
$sayfalar = seo_sayfa_listesi();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $eylem = girdi('eylem');

    if ($eylem === 'kaydet') {
        $seo['site_url']      = guvenli_url(girdi('site_url')) ?: $seo['site_url'];
        $seo['varsayilan_og'] = trim(girdi('varsayilan_og'));
        $gelen = $_POST['s'] ?? [];
        $yeni = [];
        foreach ($sayfalar as $ad => $_) {
            $r = is_array($gelen[$ad] ?? null) ? $gelen[$ad] : [];
            $onc = in_array($r['oncelik'] ?? '', $ONCELIK, true) ? $r['oncelik'] : ($ad === 'index.html' ? '1.0' : '0.7');
            $deg = in_array($r['degisim'] ?? '', $DEGISIM, true) ? $r['degisim'] : 'monthly';
            $yeni[$ad] = [
                'baslik_tr'   => mb_substr(trim($r['baslik_tr'] ?? ''), 0, 180),
                'baslik_en'   => mb_substr(trim($r['baslik_en'] ?? ''), 0, 180),
                'aciklama_tr' => mb_substr(trim($r['aciklama_tr'] ?? ''), 0, 320),
                'aciklama_en' => mb_substr(trim($r['aciklama_en'] ?? ''), 0, 320),
                'og'          => trim($r['og'] ?? ''),
                'oncelik'     => $onc,
                'degisim'     => $deg,
                'haric'       => !empty($r['haric']),
            ];
        }
        $seo['sayfalar'] = $yeni;
        if (seo_yaz($seo)) {
            gunluk_yaz('seo-kaydet');
            flash_koy('basari', 'SEO ayarları kaydedildi ve sitede güncellendi. Sitemap\'i yenilemeyi unutmayın.');
        } else {
            flash_koy('hata', 'Kaydedilemedi — veri klasörünün yazma izni yok gibi görünüyor.');
        }
        git('seo.php');
    }

    if ($eylem === 'sitemap') {
        $base = rtrim($seo['site_url'], '/');
        $satir = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
        foreach ($sayfalar as $ad => $yol) {
            $s = $seo['sayfalar'][$ad] ?? [];
            if (!empty($s['haric'])) continue;
            $loc = $base . '/' . ($ad === 'index.html' ? '' : $ad);
            $lastmod = date('Y-m-d', @filemtime($yol) ?: time());
            $onc = $s['oncelik'] ?? ($ad === 'index.html' ? '1.0' : '0.7');
            $deg = $s['degisim'] ?? 'monthly';
            $satir[] = '  <url><loc>' . e($loc) . '</loc><lastmod>' . $lastmod . '</lastmod>'
                     . '<changefreq>' . $deg . '</changefreq><priority>' . $onc . '</priority></url>';
        }
        $satir[] = '</urlset>';
        $xml = implode("\n", $satir) . "\n";

        if (@file_put_contents(SITE_KOK . '/sitemap.xml', $xml, LOCK_EX) !== false) {
            $seo['sitemap_uretim'] = time();
            seo_yaz($seo);
            gunluk_yaz('sitemap-uret', count($sayfalar) . ' sayfa');
            flash_koy('basari', 'sitemap.xml yeniden oluşturuldu (' . SITE_KOK . '/sitemap.xml).');
        } else {
            $_SESSION['sitemap_onizleme'] = $xml;
            flash_koy('hata', 'sitemap.xml dosyaya yazılamadı (site kökünün yazma izni yok). Aşağıdaki içeriği elle kaydedin.');
        }
        git('seo.php');
    }

    if ($eylem === 'robots') {
        $metin = trim(str_replace("\r\n", "\n", (string) ($_POST['robots'] ?? ''))) . "\n";
        $seo['robots'] = $metin;
        seo_yaz($seo);
        if (@file_put_contents(SITE_KOK . '/robots.txt', $metin, LOCK_EX) !== false) {
            gunluk_yaz('robots-kaydet');
            flash_koy('basari', 'robots.txt kaydedildi.');
        } else {
            flash_koy('hata', 'robots.txt dosyaya yazılamadı (site kökünün yazma izni yok). İçeriği elle kaydedin.');
        }
        git('seo.php');
    }
}

$sitemapOnizleme = $_SESSION['sitemap_onizleme'] ?? '';
unset($_SESSION['sitemap_onizleme']);

$baslik = 'SEO & Sitemap'; $aktif = 'seo';
include __DIR__ . '/inc/ust.php';
?>

<div class="kart kart--ince">
  Buradaki başlık ve açıklamalar sayfalar açıldığında <code>&lt;title&gt;</code> ve
  <code>meta description</code> etiketlerine uygulanır (site <code>assets/js/icerik.js</code>
  üzerinden). Boş bıraktığınız alanda sayfanın kendi HTML'indeki değer kullanılır.
  Türkçe dışı diller İngilizce değeri yedek alır.
</div>

<form method="post">
  <?= csrf_alan() ?>
  <input type="hidden" name="eylem" value="kaydet">

  <div class="kart">
    <h2>Genel</h2>
    <div class="alan-ikili">
      <div class="alan"><label>Site adresi (site_url)</label>
        <input type="url" name="site_url" value="<?= e($seo['site_url']) ?>" placeholder="https://www.akdoganturizm.com"></div>
      <div class="alan"><label>Varsayılan paylaşım görseli (og:image)</label>
        <input type="text" name="varsayilan_og" value="<?= e($seo['varsayilan_og']) ?>" placeholder="assets/img/og.jpg veya tam URL"></div>
    </div>
  </div>

  <div class="kart">
    <div class="sayfa-baslik" style="margin:0 0 10px">
      <h2 style="margin:0">Sayfa bazlı</h2>
      <input type="search" placeholder="Sayfa ara…" data-filtre="#seoListe" style="max-width:220px">
    </div>
    <div id="seoListe">
    <?php foreach ($sayfalar as $ad => $yol): $s = $seo['sayfalar'][$ad] ?? []; ?>
      <div class="kart kart--ince filtre-oge" style="margin:10px 0">
        <div class="sayfa-baslik" style="margin:0 0 6px">
          <b><?= e($ad) ?></b>
          <label class="ipucu" style="display:flex;align-items:center;gap:6px;margin:0">
            <input type="checkbox" name="s[<?= e($ad) ?>][haric]" value="1" style="width:auto" <?= !empty($s['haric']) ? 'checked' : '' ?>>
            sitemap dışı
          </label>
        </div>
        <div class="alan-ikili">
          <div class="alan"><label>Başlık (TR)</label>
            <input type="text" name="s[<?= e($ad) ?>][baslik_tr]" value="<?= e($s['baslik_tr'] ?? '') ?>" maxlength="180"></div>
          <div class="alan"><label>Başlık (EN)</label>
            <input type="text" name="s[<?= e($ad) ?>][baslik_en]" value="<?= e($s['baslik_en'] ?? '') ?>" maxlength="180"></div>
        </div>
        <div class="alan-ikili">
          <div class="alan"><label>Açıklama (TR) <span class="ipucu">~155 karakter</span></label>
            <textarea name="s[<?= e($ad) ?>][aciklama_tr]" maxlength="320"><?= e($s['aciklama_tr'] ?? '') ?></textarea></div>
          <div class="alan"><label>Açıklama (EN)</label>
            <textarea name="s[<?= e($ad) ?>][aciklama_en]" maxlength="320"><?= e($s['aciklama_en'] ?? '') ?></textarea></div>
        </div>
        <div class="alan-ikili">
          <div class="alan"><label>Paylaşım görseli (og:image)</label>
            <input type="text" name="s[<?= e($ad) ?>][og]" value="<?= e($s['og'] ?? '') ?>" placeholder="(boşsa varsayılan)"></div>
          <div class="alan" style="display:flex;gap:8px">
            <span style="flex:1"><label>Sitemap önceliği</label>
              <select name="s[<?= e($ad) ?>][oncelik]" style="width:100%">
                <?php foreach ($ONCELIK as $o): ?>
                  <option value="<?= $o ?>" <?= ($s['oncelik'] ?? ($ad === 'index.html' ? '1.0' : '0.7')) === $o ? 'selected' : '' ?>><?= $o ?></option>
                <?php endforeach; ?>
              </select>
            </span>
            <span style="flex:1"><label>Değişim sıklığı</label>
              <select name="s[<?= e($ad) ?>][degisim]" style="width:100%">
                <?php foreach ($DEGISIM as $d): ?>
                  <option value="<?= $d ?>" <?= ($s['degisim'] ?? 'monthly') === $d ? 'selected' : '' ?>><?= $d ?></option>
                <?php endforeach; ?>
              </select>
            </span>
          </div>
        </div>
      </div>
    <?php endforeach; ?>
    </div>
  </div>

  <div class="btn-satir">
    <button class="btn btn--ana" type="submit">SEO ayarlarını kaydet</button>
  </div>
</form>

<div class="kart">
  <h2>sitemap.xml</h2>
  <p class="ipucu">
    <?php if (!empty($seo['sitemap_uretim'])): ?>
      Son üretim: <b><?= e(tarih_tr($seo['sitemap_uretim'])) ?></b>.
    <?php else: ?>
      Henüz panelden üretilmedi.
    <?php endif; ?>
    Sayfa listesi, öncelik ve değişim sıklığı yukarıdaki ayarlardan alınır; <code>lastmod</code>
    dosya değişiklik tarihidir. Önce ayarları kaydedin, sonra üretin.
  </p>
  <form method="post" style="margin:0">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="sitemap">
    <button class="btn btn--sade" type="submit">sitemap.xml'i şimdi üret</button>
  </form>
  <?php if ($sitemapOnizleme !== ''): ?>
    <div class="alan" style="margin-top:12px">
      <label>Oluşturulan içerik (elle <code>sitemap.xml</code> olarak kaydedin)</label>
      <textarea readonly style="min-height:200px;font:12px/1.5 ui-monospace,Consolas,monospace"><?= e($sitemapOnizleme) ?></textarea>
    </div>
  <?php endif; ?>
</div>

<div class="kart">
  <h2>robots.txt</h2>
  <form method="post" style="margin:0">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="robots">
    <div class="alan">
      <textarea name="robots" style="min-height:150px;font:13px/1.6 ui-monospace,Consolas,monospace"><?= e($seo['robots']) ?></textarea>
    </div>
    <button class="btn btn--sade" type="submit">robots.txt kaydet</button>
  </form>
</div>

<?php include __DIR__ . '/inc/alt.php'; ?>
