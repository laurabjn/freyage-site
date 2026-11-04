/*
 * FREYAGE : tout ce que vous avez à modifier se trouve dans ce fichier.
 * Les horaires, le téléphone et l'e-mail sont encore des EXEMPLES. Une fois vos
 * vraies informations saisies, passez `demo` à false pour retirer le bandeau d'aperçu.
 */
window.FREYAGE = {
  demo: true,

  contact: {
    telephone: "06 00 00 00 00",
    email: "contact@exemple.fr",
    adresse: "Bordeaux",
    instagram: "" // ex. "https://www.instagram.com/votre_compte" (vide = masqué)
  },

  // Plages d'ouverture : 0 = dimanche, 1 = lundi… 6 = samedi. [] = fermé.
  horaires: {
    1: [],
    2: [["09:00", "12:30"], ["14:00", "18:30"]],
    3: [["09:00", "12:30"], ["14:00", "18:30"]],
    4: [["09:00", "12:30"], ["14:00", "18:30"]],
    5: [["09:00", "12:30"], ["14:00", "18:30"]],
    6: [["09:00", "16:00"]],
    0: []
  },

  rdv: {
    // Adresse du service qui reçoit les demandes (ex. https://formspree.io/f/xxxxxxx).
    // Vide : la demande s'ouvre dans la messagerie du visiteur, vers contact.email.
    endpoint: "",
    delaiMinHeures: 24,  // délai minimum avant un rendez-vous
    horizonJours: 60,    // réservation possible jusqu'à X jours à l'avance
    pasMinutes: 30,      // intervalle entre deux créneaux proposés
    fermetures: []       // jours de fermeture, ex. ["2026-12-25", "2027-01-01"]
  },

  /*
   * duree en minutes ; prix affiché tel quel ; description facultative.
   * lien : la prestation n'est pas réservable en ligne et renvoie vers cette section.
   * note : texte affiché à la place de la liste quand une catégorie n'a pas encore de prestations.
   */
  prestations: [
    {
      categorie: "Maquillage",
      description: "Du maquillage de jour au shooting photo, adapté à votre visage et à l'occasion.",
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
        { nom: "Cours d'auto-maquillage, formule 1", duree: 90, prix: "85 €" },
        { nom: "Cours d'auto-maquillage, formule 2", duree: 150, prix: "105 €" }
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
      note: "Prestations et tarifs sur demande : contactez-moi."
    }
  ],

  // Photos de VOS réalisations, ex. { src: "assets/photos/mariee.jpg", alt: "Maquillage de mariée" }.
  // Tant que la liste est vide, la section reste masquée.
  realisations: []
};
