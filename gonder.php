<?php
/**
 * Akdoğan Turizm — form gönderim işleyicisi
 * =========================================
 * İletişim / teklif, iş başvurusu ve müşteri yorumu formlarını e-posta olarak
 * iletir. Bağımlılık yok; PHP 7.4+ ve çalışan bir mail() yeterlidir.
 *
 * KURULUM
 *   1. Bu dosyayı sitenin köküne (index.html ile aynı klasör) yükleyin.
 *   2. Aşağıdaki $ALICI adresini kendi kutunuzla değiştirin. (Yönetim panelinde
 *      "İletişim & Ayarlar → Form bildirimi e-postası" doldurulduysa o adres
 *      buradaki $ALICI'nın yerine geçer — dosyayı elle düzenlemeye gerek kalmaz.)
 *   3. Sunucunuzda PHP + mail() aktif olmalı (çoğu paylaşımlı hostta hazırdır).
 *      Mail gitmiyorsa host paneli > "E-posta / PHP mail" ayarlarına bakın veya
 *      SMTP kullanan bir çözüme geçin (README'ye not bırakıldı).
 *
 * ALTERNATİF (PHP yoksa): formların action="" değerini bir Web3Forms/Formspree
 * uç noktasıyla değiştirmek yeterli — ayrıntı README.md içinde.
 */

// ------------------------------------------------------------------ AYARLAR ---
$ALICI      = 'info@akdoganturizm.com';           // formların düşeceği kutu (varsayılan)
$SITE_ADI   = 'Akdoğan Turizm';
$GONDEREN   = 'no-reply@' . preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'akdoganturizm.com');

// Yönetim panelinde bir "Form bildirimi e-postası" tanımlıysa onu kullan.
$panelAyar = @file_get_contents(__DIR__ . '/panel-9f3a7e21/veri/ayarlar.json');
if ($panelAyar !== false) {
    $ayarDizi = json_decode($panelAyar, true);
    $panelAlici = $ayarDizi['genel']['bildirim_epostasi'] ?? '';
    if (is_string($panelAlici) && filter_var(trim($panelAlici), FILTER_VALIDATE_EMAIL)) {
        $ALICI = trim($panelAlici);
    }
}

$IZIN_UZANTI   = ['pdf','doc','docx','xls','xlsx','jpg','jpeg','png','webp','heic'];
$MAX_DOSYA     = 8  * 1024 * 1024;   // dosya başına 8 MB
$MAX_TOPLAM    = 12 * 1024 * 1024;   // toplam 12 MB
$MAX_ADET      = 6;                  // en fazla 6 dosya
// ---------------------------------------------------------------------------- //

function bitir($ok, $mesaj, $ajax) {
    if ($ajax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'mesaj' => $mesaj], JSON_UNESCAPED_UNICODE);
    } else {
        // JS'siz gönderimlerde basit bir teşekkür / hata sayfasına yönlendir
        $hedef = $ok ? 'tesekkurler.html' : 'tesekkurler.html?hata=1';
        header('Location: ' . $hedef, true, 303);
    }
    exit;
}

$ajax = (isset($_POST['ajax']) && $_POST['ajax'] === '1');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    bitir(false, 'Geçersiz istek.', $ajax);
}

// -- Bal küpü (bot tuzağı): doldurulmuşsa sessizce başarı dön ----------------
if (!empty($_POST['website'])) {
    bitir(true, 'Teşekkürler.', $ajax);
}

// -- Basit hız sınırı: aynı IP 15 sn'de bir (yalnızca başarılı gönderimde) --
$ip    = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$kilit = sys_get_temp_dir() . '/akd_form_' . md5($ip);
if (is_file($kilit) && (time() - filemtime($kilit)) < 15) {
    bitir(false, 'Çok sık deneme yaptınız. Lütfen biraz bekleyin.', $ajax);
}

// mbstring yoksa güvenli yedekler
if (!function_exists('mb_strlen'))          { function mb_strlen($s) { return strlen($s); } }
if (!function_exists('mb_encode_mimeheader')) { function mb_encode_mimeheader($s) { return $s; } }
if (!function_exists('mb_substr'))          { function mb_substr($s, $start, $length = null) { return $length === null ? substr($s, $start) : substr($s, $start, $length); } }

// -- Alanları temizle ------------------------------------------------------
function al($k) { return isset($_POST[$k]) ? trim((string) $_POST[$k]) : ''; }
function tekSatir($s) { return trim(preg_replace('/[\r\n]+/', ' ', $s)); }

$tur     = al('form');                       // teklif | basvuru | yorum
$ad      = tekSatir(al('ad'));
$eposta  = tekSatir(al('eposta'));
$telefon = tekSatir(al('telefon'));

