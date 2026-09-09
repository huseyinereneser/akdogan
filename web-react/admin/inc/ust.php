<?php
/**
 * ust.php — panelin ortak üst kısmı (head + kenar menü).
 * Kullanım: sayfada önce  $kullanici = oturum_gerekli();  sonra:
 *   $baslik = 'Talepler'; $aktif = 'talepler'; include 'inc/ust.php';
 */
if (!defined('PANEL_KOK')) { http_response_code(403); exit; }

$aktif   = $aktif   ?? '';
$baslik  = $baslik  ?? 'Yönetim';

/* Kenar menü — bölümlere ayrılmış. Her satır: [dosya, etiket, erişim, ikon-anahtarı].
   Bir bölüm, içinde görünen en az bir bağlantı varsa gösterilir. */
$menu = [
    'Yönetim' => [
        ['index.php',      'Panel',              'pano'],
        ['sayfalar.php',   'İçerik Yönetimi',    'belge'],
        ['hizmetler.php',  'Hizmetler',          'kutu'],
        ['galeri.php',     'Görsel Yönetimi',    'resim'],
        ['talepler.php',   'İletişim Talepleri', 'gelen'],
        ['ayarlar.php',    'Genel Ayarlar',      'ayar'],
    ],
];

/** Kenar menü ikonu — 24×24 çizgi ikon (currentColor). */
function yan_ikon(string $ad): string {
    $i = [
        'pano'    => '<rect x="3" y="3" width="7" height="9" rx="1.3"/><rect x="14" y="3" width="7" height="5" rx="1.3"/><rect x="14" y="12" width="7" height="9" rx="1.3"/><rect x="3" y="16" width="7" height="5" rx="1.3"/>',
        'gelen'   => '<path d="M4 5h16v11H8l-4 4V5Z" stroke-linecap="round" stroke-linejoin="round"/>',
        'kutu'    => '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M12 12v9M4.5 7.5 12 12l7.5-4.5" stroke-linecap="round" stroke-linejoin="round"/>',
        'resim'   => '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m5 17 4.5-4.5L13 16l3-3 3 3" stroke-linecap="round" stroke-linejoin="round"/>',
        'belge'   => '<path d="M7 3h8l4 4v14H7V3Z" stroke-linejoin="round"/><path d="M9 12h6M9 16h6" stroke-linecap="round"/>',
        'foto'    => '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><circle cx="8.5" cy="8.5" r="1.4"/><path d="m4 17 5-5 4 4 3-3 4 4" stroke-linecap="round" stroke-linejoin="round"/>',
        'ayar'    => '<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V19.5a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H4.5a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.04 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10.5a1.7 1.7 0 0 0 1.04-1.56V4.5a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10.5a1.7 1.7 0 0 0 1.56 1.04H19.5a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.04Z" stroke-linejoin="round"/>',
        'arama'   => '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6" stroke-linecap="round"/>',
        'dil'     => '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.7 3 2.7 15 0 18M12 3c-2.7 3-2.7 15 0 18" stroke-linecap="round"/>',
        'saat'    => '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.4 2" stroke-linecap="round" stroke-linejoin="round"/>',
        'kisiler' => '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.6 2.9-6 5.5-6s5.5 2.4 5.5 6" stroke-linecap="round"/><path d="M16 8.2a3 3 0 1 1 3.6 4.6M17.5 14c2.3.3 3.9 2.2 3.9 6" stroke-linecap="round"/>',
        'anahtar' => '<path d="M14.7 6.3a3.5 3.5 0 0 0 4.6 4.6l-1.4 1.4-9 9A2 2 0 0 1 5 18.5l9-9 1.4-1.4Z" stroke-linejoin="round"/><path d="m14 10-1.5-1.5" stroke-linecap="round"/>',
        'indir'   => '<path d="M12 3v12m0 0 4-4m-4 4-4-4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke-linecap="round"/>',
        'liste'   => '<path d="M9 6h11M9 12h11M9 18h11" stroke-linecap="round"/><circle cx="4.5" cy="6" r="1.3"/><circle cx="4.5" cy="12" r="1.3"/><circle cx="4.5" cy="18" r="1.3"/>',
        'kisi'    => '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke-linecap="round"/>',
    ];
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">' . ($i[$ad] ?? '') . '</svg>';
}

/* Avatar için baş harfler */
$_ad = trim((string)($_SESSION['ad'] ?? ''));
$_bas = '';
foreach (preg_split('/\s+/u', $_ad) as $_p) {
    if ($_p === '') continue;
    $_bas .= mb_substr($_p, 0, 1, 'UTF-8');
    if (mb_strlen($_bas, 'UTF-8') >= 2) break;
}
$_bas = mb_strtoupper($_bas !== '' ? $_bas : 'A', 'UTF-8');
?><!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= e($baslik) ?> · Akdoğan Turizm Yönetim</title>
<link rel="icon" href="../assets/img/favicon.png" type="image/png">
<link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<a class="atla" href="#icerik">İçeriğe geç</a>

<button class="menu-ac" type="button" id="menuAc" aria-label="Menü">☰</button>

<aside class="yan">
  <div class="yan__logo">
    <div class="yan__logo-satir">
      <img src="../assets/img/logo-light.png" alt="Akdoğan Turizm" width="150">
      <span>Yönetim Paneli</span>
    </div>
  </div>
  <nav class="yan__menu">
    <?php foreach ($menu as $bolum => $satirlar): ?>
      <div class="yan__bolum"><?= e($bolum) ?></div>
      <?php foreach ($satirlar as [$dosya, $etiket, $ikon]): ?>
        <a href="<?= e($dosya) ?>"<?= $aktif === basename($dosya, '.php') ? ' class="aktif" aria-current="page"' : '' ?>>
          <?= yan_ikon($ikon) ?><span><?= e($etiket) ?></span>
        </a>
      <?php endforeach; ?>
    <?php endforeach; ?>
  </nav>
  <div class="yan__alt">
    <span class="yan__avatar" aria-hidden="true"><?= e($_bas) ?></span>
    <span>
      <b><?= e($_SESSION['ad'] ?? '') ?></b>
      <span>Yönetici</span>
    </span>
  </div>
</aside>

<div class="tepe">
  <a class="gizle-kucuk" href="../index.html" target="_blank" rel="noopener">Siteyi gör ↗</a>
  <form method="post" action="cikis.php">
    <?= csrf_alan() ?>
    <button type="submit" class="cikis">Çıkış yap</button>
  </form>
</div>

<main class="icerik" id="icerik">
  <header class="sayfa-baslik">
    <h1><?= e($baslik) ?></h1>
  </header>

  <?php foreach (flash_al() as $f): ?>
    <div class="uyari uyari--<?= e($f['tur']) ?>"><?= e($f['mesaj']) ?></div>
  <?php endforeach; ?>
