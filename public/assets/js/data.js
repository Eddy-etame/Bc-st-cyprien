/* =====================================================================
   BOXING CENTER — SAINT-CYPRIEN
   La source de vérité du contenu. Module ES simple → Astro/Next.

   CE QU'ON DIT, ET SUR QUOI ON S'APPUIE.
   Les faits de cette salle sont vérifiables sur boxingcenter.fr (page
   réseau + page Saint-Cyprien) : ouverte le 10 janvier 2022, cinquième
   salle du réseau et la première en centre-ville, au 11 rue Sainte-Lucie
   près du rond-point du Fer à Cheval. Sacs, tatamis et ring ; muscu,
   charges libres, cross-training et cardio. Accès libre 6 j/7 aux cinq
   salles, cours collectifs sans réservation. Affiliations FFBoxe et
   FFKMDA. Staff & créneaux = le planning officiel rentrée 2026.

   LA RÈGLE : rien ici ne s'invente. Un prix, un horaire, un nom de coach
   ou une caractéristique de la salle qui ne figure ni sur boxingcenter.fr
   ni sur le poster officiel n'entre pas dans ce fichier. Le ton est celui
   du club qui présente sa salle — direct, concret, sans superlatif qu'on
   ne pourrait pas prouver.

   (L'ancienne direction artistique — « le showroom au noir, la lumière
   comme objet » — a été abandonnée. Si vous croisez encore une formule
   qui parle de lumière ou de geste isolé, c'est un reste à nettoyer.)
   ===================================================================== */

import { OVERRIDES } from "./content-overrides.js";

/* ------------------------- LES CLICHÉS EN AVIF ---------------------- *
 * Liste écrite par scripts/build-avif.mjs — NE PAS ÉDITER À LA MAIN.
 * N’y figurent que les images où l’AVIF est réellement plus léger que le
 * WebP à qualité visuellement identique (mesuré, PSNR >= 42 dB). Sur les
 * photos déjà bien serrées, l’AVIF est plus lourd : elles n’y sont pas.
 * Tout ce qui n’est pas listé reste servi en WebP, point. */
const AVIF = new Set([
  /* AVIF:DEBUT */
  "/assets/img/logo-white.webp",
  "/assets/img/sc/anglaise-header.webp",
  "/assets/img/sc/anglaise.webp",
  "/assets/img/sc/anneaux.webp",
  "/assets/img/sc/appuis-tapis.webp",
  "/assets/img/sc/boxe-anglaise-sacs.webp",
  "/assets/img/sc/circuit-halteres.webp",
  "/assets/img/sc/coach-brice.webp",
  "/assets/img/sc/coach-dadi.webp",
  "/assets/img/sc/coach-portrait-1.webp",
  "/assets/img/sc/coach-portrait-2.webp",
  "/assets/img/sc/coach-portrait-3.webp",
  "/assets/img/sc/coach-portrait-4.webp",
  "/assets/img/sc/coach-tawee.webp",
  "/assets/img/sc/coachs-header.webp",
  "/assets/img/sc/cours-nb.webp",
  "/assets/img/sc/cross-barre.webp",
  "/assets/img/sc/gainage-binome.webp",
  "/assets/img/sc/grappling-kimono-controle.webp",
  "/assets/img/sc/grappling-kimono-sol.webp",
  "/assets/img/sc/grappling.webp",
  "/assets/img/sc/k1-coup-pied.webp",
  "/assets/img/sc/k1-duo.webp",
  "/assets/img/sc/kettlebell-swing.webp",
  "/assets/img/sc/lady-2.webp",
  "/assets/img/sc/lady-duo-2.webp",
  "/assets/img/sc/lady-duo.webp",
  "/assets/img/sc/lady-gants.webp",
  "/assets/img/sc/lady-sac-2.webp",
  "/assets/img/sc/lady-technique.webp",
  "/assets/img/sc/pattes-murales.webp",
  "/assets/img/sc/pattes-ours-combinaison.webp",
  "/assets/img/sc/pieds-poings-binome.webp",
  "/assets/img/sc/planning-2026-1600.webp",
  "/assets/img/sc/planning-2026-800.webp",
  "/assets/img/sc/produits/bandes-2m50-mb120t-720.webp",
  "/assets/img/sc/produits/bandes-4m-mb120bt-720.webp",
  "/assets/img/sc/produits/debardeur-entrainement-metal-boxe-training-tank-360.webp",
  "/assets/img/sc/produits/debardeur-entrainement-metal-boxe-training-tank-720.webp",
  "/assets/img/sc/produits/ensemble-enfants-short-debardeur-360.webp",
  "/assets/img/sc/produits/ensemble-enfants-short-debardeur-720.webp",
  "/assets/img/sc/produits/gants-boxe-blade-noir-blanc-360.webp",
  "/assets/img/sc/produits/gants-boxe-blade-noir-blanc-720.webp",
  "/assets/img/sc/produits/gants-boxe-enfant-one-360.webp",
  "/assets/img/sc/produits/gants-boxe-enfant-one-720.webp",
  "/assets/img/sc/produits/gants-ergo-90-mbg301k14-360.webp",
  "/assets/img/sc/produits/gants-ergo-90-mbg301k14-720.webp",
  "/assets/img/sc/produits/gants-sparring-mbgan010n14-16oz-360.webp",
  "/assets/img/sc/produits/gants-sparring-mbgan010n14-16oz-720.webp",
  "/assets/img/sc/produits/protege-dents-adulte-mbpro458srt-720.webp",
  "/assets/img/sc/produits/protege-dents-enfants-mb459jrw-360.webp",
  "/assets/img/sc/produits/protege-dents-enfants-mb459jrw-720.webp",
  "/assets/img/sc/produits/protege-tibias-pieds-coton-mb153wm-360.webp",
  "/assets/img/sc/produits/protege-tibias-pieds-coton-mb153wm-720.webp",
  "/assets/img/sc/sacs-rangee.webp",
  "/assets/img/sc/sol-grappling.webp",
  "/assets/img/sc/training.webp",
  /* AVIF:FIN */
]);

