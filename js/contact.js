(function () {
  "use strict";
  var C = window.FREYAGE;
  var form = document.getElementById("contact-form");
  var f = form.elements;
  var error = document.getElementById("contact-error");
  var captcha = window.FreyCaptcha && FreyCaptcha.monter(document.getElementById("captcha-contact"), "light");
  var OBJETS = { mariee: "Devis pour un mariage", presson: "Être prévenue de l'ouverture des press-on", cahe: "Commander des produits CAHÉ", autre: "Autre question" };

  // Lien direct vers une demande, ex. contact.html?objet=mariee
  var demande = new URLSearchParams(window.location.search).get("objet");
  if (OBJETS[demande]) f.objet.value = demande;

  function syncObjet() {
    var mariage = f.objet.value === "mariee";
    Array.prototype.forEach.call(form.querySelectorAll(".mariage-field"), function (el) { el.hidden = !mariage; });
    var hint = document.getElementById("message-hint");
    var cahe = f.objet.value === "cahe";
    hint.hidden = !mariage && f.objet.value !== "presson" && !cahe;
    hint.textContent = cahe ? "(produits souhaités et lieu de retrait : Mérignac ou Bruges)" : f.objet.value === "presson" ? "(facultatif : vos envies, couleurs, occasion…)" : "(options souhaitées, heure de la cérémonie…)";
  }
  f.objet.addEventListener("change", syncObjet);
  syncObjet();

  // Date du jour en heure locale, pour refuser une date de mariage passée.
  var now = new Date();
  f.dateMariage.min = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");

  function validate() {
    var mariage = f.objet.value === "mariee";
    var checks = [
      [f.nom, !f.nom.value.trim(), "Veuillez indiquer votre nom."],
      [f.telephone, f.telephone.value.replace(/\D/g, "").length < 10, "Veuillez indiquer un numéro de téléphone valide."],
      [f.email, !f.email.value || !f.email.checkValidity(), "Veuillez indiquer une adresse e-mail valide."],
      [f.dateMariage, mariage && (!f.dateMariage.value || !f.dateMariage.checkValidity()), "Veuillez indiquer une date de mariage à venir."],
      [f.message, !mariage && f.objet.value !== "presson" && !f.message.value.trim(), "Veuillez écrire votre message."]
    ];
    var bad = checks.filter(function (c) { return c[1]; })[0];
    error.textContent = bad ? bad[2] : "";
    if (bad) bad[0].focus();
    return !bad;
  }

  function buildRequest() {
    var req = {
      _subject: "FreyAge : " + OBJETS[f.objet.value],
      demande: OBJETS[f.objet.value],
      nom: f.nom.value.trim(),
      telephone: f.telephone.value.trim(),
      email: f.email.value.trim()
    };
    if (f.objet.value === "mariee") {
      req.dateMariage = new Date(f.dateMariage.value + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      req.lieu = f.lieu.value.trim();
      req.personnes = f.personnes.value;
    }
    req.message = f.message.value.trim();
    return req;
  }

  function showDone(title, text) {
    form.hidden = true;
    document.getElementById("contact-done").hidden = false;
    document.getElementById("contact-done-text").textContent = text;
    var h = document.getElementById("contact-done-title");
    h.textContent = title;
    h.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    if (f._gotcha.value) return; // spam bot
    var req = buildRequest();

    if (!C.rdv.endpoint) {
      var lignes = [
        "Bonjour,", "",
        "Nom : " + req.nom,
        "Téléphone : " + req.telephone,
        "E-mail : " + req.email
      ];
      if (req.dateMariage) {
        lignes.push("Date du mariage : " + req.dateMariage);
        if (req.lieu) lignes.push("Lieu des préparatifs : " + req.lieu);
        if (req.personnes) lignes.push("Personnes à maquiller : " + req.personnes);
      }
      if (req.message) lignes.push("", req.message);
      window.location.href = "mailto:" + C.contact.email + "?subject=" + encodeURIComponent(req._subject) + "&body=" + encodeURIComponent(lignes.join("\n"));
      showDone("Il reste à envoyer votre e-mail", "Votre messagerie vient de s'ouvrir avec votre demande. Envoyez ce message pour la transmettre. Si rien ne s'est ouvert, contactez-moi au " + C.contact.telephone + ".");
      return;
    }

    if (captcha) {
      var jeton = captcha.jeton();
      if (!jeton) { error.textContent = "La vérification anti-robot n'est pas terminée. Patientez quelques secondes, puis réessayez."; return; }
      req["cf-turnstile-response"] = jeton;
    }
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Envoi…";
    fetch(C.rdv.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(req)
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      showDone("Votre demande est bien envoyée", f.objet.value === "presson" ? "Merci ! Je vous préviens dès l'ouverture des press-on." : f.objet.value === "cahe" ? "Merci ! Je prépare vos produits et je vous préviens dès qu'ils sont prêts. Vous réglerez sur place, au retrait." : "Je vous réponds par téléphone ou par e-mail.");
    }).catch(function () {
      error.textContent = "L'envoi a échoué. Réessayez, ou contactez-moi au " + C.contact.telephone + ".";
    }).finally(function () {
      if (captcha) captcha.reinit();
      btn.disabled = false;
      btn.textContent = "Envoyer ma demande";
    });
  });
})();
