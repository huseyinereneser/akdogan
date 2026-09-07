/**
 * Akdoğan Turizm — header / footer senkronizasyon aracı
 * ====================================================
 *
 * Site 15 sayfadan oluşuyor ve hepsinde aynı header ile footer var.
 * Bunları tek tek elle güncellemek yerine `_partials/` klasöründeki iki
 * dosyayı düzenleyin ve bu betiği çalıştırın:
 *
 *     node tools/sync-partials.js
 *
 * Betik her sayfadaki
 *     <!-- #HEADER --> ... <!-- /#HEADER -->
 *     <!-- #FOOTER --> ... <!-- /#FOOTER -->
 * bloklarının içini partial dosyalarıyla değiştirir ve menüde bulunduğunuz
 * sayfayı otomatik olarak "is-active" ile işaretler.
 *
 * Not: Bu bir derleme adımı DEĞİLDİR. Sayfalar her zaman tam ve statik HTML
 * olarak kalır; betiği çalıştırmasanız da site çalışır.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

/* Hangi sayfa hangi üst menü başlığının altında yer alıyor?
   (Alt sayfadayken üst başlık da vurgulansın diye.) */
const PARENT_OF = {
  "hakkimizda.html": "Kurumsal",
  "kadromuz.html": "Kurumsal",
  "belgeler.html": "Kurumsal",
  "hesap-numaralarimiz.html": "Kurumsal",
  "kvkk.html": "Kurumsal",
  "galeri.html": "Medya",
  "videolar.html": "Medya",
  "haberler.html": "Medya",
  "yorumlar.html": "Medya",
  "iletisim.html": "İletişim",
  "insan-kaynaklari.html": "İletişim",
};

const read = (p) => fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n").trim();

const header = read(path.join(ROOT, "_partials", "header.html"));
const footer = read(path.join(ROOT, "_partials", "footer.html"));
const boot = read(path.join(ROOT, "_partials", "boot.html"));

/** Bir <a ...> etiketine sınıf ekler. */
function addClass(tag, cls) {
  if (/class="/.test(tag)) {
    return tag.replace(/class="([^"]*)"/, (m, c) =>
      c.split(/\s+/).includes(cls) ? m : `class="${c} ${cls}"`
    );
  }
  return tag.replace(/^<a\b/, `<a class="${cls}"`);
}

/** Header içindeki menüde geçerli sayfayı işaretler. */
function markActive(html, file) {
  const navStart = html.indexOf('<nav class="nav"');
  const navEnd = html.indexOf("</nav>", navStart);
  if (navStart === -1 || navEnd === -1) return html;

  let nav = html.slice(navStart, navEnd);

  // Önce eski işaretleri temizle (betik tekrar tekrar çalıştırılabilsin diye)
  nav = nav.replace(/\s*\bis-active\b/g, "");

  // 1) Tam eşleşen bağlantılar
  nav = nav.replace(/<a\b[^>]*>/g, (tag) => {
    const href = (tag.match(/href="([^"]*)"/) || [])[1];
    return href === file ? addClass(tag, "is-active") : tag;
  });

  // 2) Alt sayfadaysak üst menü başlığını da işaretle
  const parent = PARENT_OF[file];
  if (parent) {
    const re = new RegExp(`(<a\\b[^>]*class="nav__link"[^>]*>)(\\s*${parent}\\s*)(</a>)`);
    nav = nav.replace(re, (m, tag, text, close) => addClass(tag, "is-active") + text + close);
  }

  return html.slice(0, navStart) + nav + html.slice(navEnd);
}

/** Bir bloğu markerlar arasına yazar; marker yoksa eski bloğu bulup ekler. */
function inject(html, name, content, legacyPattern) {
  const open = `<!-- #${name} -->`;
  const close = `<!-- /#${name} -->`;
  const block = `${open}\n${content}\n${close}`;

  const markerRe = new RegExp(
    `<!-- #${name} -->[\\s\\S]*?<!-- /#${name} -->`
  );

  if (markerRe.test(html)) return html.replace(markerRe, block);
  if (legacyPattern && legacyPattern.test(html)) return html.replace(legacyPattern, block);

  console.warn(`  ! ${name} bloğu bulunamadı, atlandı`);
  return html;
}

const LEGACY_HEADER = /<div class="topbar">[\s\S]*?<div class="nav-backdrop"><\/div>/;
const LEGACY_FOOTER = /<footer class="footer">[\s\S]*?Hemen Ara\s*<\/a>/;

const files = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith(".html"));

let changed = 0;

for (const file of files) {
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, "utf8");

  let html = before;

  // <head> içindeki tema/dil boot betiği
  if (/<!-- #BOOT -->[\s\S]*?<!-- \/#BOOT -->/.test(html)) {
    html = html.replace(/<!-- #BOOT -->[\s\S]*?<!-- \/#BOOT -->/, boot);
  } else {
    html = html.replace(
      /(<meta name="viewport"[^>]*>\n)/,
      `$1${boot}\n`
    );
  }

  html = inject(html, "HEADER", markActive(header, file), LEGACY_HEADER);
  html = inject(html, "FOOTER", footer, LEGACY_FOOTER);

  if (html !== before) {
    fs.writeFileSync(full, html, "utf8");
    changed++;
    console.log(`  ✓ ${file}`);
  } else {
    console.log(`  – ${file} (değişiklik yok)`);
  }
}

console.log(`\n${changed} sayfa güncellendi.`);
