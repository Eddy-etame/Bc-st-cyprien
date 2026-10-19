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
  { q: "Quels abonnements sans engagement propose la salle ?", a: "Deux, réglés toutes les 4 semaines : le tarif étudiant à 36,99€ (carte étudiante requise) et le tarif adulte à 44,99€. Avec l’un comme avec l’autre, les cours sont illimités, la salle t’est ouverte de 10h à 21h30 et les 5 clubs aussi ; tu arrêtes quand tu veux." },
  { q: "Comment se paie la première échéance ?", a: "Par carte bancaire, au moment de t’inscrire sur la boutique. Les échéances d’après passent en prélèvement, d’où l’IBAN demandé. Compte aussi le badge d’accès : 34,99€, débités quelques jours plus tard." },
  { q: "Peut-on tout régler d’avance ?", a: "Oui : 150€ couvrent 3 mois, 250€ six mois, 400€ une année entière, payés d’un seul coup sur la boutique." },
  { q: "Le t-shirt, c’est pour qui ?", a: "Pour chaque enfant inscrit à l’école : le t-shirt Boxing Center est inclus dans l’inscription (295€ l’année, baby 250€)." },
  { q: "Je peux m’entraîner dans les autres salles ?", a: "Oui. Au tarif étudiant comme au tarif adulte, l’abonnement sans engagement t’ouvre aussi Portet, les Minimes, États-Unis et Ramonville." },
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
