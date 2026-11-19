// Rubrique Conseils : écrit conseils.html et une page par article, dans le style des pages du site.
// Les articles sont la source de vérité ici : modifier ou ajouter un article dans ARTICLES (le plus récent en premier),
// puis lancer : node _outils/creer-conseils.js — et ajouter toute nouvelle page à sitemap.xml.
// Le dossier _outils n est pas publié sur le site.
"use strict";
const fs = require("fs"), path = require("path");
const R = path.join(__dirname, "..");
const SITE = "https://freyage.fr/";
const DATE = "2026-11-19", DATE_FR = "19 novembre 2026";

const esc = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const texte = html => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const ul = items => "<ul>\n" + items.map(i => "          <li>" + i + "</li>").join("\n") + "\n        </ul>";

const ARTICLES = [
  {
    slug: "conseils-maquillage-peau-mature",
    titre: "Maquillage peau mature : textures, techniques et couleurs à privilégier",
    title: "Maquillage peau mature : textures, techniques et couleurs | FreyAge",
    description: "Textures fluides, teint lumineux, fards satinés, sourcils et lèvres : mes conseils de maquilleuse pour un maquillage de peau mature qui illumine sans marquer.",
    resume: "Textures fluides, teint lumineux, fards satinés et couleurs douces : illuminer sans marquer les ridules.",
    intro: "Avec les années, la peau devient plus fine et plus sèche, les traits se relâchent un peu, et les produits d'avant ne réagissent plus de la même façon. Il ne s'agit pas de «&nbsp;cacher&nbsp;»&nbsp;: l'objectif est d'illuminer, avec des textures et des gestes adaptés.",
    sections: [
      ["Préparer la peau : la moitié du résultat", `<p>Une peau mature manque souvent d'hydratation, et c'est ce qui fait marquer le fond de teint dans les ridules. Avant de vous maquiller, appliquez un soin hydratant riche et laissez-le pénétrer quelques minutes. Un soin contour des yeux et un baume sur les lèvres font aussi toute la différence.</p>
        <p>Une base lissante ou hydratante, posée seulement sur les zones qui en ont besoin, aide ensuite le maquillage à tenir sans se loger dans les plis.</p>`],
      ["Les textures à privilégier", `${ul([
          "<strong>Le fond de teint</strong>&nbsp;: fluide ou sérum, au fini satiné ou lumineux. Il épouse la peau au lieu de la figer.",
          "<strong>Le correcteur</strong>&nbsp;: crémeux et hydratant, en petite quantité. Trop de produit sous les yeux marque les plis.",
          "<strong>Le blush et l'enlumineur</strong>&nbsp;: en crème ou en stick, ils fondent dans la peau.",
          "<strong>La poudre</strong>&nbsp;: très fine, et seulement sur la zone T si elle brille."
        ])}
        <p>À éviter&nbsp;: les fonds de teint très couvrants et très mats, la poudre épaisse sur tout le visage et les fards secs à grosses paillettes sur la paupière.</p>`],
      ["Les bons gestes pour le teint", ul([
        "Posez le fond de teint en couche fine au centre du visage, puis estompez vers l'extérieur avec une éponge humide ou du bout des doigts&nbsp;: leur chaleur le fait fondre.",
        "Corrigez seulement là où c'est nécessaire&nbsp;: cernes, rougeurs, taches.",
        "Tapotez le correcteur plutôt que de l'étirer.",
        "Si une ridule marque, tapotez l'excédent avec l'éponge propre."
      ])],
      ["Les yeux : ouvrir le regard", `${ul([
          "Une base pour paupières évite que le fard se loge dans les plis.",
          "Préférez des fards mats ou satinés, dans des tons taupe, brun doux, bronze ou prune. Un léger satiné au centre de la paupière reste très flatteur.",
          "Un crayon estompé au ras des cils supérieurs densifie le regard sans le durcir, mieux qu'un eye-liner liquide très graphique.",
          "Recourbez les cils et misez sur un mascara allongeant sur les cils du haut. En bas, très peu de produit, ou pas du tout."
        ])}
        <p>Si votre paupière tombe un peu, retrouvez les gestes adaptés dans l'article sur les <a href="conseils-maquillage-paupieres-tombantes.html">paupières tombantes ou sans pli</a>.</p>`],
      ["Les sourcils, un lifting naturel", `<p>Avec le temps, les sourcils s'affinent ou blanchissent. Les redessiner donne immédiatement de la structure au visage. Choisissez un crayon ou une poudre légèrement plus clair que vos cheveux s'ils sont foncés, ou un taupe doux s'ils sont gris ou blancs. Dessinez par petits traits, comme des poils, puis brossez les sourcils vers le haut avec un gel teinté ou transparent.</p>`],
      ["Les couleurs qui illuminent", ul([
        "<strong>Le blush</strong>&nbsp;: rose pêche, bois de rose ou abricot, posé sur le haut des pommettes et estompé vers les tempes pour remonter le visage.",
        "<strong>L'enlumineur</strong>&nbsp;: un reflet nacré discret, sur le haut des pommettes seulement, jamais sur les zones ridées.",
        "<strong>Les lèvres</strong>&nbsp;: rose framboise, rose nude, corail ou rouge doux. Un crayon de la même teinte autour de la bouche empêche le rouge à lèvres de filer dans les petites ridules.",
        "<strong>À éviter</strong>&nbsp;: les nudes trop beiges ou trop pâles, qui éteignent le teint."
      ])],
      ["Fixer sans dessécher", `<p>Plutôt qu'une couche de poudre, terminez par une brume fixante ou hydratante&nbsp;: le maquillage tient et la peau garde son éclat. Dans la journée, un papier matifiant suffit pour les retouches.</p>`]
    ],
    cta: ["Un maquillage adapté à votre peau", "Pour une occasion, je vous maquille avec des textures choisies pour votre peau. Pour apprendre les bons gestes au quotidien, le cours d'auto-maquillage reprend tout cela avec vos propres produits. Et pour préparer la peau, le soin du visage ou le rituel repulpant lui redonnent confort et éclat.",
      [["index.html#rdv", "Prendre rendez-vous"], ["index.html#cours", "Les cours d'auto-maquillage"], ["soins-visage-bruges.html", "Les soins du visage"]]]
  },
  {
    slug: "conseils-fond-de-teint-peau-noire-metisse",
    titre: "Peau noire, métisse ou mate : bien choisir son fond de teint",
    title: "Fond de teint peau noire, métisse ou mate : bien le choisir | FreyAge",
    description: "Sous-ton, test sur la mâchoire, effet gris, taches, poudre et flash : mes conseils de maquilleuse pour choisir un fond de teint sur peau noire, métisse ou mate.",
    resume: "Sous-ton, test sur la mâchoire, effet gris, taches et flash : les repères pour trouver la bonne teinte.",
    intro: "Un fond de teint trop clair, trop rosé ou qui grise le visage : c'est la remarque que j'entends le plus souvent chez les clientes à la peau noire, métisse ou mate. Bonne nouvelle, quelques repères suffisent pour trouver la bonne teinte.",
    sections: [
      ["1. Trouver votre sous-ton", `<p>La teinte, c'est la profondeur de votre peau&nbsp;: claire, moyenne ou foncée. Le sous-ton, c'est la couleur qui se trouve en dessous, et c'est lui qui fait la différence. Sur les peaux noires, métisses et mates, on rencontre souvent&nbsp;:</p>
        ${ul([
          "<strong>un sous-ton doré ou jaune</strong>&nbsp;: la peau s'illumine avec l'or&nbsp;;",
          "<strong>un sous-ton olive</strong>&nbsp;: un fond légèrement vert ou gris, fréquent sur les peaux mates&nbsp;;",
          "<strong>un sous-ton rouge ou cuivré</strong>&nbsp;: une chaleur rosée ou acajou, surtout sur les peaux foncées&nbsp;;",
          "<strong>un sous-ton neutre</strong>&nbsp;: un équilibre entre les deux."
        ])}
        <p>Un repère simple&nbsp;: à la lumière du jour, comparez un bijou doré et un bijou argenté contre votre peau. Celui qui vous illumine le plus vous oriente vers un sous-ton chaud ou plus froid.</p>`],
      ["2. Tester au bon endroit, à la bonne lumière", `<p>Le dos de la main n'a pas la même couleur que le visage. Testez deux ou trois teintes en bandes fines sur la mâchoire, en descendant un peu sur le cou, puis regardez à la lumière du jour, près d'une fenêtre. La bonne teinte est celle qui disparaît, sans démarcation avec le cou.</p>
        <p>Beaucoup de visages ont plusieurs nuances&nbsp;: le front et le pourtour du visage sont souvent plus foncés que le centre. Dans ce cas, n'hésitez pas à utiliser deux teintes, ou à mélanger deux fonds de teint.</p>`],
      ["3. Éviter l'effet gris", `<p>L'effet gris, ou «&nbsp;cendré&nbsp;», vient presque toujours d'une teinte trop claire, d'un sous-ton trop rosé ou d'une poudre blanche. Si votre fond de teint ternit votre visage une fois posé, ne cherchez pas à le rattraper avec plus de produit&nbsp;: changez de teinte ou de sous-ton.</p>`],
      ["4. Corriger les taches avant le fond de teint", `<p>Les taches pigmentaires et les cernes bruns ou violacés sont fréquents sur les peaux foncées. Un correcteur pêche ou orangé, posé en petite quantité uniquement sur la zone à corriger, neutralise le brun ou le violet. Le fond de teint vient ensuite, plus léger&nbsp;: il n'a plus besoin de tout couvrir.</p>`],
      ["5. Poudre et photos : attention au flash", `<p>Certaines poudres libres très blanches, dites «&nbsp;HD&nbsp;», renvoient la lumière du flash et laissent des traces claires sur les photos. Pour un mariage ou une soirée photographiée, préférez une poudre teintée, proche de votre carnation, posée seulement là où la peau brille.</p>`],
      ["6. Blush, bronzer et lèvres", `<p>Sur les peaux noires, métisses et mates, les couleurs riches ressortent magnifiquement&nbsp;: terracotta, prune, framboise, bronze, cuivre. Les blushs très pâles et les enlumineurs argentés ont tendance à blanchir le teint&nbsp;: préférez des reflets dorés ou cuivrés.</p>`]
    ],
    cta: ["Envie d'être conseillée en direct&nbsp;?", "Pendant un rendez-vous maquillage, je choisis avec vous la teinte et le sous-ton qui vous vont. Et pour apprendre à le faire seule avec vos propres produits, le cours d'auto-maquillage est fait pour ça.",
      [["index.html#rdv", "Prendre rendez-vous"], ["maquillage-toutes-carnations.html", "Le maquillage pour toutes les carnations"], ["index.html#cours", "Les cours d'auto-maquillage"]]]
  },
  {
    slug: "conseils-maquillage-mariee-orientale",
    titre: "Mariée orientale : préparer un maquillage pour chaque tenue",
    title: "Maquillage de mariée orientale : un look pour chaque tenue | FreyAge",
    description: "Caftan, takchita, karakou, robe blanche : comment préparer vos maquillages de mariée orientale, réussir l'essai et faire tenir le maquillage toute la fête.",
    resume: "Caftan, takchita, robe blanche : préparer ses looks, réussir l'essai et faire tenir le maquillage toute la fête.",
    intro: "Un mariage oriental, c'est souvent plusieurs tenues, une fête qui dure tard dans la nuit et, parfois, une soirée du henné en plus. Voici comment je prépare les maquillages avec mes mariées, pour être belle à chaque passage.",
    sections: [
      ["Faire la liste des tenues", `<p>Tout commence par l'ordre de passage&nbsp;: caftan, takchita, karakou, robe kabyle, keswa, robe blanche… Pour chaque tenue, notez sa couleur principale, ses broderies (or, argent, perles) et les bijoux qui l'accompagnent. Le maquillage se construit à partir de là.</p>`],
      ["Une base commune, un regard qui évolue", `<p>On ne refait pas tout le maquillage à chaque changement. Le teint reste le même du début à la fin&nbsp;: il doit tenir des heures. Ce qui change, ce sont surtout les yeux et les lèvres&nbsp;:</p>
        ${ul([
          "un regard doux et lumineux pour une tenue claire ou la robe blanche&nbsp;;",
          "un regard plus intense, doré ou bronze, pour les tenues brodées d'or&nbsp;;",
          "des lèvres qui suivent la tenue&nbsp;: nude, rouge profond, prune ou bordeaux&nbsp;;",
          "un khôl ou un eye-liner renforcé pour la tenue la plus traditionnelle, si vous le souhaitez."
        ])}`],
      ["Bien préparer l'essai", `<p>L'essai est le moment où l'on valide chaque look. Pour qu'il soit vraiment utile, apportez&nbsp;:</p>
        ${ul([
          "des photos de chaque tenue, prises à la lumière du jour&nbsp;;",
          "les bijoux principaux, ou leurs photos&nbsp;;",
          "vos inspirations&nbsp;: des photos de mariées ou de maquillages que vous aimez&nbsp;;",
          "l'ordre de passage des tenues et les horaires de la fête, même approximatifs."
        ])}
        <p>Pendant l'essai, on pose le teint de base, puis on fait évoluer le regard et les lèvres pour voir le rendu de chaque étape. Prenez des photos, avec et sans flash.</p>`],
      ["Faire tenir le maquillage toute la nuit", `<p>Chaleur, danse, émotion, embrassades&nbsp;: le maquillage d'une mariée orientale est mis à rude épreuve. Pour qu'il tienne&nbsp;:</p>
        ${ul([
          "une peau bien préparée et hydratée dans les semaines qui précèdent&nbsp;;",
          "une base adaptée à votre type de peau, puis un fond de teint longue tenue&nbsp;;",
          "une fixation en couches fines plutôt qu'une épaisse couche de poudre&nbsp;;",
          "un mascara et un eye-liner waterproof&nbsp;;",
          "un kit retouche à portée de main&nbsp;: papier matifiant, poudre et rouge à lèvres de chaque tenue."
        ])}`],
      ["Penser à la soirée du henné", `<p>La soirée du henné a souvent lieu la veille ou quelques jours avant. Choisissez un maquillage assorti à la tenue, mais plus léger que celui du jour&nbsp;J, pour garder l'effet de surprise pour le mariage. Et évitez tout nouveau soin ou produit dans les jours qui précèdent.</p>`],
      ["Prévoir le temps de maquillage", `<p>Chaque changement de maquillage demande un moment&nbsp;: prévoyez-le dans le planning de la journée, avec la personne qui vous aide à vous habiller. Nous fixons ensemble la durée de chaque étape pendant l'essai, pour que tout s'enchaîne sans stress.</p>`]
    ],
    cta: ["Vous préparez votre mariage oriental&nbsp;?", "Je vous accompagne de l'essai à la fin de la fête, à Mérignac et autour de Bordeaux, avec un devis sur mesure selon vos tenues et le nombre de personnes à maquiller.",
      [["contact.html?objet=mariee", "Demander un devis"], ["mariage-oriental.html", "Le maquillage de mariage oriental"]]]
  },
  {
    slug: "conseils-preparer-sa-peau-avant-mariage",
    titre: "Préparer sa peau avant le mariage : le calendrier des 3 derniers mois",
    title: "Préparer sa peau avant le mariage : le calendrier sur 3 mois | FreyAge",
    description: "Un soin du visage par mois, l'essai, la dernière semaine et la veille : le calendrier pour arriver au mariage avec une peau reposée et un maquillage qui tient.",
    resume: "Un soin du visage par mois, l'essai, la dernière semaine et la veille : le calendrier d'une peau reposée le jour J.",
    intro: "Le plus beau maquillage tient mieux sur une peau reposée et hydratée. Pas besoin d'une routine compliquée&nbsp;: l'essentiel est de commencer assez tôt et de ne rien changer au dernier moment. Voici le calendrier que je conseille à mes mariées.",
    sections: [
      ["3 mois avant : poser les bases", ul([
        "Adoptez une routine simple, matin et soir&nbsp;: un nettoyant doux, un soin hydratant adapté à votre peau, et une protection solaire le matin.",
        "Buvez régulièrement et soignez votre sommeil&nbsp;: ça se voit sur la peau.",
        "<strong>Prévoyez un soin du visage par mois jusqu'au mariage.</strong> C'est la régularité qui fait la différence&nbsp;: votre peau s'habitue, gagne en éclat, et on ajuste le soin au fil des séances selon ses besoins.",
        "Si vous pensez au plasma froid, parlez-m'en dès maintenant&nbsp;: après un diagnostic, nous verrons ensemble s'il vous convient et à quel moment le programmer, pour que votre peau soit reposée le jour&nbsp;J."
      ])],
      ["1 à 2 mois avant : l'essai maquillage", ul([
        "Faites votre essai maquillage, idéalement avec votre coiffure, ou une photo de la coiffure prévue.",
        "Signalez-moi toute allergie, réaction ou produit que votre peau n'aime pas.",
        "Notez ce que vous voulez garder ou ajuster&nbsp;: un essai supplémentaire est possible si besoin."
      ])],
      ["2 à 3 semaines avant : ne plus rien changer", ul([
        "Évitez tout nouveau produit de soin ou de maquillage&nbsp;: ce n'est pas le moment de découvrir une allergie.",
        "Pas de gommage fort ni de soin agressif à l'approche du mariage. Pour l'épilation du visage, faites-la quelques jours avant, pas la veille.",
        "Programmez votre dernier soin mensuel environ une semaine avant le mariage, pour profiter de son éclat sans risque de rougeur."
      ])],
      ["La semaine du mariage", ul([
        "Hydratez bien votre peau, matin et soir, sans changer de produits.",
        "Limitez le soleil, ou protégez-vous bien.",
        "Préparez votre trousse de retouche&nbsp;: le rouge à lèvres du jour&nbsp;J, de la poudre et du papier matifiant."
      ])],
      ["La veille et le jour J", ul([
        "La veille&nbsp;: un démaquillage soigneux, un soin hydratant et, si possible, une bonne nuit.",
        "Le matin&nbsp;: un visage propre et hydraté, sans fond de teint ni autobronzant, et un baume sur les lèvres. Je m'occupe du reste."
      ])]
    ],
    cta: ["Prendre soin de votre peau avant le grand jour", "Je vous reçois à Bruges pour votre soin du visage mensuel et le plasma froid, et à Mérignac pour l'essai et le maquillage de mariée.",
      [["mariage.html", "Voir les formules mariée"], ["soins-visage-bruges.html", "Les soins du visage"], ["plasma-froid.html", "Le plasma froid"]]]
  },
  {
    slug: "conseils-maquillage-paupieres-tombantes",
    titre: "Paupières tombantes ou sans pli : mes astuces de maquillage",
    title: "Maquiller des paupières tombantes ou sans pli : astuces | FreyAge",
    description: "Faux pli, fards mats, eye-liner adapté, cils recourbés : mes astuces de maquilleuse pour mettre en valeur des paupières tombantes ou sans pli.",
    resume: "Faux pli, fards mats, eye-liner adapté et cils recourbés : un maquillage qui se voit les yeux ouverts.",
    intro: "Vous passez du temps sur votre fard… et il disparaît dès que vous ouvrez les yeux&nbsp;? C'est le cas de beaucoup de paupières tombantes ou sans pli. La solution&nbsp;: maquiller pour les yeux ouverts, pas pour les yeux fermés.",
    sections: [
      ["La règle d'or : maquiller les yeux ouverts", `<p>Regardez-vous de face, les yeux ouverts, dans un miroir à hauteur du visage. Repérez la partie de la paupière qui reste visible&nbsp;: c'est elle qu'on travaille en priorité. Ce qui est caché quand l'œil est ouvert n'a pas besoin de beaucoup de produit.</p>`],
      ["Une base pour éviter les traces", `<p>Sur une paupière tombante, la peau du dessus touche la paupière mobile, et le fard a tendance à marquer le pli ou à se reporter. Une base pour paupières, posée en couche fine, fixe le fard et évite ces traces.</p>`],
      ["Paupières tombantes : créer un faux pli", ul([
        "Posez une couleur de transition mate, un peu plus foncée que votre peau, légèrement au-dessus du pli naturel et les yeux ouverts&nbsp;: elle dessine un «&nbsp;faux pli&nbsp;» visible.",
        "Gardez les fards irisés pour le centre de la paupière mobile et le coin interne&nbsp;: sur la partie tombante, ils accentuent le relief.",
        "Étirez le fard vers l'extérieur et vers le haut, en direction de la fin du sourcil, pour remonter le regard."
      ])],
      ["Paupières sans pli : jouer sur le dégradé", ul([
        "Construisez le fard en dégradé&nbsp;: la teinte la plus foncée au ras des cils, puis de plus en plus claire en remontant. Le dégradé reste visible les yeux ouverts, même sans pli.",
        "Montez le fard un peu plus haut que vous ne le pensez, et vérifiez toujours les yeux ouverts.",
        "Une touche de fard lumineux ou de paillettes au centre de la paupière ouvre le regard."
      ])],
      ["L'eye-liner adapté", ul([
        "Pour des paupières tombantes&nbsp;: un trait fin au ras des cils, puis une pointe tracée les yeux ouverts, qui suit l'angle de la paupière. Elle reste visible au lieu de se «&nbsp;casser&nbsp;».",
        "Pour des paupières sans pli&nbsp;: un trait un peu plus épais vers l'extérieur, car une partie se cache quand l'œil est ouvert.",
        "Un crayon passé au ras des cils supérieurs, par en dessous, densifie le regard sans prendre de place sur la paupière."
      ])],
      ["Les cils, vos meilleurs alliés", `<p>Recourbez les cils avant le mascara&nbsp;: ils dégagent la paupière et ouvrent l'œil. Un mascara waterproof garde mieux la courbe, surtout sur des cils droits. Pour une occasion, des faux-cils fins, plus longs vers l'extérieur ou posés en petites touffes, agrandissent le regard sans l'alourdir.</p>`]
    ],
    cta: ["Apprendre les gestes sur vos propres yeux", "Pendant un cours d'auto-maquillage, je vous montre les gestes adaptés à la forme de vos yeux, avec vos produits, pour les refaire facilement seule.",
      [["index.html#cours", "Voir les cours d'auto-maquillage"], ["index.html#rdv", "Prendre rendez-vous"]]]
  }
];

