/* =====================================================================
   SAINT-CYPRIEN · premiere-seance.js — le levier de conversion.

   PARTICULARITÉ : cette page est écrite EN DUR dans le HTML, contrairement
   aux autres. C’est voulu. Elle répond à la question qui bloque vraiment
   (« il se passe quoi quand je pousse la porte ? ») : elle doit être lisible
   par un robot qui n’exécute pas le JavaScript, et par un moteur de réponse
   qui ne lit que la source. Le texte du déroulé n’est donc pas peint par ce
   module.

   Ce que ce module fait, et seulement ça :
     1. il RESYNCHRONISE les trois chiffres (essai · rentrée · saison) sur
        PROMOS, pour qu’une publication du vestiaire ne laisse jamais un prix
        périmé en dur dans cette page ;
     2. il branche le moteur d’animation commun (reveal, magnétique,
        projecteur du héros, vie tactile).
   ===================================================================== */
import { PROMOS, SALLE } from "./data.js?v=22";

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ------------------- LES PRIX NE PEUVENT PAS MENTIR ---------------- *
 * Le HTML porte les valeurs de repli (crawlables). Si le vestiaire a
 * publié autre chose, PROMOS gagne — on réécrit la carte, jamais l’inverse.
 * Un champ absent ne vide rien : on ne touche qu’à ce qui existe. */
function syncOffre(sel, offre) {
  const item = $(sel);
  if (!item || !offre) return;
  const b = $(".suite__price b", item);
  const u = $(".suite__price small", item);
  const s = $(".suite__price s", item);
  const d = $(".suite__d", item);
  const c = $(".btn span", item);
  if (b && offre.price) b.textContent = offre.price;
  if (u && offre.unit) u.textContent = offre.unit;
  if (s) { if (offre.was) s.textContent = offre.was; else s.remove(); }
  if (d && offre.detail) d.textContent = offre.detail;
  if (c && offre.cta) c.textContent = offre.cta;
}

/* La ligne du bas rappelle le prix de l’essai : même règle. */
function syncEssai() {
  const prix = PROMOS?.essai?.price;
  if (!prix) return;
  $$("[data-essai-prix]").forEach((el) => { el.textContent = prix; });
}

/* ------------------------------ BOOT ------------------------------ */
function boot() {
  syncOffre("#offre-rentree", PROMOS?.duo);
  syncOffre("#offre-saison", PROMOS?.saisonOffer);
  syncEssai();

  /* Le numéro affiché et composé vient de la fiche, jamais du HTML figé. */
  window.BC.syncPhone(document);
  window.BC.reveal(document);
  window.BC.magnetic(document);
  window.BC.spotlight(".phero", ".phero__spot");
  window.BC.touchLife();   // mobile : étapes, peurs et cartes s’animent au passage

  /* Petit filet : si un jour la fiche change de ville, l’adresse écrite en
     tête de page suivrait. On ne réécrit que si la cible existe. */
  const rue = $("[data-adresse]");
  if (rue && SALLE?.address?.street) rue.textContent = SALLE.address.street;

  const start = () => window.BC.refresh();
  window.addEventListener("load", start);
  setTimeout(start, 500);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