/** Le <img> reste la vérité (alt, lazy, dimensions) ; le <source> AVIF ne
 *  s’ajoute que si le fichier existe vraiment — sinon un navigateur qui
 *  comprend l’AVIF téléchargerait un 404 et n’afficherait rien. */
export function picture(src, attrs = "") {
  const img = `<img src="${src}" ${attrs} />`;
  if (!AVIF.has(src)) return img;
  return `<picture><source srcset="${src.replace(/\.webp$/, ".avif")}" type="image/avif" />${img}</picture>`;
}

/** Même décision, pour le code qui construit ses nœuds au lieu de coller
 *  du HTML : renvoie l’élément à insérer (un <img>, ou un <picture> qui
 *  le contient). Le <img> reste accessible à l’appelant. */
export function pictureEl(img) {
  if (!AVIF.has(img.getAttribute("src"))) return img;
  const p = document.createElement("picture");
  const s = document.createElement("source");
  s.type = "image/avif";
  s.srcset = img.getAttribute("src").replace(/\.webp$/, ".avif");
  p.append(s, img);
  return p;
}

/* Constantes anti-péremption — tout libellé de saison passe par ici. */
export const SEASON = "2026-2027";
export const SEASON_LABEL = "Saison 2026 — 2027";

export const SALLE = {
  id: "st-cyprien",
  name: "Boxing Center Saint-Cyprien",
  short: "Saint-Cyprien",
  baseline: "La nouvelle génération Boxing Center, rive gauche.",
  opened: "10 janvier 2022",   // page officielle du réseau + LD-JSON foundingDate
  surface: "",
  district: "Saint-Cyprien · Toulouse rive gauche",

  address: {
    street: "11 rue Sainte-Lucie",
    zip: "31300",
    city: "Toulouse",
    full: "11 rue Sainte-Lucie, 31300 Toulouse",
  },
  /* Distances mesurées sur OpenStreetMap le 08/10/2026 (à vol d'oiseau :
     arrêt Fer à Cheval 200 m, station Saint-Cyprien – République 580 m).
     L'ancien « métro A à 4 minutes » sous-estimait la marche de moitié. */
  access: [
    "Tram T1 — arrêt Fer à Cheval, à 200 m (3 min à pied)",
    "Métro ligne A — Saint-Cyprien – République, à 600 m (8 min à pied)",
    "Stationnement : parking Saint-Cyprien à proximité",
  ],
  phone: "05 62 24 46 82",
  phoneHref: "+33562244682",
  email: "boxingcenter31@gmail.com",
  hours: "Lun – Sam · 10h00 – 21h30",
  hoursData: [
    { d: "Lundi – Vendredi", h: "10h00 – 21h30" },
    { d: "Samedi", h: "10h00 – 21h30" },
    { d: "Dimanche", h: "Fermé" },
  ],
  federations: ["FFBoxe", "FFKMDA", "FMMAF"],
  mapsUrl: "https://www.google.com/maps?q=11%20rue%20Sainte-Lucie%2031300%20Toulouse&output=embed",
  mapsLink: "https://maps.google.com/?q=11+rue+Sainte-Lucie+31300+Toulouse",
};

/* Conversion — tout l’essai pointe vers box-plus (liens vérifiés 2026-07-12) */
export const LINKS = {
  /* Les deux inscriptions directes, relevées sur /api/products de la
     boutique le 19/10/2026 : chaque bouton ouvre le formulaire de SA
     formule, sans détour par la liste. Sans UTM, comme les autres liens
     d'abonnement du site. */
  etudiant: "https://boutique.boxingcenter.fr/inscription?product=etudiants-4-semaines",
  adulte: "https://boutique.boxingcenter.fr/inscription?product=44-99-4-semaines",
  essai: "https://boutique.boxingcenter.fr/seance-essai",          // CTA principal de CHAQUE page (10€)
  abos: "https://boutique.boxingcenter.fr/abonnements",
  prelevement: "https://boutique.boxingcenter.fr/abonnements#prelevement", // les formules sans engagement
  comptant: "https://boutique.boxingcenter.fr/abonnements#comptant",       // 3, 6 ou 12 mois réglés d'avance
  enfants: "https://boutique.boxingcenter.fr/abonnements#enfants",
  coachings: "https://boutique.boxingcenter.fr/coachings",
  materiel: "https://boutique.boxingcenter.fr/materiel",
  // maillage de marque : la boutique du réseau a son propre domaine
  boutique: "https://boutique.boxingcenter.fr/",
  groupe: "https://boxingcenter.fr/",
  facebook: "https://www.facebook.com/BoxingCenterToulouse/",
  instagram: "https://www.instagram.com/boxingcentertoulouse/",
};

