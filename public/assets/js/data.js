/* =====================================================================
   BOXING CENTER — SAINT-CYPRIEN · "LA NOUVELLE GÉNÉRATION"
   Content source of truth (maquette). Plain ES module → Astro/Next.

   Identity anchor: la salle que le réseau a dessinée en DERNIER. On ne
   vend pas un état ("neuve" — ça périme au bout de deux ans), on vend une
   POSITION dans une lignée (permanent) : Minimes a ouvert la voie (le
   berceau), Portet a vu grand (le vaisseau amiral), États-Unis a bâti le
   colosse, Ramonville a ouvert le ciel — Saint-Cyprien a tout retenu.
   1 200 m² rive gauche, le premier Boxing Center rive gauche.
   La DA reste le SHOWROOM au noir : la lumière n'éclaire pas du matériel,
   elle isole LE GESTE (ta garde, ton souffle, tes appuis). Le configurateur
   = "choisis ce que la lumière éclaire cette semaine".
   Staff & créneaux = le planning officiel rentrée 2026 (poster du club).
   ===================================================================== */

/* Constantes anti-péremption — tout libellé de saison passe par ici. */
export const SEASON = "2026-2027";
export const SEASON_LABEL = "Saison 2026 — 2027";

export const SALLE = {
  id: "st-cyprien",
  name: "Boxing Center Saint-Cyprien",
  short: "Saint-Cyprien",
  baseline: "La nouvelle génération Boxing Center, rive gauche.",
  opened: "Août 2025",          // fait daté — LD-JSON foundingDate uniquement, jamais en headline
  surface: "1 200 m²",
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

/* Conversion — tout l'essai pointe vers box-plus (liens vérifiés 2026-07-12) */
export const LINKS = {
  essai: "https://box-plus.vercel.app/seance-essai",          // CTA principal de CHAQUE page (10€)
  abos: "https://box-plus.vercel.app/abonnements",
  promos: "https://box-plus.vercel.app/abonnements#promotions", // cartes Duo / Saison
  enfants: "https://box-plus.vercel.app/abonnements#enfants",
  coachings: "https://box-plus.vercel.app/coachings",
  materiel: "https://box-plus.vercel.app/materiel",
  boutique: "https://boxingcenter.fr/",
  groupe: "https://boxingcenter.fr/",
  facebook: "https://www.facebook.com/BoxingCenterToulouse/",
  instagram: "https://www.instagram.com/boxingcentertoulouse/",
};

export const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/la-salle/", label: "La salle" },
  { href: "/activites/", label: "Activités" },
  { href: "/coachs/", label: "Coachs" },
  { href: "/galerie/", label: "Galerie" },
  { href: "/plannings/", label: "Planning" },
  { href: "/tarifs/", label: "Tarifs" },
  { href: "/contact/", label: "Contact" },
];

/* Les preuves du titre — chiffres inusables (aucune date, aucun "neuf") */
export const STATS = [
  { v: 1200, suffix: " m²", l: "de plateau, rive gauche" },
  { v: 4, suffix: " min", l: "du métro A · Saint-Cyprien République" },
  { v: 10, suffix: "+", l: "disciplines, une seule adresse" },
  { v: 4, suffix: "", l: "coachs spécialisés au planning" },
];

/* ------------------------------------------------------------------ *
 *  L'ÉTAT « PAS ENCORE NOMMÉ » — le grappling tourne au planning officiel
 *  mais le poster ne porte AUCUN nom d'encadrant (roster.json : aucune
 *  entrée, confidence nulle). On n'invente pas : on affiche un état voulu,
 *  identifié partout par le même token, avec la raison écrite en clair.
 *  Toute la chaîne (configurateur, activités, planning, coachs) lit ceci.
 * ------------------------------------------------------------------ */
export const COACH_TBD = "Coach à confirmer";
export const COACH_TBD_SHORT = "Nom à venir";
export const COACH_TBD_WHY =
  "Le créneau tourne, la salle est ouverte, le tapis est là. Le nom de l'encadrant s'affichera ici le jour où il est acté au planning officiel — pas avant. On préfère une case vide à un nom qu'on ne peut pas tenir.";

/* ------------------------------------------------------------------ *
 *  LE CONFIGURATEUR — la signature. Tu choisis ta discipline comme on
 *  configure un produit : photo, jours, coach, niveau. Tout est réel
 *  (planning rentrée 2026, poster officiel du club). `cat` groupe les
 *  entrées pour /activites/ (adultes · lady · école).
 *
 *  `alt` = le VRAI texte alternatif, écrit d'après le cliché lui-même
 *  (ce qu'on voit, pas ce qu'on vend). Il ne dérive JAMAIS de `tag` ni de
 *  `name` — ceux-là ne servent qu'à la pastille mono (data-label).
 * ------------------------------------------------------------------ */
