/* =====================================================================
   SAINT-CYPRIEN · data-la-salle.js — les données que SEULE la page la salle lit.

   Pourquoi à part : data.js est chargé par les 8 pages. Y laisser ce bloc
   revenait à faire descendre VISITE + VALUES à
   quelqu’un qui lit les tarifs. Rien ici n’est surchargeable par le
   vestiaire — la fusion de public/content.json reste entièrement dans
   data.js, à un seul endroit.
   ===================================================================== */

/* ------------------------------------------------------------------ *
 *  LA VISITE — la signature de /la-salle/. La visite du showroom, au noir :
 *  six postes, chacun allumé quand tu l’atteins. La lumière isole le geste,
 *  pas le neuf. Photos = vrais clichés BC ; specs factuelles (rien d’inventé).
 * ------------------------------------------------------------------ */
export const VISITE = [
  {
    n: "01",
    t: "Le plateau",
    tag: "Centre-ville · rive gauche",
    d: "Un seul niveau, mille deux cents mètres carrés, rive gauche. Tu entres et tu vois déjà où tu vas travailler : le ring au fond, les sacs à droite, rien de planqué.",
    img: "/assets/img/sc/salle-1.webp",
    alt: "Le plateau vu dans sa longueur : bancs et racks au premier plan, tapis bleu et rouge, bannière Boxing Center au fond sous la charpente métallique",
    specs: ["Centre-ville", "Accès libre 7 j/7"],
  },
  {
    n: "02",
    t: "L’anglaise",
    tag: "Le noble art",
    d: "Ring, cordes tendues, coin bleu, coin rouge. C’est le poste de Dadi : le jab, la garde, le déplacement, cinq fois par semaine.",
    img: "/assets/img/sc/anglaise.webp",
    alt: "Une boxeuse en garde, poings fermés devant le visage, concentrée, devant le mur peint de la salle",
    specs: ["Coach · Dadi", "5 créneaux / sem."],
  },
  {
    n: "03",
    t: "Le pieds-poings",
    tag: "Thaï · K1",
    d: "Le tapis pieds-poings, sous son propre faisceau. Les coachs y passent cinq fois par semaine ; le sixième créneau, samedi 18h, attend son encadrant.",
    img: "/assets/img/sc/thai-2.webp",
    alt: "Le groupe aux sacs pendant un cours pieds-poings, chacun sur son sac le long de la charpente",
    specs: ["Boxe thaï · K1", "Tous niveaux"],
  },
  {
    n: "04",
    t: "La zone cross & muscu",
    tag: "Le moteur",
    d: "Machines, charges, sacs : la salle des moteurs. Hyrox le mercredi, cross lundi et mercredi avec Hicham — la caisse derrière chaque discipline.",
    img: "/assets/img/sc/muscu.webp",
    alt: "La salle de charge : cage à squat, bancs inclinés et machines alignées sur sol caoutchouc",
    specs: ["Coach · Hicham", "Hyrox · Cross · HIIT"],
  },
  {
    n: "05",
    t: "L’école",
    tag: "Dès 3 ans",
    d: "Baby Boxe le samedi, éducative 7/11, ados 12/16, compétiteurs : l’école complète tient son propre créneau, encadrée par Dadi du plus petit au ring.",
    img: "/assets/img/sc/educative.webp",
    alt: "Deux jeunes licenciées en maillot Boxing Center, médaille aux dents, après une compétition",
    specs: ["Baby 3/6 · 7/11 · 12/16", "Coach · Dadi"],
  },
  {
    n: "06",
    t: "Le collectif",
    tag: "Tous niveaux",
    d: "Lady Punch le mardi et le jeudi, boxing camp quatre fois par semaine : les créneaux où l’on transpire ensemble, tous niveaux confondus.",
    img: "/assets/img/sc/tous-niveaux.webp",
    alt: "Un groupe mêlé, adultes et plus jeunes, travaille aux sacs et aux cibles murales pendant le même cours",
    specs: ["Lady Punch · 100 % féminin", "Camp · 4 créneaux"],
  },
];

/* Le code de la salle — quatre valeurs DURABLES (le geste / l’école /
   le quartier / le choix). Aucune n’expire. */

export const VALUES = [
  { n: "01", t: "Le geste", d: "Chaque cours éclaire une chose : ta garde, ton souffle, tes appuis. Le reste attend son tour." },
  { n: "02", t: "L’école", d: "Du Baby Boxe 3/6 aux compétiteurs : une lignée complète, tenue par le même coach d’un âge à l’autre." },
  { n: "03", t: "Le quartier", d: "Tu vois le ring depuis la porte. Premier Boxing Center rive gauche, à 4 minutes du métro A." },
  { n: "04", t: "Le choix", d: "Sept disciplines et vingt-neuf cours par semaine sur un seul plancher : tu règles ta semaine comme TU la veux." },
];

/* L’encadrement — noms = le planning officiel rentrée 2026. Photo seulement
   quand la source prouve le nom↔visage (Dadi) ; les autres = tuile stylée
   (roster.json fait foi — jamais de stock, jamais de nom croisé). */
