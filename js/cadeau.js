// Carte cadeau : envoie directement vers le paiement Stripe avec le montant choisi.
(function () {
  "use strict";
  var form = document.getElementById("cadeau-form");
  var montant = form.elements.montant;
  var error = document.getElementById("cadeau-error");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!(+montant.value >= 1) || !montant.checkValidity()) {
      error.textContent = "Veuillez indiquer un montant en euros, sans centimes.";
      montant.focus();
      return;
    }
    error.textContent = "";
    // Stripe attend le montant en centimes.
    window.location.href = window.FREYAGE.paiement.carteCadeau + "?prefilled_amount=" + Math.round(+montant.value * 100);
  });
})();
