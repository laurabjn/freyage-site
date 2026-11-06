// Page Prestations : la carte complète, chaque ligne menant au formulaire de demande.
(function () {
  "use strict";
  var C = window.FREYAGE;
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  function fmtDuree(min) {
    var h = Math.floor(min / 60), m = min % 60;
    if (!h) return m + " min";
    return h + " h" + (m ? " " + String(m).padStart(2, "0") : "");
  }

  document.getElementById("categories").innerHTML = C.prestations.map(function (cat) {
    return '<a class="filtre" href="#' + esc(cat.id) + '">' + esc(cat.categorie) + "</a>";
  }).join("");

  document.getElementById("carte").innerHTML = C.prestations.map(function (cat) {
    var liste = cat.items.length ? '<ul class="carte-list">' + cat.items.map(function (it) {
      var attrs = it.lien
        ? 'href="index.html' + esc(it.lien) + '"'
        : 'href="index.html?prestation=' + esc(encodeURIComponent(it.nom)) + '#rdv" aria-label="Demander : ' + esc(it.nom) + '"';
      return "<li><a " + attrs + '><span class="carte-nom">' + esc(it.nom.replace(cat.categorie + " : ", "")) + (it.description ? "<small>" + esc(it.description) + "</small>" : "") + '</span><span class="carte-duree">' + fmtDuree(it.duree) + '</span><span class="carte-prix">' + esc(it.prix) + "</span></a></li>";
    }).join("") + "</ul>" : '<p class="carte-note">' + esc(cat.note || "") + "</p>";
    return '<article class="carte-cat" id="' + esc(cat.id) + '"><div class="carte-intro"><h2 class="carte-titre">' + esc(cat.categorie) + "</h2>" +
      (cat.lieu ? '<p class="carte-lieu"><a href="acces.html">À ' + esc(C.lieux[cat.lieu].ville) + "</a></p>" : "") +
      "<p>" + esc(cat.description) + "</p>" + (cat.mention ? '<p class="carte-mention">' + esc(cat.mention) + "</p>" : "") + "</div>" + liste + "</article>";
  }).join("");
})();
