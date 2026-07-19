/* =====================================================================
   SAINT-CYPRIEN · "LA NOUVELLE GÉNÉRATION" · home.js
   Signature = LE CONFIGURATEUR : tu choisis ta discipline comme on configure
   un produit — la fiche (photo, coach, jours, niveau) swap avec un ressort.
   La home positionne + route : configurateur → /plannings/ · /activites/ ·
   box-plus. Tout est rendu depuis data.js (planning réel rentrée 2026).
   ===================================================================== */
import { STATS, DISCIPLINES, COACHES, LINKS, COACH_TBD_SHORT, COACH_TBD_WHY } from "./data.js?v=11";

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const nf = new Intl.NumberFormat("fr-FR");
/* les alt sont de vraies phrases (apostrophes, guillemets possibles) : on
   les échappe avant de les poser dans un attribut HTML. */
const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* --------------------------- RENDER ------------------------------- */
function renderStats() {
  $("#stats").innerHTML = STATS.map(
    (s) => `<div class="stat">
      <div class="stat__v"><span data-count="${s.v}" ${s.raw ? "data-raw" : ""}>${s.raw ? s.v : 0}</span>${s.suffix ? `<span class="stat__u">${s.suffix.trim()}</span>` : ""}</div>
      <div class="stat__l">${s.l}</div>
    </div>`
  ).join("");
}
function renderTicker() {
  // items inusables (aucune date, aucun "neuf")
  const items = ["La nouvelle génération", "Rive gauche", "1 200 m²", "Anglaise", "Thaï · K1", "Grappling", "Hyrox", "Lady Punch", "Dès 3 ans", "Métro A · 4 min"];
  const row = items.map((i) => `<span>${i}</span>`).join("");
  const t = $("#marquee"); t.innerHTML = row + row; t.dataset.speed = "0.6";
}

/* LE CONFIGURATEUR — big list + lit sheet + FULL-BLEED backdrop that follows.
   Fiche allégée : essai → box-plus · créneaux → /plannings/ · détail → /activites/ */
function renderConfig() {
  const list = $("#config-list"), mediaBox = $("#config-media"), body = $("#config-body");
  const bg = $("#config-bg");
  if (!list) return;
  // Le backdrop plein cadre est DÉCORATIF (le panneau porte déjà la photo
  // décrite) → alt="" explicite, jamais le libellé de la pastille.
  if (bg) bg.innerHTML = DISCIPLINES.map((d, i) => `<div class="media ${i === 0 ? "is-active" : ""}" data-img="${d.img}" data-alt="" data-label=""></div>`).join("");
  list.innerHTML = DISCIPLINES.map((d, i) => `
    <button class="cfg ${i === 0 ? "is-active" : ""}" type="button" role="tab" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" aria-controls="config-panel" id="cfg-${d.key}" data-i="${i}">
      <span class="cfg__n">${String(i + 1).padStart(2, "0")}</span>
      <span class="cfg__name">${d.name}</span>
      <span class="cfg__tag">${d.tag}</span>
    </button>`).join("");
  // data-label = la pastille mono (le NOM). data-alt = le vrai texte
  // alternatif, écrit d'après le cliché. Les deux ne se confondent plus.
  mediaBox.innerHTML = DISCIPLINES.map((d, i) => `<div class="media ${i === 0 ? "is-active" : ""}" data-img="${d.img}" data-alt="${esc(d.alt)}" data-label="${d.name}"></div>`).join("");
  const sheet = (d) => `
    <div class="config__facts">
      <span${d.coachTbd ? ' class="is-tbd"' : ""}><b>Coach</b> ${d.coachTbd ? `<i class="tbd">${COACH_TBD_SHORT}</i>` : d.coach}</span>
      <span><b>Jours</b> ${d.jours}</span>
      <span><b>Niveau</b> ${d.niveau}</span>
    </div>
    <p class="config__desc">${d.desc}</p>
    ${d.coachTbd ? `<p class="config__tbd">${COACH_TBD_WHY}</p>` : ""}
    <div class="config__cta">
      <a class="btn btn--primary" data-magnetic href="${LINKS.essai}"><span>Essayer · 10€</span></a>
      <a class="btn" data-magnetic href="/plannings/#${d.key}"><span>Voir les créneaux</span></a>
      <a class="btn config__link" data-magnetic href="/activites/#${d.key}"><span>En détail</span></a>
    </div>`;
  body.innerHTML = sheet(DISCIPLINES[0]);
  DISCIPLINES.forEach((d) => { const im = new Image(); im.src = d.img; }); // warm cache

  let curr = 0;
  const select = (i) => {
    if (i === curr) return;
    curr = i;
    const d = DISCIPLINES[i];
    [...list.children].forEach((b, k) => { b.classList.toggle("is-active", k === i); b.setAttribute("aria-selected", String(k === i)); b.setAttribute("tabindex", k === i ? "0" : "-1"); });
    const panel = document.getElementById("config-panel");
    if (panel) panel.setAttribute("aria-labelledby", `cfg-${d.key}`);
    [...mediaBox.children].forEach((m, k) => m.classList.toggle("is-active", k === i));
    if (bg) [...bg.children].forEach((m, k) => m.classList.toggle("is-active", k === i));
    body.classList.add("is-swapping");
    setTimeout(() => {
      body.innerHTML = sheet(d);
      window.BC.magnetic(body);
      body.classList.remove("is-swapping");
    }, reduce ? 0 : 180);
  };
  list.addEventListener("click", (e) => {
    const b = e.target.closest(".cfg");
    if (b) select(+b.dataset.i);
  });
  list.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next = (curr + (e.key === "ArrowDown" ? 1 : DISCIPLINES.length - 1)) % DISCIPLINES.length;
    select(next);
    list.children[next].focus();
  });
}

