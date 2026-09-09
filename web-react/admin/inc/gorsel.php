<?php
/**
 * gorsel.php — görsel yükleme, doğrulama ve GD ile yeniden boyutlandırma
 * Yüklenen dosya rastgele adla assets/img/ altına kaydedilir ve GD ile
 * yeniden kodlanır (içine gömülü zararlı içerik varsa temizlenir).
 */

const GORSEL_TURLERI = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
];

/**
 * $_FILES[...] tek bir öğeyi işler.
 * $seffafKoru true ise sonuç PNG olarak (şeffaflık korunarak) kaydedilir;
 * varsayılan davranış her şeyi beyaz zeminli JPG'ye indirger.
 * Dönüş: ['ok'=>true,'yol'=>'assets/img/xx.jpg'] veya ['ok'=>false,'hata'=>'...']
 */
function gorsel_yukle(array $dosya, string $adOneki = 'gorsel', bool $seffafKoru = false): array {
    if (($dosya['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return ['ok' => false, 'hata' => 'Dosya yüklenemedi (kod: ' . ($dosya['error'] ?? '?') . ').'];
    }
    if ($dosya['size'] > DOSYA_AZAMI_MB * 1024 * 1024) {
        return ['ok' => false, 'hata' => 'Dosya ' . DOSYA_AZAMI_MB . ' MB sınırını aşıyor.'];
    }
    if (!is_uploaded_file($dosya['tmp_name'])) {
        return ['ok' => false, 'hata' => 'Geçersiz yükleme.'];
    }

    $mime = function_exists('mime_content_type')
        ? (mime_content_type($dosya['tmp_name']) ?: '')
        : ($dosya['type'] ?? '');
    if (!isset(GORSEL_TURLERI[$mime])) {
        return ['ok' => false, 'hata' => 'Yalnızca JPG, PNG veya WebP yükleyebilirsiniz.'];
    }
    if (!function_exists('imagecreatetruecolor')) {
        // GD yoksa: doğrula ve olduğu gibi taşı
        $uzanti = GORSEL_TURLERI[$mime];
        $ad = $adOneki . '-' . kimlik(5) . '.' . $uzanti;
        if (!@move_uploaded_file($dosya['tmp_name'], YUKLEME_DIZIN . '/' . $ad)) {
            return ['ok' => false, 'hata' => 'Dosya kaydedilemedi (yazma izni?).'];
        }
        return ['ok' => true, 'yol' => 'assets/img/' . $ad];
    }

    $img = @imagecreatefromstring(file_get_contents($dosya['tmp_name']));
    if (!$img) return ['ok' => false, 'hata' => 'Görsel çözümlenemedi.'];

    $g = imagesx($img);
    $y = imagesy($img);
    $hedefG = min($g, GORSEL_GENISLIK);
    $hedefY = (int)round($y * $hedefG / $g);

    $yeni = imagecreatetruecolor($hedefG, $hedefY);
    // PNG/WebP şeffaflığını koru
    imagealphablending($yeni, false);
    imagesavealpha($yeni, true);
    imagecopyresampled($yeni, $img, 0, 0, 0, 0, $hedefG, $hedefY, $g, $y);

    if ($seffafKoru) {
        $ad = $adOneki . '-' . kimlik(5) . '.png';
        $tamYol = YUKLEME_DIZIN . '/' . $ad;
        $ok = imagepng($yeni, $tamYol, 6);
        imagedestroy($img); imagedestroy($yeni);
        if (!$ok) return ['ok' => false, 'hata' => 'Görsel kaydedilemedi (assets/img yazılabilir mi?).'];
        @chmod($tamYol, 0664);
        return ['ok' => true, 'yol' => 'assets/img/' . $ad];
    }

    $ad = $adOneki . '-' . kimlik(5) . '.jpg';
    $tamYol = YUKLEME_DIZIN . '/' . $ad;

    // Her şeyi JPG'ye sıkıştır (şeffaf zeminler beyaz olur)
    $zemin = imagecreatetruecolor($hedefG, $hedefY);
    $beyaz = imagecolorallocate($zemin, 255, 255, 255);
    imagefill($zemin, 0, 0, $beyaz);
    imagecopy($zemin, $yeni, 0, 0, 0, 0, $hedefG, $hedefY);

    $ok = imagejpeg($zemin, $tamYol, 82);
    imagedestroy($img); imagedestroy($yeni); imagedestroy($zemin);

    if (!$ok) return ['ok' => false, 'hata' => 'Görsel kaydedilemedi (assets/img yazılabilir mi?).'];
    @chmod($tamYol, 0664);
    return ['ok' => true, 'yol' => 'assets/img/' . $ad];
}

/** assets/img içindeki dosyalar ve nerede kullanıldıkları */
function medya_listesi(): array {
    $tumu = [];
    foreach (glob(YUKLEME_DIZIN . '/*.{jpg,jpeg,png,webp,svg}', GLOB_BRACE) ?: [] as $y) {
        $tumu[basename($y)] = ['boyut' => filesize($y), 'kullanim' => []];
    }

    // Görselin adı geçebilecek her yeri tara: içerik JSON'ları, üretilmiş
    // site.json, sayfa HTML'leri, ortak partial'lar, CSS ve JS.
    $desenler = [
        VERI_DIZIN . '/*.json',
        SITE_KOK . '/assets/data/*.json',
        SITE_KOK . '/*.html',
        SITE_KOK . '/_partials/*.html',
        SITE_KOK . '/assets/css/*.css',
        SITE_KOK . '/assets/js/*.js',
    ];
    $metin = '';
    foreach ($desenler as $desen) {
        foreach (glob($desen) ?: [] as $dosya) {
            $metin .= @file_get_contents($dosya) ?: '';
            $metin .= "\n";
        }
    }

    foreach ($tumu as $ad => &$bilgi) {
        // Tam dosya adı eşleşmesi ara — kısa bir adın uzun bir adın parçası
        // olarak yanlışlıkla "kullanımda" görünmesini engelle.
        $desen = '/(^|[^A-Za-z0-9._-])' . preg_quote($ad, '/') . '([^A-Za-z0-9]|$)/';
        if (preg_match($desen, $metin)) $bilgi['kullanim'][] = 'içerik';
    }
    unset($bilgi);
    return $tumu;
}
