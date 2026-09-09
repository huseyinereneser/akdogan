<?php
require __DIR__ . '/inc/on.php';
require __DIR__ . '/inc/gorsel.php';
$kullanici = oturum_gerekli();
yonetici_gerekli();

$ayar = ayar_oku();
$menuVarsayilan = [
    'anasayfa' => ['tr' => 'Ana Sayfa', 'en' => 'Home', 'href' => 'index.html'],
    'kurumsal' => ['tr' => 'Kurumsal', 'en' => 'Corporate', 'href' => 'kurumsal.html'],
    'hizmetler' => ['tr' => 'Hizmetler', 'en' => 'Services', 'href' => 'hizmetler.html'],
    'projeler' => ['tr' => 'Projeler', 'en' => 'Projects', 'href' => 'projeler.html'],
    'referanslar' => ['tr' => 'Referanslar', 'en' => 'References', 'href' => 'referanslar.html'],
    'medya' => ['tr' => 'Medya', 'en' => 'Media', 'href' => 'medya.html'],
    'iletisim' => ['tr' => 'İletişim', 'en' => 'Contact', 'href' => 'iletisim.html'],
];
$bolumVarsayilan = [
    'anasayfa.hero' => 'Hero / giriş',
    'anasayfa.hakkimizda' => 'Hakkımızda özeti',
    'anasayfa.hizmetler' => 'Hizmetler',
    'anasayfa.neden' => 'Neden Akdoğan',
    'anasayfa.istatistik' => 'İstatistikler',
    'anasayfa.surec' => 'Nasıl çalışıyoruz',
    'anasayfa.cta' => 'Teklif çağrısı',
];
$sayfaBolumSayilari = [
    '404' => 1, 'belgeler' => 3, 'galeri' => 3, 'haberler' => 3,
    'hakkimizda' => 7, 'hesap-numaralarimiz' => 3, 'hizmetler' => 8,
    'iletisim' => 4, 'insan-kaynaklari' => 4, 'kadromuz' => 4,
    'kvkk' => 2, 'projeler' => 6, 'referanslar' => 4,
    'tesekkurler' => 1, 'videolar' => 3, 'yorumlar' => 3,
];
$gorunumVarsayilan = ['accent' => '#e31e25', 'accent_dark' => '#b8171d', 'radius' => 4];
$siteGorseller = [
    'hero' => ['etiket' => 'Ana sayfa hero görseli', 'dosya' => 'hero-temsili.jpg'],
    'hakkimizda' => ['etiket' => 'Ana sayfa hakkımızda görseli', 'dosya' => 'fleet-temsili.jpg'],
    'page_belgeler' => ['etiket' => 'Belgeler sayfası görseli', 'dosya' => 'ofis-toplanti-temsili.jpg'],
    'page_galeri' => ['etiket' => 'Galeri sayfası görseli', 'dosya' => 'fleet-temsili.jpg'],
    'page_haberler' => ['etiket' => 'Haberler sayfası görseli', 'dosya' => 'road-2-temsili.jpg'],
    'page_hakkimizda' => ['etiket' => 'Hakkımızda sayfası görseli', 'dosya' => 'fleet-2-temsili.jpg'],
    'page_hesap' => ['etiket' => 'Hesap numaraları sayfası görseli', 'dosya' => 'ofis-toplanti-temsili.jpg'],
    'page_hizmetler' => ['etiket' => 'Hizmetler sayfası görseli', 'dosya' => 'road-2-temsili.jpg'],
    'page_iletisim' => ['etiket' => 'İletişim sayfası görseli', 'dosya' => 'road-2-temsili.jpg'],
    'page_insan_kaynaklari' => ['etiket' => 'İnsan kaynakları sayfası görseli', 'dosya' => 'surucu-arac-temsili.jpg'],
    'page_kadromuz' => ['etiket' => 'Kadromuz sayfası görseli', 'dosya' => 'ofis-toplanti-temsili.jpg'],
    'page_kvkk' => ['etiket' => 'KVKK sayfası görseli', 'dosya' => 'ekip-ofis-temsili.jpg'],
    'page_projeler' => ['etiket' => 'Projeler sayfası görseli', 'dosya' => 'fleet-temsili.jpg'],
    'page_referanslar' => ['etiket' => 'Referanslar sayfası görseli', 'dosya' => 'ekip-ofis-temsili.jpg'],
    'page_videolar' => ['etiket' => 'Videolar sayfası görseli', 'dosya' => 'fleet-2-temsili.jpg'],
    'page_yorumlar' => ['etiket' => 'Yorumlar sayfası görseli', 'dosya' => 'ekip-ofis-temsili.jpg'],
];
foreach ($sayfaBolumSayilari as $sayfa => $adet) {
    for ($i = 1; $i <= $adet; $i++) $bolumVarsayilan["sayfa.$sayfa.$i"] = ucfirst(str_replace('-', ' ', $sayfa)) . " · Bölüm $i";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $atilan = [];   // geçersiz olduğu için yok sayılan alanlar

    if (!empty($_FILES['favicon']['name'])) {
        $yukleme = gorsel_yukle($_FILES['favicon'], 'favicon', true);
        if ($yukleme['ok']) {
            $kaynak = SITE_KOK . '/' . $yukleme['yol'];
            $hedef = SITE_KOK . '/assets/img/favicon.png';
            if (@copy($kaynak, $hedef)) {
                @unlink($kaynak);
                gunluk_yaz('favicon-degistir');
            } else {
                @unlink($kaynak);
                $atilan[] = 'Favicon (dosya kaydedilemedi)';
            }
        } else {
            $atilan[] = 'Favicon (' . $yukleme['hata'] . ')';
        }
    }
    if (!empty($_FILES['logo']['name'])) {
        $yukleme = gorsel_yukle($_FILES['logo'], 'logo', true);
        if ($yukleme['ok']) {
            $kaynak = SITE_KOK . '/' . $yukleme['yol'];
            $hedef = SITE_KOK . '/assets/img/logo.png';
            if (@copy($kaynak, $hedef)) {
                @unlink($kaynak);
                gunluk_yaz('logo-degistir');
            } else {
                @unlink($kaynak);
                $atilan[] = 'Logo (dosya kaydedilemedi)';
            }
        } else {
            $atilan[] = 'Logo (' . $yukleme['hata'] . ')';
        }
    }
    if (girdi('favicon_sil') === '1' && empty($_FILES['favicon']['name'])) {
        @unlink(SITE_KOK . '/assets/img/favicon.png');
        gunluk_yaz('favicon-degistir', 'kaldırıldı');
    }
    $ayar['gorseller'] = $ayar['gorseller'] ?? [];
    foreach ($siteGorseller as $anahtar => $bilgi) {
        if (empty($_FILES['gorsel_' . $anahtar]['name'])) continue;
        $yukleme = gorsel_yukle($_FILES['gorsel_' . $anahtar], 'site-' . $anahtar);
        if (!$yukleme['ok']) {
            $atilan[] = $bilgi['etiket'] . ' (' . $yukleme['hata'] . ')';
            continue;
        }
        $kaynak = SITE_KOK . '/' . $yukleme['yol'];
        $hedef = SITE_KOK . '/assets/img/' . $bilgi['dosya'];
        if (@copy($kaynak, $hedef)) {
            @unlink($kaynak);
            $ayar['gorseller'][$anahtar] = 'assets/img/' . $bilgi['dosya'];
            gunluk_yaz('medya-yukle', $anahtar);
        } else {
            @unlink($kaynak);
            $atilan[] = $bilgi['etiket'] . ' (dosya kaydedilemedi)';
        }
    }

    $epostaHam = girdi('eposta');
    if ($epostaHam !== '' && !filter_var($epostaHam, FILTER_VALIDATE_EMAIL)) {
        $atilan[] = 'İletişim e-postası';
        $epostaHam = $i['eposta'] ?? '';
    }
    $ayar['iletisim'] = [
        'telefon'    => girdi('telefon'),
        'gsm'        => girdi('gsm'),
        'whatsapp'   => girdi('whatsapp'),
        'eposta'     => $epostaHam,
        'adres'      => girdi('adres'),
        'saatler_tr' => girdi('saatler_tr'),
        'saatler_en' => girdi('saatler_en'),
    ];

    $eski = $ayar['sosyal'] ?? [];
    $ayar['sosyal'] = [];
    foreach (['facebook', 'instagram', 'x', 'youtube', 'linkedin'] as $ag) {
        $ham   = girdi($ag);
        $temiz = guvenli_url($ham);
        if ($ham !== '' && $temiz === '') { $atilan[] = ucfirst($ag); $temiz = $eski[$ag] ?? ''; }
        $ayar['sosyal'][$ag] = $temiz;
    }

    $ayar['seo'] = [
        'baslik_tr'   => girdi('seo_baslik_tr'),
        'baslik_en'   => girdi('seo_baslik_en'),
        'aciklama_tr' => girdi('seo_aciklama_tr'),
        'aciklama_en' => girdi('seo_aciklama_en'),
    ];

    $bildirim = girdi('bildirim_epostasi');
    if ($bildirim !== '' && !filter_var($bildirim, FILTER_VALIDATE_EMAIL)) {
        $atilan[] = 'Form bildirimi e-postası';
        $bildirim = $ayar['genel']['bildirim_epostasi'] ?? '';
    }
    $ayar['genel'] = [
        'bildirim_epostasi' => $bildirim,
        'footer_about_tr' => trim((string)($_POST['footer_about_tr'] ?? '')),
        'footer_about_en' => trim((string)($_POST['footer_about_en'] ?? '')),
        'footer_credits_tr' => trim((string)($_POST['footer_credits_tr'] ?? '')),
        'footer_credits_en' => trim((string)($_POST['footer_credits_en'] ?? '')),
    ];
    $ayar['menu'] = [];
    $gelenMenu = $_POST['menu'] ?? [];
    foreach ($menuVarsayilan as $anahtar => $varsayilan) {
        $item = is_array($gelenMenu[$anahtar] ?? null) ? $gelenMenu[$anahtar] : [];
        $href = trim((string)($item['href'] ?? $varsayilan['href']));
        if (!preg_match('/^[a-z0-9][a-z0-9_#\/.-]*$/i', $href)) $href = $varsayilan['href'];
        $ayar['menu'][$anahtar] = [
            'tr' => trim((string)($item['tr'] ?? $varsayilan['tr'])) ?: $varsayilan['tr'],
            'en' => trim((string)($item['en'] ?? $varsayilan['en'])) ?: $varsayilan['en'],
            'href' => $href,
            'aktif' => !empty($item['aktif']),
        ];
    }
    $ayar['bolumler'] = [];
    $gelenBolumler = $_POST['bolumler'] ?? [];
    foreach ($bolumVarsayilan as $anahtar => $etiket) {
        $ayar['bolumler'][$anahtar] = !empty($gelenBolumler[$anahtar]);
    }
    $gorunum = $_POST['gorunum'] ?? [];
    $hex = static function ($deger, $yedek): string {
        $deger = trim((string)$deger);
        return preg_match('/^#[0-9a-f]{6}$/i', $deger) ? strtolower($deger) : $yedek;
    };
    $ayar['gorunum'] = [
        'accent' => $hex($gorunum['accent'] ?? '', $gorunumVarsayilan['accent']),
        'accent_dark' => $hex($gorunum['accent_dark'] ?? '', $gorunumVarsayilan['accent_dark']),
        'radius' => max(0, min(24, (int)($gorunum['radius'] ?? $gorunumVarsayilan['radius']))),
    ];

    if (ayar_yaz($ayar)) {
        gunluk_yaz('ayarlar-kaydet');
        flash_koy('basari', 'Ayarlar kaydedildi ve sitede güncellendi.'
            . ($atilan ? ' Şu alan(lar) geçersiz olduğu için yok sayıldı: ' . implode(', ', $atilan)
                        . ' — bağlantıları https:// ile tam yazın, e-postaları geçerli formatta girin.' : ''));
    } else {
        flash_koy('hata', 'Kaydedilemedi — panelin veri klasörünün yazma izni yok gibi görünüyor.');
    }
    git('ayarlar.php');
}

