/* =====================================================================
   SAINT-CYPRIEN · data-home.js — les données que SEULE la page accueil lit.

   Pourquoi à part : data.js est chargé par les 8 pages. Y laisser ce bloc
   revenait à faire descendre STATS à
   quelqu’un qui lit les tarifs. Rien ici n’est surchargeable par le
   vestiaire — la fusion de public/content.json reste entièrement dans
   data.js, à un seul endroit.
   ===================================================================== */

/* Les preuves du titre — chiffres inusables (aucune date, aucun "neuf") */
export const STATS = [
  { v: 1200, suffix: " m²", l: "de plateau, rive gauche" },
  { v: 4, suffix: " min", l: "du métro A · Saint-Cyprien République" },
  /* « 10+ disciplines » était un chiffre rond invérifiable : le poster en
     porte SEPT. On affiche donc ce qui se compte sur la grille — le nombre
     de cours de la semaine, calculé depuis SCHEDULE au rendu (`from`), et
     jamais recopié à la main. */
  { from: "cours", suffix: "", l: "cours par semaine, du lundi au samedi" },
  { v: 4, suffix: "", l: "coachs spécialisés au planning" },
];

/* ------------------------------------------------------------------ *
 *  L’ÉTAT « PAS ENCORE NOMMÉ » — le grappling tourne au planning officiel
 *  mais le poster ne porte AUCUN nom d’encadrant (roster.json : aucune
 *  entrée, confidence nulle). On n’invente pas : on affiche un état voulu,
 *  identifié partout par le même token, avec la raison écrite en clair.
 *  Toute la chaîne (configurateur, activités, planning, coachs) lit ceci.
 * ------------------------------------------------------------------ */