export const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/la-salle/", label: "La salle", top: false },
  /* Les activités passent en tête : c’est la question qu’on se pose en
     arrivant (« qu’est-ce que je peux pratiquer ici ? »), avant le prix
     et avant les horaires. */
  { href: "/activites/", label: "Activités" },
  { href: "/coachs/", label: "Coachs" },
  { href: "/galerie/", label: "Galerie", top: false },
  { href: "/plannings/", label: "Planning" },
  { href: "/tarifs/", label: "Tarifs" },
  { href: "/contact/", label: "Contact" },
];

export const COACH_TBD = "Coach à confirmer";
export const COACH_TBD_SHORT = "Nom à venir";
export const COACH_TBD_WHY =
  "Le créneau tourne, la salle est ouverte, le tapis est là. Le nom de l’encadrant s’affichera ici le jour où il est acté au planning officiel — pas avant. On préfère une case vide à un nom qu’on ne peut pas tenir.";

/* La version courte : sur /activites/ et dans le configurateur, la case vide
   n’est pas le sujet de la page — elle se justifie en deux lignes. La version
   longue reste sur /coachs/, dont l’encadrement EST le sujet. Une bonne
   formule ne sert qu’une fois. */
export const COACH_TBD_WHY_SHORT =
  "Le cours a lieu, le tapis est prêt — mais aucun encadrant n’est acté au planning officiel. Tant que ce n’est pas signé, on n’écrit pas de nom.";

/* ------------------------------------------------------------------ *
 *  LE CONFIGURATEUR — la signature. Tu choisis ta discipline comme on
 *  configure un produit : photo, jours, coach, niveau. Tout est réel
 *  (planning rentrée 2026, poster officiel du club). `cat` groupe les
 *  entrées pour /activites/ (adultes · lady · école).
 *
 *  `alt` = le VRAI texte alternatif, écrit d’après le cliché lui-même
 *  (ce qu’on voit, pas ce qu’on vend). Il ne dérive JAMAIS de `tag` ni de
 *  `name` — ceux-là ne servent qu’à la pastille mono (data-label).
 * ------------------------------------------------------------------ */
/* `page` = la page de la discipline (/activites/<slug>/, ajoutée le 13/10/2026).
   Son texte long vit dans src/disciplines-pages.json ; une discipline sans
   `page` n’a pas de page, et ses liens retombent sur /activites/. Le
   grappling n’en a pas : aucun encadrant n’est nommé au planning officiel. */
