// Carte cadeau : montants proposés en un clic, puis paiement Stripe avec le montant choisi.
(function () {
  "use strict";
  var C = window.FREYAGE;
  var form = document.getElementById("cadeau-form");
  var montant = form.elements.montant;
  var error = document.getElementById("cadeau-error");
  var boite = document.getElementById("montants");
  var minimum = C.carteCadeau.minimum;
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  // Les montants viennent de la carte : ils suivent les tarifs de ces prestations.
  var toutes = [];
  C.prestations.forEach(function (cat) { toutes = toutes.concat(cat.items); });
  boite.innerHTML = C.carteCadeau.suggestions.map(function (nom) {
    var it = toutes.filter(function (x) { return x.nom === nom; })[0];
    var prix = it ? parseFloat(it.prix) : NaN;
    if (!(prix >= minimum)) return "";
    return '<button type="button" class="filtre montant-choix" data-montant="' + prix + '" aria-pressed="false"><strong>' + prix + " €</strong><small>" + esc(nom.replace(", formule 1", "")) + "</small></button>";
  }).join("");

  function marquer() {
    Array.prototype.forEach.call(boite.querySelectorAll("[data-montant]"), function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.montant === montant.value));
    });
  }
  boite.addEventListener("click", function (e) {
    var b = e.target.closest("[data-montant]");
    if (!b) return;
    montant.value = b.dataset.montant;
    error.textContent = "";
    marquer();
  });
  montant.addEventListener("input", marquer);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (+montant.value < minimum || !montant.value || !montant.checkValidity()) {
      error.textContent = "Veuillez indiquer un montant d'au moins " + minimum + " €, sans centimes.";
      montant.focus();
      return;
    }
    error.textContent = "";
    // Stripe attend le montant en centimes.
    window.location.href = C.paiement.carteCadeau + "?prefilled_amount=" + Math.round(+montant.value * 100);
  });
})();
