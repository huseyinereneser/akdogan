/* ==========================================================================
   Akdoğan Turizm — arayüz etkileşimleri
   Bağımlılık yok, saf JavaScript.
   ========================================================================== */
(function () {
  "use strict";

  /* Belge kökü — dil/yön öznitelikleri burada güncellenir (12. bölüm). */
  var root = document.documentElement;

  /* ---- 0. Ortak yardımcılar -------------------------------------------
     Arapça'da sitedeki görünür rakamlar Arap-Hint biçiminde (٠-٩)
     gösterilir; diğer dillerde standart Latin rakamları kalır. `uiLang`
     seçili dil kodudur — 12. bölümdeki dil katmanı günceller, diğer
     bölümler yalnızca okur. */
  var uiLang = "tr";
  var ARAB_DIGITS = "٠١٢٣٤٥٦٧٨٩";
  function toArabicDigits(s) {
    return String(s).replace(/[0-9]/g, function (d) { return ARAB_DIGITS.charAt(+d); });
  }
  function toWesternDigits(s) {
    return String(s).replace(/[٠-٩]/g, function (d) {
      return String(d.charCodeAt(0) - 0x0660);
    });
  }

  /* ---- 1. Mobil menü ---------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var backdrop = document.querySelector(".nav-backdrop");

  function closeNav() {
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      if (backdrop) backdrop.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });

    if (backdrop) backdrop.addEventListener("click", closeNav);

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---- 2. Kaydırınca header gölgesi ------------------------------------- */
  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- 3. Görünüme girince yumuşak geçiş -------------------------------- */
  var revealTargets = document.querySelectorAll("[data-reveal]");
  if (revealTargets.length) {
    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var delay = parseInt(entry.target.getAttribute("data-reveal-delay") || "0", 10);
          setTimeout(function () {
            entry.target.classList.add("is-visible");
          }, delay);
          revealObserver.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

      revealTargets.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* ---- 4. Sayaç animasyonu (istatistik bandı) --------------------------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = formatTR(+el.getAttribute("data-count")); });
  }

  function formatTR(n) {
    var s = n.toLocaleString("tr-TR");
    return uiLang === "ar" ? toArabicDigits(s) : s;
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var duration = 1400;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatTR(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- 5+6. Galeri filtresi + ışık kutusu -----------------------------
     Fonksiyon olarak sarıldı; içerik köprüsü (icerik.js) galeriyi
     yeniden kurduğunda "cms:galeri-hazir" olayıyla tekrar bağlanır. */
  var lightbox = document.querySelector(".lightbox");
  var lbImg = lightbox ? lightbox.querySelector(".lightbox__img") : null;
  var lbTitle = lightbox ? lightbox.querySelector(".lightbox__title") : null;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  function galeriBagla() {
    var filterButtons = document.querySelectorAll(".filter-btn");
    var galleryItems = document.querySelectorAll(".gallery__item");
    if (!galleryItems.length) return;

    filterButtons.forEach(function (btn) {
      if (btn.__bagli) return;
      btn.__bagli = true;
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        document.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        document.querySelectorAll(".gallery__item").forEach(function (item) {
          var show = filter === "tumu" || item.getAttribute("data-category") === filter;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });

    galleryItems.forEach(function (item) {
      if (item.__bagli || !lightbox) return;
      item.__bagli = true;
      item.addEventListener("click", function () {
        var caption = item.querySelector(".gallery__caption");
        var img = item.querySelector("img");
        if (lbImg && img) { lbImg.src = img.currentSrc || img.src; lbImg.alt = img.alt || ""; }
        if (lbTitle) lbTitle.textContent = caption ? caption.textContent.trim() : "";
        lightbox.classList.add("is-open");
        document.body.classList.add("nav-open");
      });
    });
  }

  galeriBagla();
  document.addEventListener("cms:galeri-hazir", galeriBagla);

  if (lightbox) {
    var lbClose = lightbox.querySelector(".lightbox__close");
    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });
  }

  /* ---- 7. SSS akordiyonu ------------------------------------------------ */
  document.querySelectorAll(".faq__q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq__item");
      var answer = item.querySelector(".faq__a");
      var isOpen = item.classList.contains("is-open");

      item.classList.toggle("is-open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
    });
  });

  /* ---- 8. Formlar ------------------------------------------------------
     İstemci doğrulaması + gonder.php'ye AJAX gönderim. Betik yüklenmezse
     form normal (sayfa yenilemeli) POST yapar; gonder.php JS'siz gönderimi
     tesekkurler.html'e yönlendirerek karşılar.
     ---------------------------------------------------------------------- */
  document.querySelectorAll("form[data-validate]").forEach(function (form) {
    var okBox = form.querySelector(".form-status--ok");
    var errBox = form.querySelector(".form-status--error");
    var submitBtn = form.querySelector('[type="submit"]');
    var busy = false;

    form.setAttribute("novalidate", "novalidate");

    function showStatus(box, text) {
      [okBox, errBox].forEach(function (b) { if (b) b.classList.remove("is-visible"); });
      if (!box) return;
      if (text) box.textContent = text;
      box.classList.add("is-visible");
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    form.addEventListener("submit", function (e) {
      if (busy) { e.preventDefault(); return; }

      var valid = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var value = input.value.trim();
        var ok = value !== "";
        if (ok && input.type === "email") {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        }
        if (ok && input.type === "tel") {
          ok = value.replace(/\D/g, "").length >= 10;
        }
        if (field) field.classList.toggle("has-error", !ok);
        if (!ok && valid && input.focus) input.focus();
        if (!ok) valid = false;
      });

      var oversize = form.querySelector(".filefield[data-oversize]");
      if (oversize) {
        valid = false;
        oversize.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      if (!valid) { e.preventDefault(); return; }

      // fetch yoksa: tarayıcı normal POST yapsın (gonder.php yönlendirir)
      if (!window.fetch || !window.FormData) return;

      e.preventDefault();
      busy = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("is-loading");
      }

      var data = new FormData(form);
      data.set("ajax", "1");

      fetch(form.getAttribute("action") || "gonder.php", {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      })
        .then(function (r) {
          return r.json().catch(function () { return { ok: false }; });
        })
        .then(function (res) {
          if (res && res.ok === true) {
            form.reset();
            form.querySelectorAll(".filefield__list").forEach(function (l) { l.innerHTML = ""; });
            form.querySelectorAll(".filefield[data-oversize]").forEach(function (f) {
              f.removeAttribute("data-oversize");
            });
            showStatus(okBox);
          } else {
            showStatus(errBox, res && res.mesaj);
          }
        })
        .catch(function () {
          showStatus(errBox);
        })
        .then(function () {
          busy = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove("is-loading");
          }
        });
    });

    form.querySelectorAll("input, textarea, select").forEach(function (input) {
      var clear = function () {
        var field = input.closest(".field");
        if (field) field.classList.remove("has-error");
      };
      input.addEventListener("input", clear);
      input.addEventListener("change", clear);
    });
  });

  /* ---- 9. Koşullu alanlar ("Diğer" seçilince açılan kutu) ----------------
     Kullanımı:
       <select data-toggle-target="#alan-id" data-toggle-value="Diğer">
       <div class="field field--conditional" id="alan-id" hidden> ... </div>
     Alan görünürken içindeki girdi otomatik olarak zorunlu hale gelir.
     ---------------------------------------------------------------------- */
  document.querySelectorAll("select[data-toggle-target]").forEach(function (select) {
    var target = document.querySelector(select.getAttribute("data-toggle-target"));
    if (!target) return;

    var trigger = select.getAttribute("data-toggle-value");
    var input = target.querySelector("input, textarea");

    function update() {
      var show = select.value === trigger;
      target.hidden = !show;

      if (!input) return;
      if (show) {
        input.setAttribute("required", "required");
      } else {
        input.removeAttribute("required");
        input.value = "";
        target.classList.remove("has-error");
      }
    }

    select.addEventListener("change", update);
    update();
  });

  /* ---- 10. Dosya ekleme alanı --------------------------------------------
     Sürükle-bırak, dosya listesi ve boyut kontrolü.

     ÖNEMLİ: Dosya seçmek tek başına yeterli değildir — dosyanın size
     ulaşabilmesi için formun sunucu tarafı bir servise bağlanması gerekir
     (bkz. aşağıdaki 11. bölümdeki TODO). Şu anki haliyle dosya yalnızca
     tarayıcıda seçili görünür, hiçbir yere gönderilmez.
     ---------------------------------------------------------------------- */
  var MAX_TOTAL_BYTES = 10 * 1024 * 1024; // 10 MB

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1).replace(".", ",") + " MB";
  }

  document.querySelectorAll(".filefield").forEach(function (wrap) {
    var input = wrap.querySelector('input[type="file"]');
    var drop = wrap.querySelector(".filefield__drop");
    var list = wrap.querySelector(".filefield__list");
    var msg = wrap.querySelector(".filefield__msg");
    if (!input || !list) return;

    var canRebuild = typeof DataTransfer !== "undefined";

    function setMessage(text) {
      if (!msg) return;
      msg.textContent = text || "";
      msg.classList.toggle("is-visible", Boolean(text));
    }

    function removeAt(index) {
      if (!canRebuild) {
        input.value = "";
      } else {
        var dt = new DataTransfer();
        Array.prototype.forEach.call(input.files, function (file, i) {
          if (i !== index) dt.items.add(file);
        });
        input.files = dt.files;
      }
      render();
    }

    function render() {
      list.innerHTML = "";
      var total = 0;

      Array.prototype.forEach.call(input.files, function (file, i) {
        total += file.size;

        var item = document.createElement("li");
        item.className = "filefield__item";

        var name = document.createElement("span");
        name.className = "filefield__name";
        name.textContent = file.name;

        var size = document.createElement("span");
        size.className = "filefield__size";
        size.textContent = formatSize(file.size);

        var remove = document.createElement("button");
        remove.type = "button";
        remove.className = "filefield__remove";
        remove.innerHTML = "&times;";
        remove.setAttribute("aria-label", file.name + " dosyasını kaldır");
        remove.addEventListener("click", function () { removeAt(i); });

        item.appendChild(name);
        item.appendChild(size);
        item.appendChild(remove);
        list.appendChild(item);
      });

      if (total > MAX_TOTAL_BYTES) {
        setMessage(
          "Toplam dosya boyutu " + formatSize(total) + ". En fazla 10 MB " +
          "ekleyebilirsiniz; lütfen bazı dosyaları kaldırın."
        );
        wrap.setAttribute("data-oversize", "true");
      } else {
        setMessage("");
        wrap.removeAttribute("data-oversize");
      }
    }

    input.addEventListener("change", render);

    if (drop && canRebuild) {
      ["dragenter", "dragover"].forEach(function (evt) {
        drop.addEventListener(evt, function (e) {
          e.preventDefault();
          drop.classList.add("is-dragging");
        });
      });
      ["dragleave", "drop"].forEach(function (evt) {
        drop.addEventListener(evt, function (e) {
          e.preventDefault();
          drop.classList.remove("is-dragging");
        });
      });
      drop.addEventListener("drop", function (e) {
        if (!e.dataTransfer || !e.dataTransfer.files.length) return;
        var dt = new DataTransfer();
        Array.prototype.forEach.call(input.files, function (f) { dt.items.add(f); });
        Array.prototype.forEach.call(e.dataTransfer.files, function (f) { dt.items.add(f); });
        input.files = dt.files;
        render();
      });
    }
  });

  /* ---- 12. Dil — çok dilli açılır menü ---------------------------------
     Diller assets/i18n/languages.json ile tanımlanır. tr = sayfadaki
     varsayılan metin; en = data-en / data-en-<öznitelik> öznitelikleri;
     diğer diller assets/i18n/<kod>.json sözlüğünden (İngilizce anahtarla)
     okunur. Çift içerikli [data-l] blokları tek kaba indirgenip aynı
     sözlükten (h) doldurulur. Seçim localStorage'da "akd-lang" + "akd-dir"
     ile saklanır; <head>'deki boot betiği ilk boyamadan önce uygular.
     -------------------------------------------------------------------- */
  var LANG_KEY = "akd-lang", DIR_KEY = "akd-dir";
  var ATTR_KEYS = ["placeholder", "aria-label", "alt", "title", "content", "data-label"];

  var FALLBACK_LANGS = [
    { kod: "tr", kisa: "TR", ad: "Türkçe",  adEn: "Turkish", yon: "ltr", bayrak: "tr", htmlLang: "tr" },
    { kod: "en", kisa: "EN", ad: "English",  adEn: "English", yon: "ltr", bayrak: "gb", htmlLang: "en" },
    { kod: "ru", kisa: "RU", ad: "Русский",  adEn: "Russian", yon: "ltr", bayrak: "ru", htmlLang: "ru" },
    { kod: "ar", kisa: "AR", ad: "العربية",  adEn: "Arabic",  yon: "rtl", bayrak: "sa", htmlLang: "ar" },
    { kod: "de", kisa: "DE", ad: "Deutsch",  adEn: "German",  yon: "ltr", bayrak: "de", htmlLang: "de" }
  ];

  var langList = FALLBACK_LANGS, defaultLang = "tr";
  var dicts = {};                 // dicts[kod] = { t:{}, h:{} }
  var lblGroups = [];             // [data-l] grupları (tek kaba indirilmiş)
  var menuWrap = document.querySelector("[data-lang-menu]");
  var menuToggle = menuWrap ? menuWrap.querySelector(".lang-menu__toggle") : null;
  var menuListEl = menuWrap ? menuWrap.querySelector(".lang-menu__list") : null;
  var arabicFontAdded = false;

  /* --- Rakam yerelleştirme (yalnızca Arapça) --------------------------
     Arapça seçilince görünür Batı rakamları (0-9) Arap-Hint rakamlarına
     (٠-٩) çevrilir; başka dile dönülünce geri alınır. Yalnızca metin
     düğümleri değişir — href/src/value gibi öznitelikler ve tel:/mailto:
     bağlantıları olduğu gibi kalır (numaranın kendisi bozulmaz, yalnızca
     görünümü değişir). Bir öğeyi dışta tutmak için: data-digits="keep". */
  function localizeDigits(s, code) {
    return (code || uiLang) === "ar" ? toArabicDigits(s) : toWesternDigits(s);
  }
  function digitsSkip(node) {
    for (var p = node.parentNode; p && p.nodeType === 1; p = p.parentNode) {
      var t = p.nodeName;
      if (t === "SCRIPT" || t === "STYLE" || t === "NOSCRIPT" || t === "TEXTAREA") return true;
      if (p.getAttribute && p.getAttribute("data-digits") === "keep") return true;
    }
    return false;
  }
  function relocalizeNode(node, toArabic) {
    var v = node.nodeValue;
    if (!v || !(toArabic ? /[0-9]/ : /[٠-٩]/).test(v) || digitsSkip(node)) return;
    var next = toArabic ? toArabicDigits(v) : toWesternDigits(v);
    if (next !== v) node.nodeValue = next;   // yalnızca gerçekten değişince yaz (gözlemci döngüsünü önler)
  }
  function relocalizeTree(rootNode, toArabic) {
    if (!rootNode) return;
    if (rootNode.nodeType === 3) { relocalizeNode(rootNode, toArabic); return; }
    if (rootNode.nodeType !== 1 || !document.createTreeWalker) return;
    var w = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT, null);
    for (var n = w.nextNode(); n; n = w.nextNode()) relocalizeNode(n, toArabic);
  }
  /* Dil değişiminden sonra eklenen/değişen metinleri de (CMS köprüsü,
     sayaç animasyonu, dosya listesi…) Arapça'da çevir. */
  var digitsObserver = typeof MutationObserver === "function" ? new MutationObserver(function (list) {
    if (uiLang !== "ar") return;
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (m.type === "characterData") relocalizeNode(m.target, true);
      else for (var j = 0; j < m.addedNodes.length; j++) relocalizeTree(m.addedNodes[j], true);
    }
  }) : null;
  function watchDigits() {
    if (digitsObserver && document.body) {
      digitsObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  }

  function langByCode(code) {
    for (var i = 0; i < langList.length; i++) if (langList[i].kod === code) return langList[i];
    return null;
  }
  function stripText(html) {
    return String(html == null ? "" : html).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  }
  function dictOf(code) { return dicts[code] || { t: {}, h: {} }; }

  function pickText(enKey, code, fallbackTr) {
    if (code === "tr") return fallbackTr;
    if (enKey == null) return fallbackTr;
    if (code === "en") return enKey;
    return dictOf(code).t[enKey] || enKey;   // çeviri yoksa İngilizce'ye düş
  }

  /* [data-l="tr"] / [data-l="en"] kardeş bloklarını tek kaba indir:
     tr kabı kalır, diğerleri kaldırılır; seçili dilin HTML'i kaba yazılır. */
  (function collectBlocks() {
    document.querySelectorAll('[data-l="tr"]').forEach(function (host) {
      var group = { host: host, tr: host.innerHTML, en: null, key: "" };
      if (host.parentNode) {
        Array.prototype.slice.call(host.parentNode.querySelectorAll("[data-l]")).forEach(function (el) {
          if (el === host) return;
          if (el.getAttribute("data-l") === "en") group.en = el.innerHTML;
          if (el.parentNode) el.parentNode.removeChild(el);
        });
      }
      group.key = stripText(group.en != null ? group.en : group.tr);
      host.style.display = "contents";
      lblGroups.push(group);
    });
  })();

  function applyLang(code, persist) {
    var meta = langByCode(code) || langByCode(defaultLang) || FALLBACK_LANGS[0];
    code = meta.kod;
    root.setAttribute("lang", meta.htmlLang || code);
    root.setAttribute("dir", meta.yon === "rtl" ? "rtl" : "ltr");

    document.querySelectorAll("[data-en]").forEach(function (el) {
      if (el.__tr == null) el.__tr = el.textContent;
      el.textContent = pickText(el.getAttribute("data-en"), code, el.__tr);
    });

    ATTR_KEYS.forEach(function (attr) {
      document.querySelectorAll("[data-en-" + attr + "]").forEach(function (el) {
        var cache = "__tr_" + attr;
        if (el[cache] == null) el[cache] = el.getAttribute(attr) || "";
        el.setAttribute(attr, pickText(el.getAttribute("data-en-" + attr), code, el[cache]));
      });
    });

    lblGroups.forEach(function (g) {
      var html = code === "tr" ? g.tr
        : code === "en" ? (g.en != null ? g.en : g.tr)
        : (dictOf(code).h[g.key] || (g.en != null ? g.en : g.tr));
      if (g.host.__cur !== html) { g.host.innerHTML = html; g.host.__cur = html; }
      g.host.style.display = "contents";
    });

    var titleEl = document.querySelector("title");
    if (titleEl) {
      if (titleEl.__tr == null) titleEl.__tr = titleEl.textContent;
      titleEl.textContent = localizeDigits(pickText(root.getAttribute("data-title-en"), code, titleEl.__tr), code);
    }

    // Rakamlar: Arapça'ya geçince Arap-Hint'e çevir, Arapça'dan çıkınca geri al.
    var wasArabic = uiLang === "ar";
    uiLang = code;
    if (code === "ar") relocalizeTree(document.body, true);
    else if (wasArabic) relocalizeTree(document.body, false);

    updateMenu(meta);
    if (meta.yon === "rtl") ensureArabicFont();

    if (persist) {
      try {
        localStorage.setItem(LANG_KEY, code);
        localStorage.setItem(DIR_KEY, meta.yon === "rtl" ? "rtl" : "ltr");
      } catch (e) {}
    }
    document.dispatchEvent(new CustomEvent("akd:langchange", { detail: { lang: code, dir: meta.yon || "ltr" } }));
  }

  function ensureDict(code, cb) {
    if (code === "tr" || code === "en" || dicts[code]) { cb(); return; }
    fetch("assets/i18n/" + code + ".json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { dicts[code] = { t: (d && d.t) || {}, h: (d && d.h) || {} }; cb(); })
      .catch(function () { dicts[code] = { t: {}, h: {} }; cb(); });
  }
  function setLang(code, persist) {
    ensureDict(code, function () { applyLang(code, persist); });
  }

  function ensureArabicFont() {
    if (arabicFontAdded) return;
    arabicFontAdded = true;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;700&display=swap";
    document.head.appendChild(l);
  }

  /* --- Açılır menü davranışı --- */
  function buildMenu() {
    if (!menuListEl) return;
    // Açılır listede diller İngilizce tam adlarıyla (Turkish, English…) görünür;
    // navbar'daki kapalı düğme kısaltmayı (TR, EN…) gösterir — bkz. updateMenu.
    menuListEl.innerHTML = langList.map(function (l) {
      return '<li role="option" class="lang-menu__option" data-lang-select="' + l.kod +
        '" aria-selected="false" tabindex="-1">' +
        '<span class="flag flag--' + (l.bayrak || l.kod) + '" aria-hidden="true"></span>' +
        '<span class="lang-menu__name">' + (l.adEn || l.kisa || l.kod.toUpperCase()) + "</span></li>";
    }).join("");
    menuListEl.querySelectorAll(".lang-menu__option").forEach(function (opt) {
      opt.addEventListener("click", function () {
        setLang(opt.getAttribute("data-lang-select"), true);
        closeMenu(true);
      });
    });
  }
  function updateMenu(meta) {
    if (menuWrap) {
      var f = menuWrap.querySelector("[data-lang-flag]");
      var c = menuWrap.querySelector("[data-lang-code]");
      if (f) f.className = "flag flag--" + (meta.bayrak || meta.kod);
      if (c) c.textContent = meta.kisa || meta.kod.toUpperCase();
    }
    if (menuListEl) {
      menuListEl.querySelectorAll(".lang-menu__option").forEach(function (opt) {
        opt.setAttribute("aria-selected", String(opt.getAttribute("data-lang-select") === meta.kod));
      });
    }
  }
  function openMenu(noFocus) {
    if (!menuListEl || !menuToggle) return;
    menuListEl.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    document.addEventListener("click", onDocClick, true);
    document.addEventListener("keydown", onMenuKey);
    // Hover ile açılışta odağı seçenekler çalmasın (sayfa zıplamasın); yalnızca
    // tıklama/klavye ile açılışta ilk/geçerli seçeneğe odaklan.
    if (!noFocus) {
      var sel = menuListEl.querySelector('[aria-selected="true"]') || menuListEl.firstElementChild;
      if (sel) sel.focus();
    }
  }
  function closeMenu(focusToggle) {
    if (!menuListEl || !menuToggle) return;
    menuListEl.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", onDocClick, true);
    document.removeEventListener("keydown", onMenuKey);
    if (focusToggle) menuToggle.focus();
  }
  function onDocClick(e) { if (menuWrap && !menuWrap.contains(e.target)) closeMenu(false); }
  function onMenuKey(e) {
    if (!menuListEl || menuListEl.hidden) return;
    var opts = Array.prototype.slice.call(menuListEl.querySelectorAll(".lang-menu__option"));
    var idx = opts.indexOf(document.activeElement);
    if (e.key === "Escape") closeMenu(true);
    else if (e.key === "ArrowDown") { e.preventDefault(); (opts[idx + 1] || opts[0]).focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); (opts[idx - 1] || opts[opts.length - 1]).focus(); }
    else if (e.key === "Home") { e.preventDefault(); opts[0].focus(); }
    else if (e.key === "End") { e.preventDefault(); opts[opts.length - 1].focus(); }
    else if ((e.key === "Enter" || e.key === " ") && idx > -1) {
      e.preventDefault();
      setLang(opts[idx].getAttribute("data-lang-select"), true);
      closeMenu(true);
    }
  }
  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (menuListEl && menuListEl.hidden) openMenu(); else closeMenu(false);
    });
  }

  /* --- Fare ile üzerine gelince aç / ayrılınca kapat --- */
  if (menuWrap && menuToggle) {
    var hoverCloseTimer = null;
    var cancelHoverClose = function () {
      if (hoverCloseTimer) { clearTimeout(hoverCloseTimer); hoverCloseTimer = null; }
    };
    menuWrap.addEventListener("mouseenter", function () {
      cancelHoverClose();
      if (menuListEl && menuListEl.hidden) openMenu(true);
    });
    menuWrap.addEventListener("mouseleave", function () {
      cancelHoverClose();
      // Kısa gecikme: menü ile düğme arasındaki boşlukta gezinmeye tolerans.
      hoverCloseTimer = setTimeout(function () {
        if (menuListEl && !menuListEl.hidden) closeMenu(false);
      }, 180);
    });
  }

  /* --- Başlat --- */
  var storedLang = null;
  try { storedLang = localStorage.getItem(LANG_KEY); } catch (e) {}

  buildMenu();
  watchDigits();
  setLang(langByCode(storedLang) ? storedLang : defaultLang, false);

  fetch("assets/i18n/languages.json", { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (cfg) {
      if (cfg && cfg.diller && cfg.diller.length) {
        langList = cfg.diller;
        defaultLang = cfg.varsayilan || langList[0].kod;
        buildMenu();
        setLang(langByCode(storedLang) ? storedLang : defaultLang, false);
      }
    })
    .catch(function () {});

  /* ---- 13. Footer yılı --------------------------------------------------- */
  var year = String(new Date().getFullYear());
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = year;
  });
})();
