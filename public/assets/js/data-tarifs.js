/* =====================================================================
   SAINT-CYPRIEN · data-tarifs.js — les données que SEULE la page tarifs lit.

   Pourquoi à part : data.js est chargé par les 8 pages. Y laisser ce bloc
   revenait à faire descendre PRICING_FAQ à
   quelqu’un qui lit les tarifs. Rien ici n’est surchargeable par le
   vestiaire — la fusion de public/content.json reste entièrement dans
   data.js, à un seul endroit.
   ===================================================================== */

/* FAQ argent — servie sur /tarifs/. Désamorce les malentendus prix. */
export const PRICING_FAQ = [
  { q: "L’offre Rentrée, c’est 29€ pour deux ?", a: "Non : 29€ par personne, au lieu de 44,99€. Quatre semaines de cours illimités, sans engagement — et encore mieux à deux, 29€ chacun." },
  { q: "Y a-t-il un engagement ?", a: "L’offre Rentrée et la séance d’essai sont sans engagement. La saison se règle en une fois ou en 4× sans frais, sur douze mois." },
  { q: "Le t-shirt, c’est pour qui ?", a: "Pour chaque enfant inscrit à l’école : le t-shirt Boxing Center est inclus dans l’inscription (295€ l’année, baby 250€)." },
  { q: "Je peux m’entraîner dans les autres salles ?", a: "Oui. La saison donne accès libre aux 5 clubs du réseau : Portet, Minimes, États-Unis, Saint-Cyprien et Ramonville." },
];

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