function nav(courant) {
  const liens = [["prestations.html", "Prestations"], ["portfolio.html", "Portfolio"], ["conseils.html", "Conseils"], ["mariage.html", "Mariée"], ["index.html#questions", "FAQ"], ["carte-cadeau.html", "Carte cadeau"], ["cahe.html", "Produits CAHÉ"], ["contact.html", "Contact"]];
  return liens.map(([h, t]) => `      <a href="${h}"${h === courant ? ' aria-current="page"' : ""}>${t}</a>`).join("\n") + '\n      <a class="nav-rdv" href="index.html#rdv">Prendre rendez-vous</a>';
}

function page({ fichier, title, description, ogType, jsonld, courant, main }) {
  const url = SITE + fichier;
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="FreyAge">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="https://freyage.fr/assets/logo.png">
  <meta property="og:image:width" content="458">
  <meta property="og:image:height" content="480">
  <meta property="og:image:alt" content="Logo FreyAge : une rune dorée au-dessus de deux ailes">
  <meta name="theme-color" content="#566A4D">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <script>document.documentElement.className = "js";</script>
  <link rel="stylesheet" href="css/style.css">
  <script type="application/ld+json">
${JSON.stringify(jsonld, null, 2).replace(/^/gm, "  ")}
  </script>
</head>
<body>
  <a class="skip" href="#contenu">Aller au contenu</a>

  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <symbol id="rune" viewBox="0 0 420 800">
      <path d="M20 16V784M20 264 340 32M20 404 396 164" fill="none" stroke="currentColor" stroke-width="48" stroke-linecap="round"/>
    </symbol>
  </svg>

  <header class="site-header">
    <a class="brand" href="index.html" aria-label="FreyAge, accueil">
      <img src="assets/logo-mark.png" alt="" width="64" height="62">
      <span>FreyAge</span>
    </a>
    <button type="button" class="menu-bouton" aria-expanded="false" aria-controls="menu-principal"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Menu</span></button>
    <nav id="menu-principal" aria-label="Navigation principale">
${nav(courant)}
    </nav>
    <a class="btn btn-small" href="index.html#rdv">Prendre rendez-vous</a>
  </header>

  <main id="contenu" class="section">
${main}
  </main>

  <footer class="site-footer">
    <div class="wrap footer-inner">
      <span>© FreyAge</span>
      <span class="footer-liens"><a href="acces.html">Accès</a><a href="mentions-legales.html">Mentions légales</a><a href="cgv.html">CGV</a><a href="https://g.page/r/CeJzFuRjBVtLECE/review" rel="noopener">Laisser un avis</a></span>
    </div>
  </footer>

  <a class="btn btn-gold rdv-mobile" href="index.html#rdv">Prendre rendez-vous</a>

  <script src="js/config.js"></script>
  <script src="js/theme.js"></script>
  <script src="js/haut.js"></script>
  <!-- Cloudflare Web Analytics : statistiques de visite anonymes, sans cookies --><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "a20d8a75c0714e14886eba06712e6e13"}'></script>
