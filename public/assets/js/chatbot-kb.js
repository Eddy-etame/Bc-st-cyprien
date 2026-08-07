/* =====================================================================
   LA BASE LOCALE DE L’ASSISTANT — Saint-Cyprien.
   Sert deux choses : les puces de démarrage (réponse instantanée, zéro
   requête) et le REPLI quand /api/chat ne répond pas (pas de clé IA
   configurée, réseau coupé, dev local). Le bot reste donc utile en toutes
   circonstances : jamais une bulle vide, jamais une page morte.
   Tous les faits ci-dessous sont ceux de data.js — rien d’inventé.
   ===================================================================== */

export const QUICKS = [
  {
    label: "La séance d’essai",
    q: "Comment se passe la séance d’essai ?",
    a: "10€ la séance, toutes disciplines, gants et matériel prêtés, sans engagement. Tu arrives 10 minutes avant en tenue de sport, tu dis que c’est ta première fois — c’est la seule phrase à préparer — puis échauffement, technique et sac, à ton rythme. Pas de sparring imposé, pas de test. [boutons: premiere, essai]",
  },
  {
    label: "Les tarifs",
    q: "Quels sont les tarifs ?",
    a: "L’offre Rentrée : 29€ par personne pour 4 semaines illimitées (au lieu de 44€). La Saison : 259€ les 12 mois en 4× sans frais, accès libre aux 5 clubs. Hors promo, l’abonnement classique est à 44€ adulte / 36€ étudiant par échéance de 4 semaines. L’école : 295€ l’année t-shirt inclus, baby 250€. Et l’essai à 10€ pour tester, en dernier. [boutons: offre, saison, tarifs]",
  },
  {
    label: "Les horaires",
    q: "Quels sont les horaires ?",
    a: "Du lundi au samedi, 10h00 – 21h15. Fermé le dimanche. Les derniers cours démarrent à 20h selon les jours.",
  },
  {
    label: "Où c’est ?",
    q: "Où se trouve la salle ?",
    a: "11 rue Sainte-Lucie, 31300 Toulouse — plein cœur de Saint-Cyprien, rive gauche. Métro ligne A, arrêt Saint-Cyprien République, 4 minutes à pied. Parking Saint-Cyprien juste à côté.",
  },
  {
    label: "Les disciplines",
    q: "Quelles disciplines proposez-vous ?",
    a: "Boxe anglaise, thaï / K1, grappling, Hyrox et cross-training, Lady Punch (100 % féminin), Boxing Camp, et toute l’école enfants dès 3 ans. 1 200 m² sur un seul niveau : tout est sur le même plancher.",
  },
  {
    label: "Pour les enfants",
    q: "Y a-t-il des cours pour les enfants ?",
    a: "Oui, dès 3 ans. Baby Boxe le samedi à 14h15, éducative 7/11 et ados 12/16 le mercredi et le samedi à 15h, et un créneau compétiteurs. Dadi tient toute l’école, du premier déplacement au premier combat.",
  },
  {
    label: "Les coachs",
    q: "Qui sont les coachs ?",
    a: "Dadi tient l’anglaise, la Lady Punch et toute l’école. Tawee et Victor G tiennent le pieds-poings (thaï / K1), Hicham le moteur (Hyrox, cross, camp). Le créneau grappling tourne, mais son encadrant n’est pas encore acté au planning officiel — on n’affiche pas un nom qu’on ne peut pas tenir.",
  },
  {
    label: "Débuter",
    q: "Je n’ai jamais boxé, je peux venir ?",
    a: "Oui, et c’est même le cas le plus courant. Commence par le Boxing Camp — technique, cardio, sacs, à ton rythme. Aucun acquis demandé, personne ne regarde le nouveau, et aucun sparring n’est imposé le premier soir. [boutons: premiere, essai]",
  },
];

const RULES = [
  [/essai|d[ée]couvr|tester|essayer|premi[èe]re s[ée]ance|1re/i, 0],
  [/tarif|prix|co[ûu]te|combien|abonn|duo|saison|mensuel|annuel/i, 1],
  [/horaire|ouvert|ferm|heure|dimanche|midi/i, 2],
  /* « \b » compte en ASCII : après le « ù » de « où » il n’y a PAS de frontière
     de mot, et « Où se trouve la salle ? » retombait sur la phrase générique
     alors que l’adresse est juste là. On borne à la main sur les lettres
     accentuées — même famille que le « où » de la liste STOP des prénoms. */
  [/adresse|o[ùu](?![a-zà-öø-ÿ])|se trouve|situ|acc[èe]s|m[ée]tro|parking|venir|plan|rue|quartier/i, 3],
  [/discipline|thai|tha[ïi]|k1|kick|mma|grappling|cross|hyrox|lady|camp|anglaise|cours/i, 4],
  [/enfant|gosse|fils|fille|baby|[ée]ducative|ado|3 ans|jeune/i, 5],
  [/coach|entra[îi]neur|prof|encadr|[ée]quipe|dadi|tawee|hicham|victor/i, 6],
  [/d[ée]butant|jamais|niveau|commenc|nul|peur|timide/i, 7],
];

/** La phrase de dernier recours — quand la question ne ressemble à rien de connu. */
export const GENERIC =
  "Je peux te renseigner sur les horaires, les tarifs, les disciplines, l’école enfants ou la séance d’essai à 10€. Pose ta question — ou appelle la salle au 05 62 24 46 82.";

/** Repli hors-ligne. Renvoie `null` si RIEN ne correspond : c’est au widget de
    décider quoi dire, parce qu’il sait, lui, si le visiteur vient de donner son
    prénom ou son numéro. Servir la phrase générique à quelqu’un qui vient de
    taper son téléphone donne l’impression qu’on ne l’a pas écouté. */
export function fallbackAnswer(msg) {
  for (const [re, i] of RULES) if (re.test(msg)) return QUICKS[i].a;
  return null;
}
