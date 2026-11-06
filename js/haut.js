// Bouton « Haut de page », affiché une fois la page défilée.
(function () {
  "use strict";
  // Menu compact sur téléphone et tablette.
  var entete = document.querySelector(".site-header");
  var boutonMenu = document.querySelector(".menu-bouton");
  if (entete && boutonMenu) {
    var libelle = boutonMenu.querySelector("span");
    var regler = function (ouvert) {
      entete.classList.toggle("menu-ouvert", ouvert);
      boutonMenu.setAttribute("aria-expanded", String(ouvert));
      libelle.textContent = ouvert ? "Fermer" : "Menu";
    };
    boutonMenu.addEventListener("click", function () {
      regler(!entete.classList.contains("menu-ouvert"));
    });
    // Se ferme après un choix, par la touche Échap, ou en touchant ailleurs.
    entete.querySelector("nav").addEventListener("click", function (e) {
      if (e.target.closest("a")) regler(false);
    });
    document.addEventListener("click", function (e) {
      if (!entete.contains(e.target)) regler(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && entete.classList.contains("menu-ouvert")) {
        regler(false);
        boutonMenu.focus();
      }
    });
  }

  var bouton = document.createElement("button");
  bouton.type = "button";
  bouton.className = "haut-page";
  bouton.setAttribute("aria-label", "Revenir en haut de la page");
  bouton.title = "Haut de page";
  bouton.hidden = true;
  bouton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(bouton);

  function actualiser() {
    bouton.hidden = window.scrollY < 300;
  }
  window.addEventListener("scroll", actualiser, { passive: true });
  actualiser();

  // Sur l'accueil, le bouton fixe de rendez-vous s'efface quand le formulaire est à l'écran.
  var barreRdv = document.querySelector(".rdv-mobile");
  var sectionRdv = document.getElementById("rdv");
  if (barreRdv && sectionRdv && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entrees) {
      barreRdv.hidden = entrees[0].isIntersecting;
    }).observe(sectionRdv);
  }

  bouton.addEventListener("click", function () {
    window.scrollTo({ top: 0 });
    // Le clavier repart aussi du haut de la page.
    var lien = document.querySelector(".brand");
    if (lien) lien.focus({ preventScroll: true });
  });
})();