</body>
</html>
`;
}

const ORGA = { "@type": "Organization", name: "FreyAge", url: SITE, logo: { "@type": "ImageObject", url: SITE + "assets/logo.png" } };

for (const a of ARTICLES) {
  const fichier = a.slug + ".html";
  const corps = a.sections.map(([h, html]) => `        <h2>${h.replace(" :", "&nbsp;:")}</h2>\n        ${html}`).join("\n\n");
  const mots = texte(a.intro + " " + a.sections.map(s => s[0] + " " + s[1]).join(" ")).split(" ").length;
  const minutes = Math.max(2, Math.round(mots / 200));
  const [ctaTitre, ctaTexte, ctaLiens] = a.cta;
  const autres = ARTICLES.filter(x => x !== a);
  const main = `    <article class="wrap page-dediee article">
      <header class="section-head">
        <p class="eyebrow"><svg class="rune-icon"><use href="#rune"/></svg><a href="conseils.html">Conseils</a></p>
        <h1 class="page-title">${a.titre.replace(" :", "&nbsp;:")}</h1>
        <p class="article-meta"><time datetime="${DATE}">${DATE_FR}</time> · ${minutes}&nbsp;min de lecture</p>
        <p class="section-note">${a.intro}</p>
      </header>

${corps}

      <aside class="article-cta">
        <h2>${ctaTitre}</h2>
        <p>${ctaTexte}</p>
        <p class="page-actions">${ctaLiens.map(([h, t], i) => `<a${i === 0 ? ' class="btn"' : ""} href="${h}">${t}</a>`).join("")}</p>
      </aside>

      <nav class="article-suite" aria-label="À lire aussi">
        <h2>À lire aussi</h2>
        <ul>
