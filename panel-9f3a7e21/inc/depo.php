<?php
/**
 * depo.php — JSON dosya deposu
 * Kilitli okuma/yazma, atomik kayıt, ve public site.json'un yeniden üretimi.
 */

/** Bir JSON dosyasını dizi olarak oku (yoksa boş dizi) */
function json_oku(string $yol): array {
    if (!is_file($yol)) return [];
    $ham = @file_get_contents($yol);
    if ($ham === false || $ham === '') return [];
    $veri = json_decode($ham, true);
    return is_array($veri) ? $veri : [];
}

/** Diziyi JSON olarak atomik yaz (geçici dosya + rename) */
function json_yaz(string $yol, array $veri): bool {
    $json = json_encode(
        $veri,
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    if ($json === false) return false;

    $dizin = dirname($yol);
    if (!is_dir($dizin)) @mkdir($dizin, 0775, true);

    $gecici = $yol . '.tmp' . kimlik(4);
    if (@file_put_contents($gecici, $json, LOCK_EX) === false) return false;
    @chmod($gecici, 0664);
    if (!@rename($gecici, $yol)) { @unlink($gecici); return false; }
    return true;
}

// -- Sürüm geçmişi -------------------------------------------------------
/** Panelden yönetilen, geçmişi tutulan içerik dosyaları (etiket => dosya adı) */
function surumlu_dosyalar(): array {
    return [
        'ayarlar.json'   => 'İletişim & Ayarlar',
        'hizmetler.json' => 'Hizmetler',
        'galeri.json'    => 'Galeri',
        'sayfalar.json'  => 'Sayfa Metinleri',
        'seo.json'       => 'SEO & Sitemap',
        'users.json'     => 'Kullanıcılar',
    ];
}

/** Yazmadan hemen önce çağrılır: mevcut dosyanın bir kopyasını geçmişe al */
function surum_al(string $ad): void {
    if (!isset(surumlu_dosyalar()[$ad])) return;
    $canli = VERI_DIZIN . '/' . $ad;
    if (!is_file($canli)) return;

    $klasor = SURUM_DIZIN . '/' . $ad;
    if (!is_dir($klasor)) {
        @mkdir($klasor, 0775, true);
        @file_put_contents(SURUM_DIZIN . '/index.html', '');   // dizin listelemesine karşı
        @file_put_contents($klasor . '/index.html', '');
    }
    @copy($canli, $klasor . '/' . date('Ymd-His') . '-' . kimlik(2) . '.json');

    // En yeni SURUM_AZAMI tanesini bırak, gerisini sil
    $hepsi = glob($klasor . '/*.json') ?: [];
    rsort($hepsi);
    foreach (array_slice($hepsi, SURUM_AZAMI) as $eski) @unlink($eski);
}

/** Bir dosyanın geçmiş sürümleri, en yeni önce: [['ad'=>dosya, 'zaman'=>ts], ...] */
function surum_listesi(string $ad): array {
    if (!isset(surumlu_dosyalar()[$ad])) return [];
    $hepsi = glob(SURUM_DIZIN . '/' . $ad . '/*.json') ?: [];
    rsort($hepsi);
    return array_map(fn($y) => ['ad' => basename($y), 'zaman' => filemtime($y)], $hepsi);
}

function surum_govde(string $ad, string $surumAdi): ?string {
    $surumAdi = basename($surumAdi);
    $yol = SURUM_DIZIN . '/' . $ad . '/' . $surumAdi;
    return is_file($yol) ? (@file_get_contents($yol) ?: null) : null;
}

/** Seçili geçmiş sürümü canlıya geri yaz (önce mevcut hâli de geçmişe alınır) */
function surum_geri_yukle(string $ad, string $surumAdi): bool {
    if (!isset(surumlu_dosyalar()[$ad])) return false;
    $govde = surum_govde($ad, $surumAdi);
    if ($govde === null) return false;
    $veri = json_decode($govde, true);
    if (!is_array($veri)) return false;

    surum_al($ad);                                   // geri alma da geri alınabilsin
    if (!json_yaz(VERI_DIZIN . '/' . $ad, $veri)) return false;
    if ($ad !== 'users.json') site_json_uret();
    return true;
}

// -- Kurulum kilidi ----------------------------------------------------
/** Kurulum tamamlandı mı? (users.json geçici okunamasa bile kurulum yeniden açılmasın) */
function kurulum_kilitli(): bool { return is_file(KURULUM_KILIDI); }
function kurulum_kilidi_yaz(): void {
    if (!is_file(KURULUM_KILIDI)) @file_put_contents(KURULUM_KILIDI, date('c') . "\n", LOCK_EX);
}

// -- Bölüm bazlı kısayollar ------------------------------------------------
function ayar_oku(): array     { return json_oku(VERI_DIZIN . '/ayarlar.json'); }
function ayar_yaz(array $v)     { surum_al('ayarlar.json'); return json_yaz(VERI_DIZIN . '/ayarlar.json', $v) && site_json_uret(); }

function hizmet_oku(): array    { $d = json_oku(VERI_DIZIN . '/hizmetler.json'); return $d['hizmetler'] ?? []; }
function hizmet_yaz(array $liste) {
    usort($liste, fn($a, $b) => ($a['sira'] ?? 0) <=> ($b['sira'] ?? 0));
    surum_al('hizmetler.json');
    return json_yaz(VERI_DIZIN . '/hizmetler.json', ['hizmetler' => array_values($liste)]) && site_json_uret();
}

function galeri_oku(): array    { return json_oku(VERI_DIZIN . '/galeri.json'); }
function galeri_yaz(array $v)   { surum_al('galeri.json'); return json_yaz(VERI_DIZIN . '/galeri.json', $v) && site_json_uret(); }

function sayfa_oku(): array     { return json_oku(VERI_DIZIN . '/sayfalar.json'); }
function sayfa_yaz(array $v)    { surum_al('sayfalar.json'); return json_yaz(VERI_DIZIN . '/sayfalar.json', $v) && site_json_uret(); }

function seo_oku(): array       { return json_oku(VERI_DIZIN . '/seo.json'); }
function seo_yaz(array $v)      { surum_al('seo.json'); return json_yaz(VERI_DIZIN . '/seo.json', $v) && site_json_uret(); }

function kullanici_oku(): array { $d = json_oku(VERI_DIZIN . '/users.json'); return $d['kullanicilar'] ?? []; }
function kullanici_yaz(array $liste) {
    surum_al('users.json');
    $ok = json_yaz(VERI_DIZIN . '/users.json', ['kullanicilar' => array_values($liste)]);
    if ($ok && $liste) kurulum_kilidi_yaz();          // en az bir hesap varken kurulum kalıcı kapansın
    return $ok;
}

/**
 * Public birleşik dosyayı yeniden üret: assets/data/site.json
 * Sitenin ön yüzü YALNIZCA bunu okur. Kullanıcı/şifre/talep İÇERMEZ.
 */
function site_json_uret(): bool {
    $ayar   = ayar_oku();
    $galeri = galeri_oku();

    $cikti = [
        'guncelleme' => date('c'),
        'iletisim'   => $ayar['iletisim'] ?? [],
        'sosyal'     => $ayar['sosyal'] ?? [],
        'seo'        => $ayar['seo'] ?? [],
        'seo_sayfalar' => seo_oku()['sayfalar'] ?? [],
        'genel'      => ['varsayilan_tema' => $ayar['genel']['varsayilan_tema'] ?? 'sistem'],
        'hizmetler'  => hizmet_oku(),
        'galeri'     => $galeri['galeri'] ?? [],
        'galeri_kategoriler' => $galeri['kategoriler'] ?? [],
        'sayfalar'   => sayfa_oku(),
    ];

    $dizin = dirname(SITE_JSON);
    if (!is_dir($dizin)) @mkdir($dizin, 0775, true);
    return json_yaz(SITE_JSON, $cikti);
}

// -- Talep sayaç önbelleği ---------------------------------------------
/**
 * Talep sayıları (toplam / okunmamış / son tarih). Her sayfa yüklemesinde
 * yüzlerce dosyayı açmamak için önbelleğe alınır; talepler klasörünün
 * değişme zamanı sabit kaldığı sürece önbellek kullanılır (gonder.php yeni
 * dosya ekleyince otomatik tazelenir, panel içi değişikliklerde
 * talep_sayaci_bosalt() çağrılır).
 */
function talep_sayaci(): array {
    $cache = VERI_DIZIN . '/talep-sayac.json';
    $dizinZamani = @filemtime(TALEP_DIZIN) ?: 0;
    $c = json_oku($cache);
    if (($c['dizin'] ?? -1) === $dizinZamani && isset($c['toplam'])) return $c;

    $toplam = 0; $okunmamis = 0; $sonTarih = 0;
    foreach (glob(TALEP_DIZIN . '/*.json') ?: [] as $f) {
        $d = json_oku($f);
        if (!$d) continue;
        $toplam++;
        if (empty($d['okundu'])) $okunmamis++;
        $sonTarih = max($sonTarih, (int)($d['zaman'] ?? 0));
    }
    $c = ['dizin' => $dizinZamani, 'toplam' => $toplam, 'okunmamis' => $okunmamis, 'sonTarih' => $sonTarih];
    json_yaz($cache, $c);
    return $c;
}
function talep_sayaci_bosalt(): void { @unlink(VERI_DIZIN . '/talep-sayac.json'); }

// -- Silinen talepler (geri alınabilir) ------------------------------
/** Silinen bir talebi geri dönüşüm klasörüne taşı (en yeni 50 tanesi tutulur) */
function talep_geri_donusume(string $id, array $veri): void {
    $id = preg_replace('/[^A-Za-z0-9\-]/', '', $id);
    if ($id === '') return;
    if (!is_dir(SILINEN_TALEP_DIZIN)) {
        @mkdir(SILINEN_TALEP_DIZIN, 0775, true);
        @file_put_contents(SILINEN_TALEP_DIZIN . '/index.html', '');
    }
    $veri['silinme'] = time();
    json_yaz(SILINEN_TALEP_DIZIN . '/' . $id . '.json', $veri);
    $hepsi = glob(SILINEN_TALEP_DIZIN . '/*.json') ?: [];
    usort($hepsi, fn($a, $b) => (@filemtime($b) ?: 0) <=> (@filemtime($a) ?: 0));
    foreach (array_slice($hepsi, 50) as $eski) @unlink($eski);
}

/** Geri dönüşümdeki bir talebi listeye geri koy */
function talep_geri_al(string $id): bool {
    $id = preg_replace('/[^A-Za-z0-9\-]/', '', $id);
    if ($id === '') return false;
    $kaynak = SILINEN_TALEP_DIZIN . '/' . $id . '.json';
    if (!is_file($kaynak)) return false;
    $d = json_oku($kaynak);
    unset($d['silinme']);
    if (!$d || !json_yaz(TALEP_DIZIN . '/' . $id . '.json', $d)) return false;
    @unlink($kaynak);
    talep_sayaci_bosalt();
    return true;
}

/** Geri dönüşümdeki talepler, en yeni önce */
function silinen_talepler(): array {
    $out = [];
    foreach (glob(SILINEN_TALEP_DIZIN . '/*.json') ?: [] as $f) {
        $d = json_oku($f);
        if ($d) $out[] = $d;
    }
    usort($out, fn($a, $b) => ($b['silinme'] ?? 0) <=> ($a['silinme'] ?? 0));
    return $out;
}

// -- "veri/ klasörü dışarıdan açık mı?" öz-denetimi -------------------
/**
 * veri/ klasöründeki dosyalar tarayıcıdan doğrudan indirilebiliyor mu?
 * (.htaccess yalnızca Apache'de çalışır; nginx/LiteSpeed'de sessizce
 *  başarısız olur ve users.json / talepler herkese açık kalır.)
 * Dönüş: true = açık (tehlike), false = kapalı, null = belirlenemedi.
 * Sonuç 24 saat önbelleğe alınır.
 */
function veri_disari_acik_mi(): ?bool {
    $cache = VERI_DIZIN . '/otokontrol.json';
    $c = json_oku($cache);
    if (isset($c['t']) && (time() - (int)$c['t'] < 86400)) {
        return array_key_exists('acik', $c) ? $c['acik'] : null;
    }

    $sonuc = null;
    if (filter_var(ini_get('allow_url_fopen'), FILTER_VALIDATE_BOOLEAN)) {
        $jeton  = 'ACIK-' . kimlik(6);
        $kanari = VERI_DIZIN . '/kanari.txt';
        @file_put_contents($kanari, $jeton, LOCK_EX);

        $sema = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? '';
        $dizin = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');
        $url  = $sema . '://' . $host . $dizin . '/veri/kanari.txt';

        $ctx = stream_context_create([
            'http' => ['timeout' => 3, 'ignore_errors' => true, 'follow_location' => 0],
            'ssl'  => ['verify_peer' => false, 'verify_peer_name' => false],
        ]);
        $cevap = ($host !== '') ? @file_get_contents($url, false, $ctx) : false;
        @unlink($kanari);

        $kod = 0;
        if (isset($http_response_header[0]) && preg_match('#\s(\d{3})\s#', $http_response_header[0], $m)) {
            $kod = (int)$m[1];
        }
        if (is_string($cevap) && strpos($cevap, $jeton) !== false) {
            $sonuc = true;                       // dosyanın içeriği döndü → klasör dışarıya AÇIK
        } elseif (in_array($kod, [200, 401, 403, 404], true)) {
            $sonuc = false;                      // sunucuya ulaşıldı ama dosya servis edilmedi → KAPALI
        }
    }

    json_yaz($cache, ['t' => time(), 'acik' => $sonuc]);
    return $sonuc;
}