export const DISCIPLINES = [
  {
    key: "anglaise",
    page: "/activites/boxe-anglaise/",
    name: "Boxe Anglaise",
    tag: "Le noble art",
    cat: "adulte",
    coach: "",
    jours: "Midi mer. & ven. · soirs lun./mer./ven. 20h",
    niveau: "Débutant → confirmé",
    desc: "Jab, esquive, jeu de jambes : le noble art enseigné proprement, du premier gant au gant de compétition. Les deux midis pour la pause active, les trois soirs de 20h pour le vrai travail — cinq passages par semaine, le même œil au bord des cordes.",
    teaser: "Le pied avant, le jab, la sortie d’axe. Tout part de là.",
    img: "/assets/img/sc/anglaise-header.webp",
    alt: "Un cours en plein travail : les pratiquants frappent des boucliers ronds tenus par leurs binômes, entre les sacs suspendus",
  },
  {
    key: "thai",
    page: "/activites/boxe-thai-k1/",
    name: "Boxe Thaï · K1",
    tag: "Pieds-poings",
    cat: "adulte",
    coach: "",
    jours: "Midi mar. & jeu. · soirs mar./jeu. 20h · ven. 19h · sam. 18h",
    niveau: "Tous niveaux",
    desc: "Tibias, genoux, coudes — la boxe la plus complète, avec un enseignement dans les règles de l’art. Six créneaux par semaine, du midi au soir.",
    teaser: "Poings, tibias, genoux, coudes. Rien ne reste dehors.",
    img: "/assets/img/sc/thai-1.webp",
    alt: "Un pratiquant place un coup de pied haut ; son partenaire, casque et gants, pare des avant-bras, devant la rangée de sacs",
  },
  {
    key: "grappling",
    name: "Grappling",
    tag: "Le sol",
    cat: "adulte",
    coach: COACH_TBD,
    coachTbd: true,          // état voulu, pas un trou : cf. COACH_TBD_WHY
    jours: "Mardi & jeudi · 19h – 20h",
    niveau: "Tous niveaux",
    desc: "Projections, contrôle, soumissions. Le complément sol qui apprend au boxeur ce que le debout ne montre jamais — on tombe, on sort, on recommence. Tous niveaux, mardi et jeudi 19h.",
    teaser: "Là où la boxe s’arrête, le sol commence.",
    img: "/assets/img/sc/grappling.webp",
    alt: "Deux pratiquants au sol sur le tapis bleu : l’un contrôle l’autre, au pied du ring",
  },
  {
    key: "hyrox",
    page: "/activites/hyrox-cross-training/",
    name: "Hyrox & Cross",
    tag: "Le moteur",
    cat: "adulte",
    coach: "",
    jours: "Hyrox mer. 18h20 · cross lun. & mer. 19h",
    niveau: "Intense — zéro prérequis",
    desc: "Circuits Hyrox et cross-training : le cardio et la force qui portent tes gants. La zone moteur tourne toute la semaine.",
    teaser: "Le moteur d’abord : le souffle qui tient les trois dernières reprises.",
    img: "/assets/img/sc/hyrox.webp",
    alt: "Travail en circuit au pied du ring : montées sur step, gainage au sol et banc, plusieurs ateliers en parallèle",
  },
  {
    key: "lady",
    page: "/activites/lady-punch/",
    name: "Lady Punch",
    tag: "100 % féminin",
    cat: "lady",
    coach: "",
    jours: "Mardi & jeudi · 18h20 – 19h",
    niveau: "Zéro prérequis",
    desc: "Un créneau à elles, mardi et jeudi 18h20 : cardio, technique, sac — aucun prérequis, aucune galerie qui te regarde. Beaucoup y mettent leurs premiers gants ; certaines rejoignent ensuite les cours mixtes. Les deux sont très bien.",
    teaser: "Un créneau à elles, du premier gant au sac qui claque.",
    img: "/assets/img/sc/lady-2.webp",
    alt: "Deux pratiquantes en garde, mains bandées, pendant un cours Lady Punch",
  },
  {
    key: "kids",
    page: "/activites/boxe-educative/",
    name: "Boxe Éducative",
    tag: "Dès 3 ans",
    cat: "ecole",
    coach: "",
    jours: "Baby 3/6 sam. · 7/11 & 12/16 mer. + sam. · compétiteurs mer./sam.",
    niveau: "Baby → compétition",
    desc: "On touche, on ne frappe pas — règle fédérale, non négociable. Du Baby Boxe (dès 3 ans) aux compétiteurs : motricité, concentration, respect, et le même coach — Dadi — à chaque palier. Il n’y a personne à qui réexpliquer ton gamin.",
    teaser: "De 3 ans au premier combat, une seule école et une seule ligne.",
    img: "/assets/img/sc/educative-1.webp",
    alt: "Deux jeunes licenciées en maillot Boxing Center, médaille aux dents, après une compétition",
  },
  {
    key: "camp",
    page: "/activites/boxing-camp/",
    name: "Boxing Camp",
    tag: "Le condensé",
    cat: "adulte",
    coach: "",
    jours: "Midi lun. · lun. & ven. 18h20 · sam. 11h",
    niveau: "Tous niveaux",
    desc: "Le format signature Boxing Center : technique + cardio + sacs en une séance dense. Le meilleur point d’entrée si tu hésites.",
    teaser: "Le format maison : rien à choisir, tout y passe.",
    img: "/assets/img/sc/training.webp",
    alt: "Un coach donne la consigne à un groupe monté sur le ring, gants aux mains",
  },
];

/* ------------------------------------------------------------------ *
 *  LA SEMAINE, AU CORDEAU — la grille structurée du planning rentrée 2026.
 *  Reconstruite depuis le poster officiel (roster.json) : la /plannings/
 *  la rend filtrable (jour · discipline · coach) et le POSTER couleur reste
 *  la source de vérité. `key` mappe DISCIPLINES. Dimanche = fermé.
 * ------------------------------------------------------------------ */
