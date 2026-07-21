/* =====================================================================
   SAINT-CYPRIEN · data-coachs.js — les données que SEULE la page coachs lit.

   Pourquoi à part : data.js est chargé par les 8 pages. Y laisser ce bloc
   revenait à faire descendre ENCADREMENT à
   quelqu’un qui lit les tarifs. Rien ici n’est surchargeable par le
   vestiaire — la fusion de public/content.json reste entièrement dans
   data.js, à un seul endroit.
   ===================================================================== */

/* ------------------------------------------------------------------ *
 *  LA MÉTHODE D’ENCADREMENT — trois règles VÉRIFIABLES, chacune adossée
 *  à un fait du poster officiel ou à la politique photo du site. Aucune
 *  biographie, aucun palmarès, aucun diplôme : rien qu’on ne puisse
 *  prouver ligne à ligne.
 * ------------------------------------------------------------------ */
export const ENCADREMENT = [
  {
    n: "01", t: "Un fil rouge, pas un roulement",
    d: "Dadi tient l’anglaise, la Lady Punch et l’école entière — Baby Boxe, 7/11, 12/16, compétiteurs. Ton enfant garde le même coach du premier déplacement au premier combat, et toi le même œil du midi au créneau de 20h.",
  },
  {
    n: "02", t: "Une surface, un spécialiste",
    d: "Le pieds-poings à Tawee et Victor G, le moteur à Hicham. Personne ne fait semblant de couvrir une discipline qui n’est pas la sienne : quatre noms qui tiennent leur poste valent mieux que dix qui tournent.",
  },
  {
    n: "03", t: "Un visage seulement s’il est prouvé",
    d: "Une photo n’apparaît sous un nom que si la source officielle du réseau associe les deux. Pour les autres, une tuile — jamais un visage emprunté, jamais une banque d’images. Un coach n’est pas un décor.",
  },
];
