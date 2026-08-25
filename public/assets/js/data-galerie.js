/* =====================================================================
   SAINT-CYPRIEN · data-galerie.js — les données que SEULE la page galerie lit.

   Pourquoi à part : data.js est chargé par les 8 pages. Y laisser ce bloc
   revenait à faire descendre GALLERY à
   quelqu’un qui lit les tarifs. Rien ici n’est surchargeable par le
   vestiaire — la fusion de public/content.json reste entièrement dans
   data.js, à un seul endroit.
   ===================================================================== */

/* ------------------------------------------------------------------ *
 *  LA GALERIE, ZONE PAR ZONE — remontée ici depuis galerie.js (le module
 *  la portait en local avec un TODO). Une zone = un intertitre, une SPEC
 *  mono, une ligne d’édito (ce qu’on y fait vraiment) et ses clichés.
 *  `alt` décrit la photo ; `cap` est la pastille mono — les deux ne se
 *  confondent jamais. Aucune photo de banque : le seul fichier de stock qui
 *  traînait encore (salle-2.webp — deux modèles en studio, gants rouges,
 *  zéro signalétique BC) a été SUPPRIMÉ du dépôt, pas seulement décâblé :
 *  un visuel qui ne montre pas cette salle n’a rien à faire dans le build.
 * ------------------------------------------------------------------ */
export const GALLERY = [
  {
    id: "plateau", zone: "Le plateau", spec: "Sacs, tatamis et ring",
    lede: "Un seul niveau : depuis la porte tu vois déjà les sacs, le ring et la cage. Rien n’est planqué derrière une cloison, aucune mezzanine à monter — c’est tout l’argument.",
    shots: [
      { f: "salle-1.webp", feat: "wide", cap: "Le plateau", alt: "Le plateau vu dans sa longueur : bancs et racks au premier plan, tapis bleu et rouge, bannière Boxing Center au fond sous la charpente métallique" },
    ],
  },
  {
    id: "anglaise", zone: "L’anglaise", spec: "Le noble art · le ring",
    lede: "Cinq créneaux par semaine sur le même ring : deux midis, trois soirs. C’est le poste de Dadi, du premier jab au sparring encadré.",
    shots: [
      { f: "anglaise-header.webp", feat: "wide", cap: "Aux boucliers", alt: "Un cours en plein travail : les pratiquants frappent des boucliers ronds tenus par leurs binômes, entre les sacs suspendus" },
      { f: "anglaise.webp", cap: "Au travail", alt: "Une boxeuse en garde, poings fermés devant le visage, concentrée, devant le mur peint de la salle" },
    ],
  },
  {
    id: "pieds-poings", zone: "Le pieds-poings", spec: "Thaï · K1",
    lede: "Cinq créneaux tenus à deux : Tawee le midi, Victor G le soir — le sixième, samedi 18h, attend son encadrant. Les tibias et les genoux entrent dans le jeu, la technique ne baisse pas d’un cran.",
    shots: [
      { f: "thai-2.webp", feat: "wide", cap: "Aux sacs", alt: "Le groupe aux sacs pendant un cours pieds-poings, chacun sur son sac le long de la charpente" },
      { f: "thai.webp", cap: "Tibias, genoux", alt: "Une pratiquante lance un coup de pied haut dans la cage, appui planté et garde tenue" },
      { f: "thai-1.webp", cap: "K1", alt: "Deux pratiquants, protège-tibias aux jambes, travaillent au sac sous la bannière Boxing Center" },
    ],
  },
  {
    id: "sol", zone: "Le sol", spec: "Grappling · mardi & jeudi",
    lede: "Une heure au sol, deux soirs par semaine, dans la cage : projections, contrôle, soumissions. Le complément qui manque à la plupart des boxeurs.",
    shots: [
      { f: "grappling.webp", feat: "wide", cap: "Dans la cage", alt: "Deux pratiquantes gantées échangent dans la cage grillagée, garde haute" },
    ],
  },
  {
    id: "moteur", zone: "Le moteur", spec: "Hyrox · cross · muscu",
    lede: "La zone qui porte tout le reste : charges, rameurs, circuits. Hicham y tient l’Hyrox le mercredi et le cross deux fois par semaine — la caisse se construit ici, pas sur le ring.",
    shots: [
      { f: "muscu.webp", feat: "wide", cap: "Charges", alt: "La salle de charge : cage à squat, bancs inclinés et machines alignées sur sol caoutchouc" },
      { f: "cross.webp", cap: "Cross-training", alt: "La zone moteur : rameurs alignés au premier plan, bancs et racks derrière, bannière Boxing Center au mur" },
      { f: "hyrox.webp", cap: "Hyrox", alt: "Travail en circuit au pied du ring : montées sur step, gainage au sol et banc, plusieurs ateliers en parallèle" },
      { f: "training.webp", cap: "Boxing camp", alt: "Un coach donne la consigne à un groupe monté sur le ring, gants aux mains" },
    ],
  },
  {
    id: "lady", zone: "Lady Punch", spec: "100 % féminin · mar. & jeu.",
    lede: "Mardi et jeudi à 18h20, le créneau est à elles. Zéro prérequis, zéro galerie qui regarde : la boxe pour la forme, le cardio et la confiance.",
    shots: [
      { f: "lady-2.webp", feat: "wide", cap: "100 % féminin", alt: "Un coach corrige la position d’une pratiquante devant un sac, pendant un cours Lady Punch" },
      { f: "lady.webp", cap: "Cardio & confiance", alt: "Un cours Lady Punch : plusieurs pratiquantes travaillent aux sacs le long du plateau" },
    ],
  },
  {
    id: "ecole", zone: "L’école", spec: "Dès 3 ans → compétiteurs",
    lede: "Baby Boxe le samedi, éducative 7/11 et ados 12/16 le mercredi et le samedi, compétiteurs dans la foulée. Le même coach du bac à sable au premier combat.",
    shots: [
      { f: "educative.webp", cap: "L’école en compétition", alt: "Deux jeunes licenciées en maillot Boxing Center, médaille aux dents, après une compétition" },
      { f: "tous-niveaux.webp", cap: "Tous niveaux", alt: "Un groupe mêlé, adultes et plus jeunes, travaille aux sacs et aux cibles murales pendant le même cours" },
    ],
  },
];

/* Les paliers de l’école — remontés ici depuis activites.js (TODO levé).
   Sous-niveaux de la discipline `kids` ; jours = poster officiel. */