export const SCHEDULE = [
  // Lundi
  { day: "Lun", time: "12h40", key: "camp",      name: "Boxing Camp",    coach: "", lvl: "Tous niveaux" },
  { day: "Lun", time: "18h20", key: "camp",      name: "Boxing Camp",    coach: "",      lvl: "Tous niveaux" },
  { day: "Lun", time: "19h00", key: "hyrox",     name: "Cross-Training", coach: "",      lvl: "Intense" },
  { day: "Lun", time: "20h00", key: "anglaise",  name: "Boxe Anglaise",  coach: "",        lvl: "Débutant → confirmé" },
  // Mardi
  { day: "Mar", time: "12h40", key: "thai",      name: "Boxe Thaï · K1", coach: "",       lvl: "Tous niveaux" },
  { day: "Mar", time: "18h20", key: "lady",      name: "Lady Punch",     coach: "",        lvl: "100 % féminin" },
  { day: "Mar", time: "19h00", key: "grappling", name: "Grappling",      coach: "", lvl: "Tous niveaux" },
  { day: "Mar", time: "20h00", key: "thai",      name: "Boxe Thaï · K1", coach: "",    lvl: "Tous niveaux" },
  // Mercredi
  { day: "Mer", time: "12h40", key: "anglaise",  name: "Boxe Anglaise",  coach: "",        lvl: "Tous niveaux" },
  { day: "Mer", time: "15h00", key: "kids",      name: "Éducative 7/11", coach: "",       lvl: "7 → 11 ans" },
  { day: "Mer", time: "16h00", key: "kids",      name: "Éducative 12/16", coach: "",      lvl: "12 → 16 ans" },
  { day: "Mer", time: "17h00", key: "kids",      name: "Éducative compétiteurs", coach: "", lvl: "jusqu’à 18h15" },
  { day: "Mer", time: "18h20", key: "hyrox",     name: "Hyrox",          coach: "",      lvl: "Intense" },
  { day: "Mer", time: "19h00", key: "hyrox",     name: "Cross-Training", coach: "",      lvl: "Intense" },
  { day: "Mer", time: "20h00", key: "anglaise",  name: "Boxe Anglaise",  coach: "",        lvl: "Débutant → confirmé" },
  // Jeudi
  { day: "Jeu", time: "12h40", key: "thai",      name: "Boxe Thaï · K1", coach: "",       lvl: "Tous niveaux" },
  { day: "Jeu", time: "18h20", key: "lady",      name: "Lady Punch",     coach: "",        lvl: "100 % féminin" },
  { day: "Jeu", time: "19h00", key: "grappling", name: "Grappling",      coach: "", lvl: "Tous niveaux" },
  { day: "Jeu", time: "20h00", key: "thai",      name: "Boxe Thaï · K1", coach: "",    lvl: "Tous niveaux" },
  // Vendredi
  { day: "Ven", time: "12h40", key: "anglaise",  name: "Boxe Anglaise",  coach: "",        lvl: "Tous niveaux" },
  { day: "Ven", time: "18h20", key: "camp",      name: "Boxing Camp",    coach: "",        lvl: "Tous niveaux" },
  { day: "Ven", time: "19h00", key: "thai",      name: "Boxe Thaï · K1", coach: "",    lvl: "Tous niveaux" },
  { day: "Ven", time: "20h00", key: "anglaise",  name: "Boxe Anglaise",  coach: "",        lvl: "Débutant → confirmé" },
  // Samedi
  { day: "Sam", time: "11h00", key: "camp",      name: "Boxing Camp",    coach: "",      lvl: "Tous niveaux" },
  { day: "Sam", time: "14h15", key: "kids",      name: "Baby Boxe",      coach: "",        lvl: "3 → 6 ans" },
  { day: "Sam", time: "15h00", key: "kids",      name: "Éducative 7/11", coach: "",       lvl: "7 → 11 ans" },
  { day: "Sam", time: "16h00", key: "kids",      name: "Éducative 12/16", coach: "",      lvl: "12 → 16 ans" },
  { day: "Sam", time: "17h00", key: "kids",      name: "Éducative compétiteurs", coach: "", lvl: "jusqu’à 18h15" },
  { day: "Sam", time: "18h00", key: "thai",      name: "Boxe Pieds-Poings", coach: "", lvl: "jusqu’à 20h00" },
];

/* Jours de la semaine (ordre + libellé long) — pour la /plannings/ */
export const DAYS = [
  { k: "Lun", long: "Lundi" },
  { k: "Mar", long: "Mardi" },
  { k: "Mer", long: "Mercredi" },
  { k: "Jeu", long: "Jeudi" },
  { k: "Ven", long: "Vendredi" },
  { k: "Sam", long: "Samedi" },
];

export const COACHES = [
  /* LE PLANNING DES COACHS NE S’ÉCRIT PAS ICI. On dit ce que chacun
     enseigne ; jamais quel jour ni à quelle heure. Qui tient quel
     créneau reste une information interne au club. */
  { name: "Dadi", role: "Anglaise · Lady Punch · École", tag: "Le pilier", keys: ["anglaise", "lady", "kids"],
    note: "Anglaise, Lady Punch et toute l’école, du Baby Boxe aux compétiteurs. Premier cours ? Dis-lui que tu n’as jamais boxé — c’est exactement là que son travail commence.",
    img: "/assets/img/sc/coach-dadi.webp",
    // alt écrit d’après le cliché — jamais dérivé du nom ni du tag
    alt: "Le coach Dadi, casquette et t-shirt Boxing Center noirs, poing levé devant le ring de la salle" },
  { name: "Tawee", role: "Boxe Thaï · K1", tag: "L’art thaï", keys: ["thai"],
    note: "La thaï enseignée comme elle se boxe là-bas — les tibias avant les mots. Et pour ta première : on apprend la touche avant la puissance.",
    img: "/assets/img/sc/coach-tawee.webp",
    alt: "Le coach Tawee, t-shirt Boxing Center noir, bras croisés devant le ring" },
  { name: "Brice", role: "Hyrox · Cross · Camp", tag: "Le moteur", keys: ["hyrox", "camp"],
    note: "Les circuits qui construisent la caisse. Tu repars vidé, tu reviens plus fort.",
    img: "/assets/img/sc/coach-brice.webp",
    alt: "Le coach Brice, t-shirt Boxing Center noir, bras croisés devant le ring de la salle" },
];

/* ------------------------------------------------------------------ *
 *  LES OFFRES MISES EN AVANT (boutique, /api/products, 19/10/2026).
 *  Jamais en dur dans les pages ; toujours via PROMOS. ORDRE : l’étudiant
 *  d’abord, l’adulte ensuite — partout où deux offres sont montrées.
 *  Ce sont des PRIX, pas des remises : aucun `was`, aucun prix barré.
 *  L’étudiant s’écrit TOUJOURS avec « carte étudiante requise ».
 * ------------------------------------------------------------------ */