$i = $ayar['iletisim'] ?? [];
$s = $ayar['sosyal'] ?? [];
$o = $ayar['seo'] ?? [];
$g = $ayar['genel'] ?? [];
$menu = $ayar['menu'] ?? $menuVarsayilan;
$bolumler = $ayar['bolumler'] ?? [];
$gorunum = $ayar['gorunum'] ?? $gorunumVarsayilan;
$b = $ayar['bildirim'] ?? [];

$baslik = 'İletişim & Ayarlar'; $aktif = 'ayarlar';
include __DIR__ . '/inc/ust.php';
?>

<form method="post" enctype="multipart/form-data">
  <?= csrf_alan() ?>

  <div class="kart">
    <h2>İletişim bilgileri</h2>
    <p class="ipucu">Bu alanlar sitenin alt bilgisinde (footer) ve iletişim sayfasında otomatik güncellenir.</p>
    <div class="alan-ikili">
      <div class="alan"><label>Telefon</label><input type="text" name="telefon" value="<?= e($i['telefon'] ?? '') ?>"></div>
      <div class="alan"><label>GSM</label><input type="text" name="gsm" value="<?= e($i['gsm'] ?? '') ?>"></div>
    </div>
    <div class="alan-ikili">
      <div class="alan"><label>WhatsApp numarası</label><input type="text" name="whatsapp" value="<?= e($i['whatsapp'] ?? '') ?>"></div>
      <div class="alan"><label>E-posta</label><input type="email" name="eposta" value="<?= e($i['eposta'] ?? '') ?>"></div>
    </div>
    <div class="alan"><label>Adres</label><input type="text" name="adres" value="<?= e($i['adres'] ?? '') ?>"></div>
    <div class="alan-ikili">
      <div class="alan"><label>Çalışma saatleri (TR)</label><input type="text" name="saatler_tr" value="<?= e($i['saatler_tr'] ?? '') ?>"></div>
      <div class="alan"><label>Çalışma saatleri (EN)</label><input type="text" name="saatler_en" value="<?= e($i['saatler_en'] ?? '') ?>"></div>
    </div>
  </div>

  <div class="kart">
    <h2>Sosyal medya</h2>
    <p class="ipucu">Boş bıraktığınız hesabın ikonu sitede yine görünür ancak tıklandığında bir yere gitmez. Tam adres yazın (https:// ile).</p>
    <div class="alan"><label>Facebook</label><input type="url" name="facebook" value="<?= e($s['facebook'] ?? '') ?>" placeholder="https://facebook.com/..."></div>
    <div class="alan"><label>Instagram</label><input type="url" name="instagram" value="<?= e($s['instagram'] ?? '') ?>" placeholder="https://instagram.com/..."></div>
    <div class="alan"><label>X (Twitter)</label><input type="url" name="x" value="<?= e($s['x'] ?? '') ?>"></div>
    <div class="alan"><label>YouTube</label><input type="url" name="youtube" value="<?= e($s['youtube'] ?? '') ?>"></div>
    <div class="alan"><label>LinkedIn</label><input type="url" name="linkedin" value="<?= e($s['linkedin'] ?? '') ?>"></div>
  </div>

  <div class="kart">
    <h2>Görünüm</h2>
    <p class="ipucu">Sitenin ana vurgu renklerini ve kart köşe yuvarlaklığını yönetin.</p>
    <div class="alan-ikili">
      <div class="alan"><label>Vurgu rengi</label><input type="color" name="gorunum[accent]" value="<?= e($gorunum['accent'] ?? $gorunumVarsayilan['accent']) ?>"></div>
      <div class="alan"><label>Vurgu koyu rengi</label><input type="color" name="gorunum[accent_dark]" value="<?= e($gorunum['accent_dark'] ?? $gorunumVarsayilan['accent_dark']) ?>"></div>
    </div>
    <div class="alan"><label>Köşe yuvarlaklığı (px)</label><input type="number" name="gorunum[radius]" min="0" max="24" value="<?= (int)($gorunum['radius'] ?? $gorunumVarsayilan['radius']) ?>"></div>
  </div>

  <div class="kart">
    <h2>Bölüm görünürlüğü</h2>
    <p class="ipucu">Ana sayfadaki bölümleri kod değiştirmeden gösterebilir veya gizleyebilirsiniz.</p>
    <div class="alan-ikili">
      <?php foreach ($bolumVarsayilan as $anahtar => $etiket): ?>
        <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <input type="checkbox" name="bolumler[<?= e($anahtar) ?>]" value="1" <?= ($bolumler[$anahtar] ?? true) ? 'checked' : '' ?>>
          <?= e($etiket) ?>
        </label>
      <?php endforeach; ?>
    </div>
  </div>

  <div class="kart">
    <h2>Menü</h2>
    <p class="ipucu">Üst menüdeki adları, bağlantıları ve görünürlüğü buradan yönetin.</p>
    <?php foreach ($menuVarsayilan as $anahtar => $varsayilan): $m = $menu[$anahtar] ?? $varsayilan; ?>
      <div class="alan-ikili">
        <div class="alan"><label><?= e($varsayilan['tr']) ?> (TR)</label><input type="text" name="menu[<?= e($anahtar) ?>][tr]" value="<?= e($m['tr'] ?? $varsayilan['tr']) ?>"></div>
        <div class="alan"><label>English</label><input type="text" name="menu[<?= e($anahtar) ?>][en]" value="<?= e($m['en'] ?? $varsayilan['en']) ?>"></div>
      </div>
      <div class="alan-ikili">
        <div class="alan"><label>Bağlantı</label><input type="text" name="menu[<?= e($anahtar) ?>][href]" value="<?= e($m['href'] ?? $varsayilan['href']) ?>"></div>
        <label style="display:flex;align-items:center;gap:7px;margin-bottom:16px"><input type="checkbox" name="menu[<?= e($anahtar) ?>][aktif]" value="1" <?= ($m['aktif'] ?? true) ? 'checked' : '' ?>> Menüde göster</label>
      </div>
    <?php endforeach; ?>
  </div>

  <div class="kart">
    <h2>SEO — arama motoru metinleri</h2>
    <p class="ipucu">Ana sayfanın Google'da görünen başlığı ve açıklaması. Başlık ~60, açıklama ~155 karakteri geçmesin.</p>
    <div class="alan"><label>Site başlığı (TR)</label><input type="text" name="seo_baslik_tr" value="<?= e($o['baslik_tr'] ?? '') ?>"></div>
    <div class="alan"><label>Site başlığı (EN)</label><input type="text" name="seo_baslik_en" value="<?= e($o['baslik_en'] ?? '') ?>"></div>
    <div class="alan"><label>Açıklama (TR)</label><textarea name="seo_aciklama_tr"><?= e($o['aciklama_tr'] ?? '') ?></textarea></div>
    <div class="alan"><label>Açıklama (EN)</label><textarea name="seo_aciklama_en"><?= e($o['aciklama_en'] ?? '') ?></textarea></div>
  </div>

  <div class="kart">
    <h2>Genel</h2>
    <div class="alan-ikili">
      <div class="alan">
        <label>Favicon (sekme ikonu)</label>
        <div class="gorsel-yukleyici gorsel-yukleyici--favicon">
          <img id="favicon-onizleme" class="gorsel-yukleyici__preview" src="../assets/img/favicon.png" alt="Mevcut favicon">
          <label class="gorsel-yukleyici__drop">
            <span class="gorsel-yukleyici__icon">↑</span>
            <strong>Favicon dosyasını seçin</strong>
            <small>PNG, JPG veya WebP · otomatik PNG kaydı</small>
            <span class="gorsel-yukleyici__button">Dosya seç</span>
            <span class="gorsel-yukleyici__name" data-dosya-adi>Mevcut favicon korunacak</span>
            <input type="file" name="favicon" accept="image/png,image/jpeg,image/webp" data-onizleme="#favicon-onizleme">
          </label>
        </div>
        <label class="gorsel-yukleyici__remove">
          <input type="checkbox" name="favicon_sil" value="1"> Faviconu sil
        </label>
        <p class="ipucu">PNG, JPG veya WebP yükleyebilirsiniz. Görsel otomatik olarak PNG formatında kaydedilir.</p>
      </div>
      <?php foreach ($siteGorseller as $anahtar => $bilgi): ?>
        <div class="alan">
          <label><?= e($bilgi['etiket']) ?></label>
          <div class="gorsel-yukleyici gorsel-yukleyici--site">
            <img id="site-<?= e($anahtar) ?>-onizleme" class="gorsel-yukleyici__preview" src="../assets/img/<?= e($bilgi['dosya']) ?>" alt="Mevcut görsel">
            <label class="gorsel-yukleyici__drop">
              <span class="gorsel-yukleyici__icon">↑</span>
              <strong>Görseli değiştirin</strong>
              <small>JPG, PNG veya WebP</small>
              <span class="gorsel-yukleyici__button">Dosya seç</span>
              <span class="gorsel-yukleyici__name" data-dosya-adi>Mevcut görsel korunacak</span>
              <input type="file" name="gorsel_<?= e($anahtar) ?>" accept="image/*" data-onizleme="#site-<?= e($anahtar) ?>-onizleme">
            </label>
          </div>
        </div>
      <?php endforeach; ?>
      <div class="alan">
        <label>Logo</label>
        <div class="gorsel-yukleyici gorsel-yukleyici--logo">
          <img id="logo-onizleme" class="gorsel-yukleyici__preview" src="../assets/img/logo.png" alt="Mevcut logo">
          <label class="gorsel-yukleyici__drop">
            <span class="gorsel-yukleyici__icon">↑</span>
            <strong>Logo dosyasını seçin</strong>
            <small>PNG, JPG veya WebP · şeffaflık korunur</small>
            <span class="gorsel-yukleyici__button">Dosya seç</span>
            <span class="gorsel-yukleyici__name" data-dosya-adi>Mevcut logo korunacak</span>
            <input type="file" name="logo" accept="image/png,image/jpeg,image/webp" data-onizleme="#logo-onizleme">
          </label>
        </div>
        <p class="ipucu">Logo, sitenin üst bölümünde kullanılmak üzere PNG formatında kaydedilir.</p>
      </div>
      <div class="alan">
        <label>Form bildirimi e-postası</label>
        <input type="email" name="bildirim_epostasi" value="<?= e($g['bildirim_epostasi'] ?? '') ?>">
        <p class="ipucu">Sitedeki formlar bu adrese düşer. Boş bırakırsanız <code>gonder.php</code> içindeki
          varsayılan adres kullanılır — artık dosyayı elle düzenlemeniz gerekmiyor.</p>
      </div>
    </div>
    <div class="alan-ikili">
      <div class="alan"><label>Footer açıklaması (TR)</label><textarea name="footer_about_tr"><?= e($g['footer_about_tr'] ?? '') ?></textarea></div>
      <div class="alan"><label>Footer açıklaması (EN)</label><textarea name="footer_about_en"><?= e($g['footer_about_en'] ?? '') ?></textarea></div>
    </div>
    <div class="alan-ikili">
      <div class="alan"><label>Telif/görsel notu (TR)</label><textarea name="footer_credits_tr"><?= e($g['footer_credits_tr'] ?? '') ?></textarea></div>
      <div class="alan"><label>Telif/görsel notu (EN)</label><textarea name="footer_credits_en"><?= e($g['footer_credits_en'] ?? '') ?></textarea></div>
    </div>
  </div>

  <div class="btn-satir">
    <button class="btn btn--ana" type="submit">Kaydet</button>
    <a class="btn btn--sade" href="ayarlar.php">Vazgeç</a>
  </div>
</form>

<?php include __DIR__ . '/inc/alt.php'; ?>
