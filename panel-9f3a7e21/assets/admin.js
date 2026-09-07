/* Akdoğan Turizm — panel arayüz betiği (bağımlılık yok) */
(function () {
  "use strict";

  /* --- Kenar menü aç/kapa (CSP: satır içi onclick yerine) --- */
  var menuBtn = document.getElementById("menuAc");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      document.body.classList.toggle("menu-acik");
    });
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

  /* --- Açık / koyu tema geçişi --- */
  var temaBtn = document.getElementById("temaBtn");
  if (temaBtn) {
    var temaEtiket = temaBtn.querySelector("[data-tema-etiket]");
    var temaTazele = function () {
      var koyu = document.documentElement.getAttribute("data-theme") === "dark";
      if (temaEtiket) temaEtiket.textContent = koyu ? "Açık mod" : "Koyu mod";
      temaBtn.setAttribute("aria-pressed", koyu ? "true" : "false");
    };
    temaTazele();
    temaBtn.addEventListener("click", function () {
      var koyu = document.documentElement.getAttribute("data-theme") === "dark";
      var yeni = koyu ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", yeni);
      try { localStorage.setItem("akdpanel-tema", yeni); } catch (e) {}
      temaTazele();
    });
  }

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
    inp.addEventListener("change", function () {
      var hedef = document.querySelector(inp.getAttribute("data-onizleme"));
      if (hedef && inp.files[0]) hedef.src = URL.createObjectURL(inp.files[0]);
    });
  });
})();
