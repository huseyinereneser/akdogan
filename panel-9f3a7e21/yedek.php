<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();
yonetici_gerekli();

$icerikDosyalari = ['ayarlar', 'hizmetler', 'galeri', 'sayfalar', 'seo'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $eylem = girdi('eylem');

    // ---- Yedeği indir (JSON paket) -----------------------------------
    if ($eylem === 'indir') {
        $paket = [
            'tur'       => 'akdogan-panel-yedek',
            'surum'     => 1,
            'olusturma' => date('c'),
            'site'      => $_SERVER['HTTP_HOST'] ?? '',
            'veri'      => [
                'ayarlar'   => json_oku(VERI_DIZIN . '/ayarlar.json'),
                'hizmetler' => json_oku(VERI_DIZIN . '/hizmetler.json'),
                'galeri'    => json_oku(VERI_DIZIN . '/galeri.json'),
                'sayfalar'  => json_oku(VERI_DIZIN . '/sayfalar.json'),
                'seo'       => json_oku(VERI_DIZIN . '/seo.json'),
                'users'     => json_oku(VERI_DIZIN . '/users.json'),
            ],
            'talepler'  => [],
        ];
        foreach (glob(TALEP_DIZIN . '/*.json') ?: [] as $f) {
            $d = json_oku($f);
            if ($d) $paket['talepler'][] = $d;
        }
        $json = json_encode($paket, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($json === false) {
            flash_koy('hata', 'Yedek oluşturulamadı (bir kayıtta bozuk karakter olabilir).');
            git('yedek.php');
        }

        gunluk_yaz('yedek-indir', count($paket['talepler']) . ' talep');
        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename="akdogan-yedek-' . date('Y-m-d-Hi') . '.json"');
        header('Content-Length: ' . strlen($json));
        echo $json;
        exit;
    }

    // ---- Yedekten geri yükle ---------------------------------------
    if ($eylem === 'geri-yukle') {
        $y = $_FILES['yedek'] ?? null;
        if (!$y || ($y['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($y['tmp_name'])) {
            flash_koy('hata', 'Yedek dosyası yüklenemedi.');
            git('yedek.php');
        }
        if ($y['size'] > 25 * 1024 * 1024) {
            flash_koy('hata', 'Yedek dosyası çok büyük (25 MB üstü).');
            git('yedek.php');
        }
        $paket = json_decode((string)file_get_contents($y['tmp_name']), true);
        if (!is_array($paket) || ($paket['tur'] ?? '') !== 'akdogan-panel-yedek' || !is_array($paket['veri'] ?? null)) {
            flash_koy('hata', 'Bu dosya bir panel yedeği değil ya da bozuk.');
            git('yedek.php');
        }

        $kullanicilarDa = girdi('kullanicilar') === '1';
        $ozet = [];

        foreach ($icerikDosyalari as $k) {
            if (isset($paket['veri'][$k]) && is_array($paket['veri'][$k])) {
                surum_al($k . '.json');
                json_yaz(VERI_DIZIN . '/' . $k . '.json', $paket['veri'][$k]);
                $ozet[] = $k;
            }
        }

        if ($kullanicilarDa) {
            $ku = $paket['veri']['users']['kullanicilar'] ?? null;
            if (is_array($ku) && array_filter($ku, fn($u) => ($u['rol'] ?? '') === 'yonetici')) {
                surum_al('users.json');
                json_yaz(VERI_DIZIN . '/users.json', ['kullanicilar' => array_values($ku)]);
                $ozet[] = 'kullanıcılar';
            } else {
                flash_koy('hata', 'Yedekte geçerli bir yönetici hesabı yok — kullanıcılar geri yüklenmedi.');
            }
        }

        $talepSayi = 0;
        if (!empty($paket['talepler']) && is_array($paket['talepler'])) {
            foreach ($paket['talepler'] as $t) {
                if (!is_array($t)) continue;
                $id = preg_replace('/[^A-Za-z0-9\-]/', '', (string)($t['id'] ?? ''));
                if ($id === '') continue;
                json_yaz(TALEP_DIZIN . '/' . $id . '.json', $t);
                $talepSayi++;
            }
            if ($talepSayi) $ozet[] = $talepSayi . ' talep';
        }

        site_json_uret();
        talep_sayaci_bosalt();
        gunluk_yaz('yedek-geri-yukle', implode(', ', $ozet));
        flash_koy('basari', 'Geri yüklendi: ' . (implode(', ', $ozet) ?: 'değişiklik yok') . '. Önceki içerik "Sürüm Geçmişi"nde.');
        git('yedek.php');
    }
}

$baslik = 'Yedek'; $aktif = 'yedek';
include __DIR__ . '/inc/ust.php';
?>

<div class="kart">
  <h2>Yedek indir</h2>
  <p class="ipucu">Tüm panel içeriğini (ayarlar, hizmetler, galeri, sayfa metinleri,
    SEO, kullanıcılar ve talepler) tek bir <code>.json</code> dosyası olarak indirir.
    Ayda bir indirip güvenli bir yerde saklayın.</p>
  <p class="ipucu"><b>Görseller dahil değildir</b> — <code>assets/img/</code> klasörünü
    hosting dosya yöneticisi veya FTP ile ayrıca yedekleyin. Dosya şifre
    özetleri içerir; paylaşmayın.</p>
  <form method="post" style="margin-top:12px">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="indir">
    <button class="btn btn--ana" type="submit">Yedeği indir (.json)</button>
  </form>
</div>

<div class="kart">
  <h2>Yedekten geri yükle</h2>
  <p class="ipucu">Daha önce indirdiğiniz <code>.json</code> yedeğini yükleyin. Mevcut
    içeriğin üzerine yazılır; ama <b>önceki hâl otomatik olarak "Sürüm Geçmişi"ne
    eklenir</b>, oradan geri alabilirsiniz. Talepler ID'ye göre birleştirilir
    (mevcut talepler silinmez).</p>
  <form method="post" enctype="multipart/form-data" style="margin-top:12px"
        data-onay="Yedekteki içerik mevcut içeriğin üzerine yazılsın mı?">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="geri-yukle">
    <div class="alan">
      <label>Yedek dosyası (.json)</label>
      <input type="file" name="yedek" accept=".json,application/json" required>
    </div>
    <div class="alan" style="display:flex;align-items:center;gap:8px">
      <input type="checkbox" name="kullanicilar" value="1" id="ku" style="width:auto">
      <label for="ku" style="margin:0">Kullanıcı hesaplarını da geri yükle
        <span class="ipucu">(şu anki şifreler yedektekiyle değişir)</span></label>
    </div>
    <button class="btn btn--kirmizi" type="submit">Yedeği geri yükle</button>
  </form>
</div>

<?php include __DIR__ . '/inc/alt.php'; ?>
