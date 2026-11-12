// Offres temporaires (config.js, « offres ») : quelle réduction s'applique à une prestation, et à quel prix.
(function () {
  "use strict";
  var C = window.FREYAGE;
  if (!C || !C.offres) return;
  var liste = C.offres.liste || [];

  function iso(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  function aujourdhui() { return iso(new Date()); }
  function jourMois(j) {
    return new Date(j + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" }).replace(/^1 /, "1er ");
  }
  function concerne(o, nom, categorie) {
    return (o.prestations || []).indexOf(nom) !== -1 || (o.categories || []).indexOf(categorie) !== -1;
  }
  // L'offre peut-elle encore servir aujourd'hui (pour l'afficher) ?
  function enCours(o, jour) {
    if (o.demande) return o.demande.debut <= jour && jour <= o.demande.fin;
    if (o.rdv) return C.offres.affichage.debut <= jour && jour <= o.rdv.fin;
    return false;
  }
  // Les dates de rendez-vous souhaitées (ISO) respectent-elles l'offre ? Sans date choisie : oui, sous condition.
  function datesOk(o, dates) {
    if (o.demande) return dates.every(function (d) { return d <= o.rdvFin; });
    return dates.every(function (d) { return o.rdv.debut <= d && d <= o.rdv.fin; });
  }
  // Ce que dit l'offre sur les dates, ex. « pour un rendez-vous du 15 au 31 décembre ».
  function condition(o) {
    if (o.demande) return "pour une demande envoyée jusqu'au " + jourMois(o.demande.fin) + ", rendez-vous jusqu'au " + jourMois(o.rdvFin);
    return "pour un rendez-vous du " + jourMois(o.rdv.debut).replace(/ \S+$/, "") + " au " + jourMois(o.rdv.fin);
  }

  // Meilleure offre pour une prestation. dates : dates souhaitées (ISO), vide si pas encore choisies.
  function pour(nom, categorie, dates, jour) {
    jour = jour || aujourdhui();
    dates = dates || [];
    return liste.filter(function (o) {
      return o.remise && concerne(o, nom, categorie) && enCours(o, jour) && datesOk(o, dates);
    }).sort(function (a, b) { return b.remise - a.remise; })[0] || null;
  }
  // Prix réduit d'un tarif fixe (« 70 € » -> 59), arrondi à l'euro inférieur ; null si le prix n'est pas fixe.
  function prixReduit(prix, remise) {
    if (!/^[0-9]/.test(prix)) return null;
    return Math.floor(parseFloat(prix) * (100 - remise) / 100);
  }
  // Les offres à annoncer aujourd'hui, dans l'ordre de config.js.
  function actives(jour) {
    jour = jour || aujourdhui();
    return liste.filter(function (o) { return enCours(o, jour); });
  }

  window.FreyOffres = { pour: pour, prixReduit: prixReduit, condition: condition, actives: actives, jourMois: jourMois, aujourdhui: aujourdhui, iso: iso };
})();
