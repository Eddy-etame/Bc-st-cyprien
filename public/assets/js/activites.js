/* =====================================================================
   SAINT-CYPRIEN · activites.js — le catalogue plein écran.
   Un écran par discipline (ancre #<key>), groupé par public : adultes ·
   Lady Punch · l’école. Par entrée : photo, coach, niveau, jours (résumé 1
   ligne) + 2 liens (créneaux → /plannings/#<key> · essayer → box-plus).
   Tout depuis DISCIPLINES (data.js). Deep-link : /activites/#<key> défile
   jusqu’à la discipline et l’allume.
   ===================================================================== */
import { DISCIPLINES, LINKS, COACH_TBD, COACH_TBD_SHORT, COACH_TBD_WHY_SHORT, SALLE, SCHEDULE, DAYS, picture } from "./data.js?v=21";
import { ECOLE_LEVELS, PARCOURS, PARCOURS_NOTE, SEMAINES } from "./data-activites.js?v=21";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const byKey = Object.fromEntries(DISCIPLINES.map((d) => [d.key, d]));
const dayLong = Object.fromEntries(DAYS.map((d) => [d.k, d.long]));

/* Les trois publics, dans l’ordre de lecture. */
const GROUPS = [
  { cat: "adulte", eyebrow: "Adultes", title: "La boxe, pour de vrai.", lead: "Cinq disciplines, cinq intensités. Prends celle qui te fait peur en premier." },
  { cat: "lady", eyebrow: "100 % féminin", title: "Lady Punch.", lead: "Le mardi et le jeudi, la salle leur appartient." },
  { cat: "ecole", eyebrow: "L’école · dès 3 ans", title: "L’école, âge par âge.", lead: "Une salle, tous les âges : du bac à sable au premier ring." },
];

/* ------------------------------------------------------------------ *
 * L’AIGUILLAGE — la page était un catalogue : sept portes, aucune indication.
 * Ici on répond à la vraie question d’entrée (« je veux QUOI »), et chaque
 * réponse emmène à la discipline plus bas — même geste que le plan de la
 * visite et l’index de la galerie : sur ce site, on pilote toujours pareil.
 * Le compte de créneaux est DÉRIVÉ de SCHEDULE, jamais saisi.
 * ------------------------------------------------------------------ */
function renderParcours() {
  const el = $("#parcours");
  if (!el) return;
  const routes = PARCOURS.filter((p) => byKey[p.key]); // une route sans cible ne s’affiche pas
  if (!routes.length) return;
  el.innerHTML = routes
    .map((p) => {
      const d = byKey[p.key];
      const n = SCHEDULE.filter((s) => s.key === p.key).length;
      return `<button class="route" type="button" data-key="${p.key}">
        <span class="route__want">${p.want}</span>
        <span class="route__arrow" aria-hidden="true">↓</span>
        <span class="route__pick">${d.name}</span>
        <span class="route__why">${p.why}</span>
        <!-- séparateur long : le coach du camp s’écrit déjà "Dadi · Hicham",
             un "·" de plus collait deux listes l’une dans l’autre. -->
        <span class="route__meta">${n} créneau${n > 1 ? "x" : ""} par semaine${d.coachTbd ? "" : ` — ${d.coach}`}</span>
      </button>`;
    })
    .join("");

  const note = $("#parcours-note");
  if (note) note.textContent = PARCOURS_NOTE;

  el.addEventListener("click", (e) => {
    const b = e.target.closest(".route");
    if (!b) return;
    const target = document.getElementById(b.dataset.key);
    if (!target) return;
    window.BC.scrollToEl(target, { offset: -110 });
    target.classList.add("is-target");
    setTimeout(() => target.classList.remove("is-target"), 2400);
  });
}

/* ------------------------------------------------------------------ *
 * LES SEMAINES-TYPES — chaque ligne est résolue contre SCHEDULE au rendu :
 * on n’écrit aucun horaire à la main, donc la page ne peut pas mentir si le
 * poster bouge. Un pointeur orphelin est retiré (et sa carte disparaît si
 * elle se vide) plutôt que rendu approximativement.
 * ------------------------------------------------------------------ */
