<?php
require __DIR__ . '/inc/on.php';
$kullanici = oturum_gerekli();
yonetici_gerekli();

$liste = kullanici_oku();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_dogrula();
    $eylem = girdi('eylem');

    if ($eylem === 'ekle') {
        $ad = girdi('ad');
        $eposta = mb_strtolower(girdi('eposta'));
        $kadi = mb_strtolower(trim(girdi('kadi')));
        $sifre = girdi('sifre');
        $rol = girdi('rol') === 'yonetici' ? 'yonetici' : 'editor';

        if ($ad === '' || !filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
            flash_koy('hata', 'Ad ve geçerli e-posta girin.');
        } elseif (!preg_match('/^[a-z0-9._-]{3,32}$/', $kadi)) {
            flash_koy('hata', 'Kullanıcı adı 3-32 karakter olmalı; sadece harf, rakam, nokta, tire ve alt çizgi içerebilir.');
        } elseif (sifre_sorunu($sifre) !== null) {
            flash_koy('hata', sifre_sorunu($sifre));
        } elseif (array_filter($liste, fn($u) => mb_strtolower($u['eposta']) === $eposta)) {
            flash_koy('hata', 'Bu e-posta zaten kayıtlı.');
        } elseif (array_filter($liste, fn($u) => mb_strtolower($u['kadi'] ?? '') === $kadi)) {
            flash_koy('hata', 'Bu kullanıcı adı zaten kayıtlı.');
        } else {
            $liste[] = [
                'id' => kimlik(6), 'ad' => $ad, 'eposta' => $eposta, 'kadi' => $kadi,
                'sifre_hash' => password_hash($sifre, PASSWORD_DEFAULT),
                'rol' => $rol, 'olusturma' => date('c'), 'oturum_muhuru' => kimlik(8),
            ];
            kullanici_yaz($liste);
            gunluk_yaz('kullanici-ekle', $kadi . ' (' . $rol . ')');
            flash_koy('basari', 'Kullanıcı eklendi.');
        }
        git('kullanicilar.php');
    }

    if ($eylem === 'rol') {
        $id = girdi('id');
        $rol = girdi('rol') === 'yonetici' ? 'yonetici' : 'editor';
        $yoneticiSayi = count(array_filter($liste, fn($u) => ($u['rol'] ?? '') === 'yonetici'));
        foreach ($liste as &$u) {
            if ($u['id'] === $id) {
                if ($u['rol'] === 'yonetici' && $rol === 'editor' && $yoneticiSayi <= 1) {
                    flash_koy('hata', 'Son yöneticinin rolü düşürülemez.');
                    git('kullanicilar.php');
                }
                $u['rol'] = $rol;
            }
        }
        unset($u);
        kullanici_yaz($liste);
        gunluk_yaz('kullanici-rol', $id . ' → ' . $rol);
        flash_koy('basari', 'Rol güncellendi.');
        git('kullanicilar.php');
    }

    if ($eylem === '2fa-sifirla') {
        $id = girdi('id');
        foreach ($liste as &$u) {
            if ($u['id'] === $id) unset($u['totp_secret'], $u['totp_aktif'], $u['totp_yedek']);
        }
        unset($u);
        kullanici_yaz($liste);
        gunluk_yaz('2fa-kapandi', $id . ' (yönetici sıfırladı)');
        flash_koy('basari', 'Kullanıcının iki adımlı doğrulaması sıfırlandı.');
        git('kullanicilar.php');
    }

    if ($eylem === 'sil') {
        $id = girdi('id');
        if ($id === $kullanici['id']) {
            flash_koy('hata', 'Kendi hesabınızı silemezsiniz.');
        } else {
            $liste = array_values(array_filter($liste, fn($u) => $u['id'] !== $id));
            if (!array_filter($liste, fn($u) => ($u['rol'] ?? '') === 'yonetici')) {
                flash_koy('hata', 'En az bir yönetici kalmalı.');
            } else {
                kullanici_yaz($liste);
                gunluk_yaz('kullanici-sil', $id);
                flash_koy('basari', 'Kullanıcı silindi.');
            }
        }
        git('kullanicilar.php');
    }
}

$baslik = 'Kullanıcılar'; $aktif = 'kullanicilar';
include __DIR__ . '/inc/ust.php';
?>

