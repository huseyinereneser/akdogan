<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();
yonetici_gerekli();

$ayar = ayar_oku();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $atilan = [];   // geçersiz olduğu için yok sayılan alanlar

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
        'varsayilan_tema'   => in_array(girdi('tema'), ['sistem', 'light', 'dark'], true) ? girdi('tema') : 'sistem',
        'bildirim_epostasi' => $bildirim,
    ];

    $tgTok = trim(girdi('telegram_token'));
    if ($tgTok !== '' && !preg_match('~^\d{5,}:[A-Za-z0-9_-]{20,}$~', $tgTok)) {
        $atilan[] = 'Telegram bot anahtarı';
        $tgTok = $ayar['bildirim']['telegram_token'] ?? '';
    }
    $ayar['bildirim'] = [
        'telegram_token' => $tgTok,
        'telegram_chat'  => preg_replace('/[^0-9-]/', '', girdi('telegram_chat')),
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
$b = $ayar['bildirim'] ?? [];

$baslik = 'İletişim & Ayarlar'; $aktif = 'ayarlar';
include __DIR__ . '/inc/ust.php';
?>

<form method="post">
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
        <label>Sitenin varsayılan teması</label>
        <select name="tema">
          <option value="sistem" <?= ($g['varsayilan_tema'] ?? '') === 'sistem' ? 'selected' : '' ?>>Ziyaretçinin cihaz ayarı</option>
          <option value="light" <?= ($g['varsayilan_tema'] ?? '') === 'light' ? 'selected' : '' ?>>Her zaman açık</option>
          <option value="dark" <?= ($g['varsayilan_tema'] ?? '') === 'dark' ? 'selected' : '' ?>>Her zaman koyu</option>
        </select>
        <p class="ipucu">Ziyaretçi kendi seçimini yaptıysa o korunur.</p>
      </div>
      <div class="alan">
        <label>Form bildirimi e-postası</label>
        <input type="email" name="bildirim_epostasi" value="<?= e($g['bildirim_epostasi'] ?? '') ?>">
        <p class="ipucu">Sitedeki formlar bu adrese düşer. Boş bırakırsanız <code>gonder.php</code> içindeki
          varsayılan adres kullanılır — artık dosyayı elle düzenlemeniz gerekmiyor.</p>
      </div>
    </div>
  </div>

  <div class="kart">
    <h2>Bildirimler — Telegram</h2>
    <p class="ipucu">Doldurulursa, sitedeki formlardan gelen her yeni talep e-postanın yanında
      bir Telegram mesajı olarak da gönderilir. Bu bilgiler sunucuda kalır, sitede yayınlanmaz.</p>
    <ol class="ipucu" style="margin:0 0 12px;padding-left:20px">
      <li>Telegram'da <b>@BotFather</b>'a yazın, <code>/newbot</code> ile bir bot oluşturun; verdiği
        anahtarı (<code>123456789:AA...</code>) aşağıya yapıştırın.</li>
      <li>Botunuza bir mesaj gönderin, sonra <b>@RawDataBot</b> veya <b>@userinfobot</b> ile
        kendi <b>chat id</b>'nizi öğrenip yazın. Grup için grubu ekleyip grubun id'sini kullanın.</li>
    </ol>
    <div class="alan"><label>Bot anahtarı (token)</label><input type="text" name="telegram_token" value="<?= e($b['telegram_token'] ?? '') ?>" placeholder="123456789:AA..." autocomplete="off" spellcheck="false"></div>
    <div class="alan"><label>Chat ID</label><input type="text" name="telegram_chat" value="<?= e($b['telegram_chat'] ?? '') ?>" placeholder="ör. 87654321 veya -1001234567890" inputmode="numeric"></div>
  </div>

  <div class="btn-satir">
    <button class="btn btn--ana" type="submit">Kaydet</button>
    <a class="btn btn--sade" href="ayarlar.php">Vazgeç</a>
  </div>
</form>

<?php include __DIR__ . '/inc/alt.php'; ?>
