/* =====================================================================
   BOXING CENTER — SAINT-CYPRIEN
   La source de vérité du contenu. Module ES simple → Astro/Next.

   CE QU'ON DIT, ET SUR QUOI ON S'APPUIE.
   Les faits de cette salle sont vérifiables sur boxingcenter.fr (page
   réseau + page Saint-Cyprien) : ouverte le 10 janvier 2022, cinquième
   salle du réseau et la première en centre-ville, au 11 rue Sainte-Lucie
   près du rond-point du Fer à Cheval. Sacs, tatamis et ring ; muscu,
   charges libres, cross-training et cardio. Accès libre 7 j/7 aux cinq
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
  "/assets/img/sc/coach-dadi.webp",
  "/assets/img/sc/coach-portrait-1.webp",
  "/assets/img/sc/coach-portrait-2.webp",
  "/assets/img/sc/coach-portrait-3.webp",
  "/assets/img/sc/coach-portrait-4.webp",
  "/assets/img/sc/cours-nb.webp",
  "/assets/img/sc/cross-barre.webp",
  "/assets/img/sc/k1-coup-pied.webp",
  "/assets/img/sc/k1-duo.webp",
  "/assets/img/sc/lady-2.webp",
  "/assets/img/sc/lady-duo-2.webp",
  "/assets/img/sc/lady-duo.webp",
  "/assets/img/sc/lady-gants.webp",
  "/assets/img/sc/lady-sac-2.webp",
  "/assets/img/sc/lady-technique.webp",
  "/assets/img/sc/pattes-murales.webp",
  "/assets/img/sc/planning-2026-1600.webp",
  "/assets/img/sc/planning-2026-800.webp",
  "/assets/img/sc/sacs-rangee.webp",
  "/assets/img/sc/sol-grappling.webp",
  "/assets/img/sc/thai-1.webp",
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
  opened: "Août 2025",          // fait daté — LD-JSON foundingDate uniquement, jamais en headline
  surface: "",
  district: "Saint-Cyprien · Toulouse rive gauche",

  address: {
    street: "11 rue Sainte-Lucie",
    zip: "31300",
    city: "Toulouse",
    full: "11 rue Sainte-Lucie, 31300 Toulouse",
  },
  access: [
    "Métro ligne A — Saint-Cyprien République (4 min à pied)",
    "Rive gauche — à 10 min du centre-ville",
    "Stationnement : parking Saint-Cyprien à proximité",
  ],
  phone: "05 62 24 46 82",
  phoneHref: "+33562244682",
  email: "boxingcenter31@gmail.com",
  hours: "Lun – Sam · 10h00 – 21h15",
  hoursData: [
    { d: "Lundi – Vendredi", h: "10h00 – 21h15" },
    { d: "Samedi", h: "10h00 – 21h15" },
    { d: "Dimanche", h: "Fermé" },
  ],
  federations: ["FFBoxe", "FFKMDA", "FMMAF"],
  mapsUrl: "https://www.google.com/maps?q=11%20rue%20Sainte-Lucie%2031300%20Toulouse&output=embed",
  mapsLink: "https://maps.google.com/?q=11+rue+Sainte-Lucie+31300+Toulouse",
};

/* Conversion — tout l’essai pointe vers box-plus (liens vérifiés 2026-07-12) */
export const LINKS = {
  essai: "https://boutique.boxingcenter.fr/seance-essai",          // CTA principal de CHAQUE page (10€)
  abos: "https://boutique.boxingcenter.fr/abonnements",
  promos: "https://boutique.boxingcenter.fr/offres-speciales", // Rentrée / Saison
  prelevement: "https://boutique.boxingcenter.fr/abonnements#prelevement", // les classiques au mois
  comptant: "https://boutique.boxingcenter.fr/abonnements",
  enfants: "https://boutique.boxingcenter.fr/abonnements",
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
export const DISCIPLINES = [
  {
    key: "anglaise",
    name: "Boxe Anglaise",
    tag: "Le noble art",
    cat: "adulte",
    coach: "Dadi",
    jours: "Midi mer. & ven. · soirs lun./mer./ven. 20h",
    niveau: "Débutant → confirmé",
    desc: "Jab, esquive, jeu de jambes : le noble art enseigné proprement, du premier gant au gant de compétition. Les deux midis pour la pause active, les trois soirs de 20h pour le vrai travail — cinq passages par semaine, le même œil au bord des cordes.",
    teaser: "Le pied avant, le jab, la sortie d’axe. Tout part de là.",
    img: "/assets/img/sc/anglaise-header.webp",
    alt: "Un cours en plein travail : les pratiquants frappent des boucliers ronds tenus par leurs binômes, entre les sacs suspendus",
  },
  {
    key: "thai",
    name: "Boxe Thaï · K1",
    tag: "Pieds-poings",
    cat: "adulte",
    coach: "Tawee · Victor G",
    jours: "Midi mar. & jeu. · soirs mar./jeu. 20h · ven. 19h · sam. 18h",
    niveau: "Tous niveaux",
    desc: "Tibias, genoux, coudes — la boxe la plus complète, avec un enseignement dans les règles de l’art. Six créneaux par semaine, cinq tenus par Tawee et Victor G ; celui du samedi 18h attend encore son encadrant.",
    teaser: "Poings, tibias, genoux, coudes. Rien ne reste dehors.",
    img: "/assets/img/sc/thai-1.webp",
    alt: "Deux pratiquants, protège-tibias aux jambes, travaillent au sac sous la bannière Boxing Center",
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
    alt: "Deux pratiquantes gantées échangent dans la cage grillagée, garde haute",
  },
  {
    key: "hyrox",
    name: "Hyrox & Cross",
    tag: "Le moteur",
    cat: "adulte",
    coach: "Hicham",
    jours: "Hyrox mer. 18h20 · cross lun. & mer. 19h",
    niveau: "Intense — zéro prérequis",
    desc: "Circuits Hyrox et cross-training : le cardio et la force qui portent tes gants. La zone moteur tourne toute la semaine.",
    teaser: "Le moteur d’abord : le souffle qui tient les trois dernières reprises.",
    img: "/assets/img/sc/hyrox.webp",
    alt: "Travail en circuit au pied du ring : montées sur step, gainage au sol et banc, plusieurs ateliers en parallèle",
  },
  {
    key: "lady",
    name: "Lady Punch",
    tag: "100 % féminin",
    cat: "lady",
    coach: "Dadi",
    jours: "Mardi & jeudi · 18h20 – 19h",
    niveau: "Zéro prérequis",
    desc: "Un créneau à elles, mardi et jeudi 18h20 : cardio, technique, sac — aucun prérequis, aucune galerie qui te regarde. Beaucoup y mettent leurs premiers gants ; certaines rejoignent ensuite les cours mixtes. Les deux sont très bien.",
    teaser: "Un créneau à elles, du premier gant au sac qui claque.",
    img: "/assets/img/sc/lady-2.webp",
    alt: "Un coach corrige la position d’une pratiquante devant un sac, pendant un cours Lady Punch",
  },
  {
    key: "kids",
    name: "Boxe Éducative",
    tag: "Dès 3 ans",
    cat: "ecole",
    coach: "Dadi",
    jours: "Baby 3/6 sam. · 7/11 & 12/16 mer. + sam. · compétiteurs mer./sam.",
    niveau: "Baby → compétition",
    desc: "On touche, on ne frappe pas — règle fédérale, non négociable. Du Baby Boxe (dès 3 ans) aux compétiteurs : motricité, concentration, respect, et le même coach — Dadi — à chaque palier. Il n’y a personne à qui réexpliquer ton gamin.",
    teaser: "De 3 ans au premier combat, une seule école et une seule ligne.",
    img: "/assets/img/sc/educative-1.webp",
    alt: "Deux jeunes licenciées en maillot Boxing Center, médaille aux dents, après une compétition",
  },
  {
    key: "camp",
    name: "Boxing Camp",
    tag: "Le condensé",
    cat: "adulte",
    coach: "Dadi · Hicham",
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
  { day: "Lun", time: "12h40", key: "camp",      name: "Boxing Camp",    coach: "Coach à confirmer", lvl: "Tous niveaux" },
  { day: "Lun", time: "18h20", key: "camp",      name: "Boxing Camp",    coach: "Hicham",      lvl: "Tous niveaux" },
  { day: "Lun", time: "19h00", key: "hyrox",     name: "Cross-Training", coach: "Hicham",      lvl: "Intense" },
  { day: "Lun", time: "20h00", key: "anglaise",  name: "Boxe Anglaise",  coach: "Dadi",        lvl: "Débutant → confirmé" },
  // Mardi
  { day: "Mar", time: "12h40", key: "thai",      name: "Boxe Thaï · K1", coach: "Tawee",       lvl: "Tous niveaux" },
  { day: "Mar", time: "18h20", key: "lady",      name: "Lady Punch",     coach: "Dadi",        lvl: "100 % féminin" },
  { day: "Mar", time: "19h00", key: "grappling", name: "Grappling",      coach: "Coach à confirmer", lvl: "Tous niveaux" },
  { day: "Mar", time: "20h00", key: "thai",      name: "Boxe Thaï · K1", coach: "Victor G",    lvl: "Tous niveaux" },
  // Mercredi
  { day: "Mer", time: "12h40", key: "anglaise",  name: "Boxe Anglaise",  coach: "Dadi",        lvl: "Tous niveaux" },
  { day: "Mer", time: "15h00", key: "kids",      name: "Éducative 7/11", coach: "Dadi",       lvl: "7 → 11 ans" },
  { day: "Mer", time: "16h00", key: "kids",      name: "Éducative 12/16", coach: "Dadi",      lvl: "12 → 16 ans" },
  { day: "Mer", time: "17h00", key: "kids",      name: "Éducative compétiteurs", coach: "Dadi", lvl: "jusqu’à 18h15" },
  { day: "Mer", time: "18h20", key: "hyrox",     name: "Hyrox",          coach: "Hicham",      lvl: "Intense" },
  { day: "Mer", time: "19h00", key: "hyrox",     name: "Cross-Training", coach: "Hicham",      lvl: "Intense" },
  { day: "Mer", time: "20h00", key: "anglaise",  name: "Boxe Anglaise",  coach: "Dadi",        lvl: "Débutant → confirmé" },
  // Jeudi
  { day: "Jeu", time: "12h40", key: "thai",      name: "Boxe Thaï · K1", coach: "Tawee",       lvl: "Tous niveaux" },
  { day: "Jeu", time: "18h20", key: "lady",      name: "Lady Punch",     coach: "Dadi",        lvl: "100 % féminin" },
  { day: "Jeu", time: "19h00", key: "grappling", name: "Grappling",      coach: "Coach à confirmer", lvl: "Tous niveaux" },
  { day: "Jeu", time: "20h00", key: "thai",      name: "Boxe Thaï · K1", coach: "Victor G",    lvl: "Tous niveaux" },
  // Vendredi
  { day: "Ven", time: "12h40", key: "anglaise",  name: "Boxe Anglaise",  coach: "Dadi",        lvl: "Tous niveaux" },
  { day: "Ven", time: "18h20", key: "camp",      name: "Boxing Camp",    coach: "Dadi",        lvl: "Tous niveaux" },
  { day: "Ven", time: "19h00", key: "thai",      name: "Boxe Thaï · K1", coach: "Victor G",    lvl: "Tous niveaux" },
  { day: "Ven", time: "20h00", key: "anglaise",  name: "Boxe Anglaise",  coach: "Dadi",        lvl: "Débutant → confirmé" },
  // Samedi
  { day: "Sam", time: "11h00", key: "camp",      name: "Boxing Camp",    coach: "Hicham",      lvl: "Tous niveaux" },
  { day: "Sam", time: "14h15", key: "kids",      name: "Baby Boxe",      coach: "Dadi",        lvl: "3 → 6 ans" },
  { day: "Sam", time: "15h00", key: "kids",      name: "Éducative 7/11", coach: "Dadi",       lvl: "7 → 11 ans" },
  { day: "Sam", time: "16h00", key: "kids",      name: "Éducative 12/16", coach: "Dadi",      lvl: "12 → 16 ans" },
  { day: "Sam", time: "17h00", key: "kids",      name: "Éducative compétiteurs", coach: "Dadi", lvl: "jusqu’à 18h15" },
  { day: "Sam", time: "18h00", key: "thai",      name: "Boxe Pieds-Poings", coach: "Coach à confirmer", lvl: "jusqu’à 20h00" },
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
  { name: "Dadi", role: "Anglaise · Lady Punch · École", tag: "Le pilier",
    note: "Anglaise, Lady Punch et toute l’école, du Baby Boxe aux compétiteurs : Dadi tient la semaine d’un bout à l’autre. Premier cours ? Dis-lui que tu n’as jamais boxé — c’est exactement là que son travail commence.",
    img: "/assets/img/sc/coach-dadi.webp",
    // alt écrit d’après le cliché — jamais dérivé du nom ni du tag
    alt: "Le coach Dadi, casquette et t-shirt Boxing Center rouge, bras croisés devant le ring de la salle" },
  { name: "Tawee", role: "Boxe Thaï · K1", tag: "L’art thaï", note: "La thaï enseignée comme elle se boxe là-bas — les tibias avant les mots. Et pour ta première : on apprend la touche avant la puissance." },
  { name: "Hicham", role: "Hyrox · Cross · Camp", tag: "Le moteur", note: "Les circuits qui construisent la caisse. Tu repars vidé, tu reviens plus fort." },
  { name: "Victor G", role: "Boxe Thaï · K1", tag: "La relève", note: "Les créneaux thaï/K1 du soir — l’intensité montante de la semaine." },
];

/* ------------------------------------------------------------------ *
 *  LES OFFRES — bloc daté (source : posters officiels + OFFRES_RENTREE_2026).
 *  Jamais en dur dans les pages ; toujours via PROMOS + SEASON. RÈGLE :
 *  le Duo s’écrit TOUJOURS "29€ par personne" — jamais "29€ pour deux".
 * ------------------------------------------------------------------ */
export const PROMOS = {
  saison: SEASON,
  label: SEASON_LABEL,
  bonus: "Inscription enfant : le t-shirt Boxing Center est inclus — pour tous.",
  essai: {
    name: "Séance d’essai",
    price: "10€",
    detail: "Toutes disciplines, matériel prêté, sans engagement.",
    cta: "Réserver mon essai",
    href: LINKS.essai,
  },
  duo: {
    name: "Offre Rentrée",
    price: "29€",
    unit: "par personne",
    was: "44€",
    detail: "4 semaines, cours illimités, sans engagement. Encore mieux à deux — 29€ chacun.",
    cta: "Je profite de l’offre — 29€",
    href: LINKS.promos,
  },
  saisonOffer: {
    name: "Offre Saison",
    price: "259€",
    unit: "les 12 mois",
    was: "400€",
    detail: "Boxe anglaise, MMA, boxe pieds-poings, Lady Punch, Boxing Fitness. Payable en 4× sans frais, accès libre aux 5 clubs du réseau.",
    cta: "Je prends ma saison",
    href: LINKS.promos,
  },
};


/* ------------------------------------------------------------------ *
 *  LE CADRAN DES OFFRES — ce qui tourne dans la roulette promo.
 *
 *  Une liste À PART, et c’est voulu : TARIFS est la grille complète (on la
 *  LIT, posément, sur /tarifs/) ; le cadran est une VITRINE — les DEUX
 *  offres qu’on met en avant, qui tournent en marge de la lecture.
 *  Mélanger les deux listes, c’est soit un cadran à sept cases que
 *  personne ne suit, soit une grille amputée. Le staff change un prix
 *  ici, le cadran suit sur les 10 pages.
 *
 *  Deux publics, deux cases : celui qui teste quatre semaines et celui
 *  qui prend l’année. Ajouter une troisième case (l’école, l’essai) se
 *  fait en ajoutant un bloc — le module en accepte n’importe quel nombre.
 *
 *  `was` / `cut` sont FACULTATIFS et n’existent que si la remise est
 *  réelle (la saison : 259€ au lieu de 400€, c’est le poster officiel).
 *  Sans eux, le cadran affiche le détail de l’offre — jamais un faux prix
 *  barré : la règle du site est de n’inventer ni prix ni promesse.
 * ------------------------------------------------------------------ */
export const ROULETTE = [
  {
    key: "rentree",
    price: "29€",
    name: "L’offre Rentrée",
    /* la règle du bloc PROMOS s’applique ici aussi : « par personne »,
       JAMAIS « pour deux ». */
    detail: "par personne · 4 semaines illimitées",
    was: "44€",
    cut: "-34%",
    href: LINKS.promos,
    cta: "Je profite de l’offre",
  },
  {
    key: "saison",
    price: "259€",
    name: "La saison complète",
    detail: "les 12 mois · 4× sans frais",
    was: "400€",
    cut: "-35%",
    href: LINKS.promos,
    cta: "Je prends ma saison",
  },
];

export const TARIFS = [
  {
    name: "Offre Rentrée",
    price: "29€",
    was: "44€",
    period: "par personne · 4 semaines",
    feature: "Cours illimités, toutes disciplines — encore mieux à deux",
    items: ["29€ par personne (au lieu de 44€)", "Toutes les disciplines", "Sans engagement"],
    cta: "Je profite de l’offre — 29€",
    href: LINKS.promos,
    highlight: true,
  },
  {
    name: SEASON_LABEL,
    price: "259€",
    was: "400€",
    period: "les 12 mois",
    feature: "Accès libre aux 5 clubs · payable en 4× — moins de 5€ par semaine",
    items: ["Toutes les disciplines adultes", "Payable en 4× 64,75€ sans frais", "Accès libre aux 5 salles du réseau"],
    cta: "Je prends ma saison",
    href: LINKS.promos,
    highlight: false,
  },
  /* LES CLASSIQUES — le barreau manquant de l’échelle. Entre la promo de
     rentrée et l’école, il y a le tarif de tous les jours : celui qu’on paie
     quand la promo est passée. Il s’écrit SANS prix barré (ce n’est pas une
     offre, c’est le prix), et il part vers l’ancre #prelevement de la
     boutique — c’est là que la formule au mois se règle. */
  {
    name: "Les classiques",
    price: "44€",
    period: "/ 4 semaines · adulte",
    feature: "Le tarif de tous les jours — étudiant 36€",
    items: ["Adulte 44€ / 4 semaines", "Étudiant 36€ / 4 semaines", "Accès aux 5 salles, toutes les disciplines"],
    cta: "Voir les formules au mois",
    href: LINKS.prelevement,
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

/* Avis Google RÉELS (verbatim, cités — jamais inventés). Réassurance sur
   /tarifs/ + /contact/. Source : fiche Google Boxing Center Saint-Cyprien. */
export const REVIEWS = {
  rating: "4,0/5",
  count: 97, // relevé Google Maps 2026-08-06
  source: "Avis Google",
  quotes: [
    { text: "Une petite salle au top, des coachs au top, nichée au cœur de Saint Cyp'.", author: "Ronan L." },
    { text: "Super salle, tous les mois Dadi améliore la salle avec des nouveaux équipements.", author: "Kayon M." },
    { text: "Bonne salle, propre avec de bons équipements. Cours complet.", author: "Omar T." },
    { text: "Les cours de boxing lady sont top ! Il y a une bonne ambiance.", author: "Alyssia P." },
  ],
};

/* Le réseau — les quatre sœurs, dans l’ordre de la lignée. C’est la PREUVE
   du titre : Saint-Cyprien vient après elles et retient ce qui marche.
   (Balma-Gramont vendue — jamais citée. Réseau = 5 clubs avec Saint-Cyprien.) */
export const NETWORK = [
  { id: "minimes", name: "Minimes", tag: "Le berceau", feat: "La salle historique · 3 rings · l’école", url: "https://bc-minimes.vercel.app/" },
  { id: "portet", name: "Portet-sur-Garonne", tag: "Le vaisseau amiral", feat: "Le grand format · ring de boxe anglaise · cage MMA", url: "https://www.boxing-center-portet.fr/" },
  { id: "etats-unis", name: "États-Unis", tag: "Le colosse", feat: "1 200 m² · 3 zones · 2 rings · cage MMA", url: "https://boxingcenter.fr/" },
  { id: "ramonville", name: "Ramonville", tag: "Le ciel ouvert", feat: "Octogone 7 m · ring de boxe anglaise · 300 m² extérieur", url: "https://bc-ramonville.vercel.app/" },
];

/* FAQ générale — servie en FAQPage LD-JSON sur /contact/. */
export const FAQ = [
  { q: "Où se trouve Boxing Center Saint-Cyprien ?", a: "Au 11 rue Sainte-Lucie, 31300 Toulouse, en plein quartier Saint-Cyprien rive gauche — à 4 minutes à pied du métro ligne A (Saint-Cyprien République)." },
  { q: "Comment se passe la première séance ?", a: "Tu arrives 10 minutes avant, en tenue de sport. Tu dis que c’est ta première fois — c’est la seule phrase à préparer. Les gants et le matériel te sont prêtés sur place, puis échauffement, technique et sac, à ton rythme : pas de sparring imposé, pas de test. La séance d’essai coûte 10€, toutes disciplines. Le déroulé complet est sur la page « Ta première séance »." },
  { q: "Je n’ai jamais boxé, je peux venir ?", a: "Oui. La plupart des créneaux sont ouverts à tous les niveaux : commence par le Boxing Camp — technique, cardio, sacs, à ton rythme. Personne ne te regarde débuter." },
  { q: "Quelles disciplines peut-on pratiquer ?", a: "Boxe anglaise, boxe thaï / K1, grappling, Hyrox, cross-training, Lady Punch, boxing camp et toute l’école enfants du Baby Boxe (3/6 ans) aux compétiteurs." },
  { q: "Y a-t-il des cours pour les enfants ?", a: "Oui, dès 3 ans : Baby Boxe le samedi, boxe éducative 7/11 ans et ados 12/16 ans le mercredi et le samedi, et un créneau compétiteurs encadré par Dadi." },
  { q: "Faut-il un abonnement pour commencer ?", a: "Non. La séance d’essai à 10€ donne accès à toutes les disciplines, matériel prêté. Tu t’abonnes ensuite si tu veux continuer — sans engagement, ou à la saison." },
  { q: "Quels sont les horaires ?", a: "Du lundi au samedi, de 10h00 à 21h15 (dernier cours 20h–21h15 selon les jours). Fermé le dimanche." },
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