function resolve(ptr) {
  return SCHEDULE.find((s) => s.day === ptr.day && s.time === ptr.time) || null;
}
function renderSemaines() {
  const el = $("#semaines");
  if (!el) return;
  const cards = SEMAINES.map((w) => ({ ...w, rows: w.slots.map(resolve).filter(Boolean) })).filter((w) => w.rows.length);
  if (!cards.length) return;
  el.innerHTML = cards
    .map(
      (w) => `<article class="week">
      <span class="week__n">${w.n}</span>
      <h3 class="week__t">${w.t}</h3>
      <p class="week__d">${w.d}</p>
      <ol class="week__list">
        ${w.rows
          .map((s) => {
            const tbd = s.coach === COACH_TBD;
            return `<li class="wrow">
              <span class="wrow__day">${dayLong[s.day] || s.day}</span>
              <span class="wrow__time">${s.time}</span>
              <span class="wrow__name">${s.name}</span>
              <span class="wrow__coach">${tbd ? `<i class="tbd">${COACH_TBD_SHORT}</i>` : s.coach}</span>
            </li>`;
          })
          .join("")}
      </ol>
      <a class="week__link" href="/plannings/">Régler ma semaine sur la grille</a>
    </article>`
    )
    .join("");
}

/* Une entrée = un écran : photo lit-under-spot + fiche + 2 liens réels. */
function entry(d) {
  // La pastille mono garde `tag` ; l’alt vient de data.js et décrit la photo.
  const coachLine = d.coachTbd
    ? `<dd class="act__tbd-val"><i class="tbd">${COACH_TBD_SHORT}</i></dd>`
    : `<dd>${d.coach}</dd>`;
  return `<article class="act${d.coachTbd ? " act--tbd" : ""}" id="${d.key}" data-reveal>
    <div class="act__media media" data-label="${d.tag}">
      <span class="act__glow" aria-hidden="true"></span>
      ${picture(d.img, `alt="${esc(d.alt)}" loading="lazy" decoding="async"`)}
    </div>
    <div class="act__body">
      <span class="act__tag">${d.tag}</span>
      <h3 class="act__name">${d.name}</h3>
      <p class="act__desc">${d.desc}</p>
      <dl class="act__facts">
        <div><dt>Coach</dt>${coachLine}</div>
        <div><dt>Niveau</dt><dd>${d.niveau}</dd></div>
        <div><dt>Jours</dt><dd>${d.jours}</dd></div>
      </dl>
      ${d.coachTbd ? tbdNote() : ""}
      <div class="act__cta">
        <a class="btn btn--primary" data-magnetic href="${LINKS.essai}"><span>Essayer · 10€</span></a>
        <a class="btn" data-magnetic href="/plannings/#${d.key}"><span>Voir les créneaux</span></a>
      </div>
    </div>
  </article>`;
}

/* L’ÉTAT VOULU — le créneau tourne, le nom n’est pas acté. On l’affiche
   comme une décision, pas comme un blanc : un cartouche à part, la raison
   écrite, et le téléphone pour ceux qui veulent savoir tout de suite. */
function tbdNote() {
  return `<aside class="tbd-note" aria-label="Encadrement à confirmer">
    <span class="tbd-note__k">${COACH_TBD_SHORT}</span>
    <p class="tbd-note__d">${COACH_TBD_WHY_SHORT}</p>
    <a class="tbd-note__tel" href="tel:${SALLE.phoneHref}">Demander qui encadre · ${SALLE.phone}</a>
  </aside>`;
}

/* Le sous-bloc paliers de l’école (ECOLE_LEVELS, désormais dans data.js). */
function ecoleLevels() {
  return `<div class="levels" data-reveal-group>
    ${ECOLE_LEVELS.map(
      (l) => `<article class="level">
        <span class="level__age">${l.age}</span>
        <h4 class="level__name">${l.name}</h4>
        <p class="level__d">${l.d}</p>
        <span class="level__jours">${l.jours}</span>
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
          ${items.map((d) => entry(d)).join("")}
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

/* Deep-link : #<key> défile jusqu’à la discipline et l’allume brièvement. */
function fromHash() {
  const k = decodeURIComponent(location.hash.slice(1));
  if (!k) return;
  const target = document.getElementById(k);
  if (!target) return;
  requestAnimationFrame(() => {
    // idem : le deep-link /activites/#<key> s’arrêtait en chemin sous Lenis
    window.BC.scrollToEl(target, { offset: -110 });
    target.classList.add("is-target");
    setTimeout(() => target.classList.remove("is-target"), 2400);
  });
}

/* ------------------------------ BOOT ------------------------------ */
function boot() {
  renderJump();
  renderParcours();
  renderCatalogue();
  renderSemaines();

  window.BC.media(document);
  window.BC.reveal(document);
  window.BC.magnetic(document);
  window.BC.spotlight(".phero", ".phero__spot");
  window.BC.touchLife();   // mobile : les écrans-disciplines s’animent au passage

  const start = () => { window.BC.refresh(); fromHash(); };
  window.addEventListener("load", start);
  setTimeout(start, 500);
  window.addEventListener("hashchange", fromHash);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
