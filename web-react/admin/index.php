<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();

// Talep sayıları (önbellekli — her yüklemede yüzlerce dosya açılmaz)
$sayac       = talep_sayaci();
$talepToplam = $sayac['toplam'];
$okunmamis   = $sayac['okunmamis'];
$sonTarih    = $sayac['sonTarih'] ?: null;

$hizmetSayi = count(hizmet_oku());
$galeri = galeri_oku();
$galeriSayi = count($galeri['galeri'] ?? []);

// Hızlı ayarlar formu — yalnızca Yönetici, yalnızca "Genel" bölümünü günceller
if ($_SERVER['REQUEST_METHOD'] === 'POST' && girdi('eylem') === 'hizli_ayar') {
    yonetici_gerekli();
    csrf_dogrula();
    $ayar = ayar_oku();
    $ayar['genel'] = [
        'bildirim_epostasi' => girdi('bildirim_epostasi'),
    ];
    if (ayar_yaz($ayar)) {
        gunluk_yaz('ayarlar-kaydet', 'genel ayarlar (panel ana sayfa)');
        flash_koy('basari', 'Genel ayarlar güncellendi.');
    } else {
        flash_koy('hata', 'Kaydedilemedi — panelin veri klasörünün yazma izni yok gibi görünüyor.');
    }
    git('index.php');
}

$g = ayar_oku()['genel'] ?? [];

$saat = (int)date('G');
$selam = $saat < 6 ? 'İyi geceler' : ($saat < 12 ? 'Günaydın' : ($saat < 18 ? 'İyi günler' : 'İyi akşamlar'));

$baslik = 'Panel'; $aktif = 'index';
include __DIR__ . '/inc/ust.php';
?>

<?php if (veri_disari_acik_mi() === true): ?>
<div class="uyari uyari--hata" style="margin-bottom:16px">
  <b>Güvenlik uyarısı:</b> <code>admin/veri/</code> klasörü tarayıcıdan doğrudan
  erişilebiliyor. Kullanıcı hesapları, işlem günlüğü ve tüm form talepleri (kişisel veri)
  açıkta demektir. Sunucunuz Apache değilse <code>.htaccess</code> koruması çalışmaz —
  hosting sağlayıcınızdan bu klasöre dış erişimi kapatmasını isteyin ya da
  <code>veri/</code> klasörünü web kök dizininin dışına taşıyın.
</div>
<?php endif; ?>

<div class="pano-ust">
  <div>
    <span class="pano-ust__selam"><?= e($selam) ?></span>
    <h2><?= e($_SESSION['ad']) ?></h2>
    <p>Buradan sitenin içeriğini güncelleyebilirsiniz. Yaptığınız değişiklikler <b>kaydettiğiniz anda</b> yayına girer.</p>
  </div>
  <a class="btn btn--sade" href="../index.html" target="_blank" rel="noopener">Siteyi gör ↗</a>
</div>

<div class="kartlar">
  <a class="ozet-kart<?= $okunmamis ? ' ozet-kart--vurgu' : '' ?>" href="talepler.php">
    <span class="ozet-kart__ikon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v11H8l-4 4V5Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <b><?= $okunmamis ?></b>
    <span>okunmamış talep</span>
  </a>
  <a class="ozet-kart" href="talepler.php">
    <span class="ozet-kart__ikon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h5" stroke-linecap="round"/></svg>
    </span>
    <b><?= $talepToplam ?></b>
    <span>toplam talep<?= $sonTarih ? ' · son: ' . e(tarih_tr($sonTarih)) : '' ?></span>
  </a>
  <a class="ozet-kart" href="hizmetler.php">
    <span class="ozet-kart__ikon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M12 12v9M4.5 7.5 12 12l7.5-4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <b><?= $hizmetSayi ?></b>
    <span>hizmet</span>
  </a>
  <a class="ozet-kart" href="galeri.php">
    <span class="ozet-kart__ikon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m5 17 4.5-4.5L13 16l3-3 3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <b><?= $galeriSayi ?></b>
    <span>galeri görseli</span>
  </a>
</div>

<div class="grid-2">
  <div class="kart">
    <h2>Hızlı ayarlar</h2>
    <p class="ipucu">Sitenin genel ayarları. İletişim, sosyal medya ve SEO metinleri için
      <a href="ayarlar.php">İletişim &amp; Ayarlar</a> sayfasına gidin.</p>
    <form method="post">
      <?= csrf_alan() ?>
      <input type="hidden" name="eylem" value="hizli_ayar">
      <div class="alan">
      </div>
      <div class="alan" style="margin-bottom:14px">
        <label>Form bildirimi e-postası</label>
        <input type="email" name="bildirim_epostasi" value="<?= e($g['bildirim_epostasi'] ?? '') ?>" placeholder="ör. info@akdogan.com">
      </div>
      <button class="btn btn--ana" type="submit">Kaydet</button>
    </form>
  </div>
</div>

<div class="kart">
  <h2>Hızlı erişim</h2>
  <div class="hizli-erisim">
    <a href="talepler.php">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v11H8l-4 4V5Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>Talepler</span>
    </a>
    <a href="hizmetler.php">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/></svg>
      <span>Hizmetler</span>
    </a>
    <a href="galeri.php">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m5 17 4.5-4.5L13 16l3-3 3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>Galeri</span>
    </a>
    <a href="sayfalar.php">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h8l4 4v14H7V3Z" stroke-linejoin="round"/><path d="M9 12h6M9 16h6" stroke-linecap="round"/></svg>
      <span>Sayfa Metinleri</span>
    </a>
    <a href="galeri.php">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><circle cx="8.5" cy="8.5" r="1.4"/><path d="m4 17 5-5 4 4 3-3 4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>Görsel Yönetimi</span>
    </a>
    <a href="ayarlar.php">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V19.5a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H4.5a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.56-1.04 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10.5a1.7 1.7 0 0 0 1.04-1.56V4.5a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10.5a1.7 1.7 0 0 0 1.56 1.04H19.5a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.04Z" stroke-linejoin="round"/></svg>
      <span>İletişim &amp; Ayarlar</span>
    </a>
  </div>
</div>

<?php include __DIR__ . '/inc/alt.php'; ?>
