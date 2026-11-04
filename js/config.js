/*
 * FREYAGE : tout ce que vous avez à modifier se trouve dans ce fichier.
 * `demo: true` affiche un bandeau « Aperçu » en haut de l'accueil.
 */
window.FREYAGE = {
  demo: false,

  contact: {
    telephone: "06 99 11 78 38",
    email: "contact@freyage.fr",
    adresse: "6 rue du Plantey, 33700 Mérignac",
    reseaux: [
      { nom: "Instagram", compte: "@freyage_beauty", url: "https://www.instagram.com/freyage_beauty" },
      { nom: "TikTok", compte: "@freyage1", url: "https://www.tiktok.com/@freyage1" },
      { nom: "Facebook", compte: "FreyAge", url: "https://www.facebook.com/profile.php?id=61594013965412" }
    ]
  },

  // Liens de paiement Stripe.
  paiement: {
    carteCadeau: "https://buy.stripe.com/3cIcN7c533LGfvsarRgjC00",
    acompte: "https://buy.stripe.com/7sY6oJgljdmggzw57xgjC01"
  },

  // Plages d'ouverture : 0 = dimanche, 1 = lundi… 6 = samedi. [] = fermé.
  horaires: {
    1: [],
    2: [["09:00", "12:30"], ["14:00", "18:30"]],
    3: [["09:00", "12:30"], ["14:00", "18:30"]],
    4: [["09:00", "12:30"], ["14:00", "18:30"]],
    5: [["09:00", "12:30"], ["14:00", "18:30"]],
    6: [["14:00", "18:30"]],
    0: []
  },

  rdv: {
    // Adresse du service qui reçoit les demandes de rendez-vous et de contact (ex. https://formspree.io/f/xxxxxxx).
    // Vide : la demande s'ouvre dans la messagerie du visiteur, vers contact.email.
    endpoint: "https://formspree.io/f/myeeogyb",
    delaiMinHeures: 24,  // délai minimum avant un rendez-vous
    horizonJours: 60,    // réservation possible jusqu'à X jours à l'avance
    // Agenda Google lu par le site : ses plages occupées retirent les créneaux correspondants.
    // La clé est publique par nature : elle est limitée à freyage.fr dans Google Cloud.
    agenda: {
      id: "44e31da757e71b9a7b295971c2e1ae1d1b0d3d7b61e09cced3e622dc2ccc9aa8@group.calendar.google.com",
      cle: "AIzaSyBLkOuSARwqDIfJ9WhAiTO9m9rsdVpYNfs"
    },
    tamponMinutes: 35,   // pause minimale entre deux rendez-vous
    samediTravaille: "2026-11-07", // un samedi travaillé : les samedis ouverts sont ensuite un sur deux à partir de cette date
    fermetures: []       // jours de fermeture, ex. ["2026-12-25", "2027-01-01"]
  },

  /*
   * duree en minutes ; prix affiché tel quel ; description facultative.
   * acompte : montant en euros à régler en ligne après la demande de rendez-vous.
   * lien : la prestation n'est pas réservable en ligne et renvoie vers cette section.
   * note : texte affiché à la place de la liste quand une catégorie n'a pas encore de prestations.
   */
  prestations: [
    {
      categorie: "Maquillage",
      description: "Une prestation personnalisée selon vos envies, votre style et l'occasion : événement, soirée, cérémonie, séance photo ou autre projet.",
      items: [
        { nom: "Maquillage jour", duree: 45, prix: "55 €" },
        { nom: "Maquillage soir", duree: 60, prix: "70 €" },
        { nom: "Maquillage sophistiqué", duree: 90, prix: "85 €" },
        { nom: "Maquillage invitée", duree: 60, prix: "75 €" },
        { nom: "Maquillage shooting photo", duree: 90, prix: "95 €" },
        { nom: "Maquillage mariée + essai", duree: 90, prix: "Sur devis", lien: "#mariee" }
      ]
    },
    {
      categorie: "Cours & ateliers",
      description: "Apprenez à révéler votre beauté, simplement.",
      items: [
        {
          nom: "Cours d'auto-maquillage, formule 1", duree: 90, prix: "85 €", acompte: 25.5,
          description: "Apprenez les gestes adaptés à votre visage pour reproduire facilement votre maquillage au quotidien."
        },
        {
          nom: "Cours d'auto-maquillage, formule 2", duree: 150, prix: "105 €", acompte: 31.5,
          description: "Une formule plus complète pour approfondir votre routine, découvrir de nouvelles techniques et pratiquer à votre rythme."
        }
      ]
    },
    {
      categorie: "Soins du visage",
      description: "Des soins personnalisés pour une peau sublimée.",
      items: [
        {
          nom: "Soin du visage personnalisé", duree: 60, prix: "65 €",
          description: "Un soin entièrement adapté aux besoins de votre peau. Après un temps d'échange et d'observation, le protocole est personnalisé pour vous offrir un moment de soin et de détente."
        },
        {
          nom: "Rituel repulpant", duree: 90, prix: "90 €",
          description: "Un rituel visage complet pensé pour prendre soin de la peau et lui apporter confort et éclat. Une prestation plus longue qui associe différentes étapes de soin à un véritable moment de détente."
        }
      ]
    },
    {
      categorie: "Ongles",
      description: "Des mains soignées, jusqu'au bout des ongles.",
      items: [],
      note: "Bientôt disponible."
    }
  ],

  // Portfolio : fichiers dans assets/portfolio (nom.jpg et nom-mini.jpg).
  realisations: [
    { nom: "mariee-1", categorie: "Mariée", alt: "Maquillage de mariée lumineux avec trait d'eye-liner, diadème et collier en cristal" },
    { nom: "soiree-1", categorie: "Soirée", alt: "Smoky eyes marron et lèvres nude, de trois quarts" },
    { nom: "naturel-1", categorie: "Naturel", alt: "Maquillage cuivré aux lèvres terracotta, de trois quarts" },
    { nom: "avant-apres-1", categorie: "Avant / Après", largeur: 900, alt: "Avant et après : visage sans maquillage, puis maquillage de mariée doré sous plusieurs angles" },
    { nom: "artistique-1", categorie: "Artistique", alt: "Maquillage féerique rose et blanc, oreilles d'elfe et couronne de fleurs" },
    { nom: "soiree-4", categorie: "Soirée", alt: "Regard doré, trait d'eye-liner et teint sculpté, de profil" },
    { nom: "mariee-3", categorie: "Mariée", alt: "Maquillage bohème aux tons cuivrés avec couronne de fleurs séchées" },
    { nom: "naturel-3", categorie: "Naturel", alt: "Maquillage doux aux tons dorés et lèvres rosées, de face" },
    { nom: "soiree-5", categorie: "Soirée", alt: "Eye-liner graphique, fard orangé et lèvres rouges, de face" },
    { nom: "avant-apres-3", categorie: "Avant / Après", largeur: 1200, alt: "Avant et après : visage sans maquillage, puis maquillage cuivré aux lèvres terracotta" },
    { nom: "mariee-2", categorie: "Mariée", alt: "Maquillage de mariée au teint lumineux et lèvres nude, avec diadème" },
    { nom: "soiree-3", categorie: "Soirée", alt: "Paupières dorées et trait d'eye-liner, yeux fermés" },
    { nom: "naturel-5", categorie: "Naturel", alt: "Paupières dorées et vertes, longs cils et lèvres nude, yeux fermés" },
    { nom: "artistique-2", categorie: "Artistique", alt: "Paupières roses et blanches irisées, yeux fermés, maquillage féerique" },
    { nom: "soiree-2", categorie: "Soirée", alt: "Smoky eyes intense et lèvres pêche, de trois quarts" },
    { nom: "avant-apres-2", categorie: "Avant / Après", largeur: 900, alt: "Avant et après : visage sans maquillage, puis maquillage doré aux lèvres nude" },
    { nom: "naturel-2", categorie: "Naturel", alt: "Maquillage cuivré aux lèvres terracotta, de face" },
    { nom: "mariee-4", categorie: "Mariée", alt: "Maquillage bohème aux tons cuivrés, couronne de fleurs et main près du visage" },
    { nom: "soiree-6", categorie: "Soirée", alt: "Eye-liner graphique et lèvres rouges, de trois quarts" },
    { nom: "naturel-4", categorie: "Naturel", alt: "Regard doré souligné de longs cils et lèvres nude, de face" }
  ]
};