if ($ad === '' || mb_strlen($ad) > 120) {
    bitir(false, 'Lütfen adınızı girin.', $ajax);
}
if (!filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
    bitir(false, 'Lütfen geçerli bir e-posta adresi girin.', $ajax);
}

// -- Forma göre gövde ----------------------------------------------------
$satirlar = [];
$satirlar[] = 'Ad Soyad     : ' . $ad;
$satirlar[] = 'E-posta      : ' . $eposta;
if ($telefon !== '') $satirlar[] = 'Telefon      : ' . $telefon;

if ($tur === 'basvuru') {
    $baslik = 'İş Başvurusu';
    $poz = al('pozisyon');
    if ($poz === 'Diğer' && al('pozisyon_diger') !== '') $poz .= ' — ' . tekSatir(al('pozisyon_diger'));
    if ($poz !== '')            $satirlar[] = 'Pozisyon     : ' . $poz;
    if (al('deneyim') !== '')   $satirlar[] = 'Deneyim (yıl): ' . tekSatir(al('deneyim'));
    if (al('belgeler') !== '')  $satirlar[] = 'Belgeler     : ' . tekSatir(al('belgeler'));
    $mesaj = al('mesaj');
    if (trim($mesaj) === '') bitir(false, 'Lütfen kısa bir özgeçmiş yazın.', $ajax);
    $satirlar[] = '';
    $satirlar[] = 'Kısa özgeçmiş:';
    $satirlar[] = $mesaj;
} elseif ($tur === 'yorum') {
    $baslik = 'Müşteri Yorumu';
    if (al('kurum') !== '') $satirlar[] = 'Kurum/Görev  : ' . tekSatir(al('kurum'));
    $mesaj = al('yorum');
    if (trim($mesaj) === '') bitir(false, 'Lütfen yorumunuzu yazın.', $ajax);
    $satirlar[] = '';
    $satirlar[] = 'Yorum:';
    $satirlar[] = $mesaj;
} else {
    $tur = 'teklif';
    $baslik = 'Teklif / Bilgi Talebi';
    $hiz = al('hizmet');
    if ($hiz === 'Diğer' && al('hizmet_diger') !== '') $hiz .= ' — ' . tekSatir(al('hizmet_diger'));
    if ($hiz !== '') $satirlar[] = 'Hizmet       : ' . $hiz;
    $mesaj = al('mesaj');
    if (trim($mesaj) === '') bitir(false, 'Lütfen mesajınızı yazın.', $ajax);
    $satirlar[] = '';
    $satirlar[] = 'Mesaj:';
    $satirlar[] = $mesaj;
}

$satirlar[] = '';
$satirlar[] = str_repeat('-', 48);
$satirlar[] = 'Gönderim  : ' . date('d.m.Y H:i');
$satirlar[] = 'Sayfa     : ' . tekSatir($_SERVER['HTTP_REFERER'] ?? '-');
$satirlar[] = 'IP        : ' . $ip;
$govde = implode("\n", $satirlar);

// -- Dosya ekleri (varsa) ------------------------------------------------
$ekler = [];
if (!empty($_FILES['dosya']) && is_array($_FILES['dosya']['name'])) {
    $toplam = 0;
    foreach ($_FILES['dosya']['name'] as $i => $isim) {
        if ($_FILES['dosya']['error'][$i] !== UPLOAD_ERR_OK) continue;
        if (count($ekler) >= $MAX_ADET) break;
        $tmp  = $_FILES['dosya']['tmp_name'][$i];
        if (!is_string($tmp) || !is_uploaded_file($tmp)) continue;   // yalnızca gerçek yüklemeler
        $boyut = (int) $_FILES['dosya']['size'][$i];
        $uzanti = strtolower(pathinfo($isim, PATHINFO_EXTENSION));
        if (!in_array($uzanti, $IZIN_UZANTI, true)) {
            bitir(false, 'İzin verilmeyen dosya türü: .' . $uzanti, $ajax);
        }
        if ($boyut > $MAX_DOSYA) {
            bitir(false, 'Bir dosya 8 MB sınırını aşıyor.', $ajax);
        }
        $toplam += $boyut;
        if ($toplam > $MAX_TOPLAM) {
            bitir(false, 'Toplam dosya boyutu 12 MB sınırını aşıyor.', $ajax);
        }
        $ekler[] = [
            'ad'   => preg_replace('/[^\w.\- ]+/u', '_', $isim),
            'veri' => file_get_contents($tmp),
            'mime' => mime_content_type($tmp) ?: 'application/octet-stream',
        ];
    }
}