export const PROMOS = {
  saison: SEASON,
  label: SEASON_LABEL,
  essai: {
    name: "Séance d’essai",
    price: "10€",
    detail: "Toutes disciplines, matériel prêté, sans engagement.",
    cta: "Réserver mon essai",
    href: LINKS.essai,
  },
  etudiant: {
    name: "Étudiant",
    price: "36,99€",
    unit: "toutes les 4 semaines",
    carte: "carte étudiante requise",
    detail: "Tarif sur justificatif, sans engagement. Cours à volonté et salle ouverte de 10h à 21h30, dans les 5 clubs du réseau.",
    cta: "Je m’inscris en étudiant",
    href: LINKS.etudiant,
  },
  adulte: {
    name: "Adulte",
    price: "44,99€",
    unit: "toutes les 4 semaines",
    detail: "Reconduit de lui-même toutes les 4 semaines, arrêtable quand tu veux. Tous les cours, et les cinq salles de 10h à 21h30.",
    cta: "Je m’inscris",
    href: LINKS.adulte,
  },
  /* Ce qui vaut pour les deux, dit une fois sous les cartes. */
  modalites: "Carte bancaire pour ouvrir, prélèvement ensuite. Badge d’accès 34,99€ : il tombe quelques jours après ton inscription.",
};


/* ------------------------------------------------------------------ *
 *  LE CADRAN DES OFFRES — ce qui tourne dans le cadran des abonnements.
 *
 *  Une liste À PART, et c’est voulu : TARIFS est la grille complète (on la
 *  LIT, posément, sur /tarifs/) ; le cadran est une VITRINE — les DEUX
 *  offres qu’on met en avant, qui tournent en marge de la lecture.
 *  Mélanger les deux listes, c’est soit un cadran à sept cases que
 *  personne ne suit, soit une grille amputée. Le staff change un prix
 *  ici, le cadran suit sur les 10 pages.
 *
 *  Deux publics, deux cases, dans CET ordre : l’étudiant, puis l’adulte.
 *  Ajouter une troisième case (l’école, l’essai) se fait en ajoutant un
 *  bloc — le module en accepte n’importe quel nombre.
 *
 *  Pas de `was`, pas de `cut` : ce sont les prix de tous les jours, et le
 *  module n’affiche plus de prix barré du tout. La règle du site est de
 *  n’inventer ni prix ni promesse.
 * ------------------------------------------------------------------ */
export const ROULETTE = [
  {
    key: "etudiant",
    price: "36,99€",
    name: "L’abonnement Étudiant",
    detail: "carte étudiante requise · toutes les 4 semaines · sans engagement",
    href: LINKS.etudiant,
    cta: "Je m’inscris en étudiant",
  },
  {
    key: "adulte",
    price: "44,99€",
    name: "L’abonnement Adulte",
    detail: "toutes les 4 semaines · cours illimités · les 5 salles",
    href: LINKS.adulte,
    cta: "Je m’inscris",
  },
];

export const TARIFS = [
  /* L’ÉCHELLE, dans l’ordre de vente : étudiant, adulte, comptant, école,
     essai. Les deux premières lignes sont les cartes du haut de /tarifs/ ;
     `highlight` marque celle que les pages de discipline mettent en avant. */
  {
    name: "Étudiant",
    price: "36,99€",
    period: "les 4 semaines · carte étudiante requise",
    feature: "Sans engagement, sur justificatif étudiant",
    items: ["Carte étudiante requise", "Cours illimités, accès libre de 10h à 21h30", "Les 5 salles du réseau Boxing Center"],
    cta: "Je m’inscris en étudiant",
    href: LINKS.etudiant,
    highlight: false,
  },
  {
    name: "Adulte",
    price: "44,99€",
    period: "/ 4 semaines",
    feature: "Reconduit par périodes de 4 semaines, sans engagement",
    items: ["Cours illimités, toutes les disciplines adultes", "Accès libre de 10h à 21h30", "Les 5 salles du réseau Boxing Center"],
    cta: "Je m’inscris",
    href: LINKS.adulte,
    highlight: true,
  },
  /* LE COMPTANT — trois durées réglées d’avance, à leur prix normal. */
  {
    name: "Comptant",
    price: "150€",
    period: "/ 3 mois",
    feature: "Tout réglé d’avance — 6 mois 250€, 12 mois 400€",
    items: ["3 mois : 150€", "6 mois : 250€", "12 mois : 400€"],
    cta: "Voir les formules comptant",
    href: LINKS.comptant,
    highlight: false,
  },
  {
    name: "École & Baby Boxe",
    price: "295€",
    period: "/ an · t-shirt inclus",
    feature: "Baby Boxe 250€ · enfants & ados dès 3 ans",
    items: ["Baby 3/6 à 250€ · 7/11 · ados 12/16", "Matériel fourni", "Compétiteurs encadrés par Dadi"],
    cta: "Inscrire mon enfant",
    href: LINKS.enfants,
    highlight: false,
  },
  {
    name: "Séance d’essai",
    price: "10€",
    period: "la séance",
    feature: "Toujours là ? Alors viens essayer — gants prêtés",
    items: ["Accès à toutes les disciplines", "Gants et matériel prêtés", "Sans engagement — tu viens, tu testes, tu décides"],
    cta: "Je viens essayer · 10€",
    href: LINKS.essai,
    highlight: false,
  },
];

