/* =====================================================================
   SAINT-CYPRIEN · galerie.js — regardée, pas lue.
   Grille par zone (le plateau · l'anglaise · le pieds-poings · le sol · le
   moteur · Lady Punch · l'école). Captions mono "spec", lazy, et l'entrée
   "développe" chaque photo (du sombre au net) via IntersectionObserver —
   donc insensible au ticker gelé.
   ===================================================================== */

const $ = (s, r = document) => r.querySelector(s);
const IMG = "/assets/img/sc/";

/* ------------------------------------------------------------------ *
 * PAGE-LOCAL — la galerie par zone. data.js ne porte pas de manifeste
 * photo ; il vit ici, câblé aux vrais clichés BC déjà présents dans
 * /assets/img/sc/. Alt descriptif ≠ caption mono "spec".
 * TODO(data.js): lever GALLERY dans data.js (zones + fichiers + captions).
 * ------------------------------------------------------------------ */
const GALLERY = [
  {
    zone: "Le plateau", spec: "1 200 m² · un seul niveau",
    shots: [
      // Une seule vue du plateau, et elle est VRAIE. L'ancienne "Vue d'ensemble"
      // (salle-2.webp) était une photo de banque — deux modèles en studio, zéro
      // signalétique BC : intenable sous un H1 qui dit « Pas de retouche. La
      // salle, telle quelle. » Mieux vaut un cliché honnête que deux dont un ment.
      { f: "salle-1.webp",  feat: "wide", cap: "Depuis l'entrée", alt: "Le plateau vu depuis la porte : sacs, ring et cage au fond — Boxing Center Saint-Cyprien" },
    ],
  },
  {
    zone: "L'anglaise", spec: "Le noble art · le ring",
    shots: [
      { f: "anglaise-header.webp", feat: "wide", cap: "Le ring", alt: "Le ring de boxe anglaise, cordes tendues — Boxing Center Saint-Cyprien" },
      { f: "anglaise.webp", cap: "Au travail", alt: "Séance de boxe anglaise sur le ring — Boxing Center Saint-Cyprien" },
    ],
  },
  {
    zone: "Le pieds-poings", spec: "Thaï · K1",
    shots: [
      { f: "thai-2.webp", feat: "wide", cap: "La surface thaï", alt: "La surface pieds-poings thaï et K1 — Boxing Center Saint-Cyprien" },
      { f: "thai.webp",   cap: "Tibias, genoux", alt: "Travail de boxe thaï aux sacs — Boxing Center Saint-Cyprien" },
      { f: "thai-1.webp", cap: "K1", alt: "Séance de K1 pieds-poings — Boxing Center Saint-Cyprien" },
    ],
  },
  {
    zone: "Le sol", spec: "Grappling",
    shots: [
      { f: "grappling.webp", feat: "wide", cap: "Contrôle & soumissions", alt: "Travail de grappling au sol — Boxing Center Saint-Cyprien" },
    ],
  },
  {
    zone: "Le moteur", spec: "Hyrox · cross · muscu",
    shots: [
      { f: "muscu.webp",    feat: "wide", cap: "Charges & sacs", alt: "La zone muscu, machines et charges — Boxing Center Saint-Cyprien" },
      { f: "cross.webp",    cap: "Cross-training", alt: "Circuit de cross-training — Boxing Center Saint-Cyprien" },
      { f: "hyrox.webp",    cap: "Hyrox", alt: "Circuit Hyrox, cardio et force — Boxing Center Saint-Cyprien" },
      { f: "training.webp", cap: "Boxing camp", alt: "Séance de boxing camp, technique et cardio — Boxing Center Saint-Cyprien" },
    ],
  },
  {
    zone: "Lady Punch", spec: "100 % féminin",
    shots: [
      { f: "lady-2.webp", feat: "wide", cap: "100 % féminin", alt: "Cours de Lady Punch, boxe 100 % féminin — Boxing Center Saint-Cyprien" },
      { f: "lady.webp",   cap: "Cardio & confiance", alt: "Lady Punch, cardio et confiance — Boxing Center Saint-Cyprien" },
    ],
  },
  {
    zone: "L'école", spec: "Dès 3 ans → compétiteurs",
    shots: [
      { f: "educative.webp",     feat: "wide", cap: "Boxe éducative", alt: "Cours de boxe éducative pour enfants — Boxing Center Saint-Cyprien" },
      { f: "educative-1.webp",   cap: "7 → 16 ans", alt: "Jeunes en boxe éducative — Boxing Center Saint-Cyprien" },
      { f: "tous-niveaux.webp",  cap: "Tous niveaux", alt: "Groupe tous niveaux à l'entraînement — Boxing Center Saint-Cyprien" },
    ],
  },
];

/* Une zone = un intertitre + une grille de figures (photo lit + caption spec). */
function figure(s) {
  return `<figure class="gitem${s.feat === "wide" ? " gitem--wide" : ""}">
    <img src="${IMG}${s.f}" alt="${s.alt}" loading="lazy" decoding="async" />
    <span class="gitem__glow" aria-hidden="true"></span>
    <figcaption class="gitem__cap">${s.cap}</figcaption>
  </figure>`;
}

function renderGallery() {
  const root = $("#galerie");
  if (!root) return;
  root.innerHTML = GALLERY.map(
    (z) => `<section class="section gzone" aria-label="${z.zone}">
      <div class="wrap">
        <header class="gzone__head" data-reveal>
          <h2 class="gzone__zone">${z.zone}</h2>
          <span class="gzone__spec">${z.spec}</span>
        </header>
        <div class="ggrid">${z.shots.map(figure).join("")}</div>
      </div>
    </section>`
  ).join("");
}

/* "Développer" — chaque photo passe du sombre au net quand elle entre dans
   le cadre. Pur IO ; en reduced-motion ou sans IO, tout est net d'emblée. */
function develop() {
  const items = [...document.querySelectorAll(".gitem")];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealAll = () => items.forEach((it) => it.classList.add("is-in"));
  if (reduce || !("IntersectionObserver" in window)) { revealAll(); return; }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((it) => io.observe(it));

  // Dead-man net (loi n°1) : si le ticker gsap est gelé (rAF mort → scroll
  // Lenis bloqué, l'IO ne verra jamais les photos entrer), on développe tout
  // pour ne JAMAIS laisser une photo illisible. Sur un vrai navigateur le
  // ticker avance → ce filet ne se déclenche pas, l'IO fait le développé.
  const g = window.gsap;
  if (g) { const f0 = g.ticker.frame; setTimeout(() => { if (g.ticker.frame === f0) revealAll(); }, 3500); }
  else { setTimeout(revealAll, 3500); }
}

/* ------------------------------ BOOT ------------------------------ */
function boot() {
  renderGallery();
  develop(); // rend les photos visibles en premier — indépendant de BC/gsap

  window.BC.reveal(document);
  window.BC.magnetic(document);
  window.BC.spotlight(".phero", ".phero__spot");
  window.BC.touchLife();

  const start = () => window.BC.refresh();
  window.addEventListener("load", start);
  setTimeout(start, 500);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
