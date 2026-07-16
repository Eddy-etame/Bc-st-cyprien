/* =====================================================================
   SAINT-CYPRIEN · activites.js — le catalogue plein écran.
   Un écran par discipline (ancre #<key>), groupé par public : adultes ·
   Lady Punch · l'école. Par entrée : photo, coach, niveau, jours (résumé 1
   ligne) + 2 liens (créneaux → /plannings/#<key> · essayer → box-plus).
   Tout depuis DISCIPLINES (data.js). Deep-link : /activites/#<key> défile
   jusqu'à la discipline et l'allume.
   ===================================================================== */
import { DISCIPLINES, LINKS } from "./data.js?v=9";

const $ = (s, r = document) => r.querySelector(s);

/* ------------------------------------------------------------------ *
 * PAGE-LOCAL — les paliers de l'école. data.js ne porte qu'une entrée
 * `kids` (Baby → compétition) ; le détail par tranche d'âge vit ici en
 * attendant d'être remonté dans data.js.
 * TODO(data.js): lever ECOLE_LEVELS dans DISCIPLINES (sous-niveaux de `kids`).
 * ------------------------------------------------------------------ */
const ECOLE_LEVELS = [
  { age: "3 → 6 ans", name: "Baby Boxe", d: "Le samedi : coordination, jeu, premiers déplacements. On apprend à bouger avant d'apprendre à frapper." },
  { age: "7 → 11 ans", name: "Éducative enfants", d: "Mercredi & samedi : la technique par le jeu, le cadre par le respect. La vraie boxe, à leur échelle." },
  { age: "12 → 16 ans", name: "Éducative ados", d: "Mercredi & samedi : gestuelle propre, intensité qui monte, premiers assauts encadrés." },
  { age: "Compétition", name: "Compétiteurs", d: "Le créneau de ceux qui montent sur le ring : préparation, sparring, corner. Encadré par Dadi." },
];

/* Les trois publics, dans l'ordre de lecture. */
const GROUPS = [
  { cat: "adulte", eyebrow: "Adultes", title: "La boxe, pour de vrai.", lead: "Cinq disciplines, cinq intensités. Prends celle qui te fait peur en premier." },
  { cat: "lady", eyebrow: "100 % féminin", title: "Lady Punch.", lead: "Le mardi et le jeudi, la salle leur appartient." },
  { cat: "ecole", eyebrow: "L'école · dès 3 ans", title: "L'école, âge par âge.", lead: "Une salle, tous les âges : du bac à sable au premier ring." },
];

/* Une entrée = un écran : photo lit-under-spot + fiche + 2 liens réels. */
function entry(d, i) {
  return `<article class="act" id="${d.key}" data-reveal>
    <div class="act__media media" data-label="${d.tag}">
      <span class="act__glow" aria-hidden="true"></span>
      <img src="${d.img}" alt="${d.name} à Boxing Center Saint-Cyprien — ${d.tag}" loading="lazy" decoding="async" />
    </div>
    <div class="act__body">
      <span class="act__tag">${d.tag}</span>
      <h3 class="act__name">${d.name}</h3>
      <p class="act__desc">${d.desc}</p>
      <dl class="act__facts">
        <div><dt>Coach</dt><dd>${d.coach}</dd></div>
        <div><dt>Niveau</dt><dd>${d.niveau}</dd></div>
        <div><dt>Jours</dt><dd>${d.jours}</dd></div>
      </dl>
      <div class="act__cta">
        <a class="btn btn--primary" data-magnetic href="${LINKS.essai}"><span>Essayer · 10€</span></a>
        <a class="btn" data-magnetic href="/plannings/#${d.key}"><span>Voir les créneaux</span></a>
      </div>
    </div>
  </article>`;
}

/* Le sous-bloc paliers de l'école (page-local ECOLE_LEVELS). */
function ecoleLevels() {
  return `<div class="levels" data-reveal-group>
    ${ECOLE_LEVELS.map(
      (l) => `<article class="level">
        <span class="level__age">${l.age}</span>
        <h4 class="level__name">${l.name}</h4>
        <p class="level__d">${l.d}</p>
      </article>`
    ).join("")}
  </div>`;
}

function renderCatalogue() {
  const root = $("#catalogue");
  if (!root) return;
  root.innerHTML = GROUPS.map((g) => {
    const items = DISCIPLINES.filter((d) => d.cat === g.cat);
    return `<section class="section act-group" aria-label="${g.eyebrow}">
      <div class="wrap">
        <div class="act-group__head" data-reveal>
          <span class="eyebrow">${g.eyebrow}</span>
          <h2 class="display act-group__title">${g.title}</h2>
          <p class="act-group__lead">${g.lead}</p>
        </div>
        <div class="act-list">
          ${items.map((d, i) => entry(d, i)).join("")}
        </div>
        ${g.cat === "ecole" ? ecoleLevels() : ""}
      </div>
    </section>`;
  }).join("");
}

/* Le sommaire du héros — une puce cliquable par discipline (ancres #key). */
function renderJump() {
  const el = $("#act-jump");
  if (!el) return;
  el.innerHTML = DISCIPLINES.map((d) => `<a class="act-chip" href="#${d.key}">${d.name}</a>`).join("");
}

/* Deep-link : #<key> défile jusqu'à la discipline et l'allume brièvement. */
function fromHash() {
  const k = decodeURIComponent(location.hash.slice(1));
  if (!k) return;
  const target = document.getElementById(k);
  if (!target) return;
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add("is-target");
    setTimeout(() => target.classList.remove("is-target"), 2400);
  });
}

/* ------------------------------ BOOT ------------------------------ */
function boot() {
  renderJump();
  renderCatalogue();

  window.BC.media(document);
  window.BC.reveal(document);
  window.BC.magnetic(document);
  window.BC.spotlight(".phero", ".phero__spot");
  window.BC.touchLife();   // mobile : les écrans-disciplines s'animent au passage

  const start = () => { window.BC.refresh(); fromHash(); };
  window.addEventListener("load", start);
  setTimeout(start, 500);
  window.addEventListener("hashchange", fromHash);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
