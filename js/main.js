(function () {
  "use strict";
  var C = window.FREYAGE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  // ---- Helpers
  function fmtDuree(min) {
    var h = Math.floor(min / 60), m = min % 60;
    if (!h) return m + " min";
    return h + " h" + (m ? " " + String(m).padStart(2, "0") : "");
  }
  function toMin(hhmm) { var p = hhmm.split(":"); return +p[0] * 60 + +p[1]; }
  function toHHMM(min) { return String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0"); }
  function dateKey(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function fmtEuros(n) {
    return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  }
  function fmtDate(d) {
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  // ---- Static content from config
  if (C.demo) {
    $("#demo-banner").innerHTML = '<p class="demo">Aperçu : les informations affichées sont des exemples.</p>';
  }
  $("#year").textContent = new Date().getFullYear();

  var services = [];
  $("#carte").innerHTML = C.prestations.map(function (cat) {
    var liste = cat.items.length ? '<ul class="carte-list">' + cat.items.map(function (it) {
      var attrs;
      if (it.lien) {
        attrs = 'href="' + esc(it.lien) + '"';
      } else {
        var i = services.push({ nom: it.nom, duree: it.duree, prix: it.prix, acompte: it.acompte, categorie: cat.categorie, lieu: C.lieux[cat.lieu] }) - 1;
        attrs = 'href="#rdv" data-book="' + i + '" aria-label="Réserver : ' + esc(it.nom) + '"';
      }
      return "<li><a " + attrs + '><span class="carte-nom">' + esc(it.nom) + (it.description ? '<small>' + esc(it.description) + "</small>" : "") + '</span><span class="carte-duree">' + fmtDuree(it.duree) + '</span><span class="carte-prix">' + esc(it.prix) + "</span></a></li>";
    }).join("") + "</ul>" : '<p class="carte-note">' + esc(cat.note || "") + (cat.noteLien ? ' <a href="' + esc(cat.noteLien) + '">Me contacter</a>' : "") + "</p>";
    return '<article class="carte-cat"><div class="carte-intro"><h3>' + esc(cat.categorie) + "</h3>" + (cat.lieu ? '<p class="carte-lieu"><a href="acces.html">À ' + esc(C.lieux[cat.lieu].ville) + "</a></p>" : "") + "<p>" + esc(cat.description) + "</p></div>" + liste + "</article>";
  }).join("");

  // Only services bookable online appear in the booking form.
  var si = 0;
  $("#service-options").innerHTML = C.prestations.map(function (cat) {
    var items = cat.items.filter(function (it) { return !it.lien; });
    if (!items.length) return "";
    return '<div class="service-group"><h4>' + esc(cat.categorie) + " · à " + esc(C.lieux[cat.lieu].ville) + "</h4>" + items.map(function (it) {
      var i = si++;
      return '<label class="service-option"><input type="radio" name="prestation" value="' + i + '"><span class="service-name">' + esc(it.nom) + '</span><span class="service-meta">' + fmtDuree(it.duree) + " · " + esc(it.prix) + "</span></label>";
    }).join("") + "</div>";
  }).join("");


  // ---- Booking state
  var state = { step: 1, service: null, jours: [], reglement: null }; // jours : { date, moment }, 2 au maximum
  var MAX_JOURS = 2;
  var form = $("#booking-form");
  var now = new Date();
  var earliest = new Date(now.getTime() + C.rdv.delaiMinHeures * 3600000);
  var lastDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + C.rdv.horizonJours);
  var view = new Date(now.getFullYear(), now.getMonth(), 1);
  var occupe = []; // plages occupées de l'agenda Google

  // Every other Saturday, counted from the reference date (UTC so clock changes don't shift the count).
  function samediOuvert(d) {
    var p = C.rdv.samediTravaille.split("-");
    var semaines = Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(+p[0], +p[1] - 1, +p[2])) / (7 * 86400000));
    return semaines % 2 === 0;
  }

  // Slots that fit the selected service within opening hours and the notice period.
  function slotsFor(d, duree) {
    var ranges = C.horaires[d.getDay()] || [];
    if (C.rdv.fermetures.indexOf(dateKey(d)) !== -1) return [];
    if (d > lastDay) return [];
    if (d.getDay() === 6 && !samediOuvert(d)) return [];
    var out = [];
    var pause = C.rdv.tamponMinutes;
    ranges.forEach(function (r) {
      var m = toMin(r[0]);
      while (m + duree <= toMin(r[1])) {
        var t = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(m / 60), m % 60);
        var conflit = conflitAgenda(t, duree, pause);
        if (conflit) {
          // Reprend après ce rendez-vous et sa pause, arrondi aux 5 minutes suivantes.
          var reprise = (conflit.end.getTime() + pause * 60000 - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / 60000;
          m = Math.max(m + 5, Math.ceil(reprise / 5) * 5);
          continue;
        }
        if (t >= earliest) out.push(toHHMM(m));
        m += duree + pause;
      }
    });
    return out;
  }

  // Les moments proposés ce jour-là : seulement ceux où la prestation peut encore tenir.
  // La cliente indique une préférence : le jour et l'heure sont décidés ensuite, à la main.
  function momentsFor(d, duree) {
    var libres = slotsFor(d, duree);
    var out = (C.horaires[d.getDay()] || []).filter(function (r) {
      return libres.some(function (s) { return toMin(s) >= toMin(r[0]) && toMin(s) < toMin(r[1]); });
    }).map(function (r) {
      var matin = toMin(r[0]) < 12 * 60;
      return {
        cle: matin ? "matin" : "apres-midi",
        libelle: matin ? "Le matin" : "L'après-midi",
        court: matin ? "le matin" : "l'après-midi"
      };
    });
    if (out.length > 1) out.push({ cle: "indifferent", libelle: "Peu importe", court: "heure indifférente" });
    return out;
  }

  // Le rendez-vous de l'agenda qui empêche ce créneau, en comptant la pause avant et après.
  function conflitAgenda(debut, duree, pause) {
    var a = debut.getTime() - pause * 60000;
    var b = debut.getTime() + (duree + pause) * 60000;
    return occupe.filter(function (o) { return o.start.getTime() < b && o.end.getTime() > a; })[0];
  }

  // Si l'agenda ne répond pas, les jours restent proposés : la demande est de toute façon confirmée à la main.
  function chargerAgenda() {
    var ag = C.rdv.agenda;
    if (!ag) return;
    fetch("https://www.googleapis.com/calendar/v3/freeBusy?key=" + encodeURIComponent(ag.cle), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timeMin: new Date().toISOString(),
        timeMax: new Date(lastDay.getTime() + 2 * 86400000).toISOString(),
        items: [{ id: ag.id }]
      })
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (data) {
      occupe = data.calendars[ag.id].busy.map(function (o) {
        return { start: new Date(o.start), end: new Date(o.end) };
      });
      if (state.step === 2) { renderCalendar(); renderSlots(); renderRecap(); }
    }).catch(function () {});
  }

  function renderCalendar() {
    verifierJours();
    var y = view.getFullYear(), mo = view.getMonth();
    var title = view.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    $("#cal-title").textContent = title.charAt(0).toUpperCase() + title.slice(1);
    $("#cal-prev").disabled = y === now.getFullYear() && mo === now.getMonth();
    $("#cal-next").disabled = new Date(y, mo + 1, 1) > lastDay;

    var offset = (new Date(y, mo, 1).getDay() + 6) % 7; // Monday first
    var total = new Date(y, mo + 1, 0).getDate();
    var duree = state.service !== null ? services[state.service].duree : 30;
    var html = "";
    for (var i = 0; i < offset; i++) html += "<span></span>";
    for (var day = 1; day <= total; day++) {
      var d = new Date(y, mo, day);
      var open = slotsFor(d, duree).length > 0;
      var sel = indexJour(d) !== -1;
      html += '<button type="button" class="cal-day' + (sel ? " is-selected" : "") + '" data-day="' + day + '"' +
        (open ? "" : " disabled") + ' aria-pressed="' + (sel ? "true" : "false") + '" aria-label="' + fmtDate(d) + '">' + day + "</button>";
    }
    $("#cal-grid").innerHTML = html;
  }

  function indexJour(d) {
    for (var i = 0; i < state.jours.length; i++) {
      if (dateKey(state.jours[i].date) === dateKey(d)) return i;
    }
    return -1;
  }

  // Retire les jours et les moments devenus indisponibles depuis leur choix (agenda mis à jour).
  function verifierJours() {
    if (state.service === null) return;
    var duree = services[state.service].duree;
    state.jours = state.jours.filter(function (j) {
      var list = momentsFor(j.date, duree);
      if (j.moment && !list.some(function (m) { return m.cle === j.moment.cle; })) j.moment = null;
      return list.length > 0;
    });
  }

  function renderSlots() {
    var box = $("#slots"), title = $("#slots-title");
    var n = state.jours.length;
    title.textContent = !n ? "Choisissez un jour, ou 2 pour me laisser plus de choix."
      : n < MAX_JOURS ? "Vous pouvez ajouter un 2e jour si vous le souhaitez."
      : "Vos 2 jours de préférence";
    box.innerHTML = state.jours.map(function (j, i) {
      var jour = j.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
      jour = jour.charAt(0).toUpperCase() + jour.slice(1);
      return '<div class="jour-choix"><div class="jour-titre"><strong>' + esc(jour) + '</strong><button type="button" class="jour-retirer" data-retirer="' + i + '" aria-label="Retirer : ' + esc(jour) + '">Retirer</button></div>' +
        momentsFor(j.date, services[state.service].duree).map(function (m) {
          var sel = !!j.moment && m.cle === j.moment.cle;
          return '<button type="button" class="slot' + (sel ? " is-selected" : "") + '" data-jour="' + i + '" data-moment="' + m.cle + '" aria-pressed="' + sel + '">' + esc(m.libelle) + "</button>";
        }).join("") + "</div>";
    }).join("");
  }

  // Texte de chaque souhait, ex. « mardi 10 novembre 2026, le matin ».
  function texteSouhait(j) {
    return fmtDate(j.date) + ", " + j.moment.court;
  }

  // Les façons de régler une prestation. « montant » = à payer en ligne (0 = rien en ligne).
  function choixReglement(s) {
    var prix = parseFloat(s.prix);
    var cadeau = { libelle: "Avec une carte cadeau", court: "Carte cadeau, solde éventuel sur place", montant: 0, cadeau: true };
    var ligne = { libelle: "En ligne, après ma confirmation (" + fmtEuros(prix) + ")", court: fmtEuros(prix) + " en ligne", montant: prix, lien: C.paiement.prestation };
    if (s.acompte) {
      return {
        ligne: ligne,
        place: { libelle: "Acompte en ligne (" + fmtEuros(s.acompte) + "), puis le reste sur place par carte ou en espèces", court: fmtEuros(s.acompte) + " en ligne, le reste sur place", montant: s.acompte, lien: C.paiement.acompte, acompte: true },
        cadeau: cadeau
      };
    }
    return {
      ligne: ligne,
      place: { libelle: "Sur place, par carte ou en espèces", court: "Sur place, par carte ou en espèces", montant: 0 },
      cadeau: cadeau
    };
  }

  function renderReglement() {
    var options = choixReglement(services[state.service]);
    $("#reglement-options").innerHTML = ["ligne", "place", "cadeau"].map(function (cle) {
      return '<label class="service-option"><input type="radio" name="reglement" value="' + cle + '"' + (state.reglement === cle ? " checked" : "") + '><span class="service-name">' + esc(options[cle].libelle) + "</span></label>";
    }).join("");
    afficherCodeCadeau();
  }

  function afficherCodeCadeau() {
    $("#cadeau-code").hidden = state.reglement !== "cadeau";
  }

  function renderRecap() {
    var s = state.service !== null ? services[state.service] : null;
    $("#recap-service").textContent = s ? s.nom : "–";
    $("#recap-duree").textContent = s ? fmtDuree(s.duree) : "–";
    $("#recap-lieu").textContent = s ? s.lieu.adresse : "–";
    $("#recap-prix").textContent = s ? s.prix : "–";
    var choix = s && state.reglement ? choixReglement(s)[state.reglement] : null;
    $("#recap-reglement-titre").hidden = $("#recap-reglement").hidden = !choix;
    $("#recap-reglement").textContent = choix ? choix.court : "";
    var complets = state.jours.filter(function (j) { return j.moment; });
    $("#recap-date").textContent = complets.length ? complets.map(texteSouhait).join(" ou ") : "–";
  }

  function goTo(step, focus) {
    state.step = step;
    $$("[data-step]").forEach(function (el) { el.hidden = +el.dataset.step !== step; });
    $$("[data-step-dot]").forEach(function (el) {
      el.classList.toggle("is-current", +el.dataset.stepDot === step);
      el.classList.toggle("is-done", +el.dataset.stepDot < step);
    });
    $$(".error").forEach(function (e) { e.textContent = ""; });
    if (step === 2) { renderCalendar(); renderSlots(); renderRecap(); chargerAgenda(); }
    if (step === 3) renderReglement();
    if (focus !== false) {
      var target = $('[data-step="' + step + '"] legend') || $("#done-title");
      if (target) target.focus({ preventScroll: true });
    }
  }

  function selectService(i) {
    if (state.service !== i) { state.jours = []; state.reglement = null; }
    state.service = i;
    var radio = $('input[name="prestation"][value="' + i + '"]');
    if (radio) radio.checked = true;
    renderRecap();
  }

  function validateStep(step) {
    var msg = "";
    if (step === 1 && state.service === null) msg = "Veuillez choisir une prestation.";
    if (step === 2 && !state.jours.length) msg = "Veuillez choisir au moins un jour.";
    if (step === 2 && state.jours.some(function (j) { return !j.moment; })) msg = "Veuillez indiquer le moment préféré pour chaque jour.";
    if (step === 3) {
      var nom = form.elements.nom, tel = form.elements.telephone, mail = form.elements.email;
      var bad = !nom.value.trim() ? nom : tel.value.replace(/\D/g, "").length < 10 ? tel : !mail.checkValidity() || !mail.value ? mail : null;
      if (bad === nom) msg = "Veuillez indiquer votre nom.";
      if (bad === tel) msg = "Veuillez indiquer un numéro de téléphone valide.";
      if (bad === mail) msg = "Veuillez indiquer une adresse e-mail valide.";
      if (bad) bad.focus();
      if (!bad && !state.reglement) {
        msg = "Veuillez choisir comment régler.";
        $('input[name="reglement"]').focus();
      }
      if (!bad && state.reglement === "cadeau" && !form.elements.codeCadeau.value.trim()) {
        msg = "Veuillez indiquer le code de votre carte cadeau.";
        form.elements.codeCadeau.focus();
      }
    }
    $('[data-error="' + step + '"]').textContent = msg;
    return !msg;
  }

  // ---- Events
  $("#carte").addEventListener("click", function (e) {
    var a = e.target.closest("[data-book]");
    if (!a) return;
    selectService(+a.dataset.book);
    goTo(2, false);
  });
  $("#service-options").addEventListener("change", function (e) {
    if (e.target.name === "prestation") selectService(+e.target.value);
  });
  $("#reglement-options").addEventListener("change", function (e) {
    state.reglement = e.target.value;
    afficherCodeCadeau();
    renderRecap();
  });
  $$("[data-next]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (validateStep(state.step)) goTo(state.step + 1);
    });
  });
  $$("[data-back]").forEach(function (b) {
    b.addEventListener("click", function () { goTo(state.step - 1); });
  });
  $("#cal-prev").addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCalendar(); });
  $("#cal-next").addEventListener("click", function () { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCalendar(); });
  $("#cal-grid").addEventListener("click", function (e) {
    var b = e.target.closest("[data-day]");
    if (!b) return;
    var d = new Date(view.getFullYear(), view.getMonth(), +b.dataset.day);
    var i = indexJour(d);
    var erreur = $('[data-error="2"]');
    erreur.textContent = "";
    if (i !== -1) {
      state.jours.splice(i, 1);
    } else if (state.jours.length < MAX_JOURS) {
      state.jours.push({ date: d, moment: null });
    } else {
      erreur.textContent = "Vous avez déjà choisi 2 jours : retirez-en un pour en choisir un autre.";
      return;
    }
    renderCalendar(); renderSlots(); renderRecap();
  });
  $("#slots").addEventListener("click", function (e) {
    var retirer = e.target.closest("[data-retirer]");
    var b = e.target.closest("[data-moment]");
    if (!retirer && !b) return;
    $('[data-error="2"]').textContent = "";
    if (retirer) {
      state.jours.splice(+retirer.dataset.retirer, 1);
      renderCalendar();
    } else {
      var j = state.jours[+b.dataset.jour];
      j.moment = momentsFor(j.date, services[state.service].duree).filter(function (m) { return m.cle === b.dataset.moment; })[0];
    }
    renderSlots(); renderRecap();
  });

  function buildRequest() {
    var s = services[state.service], f = form.elements;
    var choix = choixReglement(s)[state.reglement];
    var code = state.reglement === "cadeau" ? " (code : " + f.codeCadeau.value.trim() + ")" : "";
    var req = {
      prestation: s.nom,
      lieu: s.lieu.adresse,
      duree: fmtDuree(s.duree),
      tarif: s.prix,
      reglement: choix.court + code,
      nom: f.nom.value.trim(),
      telephone: f.telephone.value.trim(),
      email: f.email.value.trim(),
      message: f.message.value.trim()
    };
    // Un champ par souhait dans l'e-mail reçu, ex. souhait1 : « mardi 10 novembre 2026 : Le matin (9 h – 12 h 30) ».
    state.jours.forEach(function (j, i) {
      req["souhait" + (i + 1)] = fmtDate(j.date) + " : " + j.moment.libelle;
    });
    // Lien à copier dans la confirmation envoyée à la cliente.
    if (choix.montant) {
      req.lienPaiement = choix.lien + "?prefilled_amount=" + Math.round(choix.montant * 100) + "&prefilled_email=" + encodeURIComponent(req.email);
    }
    return req;
  }

  function showDone(title, text) {
    $("#done-title").textContent = title;
    $("#done-text").textContent = text + " Adresse : " + services[state.service].lieu.adresse + ".";
    goTo(4, false);
    $("#done-title").focus({ preventScroll: true });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStep(3)) return;
    if (form.elements._gotcha.value) return; // spam bot
    var req = buildRequest();
    var quand = state.jours.map(texteSouhait).join(" ou ");
    var souhait = (state.jours.length > 1 ? "Vos souhaits : " : "Votre souhait : ") + quand;

    if (!C.rdv.endpoint) {
      var body = "Bonjour,\n\nJe souhaite demander un rendez-vous :\n\n" +
        "Prestation : " + req.prestation + " (" + req.duree + ", " + req.tarif + ")\n" +
        "Lieu : " + req.lieu + "\n" +
        "Règlement : " + req.reglement + "\n" +
        "Souhait : " + quand + "\n\nNom : " + req.nom + "\nTéléphone : " + req.telephone + "\nE-mail : " + req.email +
        (req.message ? "\n\nMessage : " + req.message : "");
      window.location.href = "mailto:" + C.contact.email + "?subject=" + encodeURIComponent("Demande de rendez-vous : " + req.prestation) + "&body=" + encodeURIComponent(body);
      showDone("Il reste à envoyer votre e-mail", "Votre messagerie vient de s'ouvrir avec votre demande pour le " + quand + ". Envoyez ce message pour la transmettre. Si rien ne s'est ouvert, contactez-moi au " + C.contact.telephone + ".");
      return;
    }

    var btn = $('button[type="submit"]', form);
    btn.disabled = true;
    btn.textContent = "Envoi…";
    fetch(C.rdv.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(req)
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      var choix = choixReglement(services[state.service])[state.reglement];
      if (choix.montant) {
        showDone("Votre demande est bien envoyée", souhait + ". Je vous confirme le jour et l'heure par téléphone ou par e-mail, ou je vous propose une autre date. Je vous enverrai alors le lien pour régler " + (choix.acompte ? "l'acompte de " : "") + fmtEuros(choix.montant) + " en ligne. Votre rendez-vous est définitif une fois confirmé.");
      } else if (choix.cadeau) {
        showDone("Votre demande est bien envoyée", souhait + ". Je vérifie votre carte cadeau et je vous confirme le jour et l'heure par téléphone ou par e-mail, ou je vous propose une autre date. Si la carte ne couvre pas toute la prestation, le solde se règle sur place, par carte ou en espèces.");
      } else {
        showDone("Votre demande est bien envoyée", souhait + ". Je vous confirme le jour et l'heure par téléphone ou par e-mail, ou je vous propose une autre date. Votre rendez-vous est définitif une fois confirmé. Vous réglerez sur place, par carte ou en espèces.");
      }
    }).catch(function () {
      $('[data-error="3"]').textContent = "L'envoi a échoué. Réessayez, ou contactez-moi au " + C.contact.telephone + ".";
    }).finally(function () {
      btn.disabled = false;
      btn.textContent = "Envoyer ma demande";
    });
  });

  $("#restart").addEventListener("click", function () {
    form.reset();
    state.service = state.reglement = null;
    state.jours = [];
    afficherCodeCadeau();
    renderRecap();
    goTo(1);
  });

  goTo(1, false);
})();