/* Avis Google RÉELS, cités mot pour mot (jamais inventés). Pas de note ni
   de nombre d'avis, ni d'étoiles : ordre d'Eddy du 08/10/2026 (« no google
   rating »). La preuve, ce sont les mots des adhérents et le lien vers la
   fiche, où chacun lit la source à jour. */
export const REVIEWS = {
  source: "Avis Google",
  url: SALLE.mapsLink,
  label: "Lire tous les avis sur Google",
  quotes: [
    { text: "Une petite salle au top, des coachs au top, nichée au cœur de Saint Cyp'.", author: "Ronan L." },
    { text: "Super salle, tous les mois Dadi améliore la salle avec des nouveaux équipements.", author: "Kayon M." },
    { text: "Bonne salle, propre avec de bons équipements. Cours complet.", author: "Omar T." },
    { text: "Les cours de boxing lady sont top ! Il y a une bonne ambiance.", author: "Alyssia P." },
  ],
};

/* Le réseau — les quatre sœurs, chacune avec son trait (Balma-Gramont
   vendue — jamais citée). Réseau = 5 clubs avec Saint-Cyprien. */
export const NETWORK = [
  { id: "minimes", name: "Minimes", tag: "Le berceau", feat: "La salle historique · 3 rings · l’école", url: "https://boxe-toulouse.com/" },
  { id: "portet", name: "Portet-sur-Garonne", tag: "Le vaisseau amiral", feat: "Le grand format · ring de boxe anglaise · cage MMA", url: "https://boxing-center-portet.fr/" },
  { id: "etats-unis", name: "États-Unis", tag: "Le colosse", feat: "1 200 m² · 3 zones · 2 rings · cage MMA", url: "https://clubmma.fr/" },
  { id: "ramonville", name: "Ramonville", tag: "Le ciel ouvert", feat: "Octogone 7 m · ring de boxe anglaise · 300 m² extérieur", url: "https://mmatoulouse.com/" },
];

/* FAQ générale visible sur /contact/ — servie AUSSI en FAQPage dans le
   LD-JSON de la page : même questions, même ordre, même texte (contrôlé par
   tests/seo-static.test.mjs). Les moteurs de réponse lisent ce balisage même
   si Google n'en fait plus un résultat enrichi. */
export const FAQ = [
  { q: "Où se trouve Boxing Center Saint-Cyprien ?", a: "Au 11 rue Sainte-Lucie, 31300 Toulouse, dans le quartier Saint-Cyprien, rive gauche. L’arrêt de tram Fer à Cheval (T1) est à 200 m, 3 minutes à pied ; la station de métro Saint-Cyprien – République (ligne A) à 600 m, 8 minutes à pied." },
  { q: "Comment se passe la première séance ?", a: "Tu arrives 10 minutes avant, en tenue de sport. Tu dis que c’est ta première fois — c’est la seule phrase à préparer. Les gants et le matériel te sont prêtés sur place, puis échauffement, technique et sac, à ton rythme : pas de sparring imposé, pas de test. La séance d’essai coûte 10€, toutes disciplines." },
  { q: "Je n’ai jamais boxé, je peux venir ?", a: "Oui. La plupart des créneaux sont ouverts à tous les niveaux : commence par le Boxing Camp — technique, cardio, sacs, à ton rythme. Personne ne te regarde débuter." },
  { q: "Quelles disciplines peut-on pratiquer ?", a: "Boxe anglaise, boxe thaï / K1, grappling, Hyrox, cross-training, Lady Punch, boxing camp et toute l’école enfants du Baby Boxe (3/6 ans) aux compétiteurs." },
  { q: "Y a-t-il des cours pour les enfants ?", a: "Oui, dès 3 ans : Baby Boxe le samedi, boxe éducative 7/11 ans et ados 12/16 ans le mercredi et le samedi, et un créneau compétiteurs encadré par Dadi." },
  { q: "Faut-il un abonnement pour commencer ?", a: "Non. La séance d’essai à 10€ donne accès à toutes les disciplines, matériel prêté. Ensuite, pour continuer, tu choisis ton abonnement sans engagement : 36,99€ les 4 semaines au tarif étudiant (carte étudiante requise) ou 44,99€ au tarif adulte." },
  { q: "Quels sont les horaires ?", a: "Du lundi au samedi, de 10h00 à 21h30. Le dernier cours se termine à 21h15 selon les jours. Fermé le dimanche." },
];

/* ------------------------------------------------------------------ *
 *  LE CONTENU DU VESTIAIRE — la dernière opération de ce fichier.
 *
 *  Le backoffice publie public/content.json ; le pré-build le transforme
 *  en content-overrides.js (module statique, coût d’exécution nul). On
 *  fusionne ICI, à la fin : tout ce qui précède reste la valeur de repli,
 *  et une surcharge partielle ne peut jamais VIDER un bloc.
 *
 *  Les exports sont des objets/tableaux : on les MUTE (les liaisons de
 *  module sont vivantes) plutôt que de les réassigner — les huit modules
 *  du site lisent donc tous la même instance, déjà à jour.
 * ------------------------------------------------------------------ */
