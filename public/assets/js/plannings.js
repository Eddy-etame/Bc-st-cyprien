/* =====================================================================
   SAINT-CYPRIEN · plannings.js — la semaine, au cordeau.
   Grille HTML utilisable : filtre par jour · discipline · coach, rendue
   depuis SCHEDULE (reconstruit du poster officiel rentrée 2026). Le poster
   couleur, plus bas dans la page, reste la source de vérité.
   Deep-link : /plannings/#<discipline> pré-sélectionne la discipline.
   ===================================================================== */
import { SCHEDULE, DAYS, DISCIPLINES, SEASON_LABEL } from "./data.js?v=9";

const $ = (s, r = document) => r.querySelector(s);
const byKey = Object.fromEntries(DISCIPLINES.map((d) => [d.key, d]));
const state = { day: "", key: "", coach: "" };
/* pas un vrai nom de coach → jamais une puce de filtre (le grappling n'a pas
   encore son encadrant nommé ; roster.json fait foi). */
const NON_COACH = new Set(["Coach à confirmer"]);

/* --------------------------- RENDER ------------------------------- */
function renderFilters() {
  const box = $("#filters");
  if (!box) return;
  const coaches = [...new Set(SCHEDULE.map((s) => s.coach))].filter((c) => !NON_COACH.has(c));
  const chip = (f, v, label, on) =>
    `<button class="chip${on ? " is-on" : ""}" type="button" data-f="${f}" data-v="${v}" aria-pressed="${on}">${label}</button>`;
  box.innerHTML = `
    <div class="fgroup">
      <span class="fgroup__k">Jour</span>
      <div class="chips">
        ${chip("day", "", "Tous", true)}
        ${DAYS.map((d) => chip("day", d.k, d.long, false)).join("")}
      </div>
    </div>
    <div class="fgroup">
      <span class="fgroup__k">Discipline</span>
      <div class="chips">
        ${chip("key", "", "Toutes", true)}
        ${DISCIPLINES.map((d) => chip("key", d.key, d.name, false)).join("")}
      </div>
    </div>
    <div class="fgroup">
      <span class="fgroup__k">Coach</span>
      <div class="chips">
        ${chip("coach", "", "Tous", true)}
        ${coaches.map((c) => chip("coach", c, c, false)).join("")}
      </div>
    </div>`;
}

function renderGrid() {
  const grid = $("#grid");
  if (!grid) return;
  grid.innerHTML = DAYS.map((day) => {
    const rows = SCHEDULE.filter((s) => s.day === day.k);
    return `<section class="pday" data-day="${day.k}">
      <h3 class="pday__h">${day.long}</h3>
      <ul class="pday__list" data-reveal-group>
        ${rows
          .map(
            (s) => `<li class="slot" data-day="${s.day}" data-key="${s.key}" data-coach="${s.coach}">
          <span class="slot__t">${s.time}</span>
          <span class="slot__body"><b class="slot__name">${s.name}</b><span class="slot__meta">${s.coach} · ${s.lvl}</span></span>
        </li>`
          )
          .join("")}
      </ul>
    </section>`;
  }).join("");
}

/* --------------------------- FILTER ------------------------------- */
function apply() {
  document.querySelectorAll(".slot").forEach((sl) => {
    const ok =
      (!state.day || sl.dataset.day === state.day) &&
      (!state.key || sl.dataset.key === state.key) &&
      (!state.coach || sl.dataset.coach === state.coach);
    sl.hidden = !ok;
  });
  let anyVisible = false;
  document.querySelectorAll(".pday").forEach((d) => {
    const vis = [...d.querySelectorAll(".slot")].some((s) => !s.hidden);
    d.hidden = !vis;
    if (vis) anyVisible = true;
  });
  const empty = $("#pl-empty");
  if (empty) empty.hidden = anyVisible;
}

function setActive(f, v) {
  state[f] = v;
  document.querySelectorAll(`.chip[data-f="${f}"]`).forEach((c) => {
    const on = c.dataset.v === v;
    c.classList.toggle("is-on", on);
    c.setAttribute("aria-pressed", String(on));
  });
}

function wire() {
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    setActive(b.dataset.f, b.dataset.v);
    apply();
  });
}

function fromHash() {
  const k = decodeURIComponent(location.hash.slice(1));
  if (k && byKey[k]) { setActive("key", k); apply(); }
}

/* ------------------------------ BOOT ------------------------------ */
function boot() {
  // une seule source de vérité pour le libellé de saison (data.js SEASON_LABEL)
  const seasonEl = document.getElementById("pl-season");
  if (seasonEl) seasonEl.textContent = `${SEASON_LABEL} · Rive gauche`;

  renderFilters();
  renderGrid();
  wire();
  fromHash();

  window.BC.reveal(document);
  window.BC.magnetic(document);
  window.BC.spotlight(".phero", ".phero__spot");
  window.BC.touchLife();   // mobile : les créneaux s'allument au passage

  const start = () => window.BC.refresh();
  window.addEventListener("load", start);
  setTimeout(start, 500);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
