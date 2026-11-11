// Écrit la carte, l'aperçu et les coordonnées directement dans le HTML, à partir de js/config.js.
// À relancer après chaque changement de prestations, de tarifs ou de coordonnées :
//   node _outils/generer-html.js
// Le dossier _outils n'est pas publié sur le site.
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");
const racine = path.join(__dirname, "..");
const lire = f => fs.readFileSync(path.join(racine, f), "utf8");

// Exécute un script du site sur des éléments factices et renvoie le HTML qu'il aurait affiché.
function rendre(script, ids, dataset) {
  const elements = {};
  ids.forEach(id => { elements[id] = { innerHTML: "", dataset: dataset || {} }; });
  const contexte = vm.createContext({
    window: {},
    document: { getElementById: id => elements[id] || null }
  });
  vm.runInContext(lire("js/config.js"), contexte);
  vm.runInContext(lire(script), contexte);
  return Object.fromEntries(ids.map(id => [id, elements[id].innerHTML]));
}

function injecter(html, id, contenu, fichier) {
  const motif = new RegExp(`(<(div|ul|nav)\\b[^>]*\\bid="${id}"[^>]*>)(?:<!-- rendu:${id} -->[\\s\\S]*?<!-- /rendu:${id} -->)?(</\\2>)`);
  if (!motif.test(html)) throw new Error(`${fichier} : emplacement #${id} introuvable`);
  return html.replace(motif, (m, debut, balise, fin) => `${debut}<!-- rendu:${id} -->${contenu}<!-- /rendu:${id} -->${fin}`);
}

const COORDONNEES = ["js/commun.js", ["contact", "reseaux"]];
const pages = {
  "index.html": [COORDONNEES, ["js/apercu.js", ["apercu"]]],
  "contact.html": [COORDONNEES],
  "acces.html": [COORDONNEES],
  "prestations.html": [["js/prestations.js", ["categories", "carte"]]],
  "plasma-froid.html": [["js/prestations.js", ["carte"], { categorie: "plasma-froid" }]],
  "soins-visage-bruges.html": [["js/prestations.js", ["carte"], { categorie: "soins" }]]
};

for (const [fichier, rendus] of Object.entries(pages)) {
  let html = lire(fichier);
  for (const [script, ids, dataset] of rendus) {
    const resultat = rendre(script, ids, dataset);
    for (const id of ids) {
      if (!resultat[id]) throw new Error(`${fichier} : rien à afficher pour #${id}`);
      html = injecter(html, id, resultat[id], fichier);
    }
  }
  fs.writeFileSync(path.join(racine, fichier), html);
  console.log("à jour :", fichier);
}

