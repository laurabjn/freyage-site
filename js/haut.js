// Bouton « Haut de page », affiché une fois la page défilée.
(function () {
  "use strict";
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