// -- E-postayı oluştur --------------------------------------------------
$konu = mb_encode_mimeheader('[' . $SITE_ADI . '] ' . $baslik . ' — ' . $ad, 'UTF-8', 'B');

$h  = 'From: ' . mb_encode_mimeheader($SITE_ADI, 'UTF-8', 'B') . ' <' . $GONDEREN . ">\r\n";
$h .= 'Reply-To: ' . $eposta . "\r\n";
$h .= "MIME-Version: 1.0\r\n";
$h .= "X-Mailer: akdogan-form\r\n";

if ($ekler) {
    $sinir = 'akd_' . bin2hex(random_bytes(12));
    $h .= 'Content-Type: multipart/mixed; boundary="' . $sinir . "\"\r\n";
    $mail  = '--' . $sinir . "\r\n";
    $mail .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $mail .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $mail .= $govde . "\r\n\r\n";
    foreach ($ekler as $ek) {
        $mail .= '--' . $sinir . "\r\n";
        $mail .= 'Content-Type: ' . $ek['mime'] . '; name="' . $ek['ad'] . "\"\r\n";
        $mail .= "Content-Transfer-Encoding: base64\r\n";
        $mail .= 'Content-Disposition: attachment; filename="' . $ek['ad'] . "\"\r\n\r\n";
        $mail .= chunk_split(base64_encode($ek['veri'])) . "\r\n";
    }
    $mail .= '--' . $sinir . "--\r\n";
} else {
    $h   .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $h   .= "Content-Transfer-Encoding: 8bit\r\n";
    $mail = $govde;
}

$gonderildi = @mail($ALICI, $konu, $mail, $h, '-f ' . $GONDEREN);
if (!$gonderildi) {
    $gonderildi = @mail($ALICI, $konu, $mail, $h);   // -f parametresi kapalıysa
}

// -- Talebi yönetim paneli için kaydet (mail gitmese de) ----------------
$talepDizin = __DIR__ . '/panel-9f3a7e21/veri/talepler';
if (is_dir($talepDizin) && is_writable($talepDizin)) {
    $kayit = [
        'id'      => date('Ymd-His') . '-' . bin2hex(random_bytes(3)),
        'tur'     => $tur,
        'baslik'  => $baslik,
        'ad'      => $ad,
        'eposta'  => $eposta,
        'telefon' => $telefon,
        'govde'   => $govde,
        'ekler'   => array_map(function ($e) { return $e['ad']; }, $ekler),
        'zaman'   => time(),
        'ip'      => $ip,
        'okundu'  => false,
        'mail'    => (bool) $gonderildi,
    ];
    @file_put_contents(
        $talepDizin . '/' . $kayit['id'] . '.json',
        json_encode($kayit, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );
}

// -- Telegram bildirimi (panelde tanımlıysa; en iyi çaba, hata yutulur) -----
$bildirim = (isset($ayarDizi) && is_array($ayarDizi)) ? ($ayarDizi['bildirim'] ?? []) : [];
$tgToken  = trim((string) ($bildirim['telegram_token'] ?? ''));
$tgChat   = trim((string) ($bildirim['telegram_chat'] ?? ''));
if ($tgToken !== '' && $tgChat !== '' && preg_match('~^\d{5,}:[A-Za-z0-9_-]{20,}$~', $tgToken)) {
    $tgMetin = "🔔 " . $baslik . "\n"
             . $ad . " <" . $eposta . ">\n"
             . ($telefon !== '' ? $telefon . "\n" : '')
             . "\n" . mb_substr(trim($mesaj), 0, 800);
    $tgGovde = http_build_query([
        'chat_id' => $tgChat,
        'text'    => $tgMetin,
        'disable_web_page_preview' => 'true',
    ]);
    $tgCtx = stream_context_create(['http' => [
        'method'        => 'POST',
        'timeout'       => 4,
        'ignore_errors' => true,
        'header'        => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content'       => $tgGovde,
    ]]);
    @file_get_contents('https://api.telegram.org/bot' . $tgToken . '/sendMessage', false, $tgCtx);
}

if ($gonderildi) {
    @touch($kilit);
    bitir(true, 'Talebiniz bize ulaştı. En kısa sürede dönüş yapacağız.', $ajax);
} elseif (isset($kayit)) {
    // Mail gitmedi ama talep panele kaydedildi — kullanıcıyı mağdur etme
    @touch($kilit);
    bitir(true, 'Talebiniz bize ulaştı. En kısa sürede dönüş yapacağız.', $ajax);
} else {
    bitir(false, 'Şu an gönderilemedi. Lütfen telefonla ulaşın: 0262 642 91 03', $ajax);
}
