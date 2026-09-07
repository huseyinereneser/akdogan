<?php
require __DIR__ . '/inc/on.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    if (!empty($_SESSION['uid'])) gunluk_yaz('cikis');
    cikis_yap();
    session_start();
    flash_koy('basari', 'Çıkış yapıldı.');
    git('login.php');
}

// GET ile gelindiyse: küçük onay ekranı (çıkış artık CSRF korumalı POST ile yapılır)
$belirtec = csrf_belirtec();
?><!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<script src="assets/tema.js"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Çıkış · Akdoğan Turizm Yönetim</title>
<link rel="stylesheet" href="assets/admin.css">
</head>
<body>
<div class="giris-sar">
  <form class="giris-kutu" method="post">
    <img src="../assets/img/logo.png" alt="Akdoğan Turizm" width="170">
    <h1>Çıkış yapılsın mı?</h1>
    <input type="hidden" name="csrf" value="<?= e($belirtec) ?>">
    <button class="btn btn--ana" type="submit" style="width:100%;justify-content:center">Evet, çıkış yap</button>
    <p class="ipucu" style="text-align:center;margin-top:16px"><a href="index.php">← Panele dön</a></p>
  </form>
</div>
</body>
</html>
