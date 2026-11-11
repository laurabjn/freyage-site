// Thème de saison : couleurs et décorations pendant les périodes de config.js (themes).
(function () {
  "use strict";
  var C = window.FREYAGE;
  if (!C || !C.themes) return;
  var d = new Date();
  var jour = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  var theme = C.themes.filter(function (t) { return t.debut <= jour && jour <= t.fin; })[0];
  // Sans fête en cours : la saison (dates « mois-jour », l'hiver passe d'une année à l'autre).
  var md = jour.slice(5);
  var saisons = C.saisons || [];
  if (!theme) theme = saisons.filter(function (s) {
    return s.debut <= s.fin ? s.debut <= md && md <= s.fin : md >= s.debut || md <= s.fin;
  })[0];

  // Aperçu : ajouter ?theme=noel (ou saint-valentin, fete-des-meres, halloween, printemps, ete, automne, hiver) à l'adresse.
  // Le choix est gardé pendant la visite ; ?theme=aucun revient à la normale.
  var apercu = (location.search.match(/[?&]theme=([a-z-]+)/) || [])[1];
  try {
    if (apercu) sessionStorage.setItem("freyage-theme", apercu);
    else apercu = sessionStorage.getItem("freyage-theme");
  } catch (e) { /* stockage indisponible : l'aperçu vaut pour cette page seulement */ }
  if (apercu === "aucun") theme = null;
  else if (apercu) theme = C.themes.concat(saisons).filter(function (t) { return t.id === apercu; })[0] || theme;
  if (!theme) return;
  document.documentElement.setAttribute("data-theme", theme.id);

  var FORMES = {
    etoile: '<path d="M10 0C10.6 6.5 13.5 9.4 20 10 13.5 10.6 10.6 13.5 10 20 9.4 13.5 6.5 10.6 0 10 6.5 9.4 9.4 6.5 10 0Z"/>',
    coeur: '<path d="M10 18C4 13.5 0 10.3 0 6.1 0 2.8 2.5.5 5.4.5 7.4.5 9 1.6 10 3.2 11 1.6 12.6.5 14.6.5 17.5.5 20 2.8 20 6.1 20 10.3 16 13.5 10 18Z"/>',
    fleur: '<circle cx="10" cy="4.2" r="3.6"/><circle cx="15.5" cy="8.2" r="3.6"/><circle cx="13.4" cy="14.8" r="3.6"/><circle cx="6.6" cy="14.8" r="3.6"/><circle cx="4.5" cy="8.2" r="3.6"/>',
    flocon: '<circle cx="10" cy="10" r="10"/>',
    petale: '<path d="M10 0C15 5 15 15 10 20 5 15 5 5 10 0Z"/>',
    lune: '<path d="M13 1A9.5 9.5 0 1 0 19 15 7.5 7.5 0 1 1 13 1Z"/>',
    feuille: '<path d="M10 0C17 5 18 13 10.6 18.5V20H9.4V18.5C2 13 3 5 10 0Z"/>',
    soleil: '<circle cx="10" cy="10" r="4.6"/><g><rect x="9.1" y="0" width="1.8" height="3.6" rx=".9"/><rect x="9.1" y="16.4" width="1.8" height="3.6" rx=".9"/><rect x="0" y="9.1" width="3.6" height="1.8" rx=".9"/><rect x="16.4" y="9.1" width="3.6" height="1.8" rx=".9"/></g><g transform="rotate(45 10 10)"><rect x="9.1" y="0" width="1.8" height="3.6" rx=".9"/><rect x="9.1" y="16.4" width="1.8" height="3.6" rx=".9"/><rect x="0" y="9.1" width="3.6" height="1.8" rx=".9"/><rect x="16.4" y="9.1" width="3.6" height="1.8" rx=".9"/></g>',
    cristal: '<rect x="9.1" y="0" width="1.8" height="20" rx=".9"/><rect x="9.1" y="0" width="1.8" height="20" rx=".9" transform="rotate(60 10 10)"/><rect x="9.1" y="0" width="1.8" height="20" rx=".9" transform="rotate(120 10 10)"/><circle cx="10" cy="10" r="2.4"/>'
  };
  // Symbole fixe, et élément qui tombe (ou monte) en haut de l'accueil.
  var REGLAGES = {
    noel: { symbole: "etoile", chute: "flocon", sens: "chute" },
    "saint-valentin": { symbole: "coeur", chute: "coeur", sens: "monte" },
    "fete-des-meres": { symbole: "fleur", chute: "petale", sens: "chute" },
    printemps: { symbole: "fleur", chute: "petale", sens: "chute", guirlande: false },
    ete: { symbole: "soleil", chute: "etoile", sens: "monte", guirlande: false },
    automne: { symbole: "feuille", chute: "feuille", sens: "chute", taille: 1.8, guirlande: false },
    hiver: { symbole: "cristal", chute: "flocon", sens: "chute", nuit: "cristal", guirlande: false },
    halloween: { symbole: "lune", chute: "etoile", sens: "monte", nuit: "etoile", taille: .9, guirlande: false }
  };
  var r = REGLAGES[theme.id];
  if (!r) return;
  var svg = function (forme, taille, style) {
    return '<svg viewBox="0 0 20 20" width="' + taille + '" height="' + taille + '"' + (style ? ' style="' + style + '"' : "") + ' aria-hidden="true" focusable="false">' + FORMES[forme] + "</svg>";
  };
  var icone = function (taille) { return '<span class="saison-icone">' + svg(r.symbole, taille) + "</span>"; };

  // Positions fixes (en %), tailles (px) et décalages d'animation (s).
  var PARTOUT = [
    [6, 14, 22, 0], [14, 72, 14, 1.2], [24, 30, 10, 2.1], [33, 88, 18, .6], [44, 10, 12, 1.8],
    [52, 64, 9, 2.6], [61, 22, 16, .3], [70, 82, 12, 1.5], [78, 40, 20, 2.3], [86, 12, 11, .9],
    [92, 70, 17, 1.9], [97, 34, 10, 2.8], [39, 48, 8, 3.1], [67, 56, 9, 1.1]
  ];
  // Sur fond clair : seulement dans les marges, pour ne pas passer derrière le texte.
  var BORDS = [[4, 18, 20, 0], [7, 62, 12, 1.2], [3, 88, 9, 2.1], [95, 14, 14, .6], [93, 52, 20, 1.8], [97, 82, 10, 2.6]];
  // Éléments qui tombent : position (%), taille (px), durée et décalage (s).
  var CHUTE = [
    [3, 10, 11, -2], [9, 7, 14, -9], [15, 12, 12, -5], [21, 6, 16, -12], [27, 9, 13, -1], [33, 14, 15, -7],
    [39, 7, 12, -10], [45, 11, 17, -4], [51, 8, 13, -13], [57, 13, 14, -6], [63, 6, 12, -3], [69, 10, 16, -11],
    [75, 8, 13, -8], [81, 12, 15, -2], [87, 7, 12, -6], [93, 11, 14, -10], [98, 8, 16, -4], [48, 6, 18, -15]
  ];

  function calque(classe, html) {
    var c = document.createElement("div");
    c.className = "deco-saison " + classe;
    c.setAttribute("aria-hidden", "true");
    c.innerHTML = html;
    return c;
  }
  function scintiller(conteneur, liste, classe, forme) {
    if (!conteneur) return;
    if (classe) conteneur.classList.add(classe);
    conteneur.insertBefore(calque(liste === BORDS ? "marges" : "", liste.map(function (p) {
      return svg(forme || r.symbole, p[2], "left:" + p[0] + "%;top:" + p[1] + "%;animation-delay:" + p[3] + "s");
    }).join("")), conteneur.firstChild);
  }

  // Haut de l'accueil : éléments qui tombent, plus quelques symboles qui scintillent.
  var hero = document.querySelector(".hero");
  if (hero) {
    hero.insertBefore(calque(r.sens, CHUTE.map(function (p, i) {
      return svg(r.chute, Math.round(p[1] * (r.taille || 1)), "left:" + p[0] + "%;animation-duration:" + p[2] + "s;animation-delay:" + p[3] + "s;--x:" + (i % 2 ? 40 : -40) + "px");
    }).join("")), hero.firstChild);
    scintiller(hero, PARTOUT.slice(0, 8), null, r.nuit);
  }
  // Sections foncées et pied de page, sur toutes les pages.
  Array.prototype.forEach.call(document.querySelectorAll(".section-dark, .site-footer"), function (el) {
    scintiller(el, PARTOUT, "avec-deco", r.nuit);
  });
  // Marges des pages et de la section Carte cadeau mise en avant (grands écrans).
  var principal = document.querySelector("main");
  if (principal && !hero) scintiller(principal, BORDS, "avec-deco");
  scintiller(document.querySelector(".cadeau-en-avant"), BORDS, "avec-deco");

  // Guirlande sous l'en-tête (en CSS) et symboles : à côté du nom, des titres et dans le bandeau.
  var entete = document.querySelector(".site-header");
  if (entete && r.guirlande !== false) entete.classList.add("guirlande");
  var marque = document.querySelector(".brand");
  if (marque) marque.insertAdjacentHTML("beforeend", icone(14));
  Array.prototype.forEach.call(document.querySelectorAll(".eyebrow"), function (el) {
    el.insertAdjacentHTML("beforeend", icone(13));
  });
  var lien = document.querySelector("#bandeau-cadeau:not([hidden]) a");
  if (lien) {
    lien.insertAdjacentHTML("beforebegin", icone(12));
    lien.insertAdjacentHTML("afterend", icone(12));
  }
})();