function mergeInto(target, patch) {
  if (!patch || typeof patch !== "object") return;
  for (const [k, v] of Object.entries(patch)) {
    if (v == null || v === "") continue;                       // jamais d’effacement par omission
    if (Array.isArray(v)) { if (Array.isArray(target[k])) target[k].splice(0, target[k].length, ...v); else target[k] = v; }
    else if (typeof v === "object" && target[k] && typeof target[k] === "object") mergeInto(target[k], v);
    else target[k] = v;
  }
}
function replaceList(list, patch) {
  if (Array.isArray(patch) && patch.length) list.splice(0, list.length, ...patch);
}

mergeInto(SALLE, OVERRIDES.salle);
mergeInto(PROMOS, OVERRIDES.promos);
replaceList(ROULETTE, OVERRIDES.roulette);
replaceList(TARIFS, OVERRIDES.tarifs);
replaceList(COACHES, OVERRIDES.coaches);
replaceList(SCHEDULE, OVERRIDES.schedule);
replaceList(FAQ, OVERRIDES.faq);

/* L’adresse complète est un champ dérivé : si le vestiaire a changé la rue
   ou la ville sans retoucher `full`, on la recompose — sinon la fiche de
   pied de page afficherait l’ancienne adresse à côté de la nouvelle. */
if (OVERRIDES.salle?.address && !OVERRIDES.salle.address.full) {
  SALLE.address.full = `${SALLE.address.street}, ${SALLE.address.zip} ${SALLE.address.city}`;
}

/* Même piège pour le téléphone : le vestiaire change le numéro AFFICHÉ, oublie
   le champ « lien », et tous les boutons d’appel du site composent encore
   l’ancien numéro. Mesuré : fiche « 05 62 24 46 99 », href « +33562244682 ».
   On recompose donc le lien à partir du numéro français saisi (00 → +33). */
if (OVERRIDES.salle?.phone && !OVERRIDES.salle.phoneHref) {
  const chiffres = SALLE.phone.replace(/\D/g, "");
  if (/^0\d{9}$/.test(chiffres)) SALLE.phoneHref = "+33" + chiffres.slice(1);
  else if (/^33\d{9}$/.test(chiffres)) SALLE.phoneHref = "+" + chiffres;
}

/* ------------------------------------------------------------------ *
 *  L’ACCUEIL S’ÉTOFFE (08/10/2026) — St-Cyprien n’avait AUCUNE page dans
 *  l’index Google (« détectée, non indexée ») : un accueil de 308 mots, sans
 *  H1 en production, et presque aucun lien entrant. La semaine, la première
 *  séance, les avis, le réseau et les questions s’ajoutent — rien n’est
 *  retiré. Les horaires cités sont CALCULÉS depuis SCHEDULE.
 * ------------------------------------------------------------------ */
const _J = { Lun: "lundi", Mar: "mardi", Mer: "mercredi", Jeu: "jeudi", Ven: "vendredi", Sam: "samedi" };
const _quand = (key) => {
  const rows = SCHEDULE.filter((s) => s.key === key);
  const parts = rows.map((s) => `le ${_J[s.day]} à ${s.time}`);
  return parts.length > 1 ? `${parts.slice(0, -1).join(", ")} et ${parts.at(-1)}` : parts[0] || "";
};

export const SEMAINE = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((d) => ({
  d, long: _J[d], cours: SCHEDULE.filter((s) => s.day === d).map((s) => ({ start: s.time, cours: s.name, lvl: s.lvl, key: s.key })),
}));

/* Questions d’ACCUEIL — distinctes de la FAQ de /contact/ (où, première
   séance, débutant, disciplines, enfants, abonnement, horaires). */
export const HOME_FAQ = [
  { q: "Peut-on s’entraîner dans les autres Boxing Center avec un abonnement de Saint-Cyprien ?",
    a: "Oui. Ton abonnement de Saint-Cyprien vaut aussi aux Minimes, à États-Unis, à Ramonville et à Portet-sur-Garonne, que tu le paies 36,99€ (tarif étudiant, carte étudiante requise) ou 44,99€ (tarif adulte) par période de 4 semaines." },
  { q: "Faut-il réserver son cours ?",
    a: "Non. Les cours collectifs se font sans réservation : tu viens à l’heure du créneau, en tenue, et tu montes sur le tapis." },
  { q: "Peut-on venir s’entraîner en dehors des cours ?",
    a: "Oui. Le club est ouvert du lundi au samedi, de 10h00 à 21h30, en accès libre : sacs, tatamis, ring, musculation, charges libres et cardio. Fermé le dimanche." },
  { q: "Quel cours pour une femme qui débute ?",
    a: `Le Lady Punch, 100 % féminin, ${_quand("lady")}. Zéro prérequis, et personne ne regarde : la boxe pour la forme, le cardio et la confiance.` },
  { q: "Y a-t-il du cross-training et de l’Hyrox à Saint-Cyprien ?",
    a: `Oui : ${_quand("hyrox")}. Charges, rameurs, circuits — la zone qui prépare le souffle du troisième round.` },
];
