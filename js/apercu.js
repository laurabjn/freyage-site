// Accueil : aperçu des catégories ; la carte complète est sur la page Prestations.
(function () {
  "use strict";
  var C = window.FREYAGE;
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  document.getElementById("apercu").innerHTML = C.prestations.map(function (cat) {
    var prix = cat.items.map(function (it) { return parseFloat(it.prix); }).filter(function (p) { return !isNaN(p); });
    var detail = cat.items.length
      ? "Dès " + Math.min.apply(null, prix) + " € · " + cat.items.length + " prestations"
      : esc(cat.note || "");
    return '<article class="apercu-cat carte-intro"><h3><a href="' + esc(cat.page || "prestations.html#" + cat.id) + '">' + esc(cat.categorie) + "</a></h3>" +
      (cat.lieu ? '<p class="carte-lieu">À ' + esc(C.lieux[cat.lieu].ville) + "</p>" : "") +
      "<p>" + esc(cat.description) + '</p><p class="apercu-detail">' + detail + "</p></article>";
  }).join("");
})();