${autres.map(x => `          <li><a href="${x.slug}.html">${x.titre}</a></li>`).join("\n")}
        </ul>
      </nav>
    </article>`;
  const jsonld = { "@context": "https://schema.org", "@type": "BlogPosting", headline: a.titre, description: a.description, datePublished: DATE, dateModified: DATE, inLanguage: "fr-FR", mainEntityOfPage: SITE + fichier, url: SITE + fichier, image: SITE + "assets/logo.png", author: ORGA, publisher: ORGA };
  fs.writeFileSync(path.join(R, fichier), page({ fichier, title: a.title, description: a.description, ogType: "article", jsonld, courant: null, main }));
  console.log(fichier, "·", mots, "mots ·", minutes, "min");
}

// Page d'accueil de la rubrique
{
  const fichier = "conseils.html";
  const title = "Conseils maquillage et soins du visage | FreyAge, près de Bordeaux";
  const description = "Les conseils de FreyAge : fond de teint pour peau noire ou métisse, mariée orientale, préparer sa peau avant le mariage, paupières tombantes ou sans pli.";
  const main = `    <div class="wrap page-dediee">
      <header class="section-head">
        <p class="eyebrow"><svg class="rune-icon"><use href="#rune"/></svg>Conseils</p>
        <h1 class="page-title">Conseils maquillage et soins</h1>
        <p class="section-note">Mes conseils de maquillage et de soin, pour votre quotidien comme pour les grands jours.</p>
      </header>

      <ul class="articles">
${ARTICLES.map(a => `        <li class="article-carte">
          <h2><a href="${a.slug}.html">${a.titre.replace(" :", "&nbsp;:")}</a></h2>
          <p>${a.resume.replace(/ :/g, "&nbsp;:").replace(/jour J/g, "jour&nbsp;J")}</p>
          <a class="lire" href="${a.slug}.html" aria-hidden="true" tabindex="-1">Lire l'article</a>
        </li>`).join("\n")}
      </ul>
    </div>`;
  const jsonld = { "@context": "https://schema.org", "@type": "Blog", name: "Conseils FreyAge", url: SITE + fichier, inLanguage: "fr-FR", publisher: ORGA, blogPost: ARTICLES.map(a => ({ "@type": "BlogPosting", headline: a.titre, url: SITE + a.slug + ".html", datePublished: DATE })) };
  fs.writeFileSync(path.join(R, fichier), page({ fichier, title, description, ogType: "website", jsonld, courant: "conseils.html", main }));
  console.log(fichier);
}