// ---- Données structurées (JSON-LD) lues par Google : établissements, prestations et prix.
{
  const contexte = vm.createContext({ window: {} });
  vm.runInContext(lire("js/config.js"), contexte);
  const C = contexte.window.FREYAGE;
  const SITE = "https://freyage.fr/";
  const DESCRIPTIONS = {
    merignac: "Maquillage, formule mariée et cours d'auto-maquillage à Mérignac, près de Bordeaux.",
    bruges: "Soins du visage et plasma froid à Bruges, près de Bordeaux."
  };
  const IMAGE = SITE + "assets/portfolio/mariee-1.jpg";

  // « 65 € », « Dès 480 € », « de 50 € à 150 € », « Sur devis » -> prix pour Google (ou null).
  function prix(texte) {
    const n = (String(texte).match(/\d+(?:[.,]\d+)?/g) || []).map(x => +x.replace(",", "."));
    if (!n.length) return null;
    if (n.length > 1) return { priceSpecification: { "@type": "PriceSpecification", minPrice: n[0], maxPrice: n[1], priceCurrency: "EUR" } };
    if (/dès|à partir/i.test(texte)) return { priceSpecification: { "@type": "PriceSpecification", minPrice: n[0], priceCurrency: "EUR" } };
    return { price: n[0], priceCurrency: "EUR" };
  }
  const offre = item => {
    const p = prix(item.prix);
    if (!p) return null;
    const service = { "@type": "Service", name: item.nom };
    if (item.description) service.description = item.description;
    return Object.assign({ "@type": "Offer", itemOffered: service }, p);
  };
  const catalogue = (nom, items) => ({ "@type": "OfferCatalog", name: nom, itemListElement: items.map(offre).filter(Boolean) });
  const montants = items => items.flatMap(i => (String(i.prix).match(/\d+/g) || []).map(Number));

  function etablissement(id) {
    const lieu = C.lieux[id];
    const m = lieu.adresse.match(/^(.*),\s*(\d{5})\s+(.*)$/);
    const cats = C.prestations.filter(c => c.lieu === id && c.items.length);
    const tous = montants(cats.flatMap(c => c.items));
    return {
      "@type": "BeautySalon",
      "@id": SITE + "#" + id,
      name: "FreyAge",
      url: SITE,
      image: IMAGE,
      logo: SITE + "assets/logo.png",
      telephone: "+33" + C.contact.telephone.replace(/\s/g, "").slice(1),
      email: C.contact.email,
      address: { "@type": "PostalAddress", streetAddress: m[1], postalCode: m[2], addressLocality: m[3], addressCountry: "FR" },
      areaServed: [lieu.ville, "Bordeaux"],
      priceRange: Math.min(...tous) + " € – " + Math.max(...tous) + " €",
      description: DESCRIPTIONS[id] || lieu.prestations + " à " + lieu.ville + ".",
      sameAs: C.contact.reseaux.map(r => r.url),
      hasOfferCatalog: { "@type": "OfferCatalog", name: "Prestations à " + lieu.ville, itemListElement: cats.map(c => catalogue(c.categorie, c.items)) }
    };
  }
  // Établissement réduit, pour les pages de prestations.
  const prestataire = id => {
    const e = etablissement(id);
    return { "@type": e["@type"], "@id": e["@id"], name: e.name, url: e.url, telephone: e.telephone, address: e.address, image: e.image, priceRange: e.priceRange };
  };
  const pageService = (id, nom, description, items) => {
    const lieu = C.lieux[id];
    return { "@type": "Service", name: nom, serviceType: nom, description, url: SITE, provider: prestataire(id), areaServed: [lieu.ville, "Bordeaux"], hasOfferCatalog: catalogue(nom, items) };
  };
  const cat = id => C.prestations.find(c => c.id === id);
  const mariee = cat("maquillage").items.filter(i => i.lien === "mariage.html");

  const jsonld = {
    "index.html": { "@context": "https://schema.org", "@graph": Object.keys(C.lieux).map(etablissement) },
    "soins-visage-bruges.html": Object.assign({ "@context": "https://schema.org" }, pageService("bruges", "Soins du visage", cat("soins").description, cat("soins").items), { url: SITE + "soins-visage-bruges.html" }),
    "plasma-froid.html": Object.assign({ "@context": "https://schema.org" }, pageService("bruges", "Plasma froid", cat("plasma-froid").description, cat("plasma-froid").items), { url: SITE + "plasma-froid.html" }),
    "mariage.html": Object.assign({ "@context": "https://schema.org" }, pageService("merignac", "Maquillage de mariée", "Formule Mariée : maquillage de la mariée et de ses accompagnantes, essai compris.", mariee), { url: SITE + "mariage.html" })
  };
  for (const [fichier, donnees] of Object.entries(jsonld)) {
    let html = lire(fichier);
    const bloc = '<script type="application/ld+json">\n' + JSON.stringify(donnees, null, 2).replace(/^/gm, "  ") + "\n  </script>";
    const motif = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;
    if (motif.test(html)) html = html.replace(motif, () => bloc);
    else if (html.includes('<link rel="stylesheet" href="css/style.css">')) html = html.replace('<link rel="stylesheet" href="css/style.css">', m => m + "\n  " + bloc);
    else throw new Error(fichier + " : emplacement des données structurées introuvable");
    if (html.includes("\r\n")) html = html.replace(/\r?\n/g, "\r\n");
    fs.writeFileSync(path.join(racine, fichier), html);
    console.log("données structurées :", fichier);
  }
}
