/* =====================================================================
   SAINT-CYPRIEN · coachs.js — un pilier, trois spécialistes.
   Dadi d'abord, GRAND, avec sa vraie photo (coach-dadi.webp) et le spotlight
   qui suit le curseur. Les autres (Tawee, Hicham, Victor G) = tuiles
   silhouette-showroom (initiale chrome), JAMAIS de stock — roster.json fait
   foi. Le faisceau passe d'un coach à l'autre (interval, pause au survol).
   ===================================================================== */
import { COACHES, LINKS } from "./data.js?v=9";

const $ = (s, r = document) => r.querySelector(s);

/* LE PILIER — le coach au visage prouvé (Dadi). Photo réelle sous son spot,
   disciplines tirées de son rôle (aucune donnée inventée). */
function renderLead() {
  const el = $("#coachlead");
  if (!el) return;
  const c = COACHES.find((x) => x.img) || COACHES[0];
  const chips = c.role.split("·").map((s) => `<li>${s.trim()}</li>`).join("");
  el.innerHTML = `
    <div class="coachlead__spot" aria-hidden="true"></div>
    <div class="coachlead__media">
      <img src="${c.img}" alt="Coach ${c.name} — Boxing Center Saint-Cyprien, rive gauche" loading="eager" fetchpriority="high" decoding="async" />
    </div>
    <div class="coachlead__body">
      <span class="coachlead__tag">${c.tag}</span>
      <h2 class="display coachlead__name">${c.name}</h2>
      <p class="coachlead__role">${c.role}</p>
      <p class="coachlead__note">${c.note}</p>
      <ul class="coachlead__chips" aria-label="Ce que Dadi encadre">${chips}</ul>
      <div class="coachlead__cta">
        <a class="btn btn--primary" data-magnetic href="${LINKS.essai}"><span>S'entraîner avec Dadi · 10€</span></a>
        <a class="btn" data-magnetic href="/plannings/#anglaise"><span>Ses créneaux</span></a>
      </div>
    </div>`;
}

/* LES SPÉCIALISTES — les coachs sans photo prouvée : tuile silhouette
   (initiale chrome sous un spot), jamais de stock. */
function renderRoster() {
  const el = $("#roster");
  if (!el) return;
  const rest = COACHES.filter((x) => !x.img);
  el.innerHTML = rest
    .map((c, i) => {
      const initial = c.name.trim().charAt(0).toUpperCase();
      return `<article class="rostercard ${i === 0 ? "is-active" : ""}" data-i="${i}" data-reveal>
        <div class="rostercard__media" aria-hidden="true">
          <span class="rostercard__beam"></span>
          <span class="rostercard__initial">${initial}</span>
        </div>
        <div class="rostercard__body">
          <span class="rostercard__tag">${c.tag}</span>
          <h3 class="rostercard__name">${c.name}</h3>
          <p class="rostercard__role">${c.role}</p>
          <p class="rostercard__note">${c.note}</p>
        </div>
      </article>`;
    })
    .join("");
}

/* LE FAISCEAU — il passe d'un coach à l'autre. Interval sobre ; il se cale
   sur la tuile survolée et repart quand le curseur s'en va. CSS-only visual,
   donc insensible au ticker gelé (la lisibilité ne dépend jamais de ça). */
function beam() {
  const cards = [...document.querySelectorAll(".rostercard")];
  if (cards.length < 2) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let curr = 0, timer = null, hovering = false;
  const light = (i) => {
    curr = (i + cards.length) % cards.length;
    cards.forEach((c, k) => c.classList.toggle("is-active", k === curr));
  };
  const tick = () => { if (!hovering) light(curr + 1); };
  const play = () => { if (reduce) return; stop(); timer = setInterval(tick, 2600); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  cards.forEach((c, i) => {
    c.addEventListener("pointerenter", () => { hovering = true; light(i); });
    c.addEventListener("pointerleave", () => { hovering = false; });
  });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
  play();
}

/* ------------------------------ BOOT ------------------------------ */
function boot() {
  renderLead();
  renderRoster();

  window.BC.reveal(document);
  window.BC.magnetic(document);
  window.BC.spotlight(".phero", ".phero__spot");
  window.BC.spotlight(".coachlead", ".coachlead__spot"); // la lumière suit le curseur sur Dadi
  window.BC.touchLife();   // mobile : les tuiles roster s'animent au passage
  beam();

  const start = () => window.BC.refresh();
  window.addEventListener("load", start);
  setTimeout(start, 500);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
