// Carte cadeau : montants proposés en un clic, puis paiement Stripe avec le montant choisi.
(function () {
  "use strict";
  var C = window.FREYAGE;
  var K = C.carteCadeau;
  var form = document.getElementById("cadeau-form");
  var montant = form.elements.montant;
  var error = document.getElementById("cadeau-error");
  var boite = document.getElementById("montants");
  var aPayer = document.getElementById("a-payer");
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var euros = function (n) { return (n % 1 ? n.toFixed(2).replace(".", ",") : String(n)) + " €"; };
  // Période de mise en avant de la carte cadeau en cours aujourd'hui, ou null.
  function periodeCadeau() {
    var d = new Date();
    var jour = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
    return (C.carteCadeau.periodes || []).filter(function (p) { return p.debut <= jour && jour <= p.fin; })[0] || null;
  }
  function jourMois(iso) {
    return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  }

  // Remise en cours : la carte garde sa valeur, seul le prix payé baisse.
  var periode = periodeCadeau();
  var remise = periode ? periode.remise || 0 : 0;
  var prixPaye = function (v) { return Math.round(v * (100 - remise)) / 100; };
  // Le montant payé ne doit pas passer sous le minimum du lien Stripe.
  var minimum = Math.max(K.minimum, Math.ceil((K.minimumStripe || 0) * 100 / (100 - remise)));
  montant.min = minimum;
  document.getElementById("montant-min").textContent = minimum + " € minimum";

  if (remise) {
    var bloc = document.getElementById("remise");
    bloc.textContent = periode.nom + " : −" + remise + " % sur le prix de la carte, jusqu'au " + jourMois(periode.fin) + ". Une carte de 50 € vous coûte " + euros(prixPaye(50)) + ", et garde sa valeur de 50 €.";
    bloc.hidden = false;
  }

  // Les montants viennent de la carte : ils suivent les tarifs de ces prestations.
  var toutes = [];
  C.prestations.forEach(function (cat) { toutes = toutes.concat(cat.items); });
  boite.innerHTML = K.suggestions.map(function (nom) {
    var it = toutes.filter(function (x) { return x.nom === nom; })[0];
    var prix = it ? parseFloat(it.prix) : NaN;
    if (!(prix >= minimum)) return "";
    return '<button type="button" class="filtre montant-choix" data-montant="' + prix + '" aria-pressed="false"><strong>' + prix + " €</strong><small>" + esc(nom.replace(", formule 1", "")) + (remise ? "<br>vous payez " + euros(prixPaye(prix)) : "") + "</small></button>";
  }).join("");

  function valide() { return montant.value && montant.checkValidity() && +montant.value >= minimum; }
  function marquer() {
    Array.prototype.forEach.call(boite.querySelectorAll("[data-montant]"), function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.montant === montant.value));
    });
    if (remise) {
      aPayer.hidden = !valide();
      aPayer.textContent = valide() ? "Vous payez " + euros(prixPaye(+montant.value)) + " pour une carte de " + euros(+montant.value) + "." : "";
    }
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
    if (!valide()) {
      error.textContent = "Veuillez indiquer un montant d'au moins " + minimum + " €, sans centimes.";
      montant.focus();
      return;
    }
    error.textContent = "";
    // Stripe attend le montant payé en centimes. La valeur de la carte est transmise en référence.
    var v = +montant.value;
    window.location.href = C.paiement.carteCadeau + "?prefilled_amount=" + Math.round(prixPaye(v) * 100) + "&client_reference_id=carte-" + v + "-euros";
  });
})();
