/* =====================================================================
   SAINT-CYPRIEN · data-galerie.js — les données que SEULE la page galerie lit.

   Pourquoi à part : data.js est chargé par les 8 pages. Y laisser ce bloc
   revenait à faire descendre GALLERY à
   quelqu'un qui lit les tarifs. Rien ici n'est surchargeable par le
   vestiaire — la fusion de public/content.json reste entièrement dans
   data.js, à un seul endroit.
   ===================================================================== */

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
