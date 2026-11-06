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
