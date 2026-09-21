/* ==========================================================================
   Akdoğan Turizm — içerik köprüsü
   Yönetim panelinin ürettiği assets/data/site.json dosyasını okur ve
   sayfadaki data-cms* işaretli alanları günceller.
   Dosya yoksa / okunamazsa sayfa HTML'deki varsayılan içerikle çalışır.
   ========================================================================== */
(function () {
  "use strict";

  fetch("assets/data/site.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) { if (d && typeof d === "object") uygula(d); })
    .catch(function () {});

  function gercekDil() {
    return document.documentElement.getAttribute("lang") || "tr";
  }
  function dil() {
    return gercekDil() === "en" ? "en" : "tr";
  }
  /* site.json yalnızca tr/en içerir. Diğer dillerde çevrilebilir metinleri
     i18n katmanı (main.js · assets/i18n/<kod>.json) yönetir; burada CMS
     metnini yazmayıp öğeyi olduğu gibi bırakıyoruz. */
  function i18nDevri() {
    var d = gercekDil();
    return d !== "tr" && d !== "en";
  }
  function cift(obj, taban) {
    if (!obj) return "";
    var l = dil();
    return obj[taban + "_" + l] || obj[taban + "_tr"] || obj[l] || obj.tr || "";
  }
  function yaz(sec, deger) {
    document.querySelectorAll(sec).forEach(function (el) {
      if (deger != null && deger !== "") el.textContent = deger;
    });
  }
  function link(sec, href, metin) {
    document.querySelectorAll(sec).forEach(function (el) {
      if (href) el.setAttribute("href", href);
      if (metin != null && metin !== "") el.textContent = metin;
    });
  }
  function telHref(no) { return "tel:" + String(no || "").replace(/[^0-9+]/g, ""); }
  function waHref(no) {
    var s = String(no || "").replace(/[^0-9]/g, "");
    if (s.indexOf("0") === 0) s = "90" + s.slice(1);
    return "https://wa.me/" + s;
  }

  function uygula(d) {
    iletisim(d.iletisim || {}, d.sosyal || {});
    hizmetler(d.hizmetler || []);
    sayfaMetin(d.sayfalar || {});
    galeri(d.galeri || [], d.galeri_kategoriler || []);
    seoUygula(d.seo_sayfalar || {}, d.seo || {});
    marka(d.marka || {});
    menu(d.menu || {});
    bolumler(d.bolumler || {});
    genel(d.genel || {});
    gorunum(d.gorunum || {});
    gorseller(d.gorseller || {});
    // Dil değişince metne bağlı alanları tazele (main.js "akd:langchange" yayar)
    document.addEventListener("akd:langchange", function () {
      iletisim(d.iletisim || {}, d.sosyal || {});
      hizmetler(d.hizmetler || []);
      sayfaMetin(d.sayfalar || {});
      galeri(d.galeri || [], d.galeri_kategoriler || []);
      seoUygula(d.seo_sayfalar || {}, d.seo || {});
      menu(d.menu || {});
      bolumler(d.bolumler || {});
      genel(d.genel || {});
      gorunum(d.gorunum || {});
      gorseller(d.gorseller || {});
    });
  }

  /* ---- Sayfa bazlı SEO: başlık + meta açıklama + og:image ----
     Panelin "SEO & Sitemap" ekranından yönetilir. tr/en dışı dillerde
     İngilizce değer yedek olarak kullanılır. */
  function seoUygula(sayfalar, genel) {
    var ad = (location.pathname.split("/").pop() || "index.html");
    if (ad === "" || ad.indexOf(".") === -1) ad = "index.html";
    var s = sayfalar[ad] || {};
    var en = gercekDil() !== "tr";                       // tr değilse İngilizce/yedek
    var baslik = (en ? s.baslik_en || s.baslik_tr : s.baslik_tr) || "";
    var aciklama = (en ? s.aciklama_en || s.aciklama_tr : s.aciklama_tr) || "";

    if (!baslik && ad === "index.html") baslik = (en ? genel.baslik_en || genel.baslik_tr : genel.baslik_tr) || "";
    if (!aciklama && ad === "index.html") aciklama = (en ? genel.aciklama_en || genel.aciklama_tr : genel.aciklama_tr) || "";

    if (baslik) document.title = baslik;
    if (aciklama) metaYaz("name", "description", aciklama);
    if (s.og) metaYaz("property", "og:image", s.og);
    if (baslik) metaYaz("property", "og:title", baslik);
    if (aciklama) metaYaz("property", "og:description", aciklama);
  }
  function metaYaz(anahtar, ad, deger) {
    var m = document.head.querySelector("meta[" + anahtar + '="' + ad + '"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute(anahtar, ad);
      document.head.appendChild(m);
    }
    m.setAttribute("content", deger);
  }

  /* ---- İletişim & sosyal ---- */
  function iletisim(i, s) {
    if (i.telefon) {
      link('[data-cms="tel"]', telHref(i.telefon), i.telefon);
      document.querySelectorAll('[data-cms="tel-href"]').forEach(function (el) {
        el.setAttribute("href", telHref(i.telefon));
      });
    }
    if (i.gsm) link('[data-cms="gsm"]', telHref(i.gsm), i.gsm);
    if (i.eposta) link('[data-cms="eposta"]', "mailto:" + i.eposta, i.eposta);
    if (i.adres) yaz('[data-cms="adres"]', i.adres);
    if (!i18nDevri()) yaz('[data-cms="saatler"]', dil() === "en" ? i.saatler_en : i.saatler_tr);
    if (i.whatsapp) {
      document.querySelectorAll('[data-cms="whatsapp"]').forEach(function (el) {
        el.setAttribute("href", waHref(i.whatsapp));
      });
    }
    Object.keys(s || {}).forEach(function (ag) {
      if (!s[ag]) return;
      document.querySelectorAll('[data-cms-sosyal="' + ag + '"]').forEach(function (el) {
        el.setAttribute("href", s[ag]);
      });
    });
  }

  function marka(m) {
    if (!m.logo) return;
    document.querySelectorAll('[data-cms-logo]').forEach(function (el) { el.setAttribute('src', m.logo); });
  }

  function menu(m) {
    var dl = dil();
    document.querySelectorAll('[data-cms-menu]').forEach(function (el) {
      var item = m[el.getAttribute('data-cms-menu')];
      if (!item) return;
      if (item.href) el.setAttribute('href', item.href);
      if (item.aktif === false) el.hidden = true;
      var metin = dl === 'en' ? (item.en || item.tr) : item.tr;
      if (metin) el.textContent = metin;
    });
  }

  function bolumler(ayarlar) {
    document.querySelectorAll('[data-cms-bolum]').forEach(function (el) {
      var anahtar = el.getAttribute('data-cms-bolum');
      if (Object.prototype.hasOwnProperty.call(ayarlar, anahtar)) el.hidden = ayarlar[anahtar] === false;
    });
  }

  function genel(ayarlar) {
    var dl = dil();
    document.querySelectorAll('[data-cms-genel]').forEach(function (el) {
      var alan = el.getAttribute('data-cms-genel');
      var deger = dl === 'en' ? (ayarlar[alan + '_en'] || ayarlar[alan + '_tr']) : ayarlar[alan + '_tr'];
      if (deger) el.textContent = deger;
    });
  }

  function gorunum(ayarlar) {
    var root = document.documentElement;
    if (/^#[0-9a-f]{6}$/i.test(ayarlar.accent || '')) root.style.setProperty('--accent', ayarlar.accent);
    if (/^#[0-9a-f]{6}$/i.test(ayarlar.accent_dark || '')) root.style.setProperty('--accent-dark', ayarlar.accent_dark);
    if (Number.isFinite(Number(ayarlar.radius))) root.style.setProperty('--radius', Math.max(0, Math.min(24, Number(ayarlar.radius))) + 'px');
  }

  function gorseller(ayarlar) {
    document.querySelectorAll('[data-cms-gorsel]').forEach(function (el) {
      var yol = ayarlar[el.getAttribute('data-cms-gorsel')];
      if (yol) el.setAttribute('src', yol);
    });
  }

  /* ---- Hizmetler ---- */
  function hizmetler(liste) {
    liste.forEach(function (h) {
      var kok = document.querySelectorAll('[data-cms-hizmet="' + h.id + '"]');
      kok.forEach(function (el) {
        var dl = dil();
        var m = h[dl] && h[dl].baslik ? h[dl] : h.tr || {};
        // Metin alanları: tr/en dışındaki dillerde i18n katmanına bırakılır
        if (!i18nDevri()) {
          el.querySelectorAll('[data-cms-alan="baslik"]').forEach(function (x) { if (m.baslik) x.textContent = m.baslik; });
          el.querySelectorAll('[data-cms-alan="ozet"]').forEach(function (x) { if (m.ozet) x.textContent = m.ozet; });
          el.querySelectorAll('[data-cms-alan="detay"]').forEach(function (x) { if (m.detay) x.textContent = m.detay; });
        }
        el.querySelectorAll('[data-cms-alan="gorsel"]').forEach(function (x) {
          if (h.gorsel) x.setAttribute("src", h.gorsel);
        });
      });
    });
  }

  /* ---- Sayfa metinleri: data-cms-metin="anasayfa.hero_slogan" ---- */
  function sayfaMetin(sayfalar) {
    if (i18nDevri()) return;   // tr/en dışı: metni i18n katmanı yönetir
    document.querySelectorAll("[data-cms-metin]").forEach(function (el) {
      var yol = el.getAttribute("data-cms-metin").split(".");
      var s = sayfalar[yol[0]];
      var alan = s && s.alanlar ? s.alanlar[yol[1]] : null;
      if (!alan) return;
      var deger = dil() === "en" ? (alan.en || alan.tr) : alan.tr;
      if (deger) el.textContent = deger;
    });
  }

  /* ---- Galeri: grid'i JSON'dan yeniden kur ---- */
  function galeri(ogeler, kategoriler) {
    if (i18nDevri()) return;   // tr/en dışı: statik başlıkları i18n katmanı çevirir
    var grid = document.querySelector("[data-cms-galeri]");
    if (!grid || !ogeler.length) return;
    var dl = dil();

    grid.innerHTML = ogeler.map(function (g) {
      var bas = dl === "en" ? (g.baslik_en || g.baslik_tr) : g.baslik_tr;
      return (
        '<figure class="gallery__item" data-category="' + esc(g.kategori) + '">' +
          '<img class="media media--4-3" src="' + esc(g.dosya) + '" alt="' + esc(bas || "") + '" loading="lazy">' +
          (bas ? '<figcaption class="gallery__caption">' + esc(bas) + "</figcaption>" : "") +
        "</figure>"
      );
    }).join("");

    // Filtre butonlarını da güncelle (varsa)
    var filtre = document.querySelector(".filters");
    if (filtre && kategoriler.length) {
      var akt = "tumu";
      filtre.innerHTML =
        '<button class="filter-btn is-active" type="button" data-filter="tumu">' +
        (dl === "en" ? "All" : "Tümü") + "</button>" +
        kategoriler.map(function (k) {
          return '<button class="filter-btn" type="button" data-filter="' + esc(k.anahtar) + '">' +
            esc(dl === "en" ? k.ad_en : k.ad_tr) + "</button>";
        }).join("");
    }
    // main.js'in galeri/lightbox kurulumunu yeniden tetikle
    document.dispatchEvent(new CustomEvent("cms:galeri-hazir"));
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

})();
