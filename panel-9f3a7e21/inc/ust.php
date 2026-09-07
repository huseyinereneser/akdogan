<?php
/**
 * ust.php — panelin ortak üst kısmı (head + kenar menü).
 * Kullanım: sayfada önce  $kullanici = oturum_gerekli();  sonra:
 *   $baslik = 'Talepler'; $aktif = 'talepler'; include 'inc/ust.php';
 */
if (!defined('PANEL_KOK')) { http_response_code(403); exit; }

$aktif   = $aktif   ?? '';
$baslik  = $baslik  ?? 'Yönetim';
$menu = [
    ['index.php',       'Panel',             'genel'],
    ['talepler.php',    'Talepler',          'genel'],
    ['ayarlar.php',     'İletişim & Ayarlar','yonetici'],
    ['hizmetler.php',   'Hizmetler',         'genel'],
    ['galeri.php',      'Galeri',            'genel'],
    ['sayfalar.php',    'Sayfa Metinleri',   'genel'],
    ['medya.php',       'Medya',             'genel'],
    ['seo.php',         'SEO & Sitemap',     'yonetici'],
    ['ceviri.php',      'Çeviriler',         'yonetici'],
    ['surumler.php',    'Sürüm Geçmişi',     'genel'],
    ['kullanicilar.php','Kullanıcılar',      'yonetici'],
    ['bakim.php',       'Bakım Modu',        'yonetici'],
    ['yedek.php',       'Yedek',             'yonetici'],
    ['gunluk.php',      'İşlem Günlüğü',     'yonetici'],
    ['hesap.php',       'Hesabım',           'genel'],
];
?><!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<script src="assets/tema.js"></script>
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
    <img src="../assets/img/logo.png" alt="Akdoğan Turizm" width="150">
    <span>Yönetim Paneli</span>
  </div>
  <nav class="yan__menu">
    <?php foreach ($menu as [$dosya, $etiket, $erisim]): ?>
      <?php if ($erisim === 'yonetici' && !yonetici_mi()) continue; ?>
      <a href="<?= e($dosya) ?>"<?= $aktif === basename($dosya, '.php') ? ' class="aktif"' : '' ?>><?= e($etiket) ?></a>
    <?php endforeach; ?>
  </nav>
  <div class="yan__alt">
    <span><?= e($_SESSION['ad'] ?? '') ?> · <?= yonetici_mi() ? 'Yönetici' : 'Editör' ?></span>
  </div>
</aside>

<div class="tepe">
  <button type="button" class="tema-btn" id="temaBtn" aria-pressed="false">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <span data-tema-etiket>Koyu mod</span>
  </button>
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
