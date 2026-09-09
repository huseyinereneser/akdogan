<?php
require __DIR__ . '/inc/on.php';
oturum_gerekli();

$satirlar = [];
foreach (glob(TALEP_DIZIN . '/*.json') ?: [] as $f) {
    $d = json_oku($f);
    if (!$d) continue;
    // govde içindeki asıl mesajı sadeleştir
    $mesaj = preg_replace("/\s+/", ' ', $d['govde'] ?? '');
    $satirlar[] = [
        'Tarih'   => tarih_tr($d['zaman'] ?? 0),
        'Tür'     => $d['tur'] ?? '',
        'Ad Soyad'=> $d['ad'] ?? '',
        'E-posta' => $d['eposta'] ?? '',
        'Telefon' => $d['telefon'] ?? '',
        'Okundu'  => empty($d['okundu']) ? 'Hayır' : 'Evet',
        'Mesaj'   => $mesaj,
    ];
}
usort($satirlar, fn($a, $b) => strcmp($b['Tarih'], $a['Tarih']));

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="talepler-' . date('Y-m-d') . '.csv"');

$cikti = fopen('php://output', 'w');
fwrite($cikti, "\xEF\xBB\xBF"); // Excel için UTF-8 BOM
fputcsv($cikti, ['Tarih', 'Tür', 'Ad Soyad', 'E-posta', 'Telefon', 'Okundu', 'Mesaj'], ';');
foreach ($satirlar as $s) {
    // csv_guvenli: =,+,-,@ ile başlayan hücreler Excel'de formül olarak
    // çalışmasın diye başına tırnak eklenir (formül enjeksiyonu).
    fputcsv($cikti, array_map('csv_guvenli', array_map('strval', array_values($s))), ';');
}
fclose($cikti);
