// Portfolio : filtres par domaine (maquillage, ongles…) puis par style, et affichage en grand.
(function () {
  "use strict";
  var photos = window.FREYAGE.realisations || [];
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  var uniques = function (a) { return a.filter(function (c, i) { return a.indexOf(c) === i; }); };
  var domaineDe = function (p) { return p.domaine || "Maquillage"; };
  var domaines = uniques(photos.map(domaineDe));
  var boutons = function (liste, attr) {
    return ["Tout"].concat(liste).map(function (c, i) {
      return '<button type="button" class="filtre" ' + attr + '="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + "</button>";
    }).join("");
  };
  // Un seul domaine : les styles suffisent, sur une seule ligne comme avant.
  var plusieurs = domaines.length > 1;
  if (plusieurs) $("#filtres").innerHTML = boutons(domaines, "data-domaine");
  else $("#filtres").hidden = true;
  function afficherStyles() {
    var styles = uniques(photos.filter(function (p) { return domaine === "Tout" || domaineDe(p) === domaine; }).map(function (p) { return p.categorie; }));
    var box = $("#styles");
    box.hidden = domaine === "Tout" && plusieurs || styles.length < 2;
    box.innerHTML = box.hidden ? "" : boutons(styles, "data-cat");
  }

  // Les miniatures font 600 px de large ; les originaux carrés (largeur 1200) font 600 px de haut, les autres 800.
  $("#galerie").innerHTML = photos.map(function (p, i) {
    var h = p.largeur === 1200 ? 600 : 800;
    return '<button type="button" class="photo" data-i="' + i + '" aria-label="Agrandir : ' + esc(p.alt) + '"><img src="assets/portfolio/' + esc(p.nom) + '-mini.jpg" alt="' + esc(p.alt) + '" width="600" height="' + h + '" loading="lazy"></button>';
  }).join("");

  var boxes = $$(".photo");
  var dialog = $("#visionneuse");
  var image = $("#visionneuse-img");
  var pagination = $("#pagination");
  var PAR_PAGE = 9;
  var courant = 0;
  var domaine = "Tout";
  var filtre = "Tout";
  var page = 0;

  // Galerie en colonnes remplies ligne par ligne : chaque photo visible va dans la colonne
  // la moins haute, de gauche à droite. Les colonnes restent équilibrées, sans trou à droite.
  var galerie = $("#galerie");
  var nbActuel = 0;
  function nbColonnes() {
    if (window.matchMedia("(max-width: 640px)").matches) return 2;
    return Math.max(1, Math.min(3, Math.floor((galerie.clientWidth + 12) / 272)));
  }
  function ranger() {
    var actif = document.activeElement;
    var cols = [], hauteurs = [];
    nbActuel = nbColonnes();
    for (var c = 0; c < nbActuel; c++) {
      var col = document.createElement("div");
      col.className = "galerie-col";
      cols.push(col);
      hauteurs.push(0);
    }
    boxes.forEach(function (b) {
      if (b.hidden) { cols[0].appendChild(b); return; }
      var k = hauteurs.indexOf(Math.min.apply(null, hauteurs));
      cols[k].appendChild(b);
      hauteurs[k] += photos[+b.dataset.i].largeur === 1200 ? 1 : 4 / 3;
    });
    galerie.innerHTML = "";
    cols.forEach(function (col) { galerie.appendChild(col); });
    if (actif && boxes.indexOf(actif) !== -1 && !actif.hidden) actif.focus({ preventScroll: true });
  }
  window.addEventListener("resize", function () { if (nbColonnes() !== nbActuel) ranger(); });

  // Toutes les photos du filtre choisi, quelle que soit la page.
  function selection() {
    return photos.map(function (p, i) { return i; }).filter(function (i) {
      return (domaine === "Tout" || domaineDe(photos[i]) === domaine) && (filtre === "Tout" || photos[i].categorie === filtre);
    });
  }
  function afficherPage(n) {
    var s = selection();
    var total = Math.ceil(s.length / PAR_PAGE);
    page = n;
    var surPage = s.slice(page * PAR_PAGE, (page + 1) * PAR_PAGE);
    boxes.forEach(function (b) { b.hidden = surPage.indexOf(+b.dataset.i) === -1; });
    ranger();

    if (total < 2) { pagination.innerHTML = ""; return; }
    var html = '<button type="button" class="filtre" data-page="' + (page - 1) + '"' + (page === 0 ? " disabled" : "") + ">Précédent</button>";
    for (var i = 0; i < total; i++) {
      html += '<button type="button" class="filtre" data-page="' + i + '" aria-label="Page ' + (i + 1) + '"' + (i === page ? ' aria-current="page"' : "") + ">" + (i + 1) + "</button>";
    }
    html += '<button type="button" class="filtre" data-page="' + (page + 1) + '"' + (page === total - 1 ? " disabled" : "") + ">Suivant</button>";
    pagination.innerHTML = html;
  }
  function afficher(i) {
    courant = i;
    image.src = "assets/portfolio/" + photos[i].nom + ".jpg";
    image.alt = photos[i].alt;
    var s = selection();
    $("#visionneuse-pos").textContent = (s.indexOf(i) + 1) + " / " + s.length;
  }
  function decaler(sens) {
    var s = selection();
    afficher(s[(s.indexOf(courant) + sens + s.length) % s.length]);
  }

  $("#filtres").addEventListener("click", function (e) {
    var b = e.target.closest("[data-domaine]");
    if (!b) return;
    $$("[data-domaine]").forEach(function (f) { f.setAttribute("aria-pressed", String(f === b)); });
    domaine = b.dataset.domaine;
    filtre = "Tout";
    afficherStyles();
    afficherPage(0);
  });
  $("#styles").addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]");
    if (!b) return;
    $$("[data-cat]").forEach(function (f) { f.setAttribute("aria-pressed", String(f === b)); });
    filtre = b.dataset.cat;
    afficherPage(0);
  });
  pagination.addEventListener("click", function (e) {
    var b = e.target.closest("[data-page]");
    if (!b || b.disabled) return;
    afficherPage(+b.dataset.page);
    ($("#filtres").hidden ? $("#styles") : $("#filtres")).scrollIntoView();
    var numero = pagination.querySelector('[aria-current="page"]');
    if (numero) numero.focus({ preventScroll: true });
  });
  // En fermant la photo, la galerie se place sur la page de la dernière photo vue.
  dialog.addEventListener("close", function () {
    var n = Math.floor(selection().indexOf(courant) / PAR_PAGE);
    if (n !== page) afficherPage(n);
  });
  $("#galerie").addEventListener("click", function (e) {
    var b = e.target.closest(".photo");
    if (!b) return;
    afficher(+b.dataset.i);
    dialog.showModal();
  });
  $("#visionneuse-prec").addEventListener("click", function () { decaler(-1); });
  $("#visionneuse-suiv").addEventListener("click", function () { decaler(1); });
  $("#visionneuse-fermer").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") decaler(-1);
    if (e.key === "ArrowRight") decaler(1);
  });

  afficherStyles();
  afficherPage(0);
})();
