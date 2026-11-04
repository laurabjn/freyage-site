// Formulaire de demande de carte cadeau.
(function () {
  "use strict";
  var C = window.FREYAGE;
  var form = document.getElementById("cadeau-form");
  var f = form.elements;
  var error = document.getElementById("cadeau-error");

  function validate() {
    var checks = [
      [f.montant, !(+f.montant.value >= 1), "Veuillez indiquer le montant de la carte."],
      [f.nom, !f.nom.value.trim(), "Veuillez indiquer votre nom."],
      [f.telephone, f.telephone.value.replace(/\D/g, "").length < 10, "Veuillez indiquer un numéro de téléphone valide."],
      [f.email, !f.email.value || !f.email.checkValidity(), "Veuillez indiquer une adresse e-mail valide."]
    ];
    var bad = checks.filter(function (c) { return c[1]; })[0];
    error.textContent = bad ? bad[2] : "";
    if (bad) bad[0].focus();
    return !bad;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    if (f._gotcha.value) return; // spam bot

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Envoi…";
    fetch(C.rdv.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: "FreyAge : Carte cadeau",
        demande: "Carte cadeau",
        montant: f.montant.value + " €",
        beneficiaire: f.beneficiaire.value.trim(),
        nom: f.nom.value.trim(),
        telephone: f.telephone.value.trim(),
        email: f.email.value.trim(),
        message: f.message.value.trim()
      })
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      // Stripe attend le montant en centimes ; la cliente garde la main pour le modifier.
      document.getElementById("cadeau-payer").href = C.paiement.carteCadeau +
        "?prefilled_amount=" + Math.round(+f.montant.value * 100) +
        "&prefilled_email=" + encodeURIComponent(f.email.value.trim());
      form.hidden = true;
      document.getElementById("cadeau-done").hidden = false;
      document.getElementById("cadeau-done-title").focus();
    }).catch(function () {
      error.textContent = "L'envoi a échoué. Réessayez, ou contactez-moi au " + C.contact.telephone + ".";
    }).finally(function () {
      btn.disabled = false;
      btn.textContent = "Demander ma carte cadeau";
    });
  });
})();
