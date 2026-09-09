/* Akdoğan Turizm — panel arayüz betiği (bağımlılık yok) */
(function () {
  "use strict";

  /* --- Girişte şifreyi göster/gizle (CSP: satır içi script yerine) --- */
  document.querySelectorAll(".sifre-goster").forEach(function (dugme) {
    dugme.addEventListener("click", function () {
      var sifre = document.getElementById(dugme.getAttribute("aria-controls"));
      if (!sifre) return;
      var gorunur = sifre.type === "text";
      sifre.type = gorunur ? "password" : "text";
      dugme.setAttribute("aria-label", gorunur ? "Şifreyi göster" : "Şifreyi gizle");
      dugme.setAttribute("title", gorunur ? "Şifreyi göster" : "Şifreyi gizle");
      dugme.classList.toggle("is-acik", !gorunur);
    });
  });

  /* --- Kenar menü aç/kapa (CSP: satır içi onclick yerine) --- */
  var menuBtn = document.getElementById("menuAc");
  if (menuBtn) {
    var yan = document.querySelector(".yan");
    var ortu = null;

    function menuKapat() {
      document.body.classList.remove("menu-acik");
      menuBtn.setAttribute("aria-expanded", "false");
      if (ortu) ortu.classList.remove("gorunur");
    }
    function menuAc() {
      if (!ortu) {
        ortu = document.createElement("div");
        ortu.className = "yan-ortu";
        ortu.addEventListener("click", menuKapat);
        document.body.appendChild(ortu);
      }
      document.body.classList.add("menu-acik");
      menuBtn.setAttribute("aria-expanded", "true");
      ortu.classList.add("gorunur");
    }

    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.addEventListener("click", function () {
      if (document.body.classList.contains("menu-acik")) menuKapat();
      else menuAc();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") menuKapat();
    });
    // Menüden bir bağlantıya tıklanınca panel kapansın (mobil).
    if (yan) {
      yan.addEventListener("click", function (e) {
        if (e.target.closest("a")) menuKapat();
      });
    }
  }

  /* --- Değişince ait olduğu formu gönder (CSP: satır içi onchange yerine) --- */
  document.querySelectorAll("[data-otomatik-gonder]").forEach(function (el) {
    el.addEventListener("change", function () {
      if (el.form) el.form.submit();
    });
  });

  /* --- Tıklayınca içeriği seç (2FA kurulum anahtarı vb.) --- */
  document.querySelectorAll("[data-tiklayinca-sec]").forEach(function (el) {
    el.addEventListener("focus", function () { el.select(); });
    el.addEventListener("click", function () { el.select(); });
  });

  /* --- Silme / tehlikeli işlem onayı --- */
  document.addEventListener("submit", function (e) {
    var f = e.target;
    var soru = f.getAttribute("data-onay");
    if (soru && !window.confirm(soru)) e.preventDefault();
  });
  document.querySelectorAll("[data-onay-link]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (!window.confirm(a.getAttribute("data-onay-link"))) e.preventDefault();
    });
  });

  /* --- TR / EN sekmeleri --- */
  document.querySelectorAll(".sekmeler").forEach(function (bar) {
    var grup = bar.getAttribute("data-grup") || "";
    bar.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var hedef = btn.getAttribute("data-sekme");
        bar.querySelectorAll("button").forEach(function (b) { b.classList.toggle("aktif", b === btn); });
        document.querySelectorAll('.sekme-govde[data-grup="' + grup + '"]').forEach(function (g) {
          g.classList.toggle("aktif", g.getAttribute("data-sekme") === hedef);
        });
      });
    });
  });

  /* --- Sürükle-bırak sıralama --- */
  document.querySelectorAll(".siralanabilir").forEach(function (liste) {
    var suruklenen = null;
    liste.querySelectorAll(".oge").forEach(function (oge) {
      oge.setAttribute("draggable", "true");
      oge.addEventListener("dragstart", function () {
        suruklenen = oge;
        setTimeout(function () { oge.classList.add("suruklenen"); }, 0);
      });
      oge.addEventListener("dragend", function () {
        oge.classList.remove("suruklenen");
        guncelleSira(liste);
      });
      oge.addEventListener("dragover", function (e) {
        e.preventDefault();
        var sonrasi = altKomsu(liste, e.clientY);
        if (!suruklenen) return;
        if (sonrasi == null) liste.appendChild(suruklenen);
        else liste.insertBefore(suruklenen, sonrasi);
      });
    });
  });

  function altKomsu(liste, y) {
    var ogeler = [].slice.call(liste.querySelectorAll(".oge:not(.suruklenen)"));
    return ogeler.reduce(function (yakin, oge) {
      var kutu = oge.getBoundingClientRect();
      var fark = y - kutu.top - kutu.height / 2;
      if (fark < 0 && fark > yakin.fark) return { fark: fark, oge: oge };
      return yakin;
    }, { fark: -Infinity, oge: null }).oge;
  }

  function guncelleSira(liste) {
    liste.querySelectorAll(".oge").forEach(function (oge, i) {
      var alan = oge.querySelector('input[data-sira]');
      if (alan) alan.value = i + 1;
    });
  }

  /* --- Çok alanlı formu tek JSON alanına topla (PHP max_input_vars sınırını aşar) ---
     <form data-json-topla> içinde bir <input data-json-hedef> bulunmalı. Sunucu YALNIZCA
     bu JSON alanını okur; kalan alanlar gönderilse de yok sayılır. Bu alan formda erken
     yer aldığından max_input_vars kırpması onu etkilemez. */
  document.querySelectorAll("form[data-json-topla]").forEach(function (form) {
    var hedef = form.querySelector("[data-json-hedef]");
    if (!hedef) return;
    form.addEventListener("submit", function () {
      var veri = {};
      form.querySelectorAll("input[name], select[name], textarea[name]").forEach(function (el) {
        if (el === hedef || el.type === "hidden" || el.hasAttribute("data-json-atla")) return;
        var n = el.getAttribute("name");
        if (el.type === "checkbox" || el.type === "radio") {
          if (el.checked) veri[n] = el.value;
        } else {
          veri[n] = el.value;
        }
      });
      hedef.value = JSON.stringify(veri);
    });
  });

  /* --- Ücretsiz yerel LibreTranslate ile TR -> EN --- */
  document.querySelectorAll("[data-ceviri-butonu]").forEach(function (dugme) {
    dugme.addEventListener("click", async function () {
      var alan = dugme.closest(".ceviri-alani") || dugme.closest("form");
      if (!alan) return;
      var kaynaklar = [].slice.call(alan.querySelectorAll("[data-ceviri-kaynak]"));
      var hedefler = [].slice.call(alan.querySelectorAll("[data-ceviri-hedef]"));
      if (!kaynaklar.length) {
        kaynaklar = [].slice.call(alan.querySelectorAll('[name^="tr_"]'));
        hedefler = [].slice.call(alan.querySelectorAll('[name^="en_"]'));
      }
      if (!kaynaklar.length || kaynaklar.length !== hedefler.length) return;
      if (!kaynaklar.some(function (el) { return el.value.trim() !== ""; })) { alert("Önce Türkçe metni girin."); return; }
      var csrf = (alan.closest("form") || document).querySelector('input[name="csrf"]');
      dugme.classList.add("is-loading"); dugme.textContent = "Çevriliyor…";
      try {
        var veri = new URLSearchParams(); veri.set("csrf", csrf ? csrf.value : ""); veri.set("hedef", "en");
        kaynaklar.forEach(function (el) { veri.append("metinler[]", el.value); });
        var cevap = await fetch("cevir.php", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: veri.toString() });
        var json = await cevap.json();
        if (!cevap.ok || !json.ok) throw new Error(json.hata || "Çeviri yapılamadı.");
        json.ceviriler.forEach(function (metin, i) { hedefler[i].value = metin; });
        var mesaj = document.createElement("p"); mesaj.className = "ceviri-mesaj"; mesaj.textContent = "İngilizce alanlar dolduruldu. Kontrol edip kaydetmeyi unutmayın.";
        alan.parentNode.insertBefore(mesaj, alan); setTimeout(function () { mesaj.remove(); }, 5000);
      } catch (hata) { alert(hata.message || "Çeviri yapılamadı."); }
      finally { dugme.classList.remove("is-loading"); dugme.textContent = "TR → EN"; }
    });
  });

  /* --- Galeri görselini büyüt --- */
  var modal = document.createElement("div");
  modal.className = "gorsel-modal";
  modal.hidden = true;
  modal.innerHTML = '<div class="gorsel-modal__kutu" role="dialog" aria-modal="true" aria-label="Görsel önizleme"><button type="button" class="gorsel-modal__kapat" aria-label="Kapat">×</button><img class="gorsel-modal__resim" alt=""></div>';
  document.body.appendChild(modal);
  var modalResim = modal.querySelector(".gorsel-modal__resim");
  var modalKapat = modal.querySelector(".gorsel-modal__kapat");
  function modalKapatir() { modal.hidden = true; document.body.style.overflow = ""; }
  document.querySelectorAll("[data-gorsel-incele]").forEach(function (dugme) {
    dugme.addEventListener("click", function () {
      var kaynak = document.querySelector(dugme.getAttribute("data-gorsel-incele"));
      if (!kaynak) return;
      modalResim.src = kaynak.src;
      modalResim.alt = kaynak.alt || "Görsel önizleme";
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      modalKapat.focus();
    });
  });
  modalKapat.addEventListener("click", modalKapatir);
  modal.addEventListener("click", function (e) { if (e.target === modal) modalKapatir(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) modalKapatir(); });

  /* --- Canlı liste filtresi: <input data-filtre="#kapsayici"> --- */
  document.querySelectorAll("input[data-filtre]").forEach(function (inp) {
    var kap = document.querySelector(inp.getAttribute("data-filtre"));
    if (!kap) return;
    var say = inp.getAttribute("data-filtre-sayac")
      ? document.querySelector(inp.getAttribute("data-filtre-sayac"))
      : null;
    var suz = function () {
      var q = inp.value.trim().toLocaleLowerCase("tr");
      var gorunen = 0;
      kap.querySelectorAll(".filtre-oge").forEach(function (oge) {
        var esles = q === "" || oge.textContent.toLocaleLowerCase("tr").indexOf(q) !== -1;
        oge.style.display = esles ? "" : "none";
        if (esles) gorunen++;
      });
      if (say) say.textContent = String(gorunen);
    };
    inp.addEventListener("input", suz);
  });

  /* --- Görsel önizleme (dosya seçilince) --- */
  document.querySelectorAll('input[type="file"][data-onizleme]').forEach(function (inp) {
    var alan = inp.closest(".gorsel-yukleyici__drop");
    var ad = alan && alan.querySelector("[data-dosya-adi]");
    inp.addEventListener("change", function () {
      var hedef = document.querySelector(inp.getAttribute("data-onizleme"));
      if (hedef && inp.files[0]) hedef.src = URL.createObjectURL(inp.files[0]);
      if (ad && inp.files[0]) ad.textContent = inp.files[0].name;
    });
    if (alan) {
      ["dragenter", "dragover"].forEach(function (eventName) {
        alan.addEventListener(eventName, function (e) { e.preventDefault(); alan.classList.add("is-dragging"); });
      });
      ["dragleave", "drop"].forEach(function (eventName) {
        alan.addEventListener(eventName, function (e) { e.preventDefault(); alan.classList.remove("is-dragging"); });
      });
      alan.addEventListener("drop", function (e) {
        if (!e.dataTransfer.files.length) return;
        try { inp.files = e.dataTransfer.files; } catch (err) {}
        inp.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }
  });

  /* --- Çoklu galeri yükleme alanı --- */
  document.querySelectorAll('input[type="file"][data-dosya-listesi]').forEach(function (inp) {
    var alan = inp.closest(".gorsel-yukleyici__drop");
    var ad = alan && alan.querySelector("[data-dosya-adi]");
    if (!alan || !ad) return;
    ["dragenter", "dragover"].forEach(function (eventName) {
      alan.addEventListener(eventName, function (e) { e.preventDefault(); alan.classList.add("is-dragging"); });
    });
    ["dragleave", "drop"].forEach(function (eventName) {
      alan.addEventListener(eventName, function (e) { e.preventDefault(); alan.classList.remove("is-dragging"); });
    });
    alan.addEventListener("drop", function (e) {
      if (!e.dataTransfer.files.length) return;
      try { inp.files = e.dataTransfer.files; } catch (err) {}
      inp.dispatchEvent(new Event("change", { bubbles: true }));
    });
    inp.addEventListener("change", function () {
      var adet = inp.files ? inp.files.length : 0;
      if (!adet) return;
      var isimler = [].slice.call(inp.files).map(function (dosya) { return dosya.name; });
      ad.textContent = adet === 1 ? isimler[0] : adet + " görsel seçildi";
      ad.title = isimler.join(", ");
      ad.classList.add("is-selected");
    });
  });
})();
