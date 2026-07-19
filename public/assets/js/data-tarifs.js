/* =====================================================================
   SAINT-CYPRIEN · data-tarifs.js — les données que SEULE la page tarifs lit.

   Pourquoi à part : data.js est chargé par les 8 pages. Y laisser ce bloc
   revenait à faire descendre PRICING_FAQ à
   quelqu'un qui lit les tarifs. Rien ici n'est surchargeable par le
   vestiaire — la fusion de public/content.json reste entièrement dans
   data.js, à un seul endroit.
   ===================================================================== */

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