<div class="kart" style="padding:0">
<div class="tablo-sar">
<table class="liste">
  <thead><tr><th>Ad</th><th>Kullanıcı adı</th><th>E-posta</th><th>Son giriş</th><th>2FA</th><th>Rol</th><th></th></tr></thead>
  <tbody>
  <?php foreach ($liste as $u): ?>
    <?php $sonGiris = $u['giris_gecmisi'][0] ?? null; ?>
    <tr>
      <td><b><?= e($u['ad']) ?></b><?= $u['id'] === $kullanici['id'] ? ' <span class="ipucu">(siz)</span>' : '' ?></td>
      <td><?= e($u['kadi'] ?: '—') ?></td>
      <td><?= e($u['eposta']) ?></td>
      <td style="white-space:nowrap">
        <?php if ($sonGiris): ?>
          <?= e(tarih_tr($sonGiris['t'] ?? 0)) ?><br>
          <span class="ipucu"><?= e($sonGiris['ip'] ?? '') ?></span>
        <?php else: ?>
          <span class="ipucu">—</span>
        <?php endif; ?>
      </td>
      <td>
        <?php if (!empty($u['totp_aktif'])): ?>
          <span class="rozet rozet--ok2">açık</span>
          <form method="post" style="margin:4px 0 0" data-onay="<?= e($u['ad']) ?> için 2FA sıfırlansın mı? (Telefonunu kaybettiyse)">
            <?= csrf_alan() ?>
            <input type="hidden" name="eylem" value="2fa-sifirla">
            <input type="hidden" name="id" value="<?= e($u['id']) ?>">
            <button class="btn btn--sade" style="padding:4px 10px;color:var(--err-tx)" type="submit">Sıfırla</button>
          </form>
        <?php else: ?>
          <span class="ipucu">kapalı</span>
        <?php endif; ?>
      </td>
      <td>
        <form method="post" style="margin:0">
          <?= csrf_alan() ?>
          <input type="hidden" name="eylem" value="rol">
          <input type="hidden" name="id" value="<?= e($u['id']) ?>">
          <select name="rol" data-otomatik-gonder style="width:auto">
            <option value="editor" <?= ($u['rol'] ?? '') === 'editor' ? 'selected' : '' ?>>Editör</option>
            <option value="yonetici" <?= ($u['rol'] ?? '') === 'yonetici' ? 'selected' : '' ?>>Yönetici</option>
          </select>
        </form>
      </td>
      <td>
        <?php if ($u['id'] !== $kullanici['id']): ?>
        <form method="post" style="margin:0" data-onay="<?= e($u['ad']) ?> hesabını silmek istiyor musunuz?">
          <?= csrf_alan() ?>
          <input type="hidden" name="eylem" value="sil">
          <input type="hidden" name="id" value="<?= e($u['id']) ?>">
          <button class="btn btn--sade" style="padding:6px 12px;color:var(--err-tx)" type="submit">Sil</button>
        </form>
        <?php endif; ?>
      </td>
    </tr>
  <?php endforeach; ?>
  </tbody>
</table>
</div>
</div>

<div class="kart" style="max-width:460px">
  <h2>Yeni kullanıcı</h2>
  <form method="post" autocomplete="off">
    <?= csrf_alan() ?>
    <input type="hidden" name="eylem" value="ekle">
    <div class="alan"><label>Ad Soyad</label><input type="text" name="ad" required></div>
    <div class="alan"><label>Kullanıcı adı (girişte kullanılır)</label><input type="text" name="kadi" required pattern="[a-z0-9._-]{3,32}" autocapitalize="off" spellcheck="false"></div>
    <div class="alan"><label>E-posta</label><input type="email" name="eposta" required></div>
    <div class="alan"><label>Geçici şifre (en az 8 karakter)</label><input type="text" name="sifre" required></div>
    <div class="alan">
      <label>Rol</label>
      <select name="rol">
        <option value="editor">Editör — yalnızca içerik</option>
        <option value="yonetici">Yönetici — her şey</option>
      </select>
    </div>
    <button class="btn btn--ana" type="submit">Kullanıcı ekle</button>
  </form>
</div>

<?php include __DIR__ . '/inc/alt.php'; ?>