export const DISCIPLINES = [
  {
    key: "anglaise",
    name: "Boxe Anglaise",
    tag: "Le noble art",
    cat: "adulte",
    coach: "Dadi",
    jours: "Midi lun./mer./ven. · soirs lun./mer./ven. 20h",
    niveau: "Débutant → confirmé",
    desc: "Jab, esquive, jeu de jambes : le noble art enseigné proprement, du premier gant aux gants qui piquent. Les cours du midi pour la pause active, les soirs pour le vrai travail.",
    img: "/assets/img/sc/anglaise-header.webp",
    alt: "Un boxeur en casque et gants, garde haute et appui avant marqué, au milieu d'un cours d'anglaise sur le ring ; d'autres binômes travaillent derrière les cordes",
  },
  {
    key: "thai",
    name: "Boxe Thaï · K1",
    tag: "Pieds-poings",
    cat: "adulte",
    coach: "Tawee · Victor G",
    jours: "Midi mar. & jeu. · soirs mar./jeu. 20h · ven. 19h",
    niveau: "Tous niveaux",
    desc: "Tibias, genoux, coudes — la boxe la plus complète, avec un enseignement dans les règles de l'art. Deux coachs, cinq créneaux par semaine.",
    img: "/assets/img/sc/thai-1.webp",
    alt: "Deux pratiquants de boxe thaï face à face au bord du ring : l'un tient les pattes d'ours, mains bandées de rouge, l'autre s'apprête à frapper",
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
    desc: "Projections, contrôle, soumissions. Le complément sol qui transforme un boxeur en combattant complet.",
    img: "/assets/img/sc/grappling.webp",
    alt: "Vue plongeante sur la cage : plusieurs binômes travaillent au sol, contrôles et sorties, pendant qu'un pratiquant debout observe la position",
  },
  {
    key: "hyrox",
    name: "Hyrox & Cross",
    tag: "Le moteur",
    cat: "adulte",
    coach: "Hicham",
    jours: "Hyrox mer. 18h20 · cross lun. & mer. 19h",
    niveau: "Ça pique — pour tous",
    desc: "Circuits Hyrox et cross-training : le cardio et la force qui portent tes gants. La zone moteur tourne toute la semaine.",
    img: "/assets/img/sc/hyrox.webp",
    alt: "Un groupe de pratiquants court en peloton sur une route de campagne, foulée soutenue — le travail de caisse derrière l'Hyrox et le cross",
  },
  {
    key: "lady",
    name: "Lady Punch",
    tag: "100 % féminin",
    cat: "lady",
    coach: "Dadi",
    jours: "Mardi & jeudi · 18h20 – 19h",
    niveau: "Zéro prérequis",
    desc: "Un créneau à elles : la boxe pour la forme, la confiance et le cardio — pas de cliché, pas de galerie qui te regarde.",
    img: "/assets/img/sc/lady-2.webp",
    alt: "Une boxeuse en gants, garde serrée, frappe un sac de frappe pendant un cours Lady Punch ; d'autres pratiquantes travaillent aux sacs derrière elle",
  },
  {
    key: "kids",
    name: "Boxe Éducative",
    tag: "Dès 3 ans",
    cat: "ecole",
    coach: "Dadi",
    jours: "Baby 3/6 sam. · 7/11 & 12/16 mer. + sam. · compétiteurs mer./sam.",
    niveau: "Baby → compétition",
    desc: "Du Baby Boxe aux compétiteurs : coordination, respect, cadre. L'école complète, du premier déplacement au premier combat.",
    img: "/assets/img/sc/educative-1.webp",
    alt: "Deux jeunes boxeurs en casque et gants s'échangent des touches en assaut encadré, devant un mur peint de la salle",
  },
  {
    key: "camp",
    name: "Boxing Camp",
    tag: "Le condensé",
    cat: "adulte",
    coach: "Dadi · Hicham",
    jours: "Lun. & ven. 18h20 · sam. 11h",
    niveau: "Tous niveaux",
    desc: "Le format signature Boxing Center : technique + cardio + sacs en une séance dense. Le meilleur point d'entrée si tu hésites.",
    img: "/assets/img/sc/training.webp",
    alt: "Sur le tapis, un pratiquant lance un coup de pied haut pendant que le groupe travaille en binômes, gants et protège-tibias aux jambes",
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
  { day: "Lun", time: "12h40", key: "anglaise",  name: "Boxe Anglaise",  coach: "Dadi",        lvl: "Tous niveaux" },
  { day: "Lun", time: "18h20", key: "camp",      name: "Boxing Camp",    coach: "Hicham",      lvl: "Tous niveaux" },
  { day: "Lun", time: "19h00", key: "hyrox",     name: "Cross-Training", coach: "Hicham",      lvl: "Ça pique" },
  { day: "Lun", time: "20h00", key: "anglaise",  name: "Boxe Anglaise",  coach: "Dadi",        lvl: "Débutant → confirmé" },
  // Mardi
  { day: "Mar", time: "12h40", key: "thai",      name: "Boxe Thaï · K1", coach: "Tawee",       lvl: "Tous niveaux" },
  { day: "Mar", time: "18h20", key: "lady",      name: "Lady Punch",     coach: "Dadi",        lvl: "100 % féminin" },
  { day: "Mar", time: "19h00", key: "grappling", name: "Grappling",      coach: "Coach à confirmer", lvl: "Tous niveaux" },
  { day: "Mar", time: "20h00", key: "thai",      name: "Boxe Thaï · K1", coach: "Victor G",    lvl: "Tous niveaux" },
  // Mercredi
  { day: "Mer", time: "12h40", key: "anglaise",  name: "Boxe Anglaise",  coach: "Dadi",        lvl: "Tous niveaux" },
  { day: "Mer", time: "15h00", key: "kids",      name: "Éducative 7/11 · 12/16 · compétiteurs", coach: "Dadi", lvl: "7 → 16 ans" },
  { day: "Mer", time: "18h20", key: "hyrox",     name: "Hyrox",          coach: "Hicham",      lvl: "Ça pique" },
  { day: "Mer", time: "19h00", key: "hyrox",     name: "Cross-Training", coach: "Hicham",      lvl: "Ça pique" },
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
  { day: "Sam", time: "15h00", key: "kids",      name: "Éducative 7/11 · 12/16 · compétiteurs", coach: "Dadi", lvl: "7 → 16 ans" },
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

/* ------------------------------------------------------------------ *
 *  LA VISITE — la signature de /la-salle/. La visite du showroom, au noir :
 *  six postes, chacun allumé quand tu l'atteins. La lumière isole le geste,
 *  pas le neuf. Photos = vrais clichés BC ; specs factuelles (rien d'inventé).
 * ------------------------------------------------------------------ */
export const VISITE = [
  {
    n: "01",
    t: "Le plateau",
    tag: "1 200 m² · rive gauche",
    d: "Un seul niveau, mille deux cents mètres carrés, rive gauche. Tu entres et tu vois déjà où tu vas travailler : le ring au fond, les sacs à droite, rien de planqué.",
    img: "/assets/img/sc/salle-1.webp",
    alt: "Le plateau vu depuis l'entrée : la ligne de sacs suspendus à la charpente, le tapis bleu, le ring au fond et la cage grillagée sur la droite",
    specs: ["1 200 m²", "Un seul niveau"],
  },
  {
    n: "02",
    t: "L'anglaise",
    tag: "Le noble art",
    d: "Ring, cordes tendues, coin bleu, coin rouge. C'est le poste de Dadi : le jab, la garde, le déplacement, six fois par semaine.",
    img: "/assets/img/sc/anglaise.webp",
    alt: "Un cours d'anglaise en plein travail : jeunes et adultes gantés de part et d'autre des cordes, sacs et poires de vitesse en arrière-plan",
    specs: ["Coach · Dadi", "6 créneaux / sem."],
  },
  {
    n: "03",
    t: "Le pieds-poings",
    tag: "Thaï · K1",
    d: "Le tapis pieds-poings, sous son propre faisceau. Tawee et Victor G y passent cinq fois par semaine.",
    img: "/assets/img/sc/thai-2.webp",
    alt: "Un pratiquant lance un genou face à un coach qui tient la patte d'ours, sur le tapis bleu au pied du ring",
    specs: ["Coachs · Tawee, Victor G", "5 créneaux / sem."],
  },
  {
    n: "04",
    t: "La zone cross & muscu",
    tag: "Le moteur",
    d: "Machines, charges, sacs : la salle des moteurs. Hyrox le mercredi, cross lundi et mercredi avec Hicham — la caisse derrière chaque discipline.",
    img: "/assets/img/sc/muscu.webp",
    alt: "La zone moteur : rameurs au premier plan, cage à squat, bancs inclinés et machines de charge sur sol caoutchouc",
    specs: ["Coach · Hicham", "Hyrox · Cross · HIIT"],
  },
  {
    n: "05",
    t: "L'école",
    tag: "Dès 3 ans",
    d: "Baby Boxe le samedi, éducative 7/11, ados 12/16, compétiteurs : l'école complète tient son propre créneau, encadrée par Dadi du plus petit au ring.",
    img: "/assets/img/sc/educative.webp",
    alt: "Un jeune boxeur en casque frappe un sac sous la charpente métallique, vu depuis le coin du ring",
    specs: ["Baby 3/6 · 7/11 · 12/16", "Coach · Dadi"],
  },
  {
    n: "06",
    t: "Le collectif",
    tag: "Tous niveaux",
    d: "Lady Punch le mardi et le jeudi, boxing camp trois fois par semaine : les créneaux où l'on transpire ensemble, tous niveaux confondus.",
    img: "/assets/img/sc/tous-niveaux.webp",
    alt: "Un pratiquant, gants aux poings, attend son tour au bord du ring pendant que le groupe s'échauffe derrière les cordes",
    specs: ["Lady Punch · 100 % féminin", "Camp · 3 créneaux"],
  },
];

/* Le code de la salle — quatre valeurs DURABLES (le geste / l'école /
   le quartier / le choix). Aucune n'expire. */
export const VALUES = [
  { n: "01", t: "Le geste", d: "Chaque cours éclaire une chose : ta garde, ton souffle, tes appuis. Le reste attend son tour." },
  { n: "02", t: "L'école", d: "Du Baby Boxe 3/6 aux compétiteurs : une lignée complète, tenue par le même coach d'un âge à l'autre." },
  { n: "03", t: "Le quartier", d: "Tu vois le ring depuis la porte. Premier Boxing Center rive gauche, à 4 minutes du métro A." },
  { n: "04", t: "Le choix", d: "Plus de dix disciplines, un seul plancher : tu règles ta semaine comme TU la veux." },
];

/* L'encadrement — noms = le planning officiel rentrée 2026. Photo seulement
   quand la source prouve le nom↔visage (Dadi) ; les autres = tuile stylée
   (roster.json fait foi — jamais de stock, jamais de nom croisé). */
export const COACHES = [
  { name: "Dadi", role: "Anglaise · Lady Punch · École", tag: "Le pilier",
    note: "Anglaise, Lady Punch et toute l'école, du Baby Boxe aux compétiteurs : Dadi tient la semaine d'un bout à l'autre.",
    img: "/assets/img/sc/coach-dadi.webp",
    // alt écrit d'après le cliché — jamais dérivé du nom ni du tag
    alt: "Le coach Dadi, casquette et t-shirt Boxing Center rouge, poing serré devant lui, debout sur le tapis au bord du ring de la salle" },
  { name: "Tawee", role: "Boxe Thaï · K1", tag: "L'art thaï", note: "La thaï enseignée comme elle se boxe là-bas — les tibias avant les mots." },
  { name: "Hicham", role: "Hyrox · Cross · Camp", tag: "Le moteur", note: "Les circuits qui construisent la caisse. Tu repars vidé, tu reviens plus fort." },
  { name: "Victor G", role: "Boxe Thaï · K1", tag: "La relève", note: "Les créneaux thaï/K1 du soir — l'intensité montante de la semaine." },
];

/* ------------------------------------------------------------------ *
 *  LES OFFRES — bloc daté (source : posters officiels + OFFRES_RENTREE_2026).
 *  Jamais en dur dans les pages ; toujours via PROMOS + SEASON. RÈGLE :
 *  le Duo s'écrit TOUJOURS "29€ par personne" — jamais "29€ pour deux".
 * ------------------------------------------------------------------ */
export const PROMOS = {
  saison: SEASON,
  label: SEASON_LABEL,
  bonus: "T-shirt Boxing Center offert aux 100 premiers inscrits de la saison.",
  essai: {
    name: "Séance d'essai",
    price: "10€",
    detail: "Toutes disciplines, matériel prêté, sans engagement.",
    cta: "Réserver mon essai",
    href: LINKS.essai,
  },
  duo: {
    name: "Offre Duo",
    price: "29€",
    unit: "par personne",
    was: "44€",
    detail: "4 semaines, cours illimités, sans engagement. Tu viens avec ton binôme — vous payez 29€ chacun.",
    cta: "Je viens avec mon binôme",
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

export const TARIFS = [
  {
    name: "Séance d'essai",
    price: "10€",
    period: "la séance",
    feature: "Toutes disciplines, matériel prêté",
    items: ["Accès à toutes les disciplines", "Gants et matériel prêtés", "Sans engagement"],
    cta: "Réserver mon essai",
    href: LINKS.essai,
    highlight: false,
  },
  {
    name: SEASON_LABEL,
    price: "259€",
    period: "les 12 mois",
    feature: "Accès libre aux 5 clubs · payable en 4×",
    items: ["Toutes les disciplines adultes", "Payable en 4× sans frais", "Accès libre aux 5 salles du réseau"],
    cta: "Je prends ma saison",
    href: LINKS.promos,
    highlight: true,
  },
  {
    name: "École & Baby Boxe",
    price: "dès 280€",
    period: "/ an",
    feature: "Enfants & ados, dès 3 ans",
    items: ["Baby 3/6 · 7/11 · ados 12/16", "Matériel fourni", "Compétiteurs encadrés par Dadi"],
    cta: "Inscrire mon enfant",
    href: LINKS.enfants,
    highlight: false,
  },
];

/* Avis Google RÉELS (verbatim, cités — jamais inventés). Réassurance sur
   /tarifs/ + /contact/. Source : fiche Google Boxing Center Saint-Cyprien. */
export const REVIEWS = {
  rating: "4,2/5",
  count: 59,
  source: "Avis Google",
  quotes: [
    { text: "Une petite salle au top, des coachs au top, nichée au cœur de Saint Cyp'.", author: "Ronan L." },
    { text: "Super salle, tous les mois Dadi améliore la salle avec des nouveaux équipements.", author: "Kayon M." },
    { text: "Bonne salle, propre avec de bons équipements. Cours complet.", author: "Omar T." },
    { text: "Les cours de boxing lady sont top ! Il y a une bonne ambiance.", author: "Alyssia P." },
  ],
};

/* Le réseau — les quatre sœurs, dans l'ordre de la lignée. C'est la PREUVE
   du titre : Saint-Cyprien vient après elles et retient ce qui marche.
   (Balma-Gramont vendue — jamais citée. Réseau = 5 clubs avec Saint-Cyprien.) */
export const NETWORK = [
  { id: "minimes", name: "Minimes", tag: "Le berceau", feat: "La salle historique · 3 rings · l'école", url: "https://boxingcenter.fr/" },
  { id: "portet", name: "Portet-sur-Garonne", tag: "Le vaisseau amiral", feat: "Le grand format · ring olympique · cage MMA", url: "https://www.boxing-center-portet.fr/" },
  { id: "etats-unis", name: "États-Unis", tag: "Le colosse", feat: "1 200 m² · 3 zones · 2 rings · cage MMA", url: "https://boxingcenter.fr/" },
  { id: "ramonville", name: "Ramonville", tag: "Le ciel ouvert", feat: "Octogone 7 m · ring olympique · 300 m² extérieur", url: "https://boxingcenter.fr/" },
];

/* FAQ générale — servie en FAQPage LD-JSON sur /contact/. */
export const FAQ = [
  { q: "Où se trouve Boxing Center Saint-Cyprien ?", a: "Au 11 rue Sainte-Lucie, 31300 Toulouse, en plein quartier Saint-Cyprien rive gauche — à 4 minutes à pied du métro ligne A (Saint-Cyprien République)." },
  { q: "Comment se passe la première séance ?", a: "Tu arrives 10 minutes avant, en tenue de sport. Les gants et le matériel te sont prêtés sur place, le coach t'explique le déroulé, et tu boxes avec le groupe. La séance d'essai coûte 10€, toutes disciplines." },
  { q: "Je n'ai jamais boxé, je peux venir ?", a: "Oui. La plupart des créneaux sont ouverts à tous les niveaux : commence par le Boxing Camp — technique, cardio, sacs, à ton rythme. Personne ne te regarde débuter." },
  { q: "Quelles disciplines peut-on pratiquer ?", a: "Boxe anglaise, boxe thaï / K1, grappling, Hyrox, cross-training, Lady Punch, boxing camp et toute l'école enfants du Baby Boxe (3/6 ans) aux compétiteurs." },
  { q: "Y a-t-il des cours pour les enfants ?", a: "Oui, dès 3 ans : Baby Boxe le samedi, boxe éducative 7/11 ans et ados 12/16 ans le mercredi et le samedi, et un créneau compétiteurs encadré par Dadi." },
  { q: "Faut-il un abonnement pour commencer ?", a: "Non. La séance d'essai à 10€ donne accès à toutes les disciplines, matériel prêté. Tu t'abonnes ensuite si tu veux continuer — sans engagement, ou à la saison." },
  { q: "Quels sont les horaires ?", a: "Du lundi au samedi, de 10h00 à 21h15 (dernier cours 20h–21h15 selon les jours). Fermé le dimanche." },
];

/* FAQ argent — servie sur /tarifs/. Désamorce les malentendus prix. */
export const PRICING_FAQ = [
  { q: "L'offre Duo, c'est 29€ pour deux ?", a: "Non : 29€ par personne. Tu viens avec ton binôme, vous payez 29€ chacun pour 4 semaines de cours illimités, sans engagement." },
  { q: "Y a-t-il un engagement ?", a: "La séance d'essai et l'offre Duo sont sans engagement. La saison se règle en une fois ou en 4× sans frais, sur douze mois." },
  { q: "Le t-shirt offert, c'est pour qui ?", a: "Pour les 100 premiers inscrits de la saison : un t-shirt Boxing Center offert dès l'inscription." },
  { q: "Je peux m'entraîner dans les autres salles ?", a: "Oui. La saison donne accès libre aux 5 clubs du réseau : Portet, Minimes, États-Unis, Saint-Cyprien et Ramonville." },
];

/* ------------------------------------------------------------------ *
 *  LA GALERIE, ZONE PAR ZONE — remontée ici depuis galerie.js (le module
 *  la portait en local avec un TODO). Une zone = un intertitre, une SPEC
 *  mono, une ligne d'édito (ce qu'on y fait vraiment) et ses clichés.
 *  `alt` décrit la photo ; `cap` est la pastille mono — les deux ne se
 *  confondent jamais. Aucune photo de banque : le seul fichier de stock qui
 *  traînait encore (salle-2.webp — deux modèles en studio, gants rouges,
 *  zéro signalétique BC) a été SUPPRIMÉ du dépôt, pas seulement décâblé :
 *  un visuel qui ne montre pas cette salle n'a rien à faire dans le build.
 * ------------------------------------------------------------------ */
export const GALLERY = [
  {
    id: "plateau", zone: "Le plateau", spec: "1 200 m² · un seul niveau",
    lede: "Un seul niveau : depuis la porte tu vois déjà les sacs, le ring et la cage. Rien n'est planqué derrière une cloison, aucune mezzanine à monter — c'est tout l'argument.",
    shots: [
      { f: "salle-1.webp", feat: "wide", cap: "Depuis l'entrée", alt: "Le plateau vu depuis la porte : la ligne de sacs suspendus à la charpente, le tapis bleu, le ring au fond et la cage grillagée sur la droite" },
    ],
  },
  {
    id: "anglaise", zone: "L'anglaise", spec: "Le noble art · le ring",
    lede: "Six créneaux par semaine sur le même ring : trois midis, trois soirs. C'est le poste de Dadi, du premier jab au sparring encadré.",
    shots: [
      { f: "anglaise-header.webp", feat: "wide", cap: "Le ring", alt: "Un boxeur en casque et gants, garde haute et appui avant marqué, au milieu d'un cours d'anglaise sur le ring" },
      { f: "anglaise.webp", cap: "Au travail", alt: "Un cours d'anglaise en plein travail : jeunes et adultes gantés de part et d'autre des cordes, sacs et poires de vitesse en arrière-plan" },
    ],
  },
  {
    id: "pieds-poings", zone: "Le pieds-poings", spec: "Thaï · K1",
    lede: "Cinq créneaux tenus à deux : Tawee le midi, Victor G le soir. Les tibias et les genoux entrent dans le jeu, la technique ne baisse pas d'un cran.",
    shots: [
      { f: "thai-2.webp", feat: "wide", cap: "La surface thaï", alt: "Un pratiquant lance un genou face à un coach qui tient la patte d'ours, sur le tapis bleu au pied du ring" },
      { f: "thai.webp", cap: "Tibias, genoux", alt: "Travail de boxe thaï aux sacs, protège-tibias aux jambes, sous la lumière de la salle" },
      { f: "thai-1.webp", cap: "K1", alt: "Deux pratiquants face à face au bord du ring : l'un tient les pattes d'ours, mains bandées de rouge, l'autre s'apprête à frapper" },
    ],
  },
  {
    id: "sol", zone: "Le sol", spec: "Grappling · mardi & jeudi",
    lede: "Une heure au sol, deux soirs par semaine, dans la cage : projections, contrôle, soumissions. Le complément qui manque à la plupart des boxeurs.",
    shots: [
      { f: "grappling.webp", feat: "wide", cap: "Contrôle & soumissions", alt: "Vue plongeante sur la cage : plusieurs binômes travaillent au sol, contrôles et sorties, pendant qu'un pratiquant debout observe la position" },
    ],
  },
  {
    id: "moteur", zone: "Le moteur", spec: "Hyrox · cross · muscu",
    lede: "La zone qui porte tout le reste : charges, rameurs, circuits. Hicham y tient l'Hyrox le mercredi et le cross deux fois par semaine — la caisse se construit ici, pas sur le ring.",
    shots: [
      { f: "muscu.webp", feat: "wide", cap: "Charges & sacs", alt: "La zone moteur : rameurs au premier plan, cage à squat, bancs inclinés et machines de charge sur sol caoutchouc" },
      { f: "cross.webp", cap: "Cross-training", alt: "Circuit de cross-training en cours, matériel de conditionnement disposé au sol" },
      { f: "hyrox.webp", cap: "Hyrox", alt: "Un groupe de pratiquants court en peloton sur une route de campagne, foulée soutenue — le travail de caisse derrière l'Hyrox" },
      { f: "training.webp", cap: "Boxing camp", alt: "Sur le tapis, un pratiquant lance un coup de pied haut pendant que le groupe travaille en binômes, gants et protège-tibias aux jambes" },
    ],
  },
  {
    id: "lady", zone: "Lady Punch", spec: "100 % féminin · mar. & jeu.",
    lede: "Mardi et jeudi à 18h20, le créneau est à elles. Zéro prérequis, zéro galerie qui regarde : la boxe pour la forme, le cardio et la confiance.",
    shots: [
      { f: "lady-2.webp", feat: "wide", cap: "100 % féminin", alt: "Une boxeuse en gants, garde serrée, frappe un sac de frappe pendant un cours Lady Punch ; d'autres pratiquantes travaillent aux sacs derrière elle" },
      { f: "lady.webp", cap: "Cardio & confiance", alt: "Cours de Lady Punch aux sacs, plusieurs pratiquantes gantées en travail de cardio" },
    ],
  },
  {
    id: "ecole", zone: "L'école", spec: "Dès 3 ans → compétiteurs",
    lede: "Baby Boxe le samedi, éducative 7/11 et ados 12/16 le mercredi et le samedi, compétiteurs dans la foulée. Le même coach du bac à sable au premier combat.",
    shots: [
      { f: "educative.webp", feat: "wide", cap: "Boxe éducative", alt: "Un jeune boxeur en casque frappe un sac sous la charpente métallique, vu depuis le coin du ring" },
      { f: "educative-1.webp", cap: "7 → 16 ans", alt: "Deux jeunes boxeurs en casque et gants s'échangent des touches en assaut encadré, devant un mur peint de la salle" },
      { f: "tous-niveaux.webp", cap: "Tous niveaux", alt: "Un pratiquant, gants aux poings, attend son tour au bord du ring pendant que le groupe s'échauffe derrière les cordes" },
    ],
  },
];

/* Les paliers de l'école — remontés ici depuis activites.js (TODO levé).
   Sous-niveaux de la discipline `kids` ; jours = poster officiel. */
export const ECOLE_LEVELS = [
  { age: "3 → 6 ans",   name: "Baby Boxe",         jours: "Samedi 14h15",          d: "Le samedi : coordination, jeu, premiers déplacements. On apprend à bouger avant d'apprendre à frapper." },
  { age: "7 → 11 ans",  name: "Éducative enfants", jours: "Mercredi & samedi 15h", d: "La technique par le jeu, le cadre par le respect. La vraie boxe, à leur échelle." },
  { age: "12 → 16 ans", name: "Éducative ados",    jours: "Mercredi & samedi 15h", d: "Gestuelle propre, intensité qui monte, premiers assauts encadrés." },
  { age: "Compétition", name: "Compétiteurs",      jours: "Mercredi & samedi",     d: "Le créneau de ceux qui montent sur le ring : préparation, sparring, corner. Encadré par Dadi." },
];

/* ------------------------------------------------------------------ *
 *  L'AIGUILLAGE — /activites/ listait sept disciplines et laissait le
 *  visiteur choisir tout seul : un catalogue, pas un conseil. Ici on prend
 *  position. Cinq intentions réelles → une discipline réelle (`key` mappe
 *  DISCIPLINES, donc l'ancre existe forcément). On n'aiguille PAS vers la
 *  thaï ni le grappling : qui les cherche sait déjà pourquoi — le dire vaut
 *  mieux que fabriquer une raison.
 * ------------------------------------------------------------------ */
export const PARCOURS = [
  {
    want: "Je n'ai jamais mis de gants",
    key: "camp",
    why: "Le camp ne demande aucun acquis : on t'apprend à te tenir, à respirer, à frapper un sac sans te faire mal au poignet. Trois créneaux dans la semaine, personne ne regarde le nouveau.",
  },
  {
    want: "Je veux une technique, pas une séance de fitness",
    key: "anglaise",
    why: "Six passages par semaine sur le même ring, le même œil au bord des cordes. Le jab avant la sueur : c'est le poste où l'on te corrige un détail jusqu'à ce qu'il tienne.",
  },
  {
    want: "Je veux que ça pique",
    key: "hyrox",
    why: "Hyrox et cross : la zone moteur, charges et circuits. Tu n'y apprends pas à boxer, tu y construis la caisse qui te permet de boxer une troisième reprise.",
  },
  {
    want: "Je préfère commencer sans galerie derrière moi",
    key: "lady",
    why: "Mardi et jeudi à 18h20, le créneau ne s'ouvre qu'aux femmes. Aucun prérequis, aucun public — juste les sacs et le cardio.",
  },
  {
    want: "C'est pour mon enfant",
    key: "kids",
    why: "Dès trois ans au Baby Boxe du samedi, puis 7/11, 12/16, compétiteurs. Le même coach à chaque palier : il n'y a personne à qui réexpliquer ton gamin.",
  },
];

/* La ligne qui assume ce qu'on n'aiguille pas (affichée sous l'aiguillage). */
export const PARCOURS_NOTE =
  "La thaï et le grappling ne sont pas dans cette liste : on n'a jamais vu quelqu'un arriver au grappling par hasard. Si tu les cherches, ils t'attendent plus bas, aux mêmes conditions.";

/* ------------------------------------------------------------------ *
 *  LES SEMAINES-TYPES — la question qui reste après le catalogue : « ça
 *  ressemble à quoi, concrètement, une semaine ici ? » Chaque ligne est un
 *  POINTEUR {day,time} vers SCHEDULE : rien n'est recopié, donc rien ne peut
 *  diverger du poster. Un pointeur qui ne retrouve pas son créneau est
 *  simplement omis à l'affichage — jamais rendu en dur.
 *  Ce sont des exemples, pas des formules vendues : le rendu le dit.
 * ------------------------------------------------------------------ */
export const SEMAINES = [
  {
    n: "2×",
    t: "Deux fois, sans se mentir",
    d: "Le minimum qui produit quelque chose. En dessous, on ne progresse pas, on entretient.",
    slots: [
      { day: "Lun", time: "18h20" },
      { day: "Mer", time: "20h00" },
    ],
  },
  {
    n: "3×",
    t: "Trois fois, debout puis au sol",
    d: "Les poings, les tibias, le tapis. La semaine de qui veut être complet plutôt que spécialiste.",
    slots: [
      { day: "Lun", time: "20h00" },
      { day: "Mar", time: "20h00" },
      { day: "Jeu", time: "19h00" },
    ],
  },
  {
    n: "4×",
    t: "Quatre fois, moteur compris",
    d: "Deux séances qui construisent le souffle, deux qui construisent le geste. C'est là que la caisse commence à se voir.",
    slots: [
      { day: "Lun", time: "19h00" },
      { day: "Mar", time: "20h00" },
      { day: "Mer", time: "18h20" },
      { day: "Ven", time: "18h20" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 *  LA MÉTHODE D'ENCADREMENT — trois règles VÉRIFIABLES, chacune adossée
 *  à un fait du poster officiel ou à la politique photo du site. Aucune
 *  biographie, aucun palmarès, aucun diplôme : rien qu'on ne puisse
 *  prouver ligne à ligne.
 * ------------------------------------------------------------------ */
export const ENCADREMENT = [
  {
    n: "01", t: "Un fil rouge, pas un roulement",
    d: "Dadi tient l'anglaise, la Lady Punch et l'école entière — Baby Boxe, 7/11, 12/16, compétiteurs. Ton enfant garde le même coach du premier déplacement au premier combat, et toi le même œil du midi au créneau de 20h.",
  },
  {
    n: "02", t: "Une surface, un spécialiste",
    d: "Le pieds-poings à Tawee et Victor G, le moteur à Hicham. Personne ne fait semblant de couvrir une discipline qui n'est pas la sienne : quatre noms qui tiennent leur poste valent mieux que dix qui tournent.",
  },
  {
    n: "03", t: "Un visage seulement s'il est prouvé",
    d: "Une photo n'apparaît sous un nom que si la source officielle du réseau associe les deux. Pour les autres, une tuile — jamais un visage emprunté, jamais une banque d'images. Un coach n'est pas un décor.",
  },
];
