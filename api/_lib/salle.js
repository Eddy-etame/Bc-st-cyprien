/* =====================================================================
   LES FAITS DE LA SALLE — la source unique côté serveur.
   Miroir de public/assets/js/data.js (adresse, accès, horaires, coachs,
   disciplines, planning, offres). Les champs éditables au vestiaire sont
   relus depuis public/content.json (écrit par le backoffice, bundlé au
   déploiement) : le bot reste synchronisé avec le site sans jamais
   dépendre du réseau. Lecture impossible ⇒ repli sur les faits figés.
   RÈGLE : aucun fait inventé, jamais. Ce fichier ne contient que ce que
   le poster officiel et la fiche du club affirment.
   ===================================================================== */
import { readFileSync } from "fs";
import { join } from "path";

export const FACTS = {
  nom: "Boxing Center Saint-Cyprien",
  adresse: "11 rue Sainte-Lucie, 31300 Toulouse",
  quartier: "Saint-Cyprien, Toulouse rive gauche",
  acces: "Métro ligne A — Saint-Cyprien République, à 4 minutes à pied. Parking Saint-Cyprien à proximité.",
  surface: "1 200 m² sur un seul niveau",
  telephone: "05 62 24 46 82",
  email: "boxingcenter31@gmail.com",
  horaires: "Du lundi au samedi, 10h00 – 21h15. Fermé le dimanche.",
  disciplines:
    "Boxe anglaise, boxe thaï / K1, grappling, Hyrox & cross-training, Lady Punch (100 % féminin), Boxing Camp, et l’école enfants dès 3 ans (Baby Boxe 3/6, éducative 7/11, ados 12/16, compétiteurs).",
  coachs:
    "Dadi (anglaise, Lady Punch et toute l’école — le pilier de la semaine), Tawee (thaï / K1), Victor G (thaï / K1 le soir), Hicham (Hyrox, cross, camp). Le créneau grappling du mardi et du jeudi tourne, mais l’encadrant n’est pas encore acté au planning officiel : on ne donne pas de nom tant qu’il ne l’est pas.",
  offres:
    "Dans l’ordre où on les propose : offre RENTRÉE 29€ PAR PERSONNE pour 4 semaines de cours illimités, sans engagement (au lieu de 44€). Offre Saison 259€ les 12 mois, payable en 4× sans frais, accès libre aux 5 clubs du réseau. Hors promotion, abonnement classique 44€ adulte et 36€ étudiant par échéance de 4 semaines, accès aux 5 salles (c’est un tarif, jamais barré — c’est lui qui est barré sur l’offre de rentrée). École 295€ / an t-shirt du club inclus, Baby Boxe 250€. Séance d’essai 10€ EN DERNIER (toutes disciplines, matériel prêté, sans engagement).",
  planning:
    "29 cours sur 6 jours. Lun 12h40 Boxing Camp (encadrant non acté) / 18h20 Boxing Camp / 19h cross / 20h anglaise ; Mar 12h40 thaï / 18h20 Lady Punch / 19h grappling / 20h thaï ; Mer 12h40 anglaise / 15h éducative 7-11, 16h 12-16, 17h compétiteurs / 18h20 Hyrox / 19h cross / 20h anglaise ; Jeu 12h40 thaï / 18h20 Lady Punch / 19h grappling / 20h thaï ; Ven 12h40 anglaise / 18h20 Boxing Camp / 19h thaï / 20h anglaise ; Sam 11h Boxing Camp / 14h15 Baby Boxe / 15h éducative 7-11, 16h 12-16, 17h compétiteurs / 18h pieds-poings (encadrant non acté).",
  avis: "Note Google 4,0/5 sur 97 avis (relevé du 2026-08-06). C’est la vraie note : ne jamais l’embellir.",
  premiere:
    "La page « Ta première séance » (/premiere-seance/) décrit le déroulé réel : arriver 10 minutes avant, dire que c’est sa première fois, gants et protections PRÊTÉS, échauffement d’un quart d’heure, un point technique, le sac — à son rythme. Aucun sparring imposé (personne ne monte sur le ring sans en avoir envie), aucun test d’entrée, aucun engagement, aucun certificat médical pour l’essai. Tenue : t-shirt, short ou legging, baskets propres, bouteille d’eau.",
  reseau:
    "Réseau Boxing Center — 5 clubs : Saint-Cyprien, Minimes (le berceau), Portet-sur-Garonne (le vaisseau amiral), États-Unis (le colosse), Ramonville (le ciel ouvert). L’abonnement saison donne accès libre aux 5. Site du groupe : boxingcenter.fr.",
};

/** Relit les champs éditables au vestiaire, s’ils existent. */
export function liveFacts() {
  const f = { ...FACTS };
  try {
    const c = JSON.parse(readFileSync(join(process.cwd(), "public/content.json"), "utf8"));
    const s = c.salle || {};
    if (s.address?.full) f.adresse = s.address.full;
    if (s.phone) f.telephone = s.phone;
    if (s.email) f.email = s.email;
    if (s.hours) f.horaires = s.hours;
    if (Array.isArray(c.tarifs) && c.tarifs.length)
      f.offres = c.tarifs.map((t) => `${t.name} ${t.price} ${t.period || ""}`.trim()).join(" ; ") + ".";
    if (Array.isArray(c.coaches) && c.coaches.length)
      f.coachs = c.coaches.map((m) => `${m.name}${m.role ? ` (${m.role})` : ""}`).join(", ") + ".";
    if (Array.isArray(c.schedule) && c.schedule.length)
      f.planning = c.schedule.map((s2) => `${s2.day} ${s2.time} ${s2.name}`).join(" ; ") + ".";
  } catch {
    /* pas de contenu édité (ou illisible) : les faits figés font foi */
  }
  return f;
}

/** Le bloc d’ancrage injecté dans le prompt système. */
export function factsBlock() {
  const f = liveFacts();
  return [
    `- ${f.nom} : ${f.surface}, ${f.quartier}. Le premier Boxing Center rive gauche.`,
    `- Adresse : ${f.adresse}. Téléphone : ${f.telephone}. Email : ${f.email}.`,
    `- Accès : ${f.acces}`,
    `- Horaires : ${f.horaires}`,
    `- Disciplines : ${f.disciplines}`,
    `- Encadrement : ${f.coachs}`,
    `- Offres : ${f.offres}`,
    `- Planning de la semaine : ${f.planning}`,
    `- Première séance : ${f.premiere}`,
    `- ${f.avis}`,
    `- ${f.reseau}`,
  ].join("\n");
}
