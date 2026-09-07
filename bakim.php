<?php
/**
 * bakim.php — bakım modu sayfası.
 * Yönetim panelindeki "Bakım Modu" ekranından açılır/kapanır. Kök .htaccess,
 * panel-9f3a7e21/veri/bakim.aktif dosyası varken tüm istekleri buraya yönlendirir.
 */
$d = [];
$ham = @file_get_contents(__DIR__ . '/panel-9f3a7e21/veri/bakim.json');
if ($ham !== false) {
    $c = json_decode($ham, true);
    if (is_array($c)) $d = $c;
}
$aktif = is_file(__DIR__ . '/panel-9f3a7e21/veri/bakim.aktif');

http_response_code($aktif ? 503 : 200);
if ($aktif) header('Retry-After: 3600');
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');

$tr = trim((string) ($d['mesaj_tr'] ?? '')) ?: 'Sitemiz kısa süreli bakımda. Lütfen birazdan tekrar deneyin.';
$en = trim((string) ($d['mesaj_en'] ?? '')) ?: 'Our website is briefly down for maintenance. Please check back soon.';
$esc = fn($s) => htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?><!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Bakım · Akdoğan Turizm</title>
<style>
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    padding: 24px;
    font: 16px/1.6 "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    background: #f4f6f9; color: #1c2430;
  }
  .kutu {
    max-width: 460px; width: 100%; text-align: center;
    background: #fff; border: 1px solid #e2e6ec; border-radius: 16px;
    padding: 40px 32px; box-shadow: 0 20px 50px rgba(13,36,64,.10);
  }
  img { width: 170px; height: auto; margin-bottom: 22px; }
  h1 { font-size: 1.35rem; margin: 0 0 12px; color: #0d2440; }
  p { margin: 8px 0; }
  .en { color: #667085; font-size: .95rem; }
  .cizgi { width: 46px; height: 3px; background: #e31e25; border-radius: 2px; margin: 20px auto; }
  @media (prefers-color-scheme: dark) {
    body { background: #0f151d; color: #e6e9ef; }
    .kutu { background: #171e28; border-color: #2b3542; box-shadow: 0 20px 50px rgba(0,0,0,.4); }
    h1 { color: #9cc0f0; }
    .en { color: #94a0b1; }
  }
</style>
</head>
<body>
  <main class="kutu">
    <img src="assets/img/logo.png" alt="Akdoğan Turizm">
    <h1>Kısa bir ara</h1>
    <p><?= $esc($tr) ?></p>
    <div class="cizgi"></div>
    <p class="en"><?= $esc($en) ?></p>
  </main>
</body>
</html>
