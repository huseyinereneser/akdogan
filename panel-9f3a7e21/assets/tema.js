/* Panel teması — sayfa boyanmadan önce çalışır (yanıp sönme olmasın diye <head>'de). */
(function () {
  try {
    var t = localStorage.getItem("akdpanel-tema");
    if (t === "dark" || t === "light") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
})();