/* TEASER COACHS — 4 visages → /coachs/. Dadi = photo réelle, les autres =
   tuile initiale stylée showroom (jamais de stock, roster.json fait foi). */
function renderCoaches() {
  const row = $("#coachrow");
  if (!row) return;
  row.innerHTML = COACHES.map((c) => {
    const initial = c.name.trim().charAt(0).toUpperCase();
    // photo seulement si roster.json prouve nom↔visage ; l'alt décrit le
    // cliché (data.js), il ne recopie plus le nom ni le rôle.
    const face = c.img
      ? `<div class="media coachcard__media" data-img="${c.img}" data-label="" data-alt="${esc(c.alt || "")}"></div>`
      : `<div class="coachcard__media coachcard__media--tile" aria-hidden="true"><span>${initial}</span></div>`;
    return `<article class="coachcard">
      ${face}
      <div class="coachcard__body">
        <span class="coachcard__tag">${c.tag}</span>
        <h3 class="coachcard__name">${c.name}</h3>
        <p class="coachcard__role">${c.role}</p>
      </div>
    </article>`;
  }).join("");
}

/* ------------------------- CHOREOGRAPHY --------------------------- */
function countUp() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    if (el.hasAttribute("data-raw")) return;
    const end = +el.dataset.count;
    // Dead-man #1 : no plugin / reduced-motion → paint the REAL number immediately
    // (never leave the "preuves du titre" stuck on 0). Also guards the create() call below.
    if (reduce || !window.ScrollTrigger || !window.gsap) { el.textContent = nf.format(end); return; }
    ScrollTrigger.create({
      trigger: el, start: "top 92%", once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 1.5, ease: "power2.out", onUpdate: () => (el.textContent = nf.format(Math.round(o.v))) });
      },
    });
  });
}

/* ------------------------------ BOOT ------------------------------ */
function boot() {
  renderStats(); renderTicker(); renderConfig(); renderCoaches();

  window.BC.media(document);
  window.BC.reveal(document);
  window.BC.magnetic(document);
  window.BC.spotlight(".hero", ".hero__spot");   // la lumière suit le curseur
  window.BC.spotlight(".essai", ".essai__spot"); // et éclaire la carte essai
  countUp();
  window.BC.touchLife();   // de la vie sur mobile (hover:none) — cartes + configurateur

  const start = () => { window.BC.refresh(); window.BC.initKinetics(); };
  window.addEventListener("load", start);
  setTimeout(start, 500);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
