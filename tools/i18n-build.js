/**
 * Akdoğan Turizm — çeviri derleyici
 * =================================
 * Tek kaynak dosyası  tools/i18n-translations.json  içindeki
 *   { "text": { "<İngilizce>": { ru, ar, de } },
 *     "html": { "<İngilizce düz metin>": { ru, ar, de (HTML) } } }
 * yapısını okuyup çalışma zamanı sözlüklerini üretir:
 *   assets/i18n/ru.json , ar.json , de.json   →  { "t": {...}, "h": {...} }
 *
 * Ayrıca sayfalardaki data-en / data-l değerlerini tarayıp
 * hangi dizgelerin henüz çevrilmediğini raporlar.
 *
 *     node tools/i18n-build.js
 *
 * Yeni dil eklemek için: assets/i18n/languages.json'a kayıt ekleyin,
 * i18n-translations.json'daki her girdiye o dilin anahtarını yazın,
 * assets/css/style.css'e .flag--<bayrak> kuralı + bir bayrak SVG'si ekleyin.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(__dirname, "i18n-translations.json");
const OUT_DIR = path.join(ROOT, "assets", "i18n");

const TARGETS = ["ru", "ar", "de"];

const decode = (s) =>
  String(s).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
const norm = (s) => String(s).replace(/\s+/g, " ").trim();
const stripTags = (s) => norm(String(s).replace(/<[^>]*>/g, ""));

/* ---- 1. Kaynağı oku ---- */
const src = JSON.parse(fs.readFileSync(SRC, "utf8"));
const srcText = src.text || {};
const srcHtml = src.html || {};

/* ---- 2. Çalışma zamanı sözlüklerini yaz ---- */
for (const lang of TARGETS) {
  const t = {};
  const h = {};
  for (const [en, tr] of Object.entries(srcText)) {
    if (tr && tr[lang] != null && tr[lang] !== "") t[en] = tr[lang];
  }
  for (const [en, tr] of Object.entries(srcHtml)) {
    if (tr && tr[lang] != null && tr[lang] !== "") h[en] = tr[lang];
  }
  const file = path.join(OUT_DIR, lang + ".json");
  fs.writeFileSync(file, JSON.stringify({ t, h }, null, 1) + "\n", "utf8");
  console.log(`  ✓ assets/i18n/${lang}.json  —  ${Object.keys(t).length} metin, ${Object.keys(h).length} blok`);
}

/* ---- 3. Kapsam denetimi: sayfalarda geçen ama kaynakta olmayan dizgeler ---- */
const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
pages.push(path.join("_partials", "header.html"), path.join("_partials", "footer.html"));

const seenText = new Set();
const seenHtml = new Set();

for (const rel of pages) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  const html = fs.readFileSync(p, "utf8");
  for (const m of html.matchAll(/\sdata-en="([^"]*)"/g)) seenText.add(norm(decode(m[1])));
  for (const m of html.matchAll(/\sdata-en-[a-z-]+="([^"]*)"/g)) seenText.add(norm(decode(m[1])));
  const tm = html.match(/data-title-en="([^"]*)"/);
  if (tm) seenText.add(norm(decode(tm[1])));
  const re = /<(\w+)[^>]*\sdata-l="en"[^>]*>([\s\S]*?)<\/\1>/g;
  for (const m of html.matchAll(re)) seenHtml.add(stripTags(m[2]));
}

const missing = { text: [], html: [] };
for (const s of seenText) if (s && !(s in srcText)) missing.text.push(s);
for (const s of seenHtml) if (s && !(s in srcHtml)) missing.html.push(s);

const total = missing.text.length + missing.html.length;
if (total === 0) {
  console.log("\n  Tüm data-en / data-l dizgeleri kaynak dosyada mevcut. ✓");
} else {
  console.log(`\n  ⚠ Kaynakta eksik ${total} dizge (İngilizce anahtar):`);
  missing.text.sort().forEach((s) => console.log("   text  " + JSON.stringify(s)));
  missing.html.sort().forEach((s) => console.log("   html  " + JSON.stringify(s)));
}

/* ---- 4. Dil başına eksik çeviri sayısı ---- */
console.log("\n  Dil başına eksik çeviri (kaynak girdisi var ama o dil boş):");
for (const lang of TARGETS) {
  let n = 0;
  for (const v of Object.values(srcText)) if (!v || !v[lang]) n++;
  for (const v of Object.values(srcHtml)) if (!v || !v[lang]) n++;
  console.log(`   ${lang}: ${n}`);
}
