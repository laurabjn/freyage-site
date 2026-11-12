// Vérification anti-robot Cloudflare Turnstile pour les formulaires envoyés à Formspree.
// Sans clé dans config.js (rdv.turnstile), rien n'est chargé et les formulaires fonctionnent comme avant.
(function () {
  "use strict";
  var C = window.FREYAGE;
  var cle = C && C.rdv && C.rdv.turnstile;
  var attente = [];
  var charge = false;

  function charger() {
    if (charge) return;
    charge = true;
    window.freyCaptchaPret = function () {
      attente.forEach(function (f) { f(); });
      attente = [];
    };
    var s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=freyCaptchaPret";
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }

  // Place le widget dans « el » et renvoie { jeton(), reinit() }, ou null sans clé.
  function monter(el, theme) {
    if (!cle || !el) return null;
    var id = null;
    var rendre = function () {
      id = window.turnstile.render(el, {
        sitekey: cle,
        theme: theme || "light",
        language: "fr",
        appearance: "interaction-only" // visible seulement si Cloudflare a un doute
      });
    };
    if (window.turnstile) rendre(); else { attente.push(rendre); charger(); }
    return {
      jeton: function () { return id !== null && window.turnstile ? window.turnstile.getResponse(id) || "" : ""; },
      reinit: function () { if (id !== null && window.turnstile) window.turnstile.reset(id); }
    };
  }

  window.FreyCaptcha = { monter: monter };
})();
