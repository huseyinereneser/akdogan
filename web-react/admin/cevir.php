<?php
require __DIR__ . '/inc/on.php';
oturum_gerekli();
require __DIR__ . '/inc/ceviri.php';

header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'hata' => 'Yalnızca POST isteği kullanılabilir.'], JSON_UNESCAPED_UNICODE);
    exit;
}
csrf_dogrula();
$metinler = $_POST['metinler'] ?? [];
$hedef = girdi('hedef') ?: 'en';
if (!is_array($metinler) || !in_array($hedef, ['en', 'ru', 'ar', 'de'], true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'hata' => 'Geçersiz çeviri isteği.'], JSON_UNESCAPED_UNICODE);
    exit;
}
$sonuclar = [];
foreach ($metinler as $metin) {
    $metin = trim((string)$metin);
    if ($metin === '') { $sonuclar[] = ''; continue; }
    $sonuc = libretranslate($metin, 'tr', $hedef);
    if (!$sonuc['ok']) {
        http_response_code(502);
        echo json_encode(['ok' => false, 'hata' => $sonuc['hata']], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $sonuclar[] = $sonuc['metin'];
}
gunluk_yaz('ceviri-otomatik', $hedef . ' (' . count($sonuclar) . ' alan)');
echo json_encode(['ok' => true, 'ceviriler' => $sonuclar], JSON_UNESCAPED_UNICODE);
