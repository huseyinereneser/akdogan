<?php
/** Ücretsiz, self-hosted LibreTranslate bağlantısı. */
function libretranslate(string $metin, string $kaynak, string $hedef): array {
    $adres = rtrim((string)(getenv('LIBRETRANSLATE_URL') ?: 'http://127.0.0.1:5000'), '/') . '/translate';
    $veri = http_build_query(['q' => $metin, 'source' => $kaynak, 'target' => $hedef, 'format' => 'text']);
    $cevap = false; $kod = 200;
    if (function_exists('curl_init')) {
        $ch = curl_init($adres);
        curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $veri, CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'], CURLOPT_CONNECTTIMEOUT => 3, CURLOPT_TIMEOUT => 15]);
        $cevap = curl_exec($ch); $hata = curl_error($ch); $kod = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
        if ($cevap === false) return ['ok' => false, 'hata' => 'Çeviri servisine bağlanılamadı. LibreTranslate çalışıyor mu? (' . $hata . ')'];
    } else {
        $cevap = @file_get_contents($adres, false, stream_context_create(['http' => ['method' => 'POST', 'header' => "Content-Type: application/x-www-form-urlencoded\r\n", 'content' => $veri, 'timeout' => 15]]));
        if ($cevap === false) return ['ok' => false, 'hata' => 'Ücretsiz çeviri servisine bağlanılamadı. LibreTranslate servisini 127.0.0.1:5000 adresinde başlatın.'];
    }
    $json = json_decode((string)$cevap, true);
    if ($kod >= 400 || !is_array($json) || empty($json['translatedText'])) return ['ok' => false, 'hata' => is_array($json) ? ($json['error'] ?? 'Çeviri servisi geçerli bir yanıt vermedi.') : 'Çeviri servisi geçerli bir yanıt vermedi.'];
    return ['ok' => true, 'metin' => (string)$json['translatedText']];
}
