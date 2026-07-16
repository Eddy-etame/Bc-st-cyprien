/* =====================================================================
   SAINT-CYPRIEN · la-salle.js — la visite privée.
   La visite du showroom au noir : six postes (VISITE), chacun ALLUMÉ quand
   tu l'atteins (IO light-up, indépendant de gsap → survit au ticker gelé).
   Puis LE CODE (4 valeurs durables), LE RÉSEAU (les 4 sœurs + sa place, la
   preuve du titre) et les infos pratiques. Tout depuis data.js.
   ===================================================================== */
import { VISITE, VALUES, NETWORK, SALLE, LINKS } from "./data.js?v=9";

const $ = (s, r = document) => r.querySelector(s);

/* LA VISITE — six postes, en split alterné, photo lit-under-spot. Alt
   descriptif porté par l'<img> ; la pastille mono par data-label. */
function renderVisite() {
  const el = $("#visite");
  if (!el) return;
  el.innerHTML = VISITE.map(
    (v, i) => `<article class="station" data-i="${i}" data-reveal>
      <div class="station__media media" data-label="${v.tag}">
        <span class="station__glow" aria-hidden="true"></span>
        <img src="${v.img}" alt="${v.t} — ${v.tag}, Boxing Center Saint-Cyprien" loading="lazy" decoding="async" />
      </div>
      <div class="station__body">
        <span class="station__n">${v.n}</span>
        <span class="station__tag">${v.tag}</span>
        <h3 class="station__t">${v.t}</h3>
        <p class="station__d">${v.d}</p>
        <ul class="station__specs">${v.specs.map((s) => `<li>${s}</li>`).join("")}</ul>
      </div>
    </article>`
  ).join("");
}

/* LE CODE — quatre valeurs durables (le geste / l'école / le quartier / le choix). */
function renderCode() {
  const el = $("#code");
  if (!el) return;
  el.innerHTML = VALUES.map(
    (v) => `<article class="codecard">
      <span class="codecard__n">${v.n}</span>
      <h3 class="codecard__t">${v.t}</h3>
      <p class="codecard__d">${v.d}</p>
    </article>`
  ).join("");
}

/* LE RÉSEAU — les quatre sœurs dans l'ordre de la lignée, puis Saint-Cyprien
   en bout de chaîne (la preuve : elle vient après et retient ce qui marche). */
function renderLineage() {
  const el = $("#lineage");
  if (!el) return;
  const sisters = NETWORK.map(
    (n, i) => `<li class="sister" data-reveal>
      <span class="sister__i">0${i + 1}</span>
      <div class="sister__body">
        <span class="sister__tag">${n.tag}</span>
        <h3 class="sister__name">${n.name}</h3>
        <p class="sister__feat">${n.feat}</p>
      </div>
      <a class="sister__link" href="${n.url}" target="_blank" rel="noopener" aria-label="${n.name} ↗">↗</a>
    </li>`
  ).join("");
  const self = `<li class="sister sister--self" data-reveal>
      <span class="sister__i">05</span>
      <div class="sister__body">
        <span class="sister__tag">La nouvelle génération</span>
        <h3 class="sister__name">Saint-Cyprien</h3>
        <p class="sister__feat">1 200 m² un niveau · rive gauche · la somme des quatre autres</p>
      </div>
      <span class="sister__here" aria-hidden="true">Tu es ici</span>
    </li>`;
  el.innerHTML = sisters + self;
}

/* INFOS PRATIQUES — depuis SALLE (adresse, accès, horaires, tél, fédérations). */
function renderInfos() {
  const el = $("#infos");
  if (!el) return;
  const rows = [
    { k: "Adresse", v: SALLE.address.full },
    { k: "Métro", v: "Ligne A · Saint-Cyprien République (4 min à pied)" },
    { k: "Horaires", v: SALLE.hours },
    { k: "Stationnement", v: "Parking Saint-Cyprien à proximité" },
    { k: "Téléphone", v: `<a href="tel:${SALLE.phoneHref}">${SALLE.phone}</a>` },
    { k: "Fédérations", v: SALLE.federations.join(" · ") },
  ];
  el.innerHTML = rows.map((r) => `<li><span class="qk">${r.k}</span><span class="qv">${r.v}</span></li>`).join("");
}

/* IO LIGHT-UP — le faisceau s'allume sur le poste qui entre dans le cadre.
   Pur IntersectionObserver : aucune dépendance à gsap, donc insensible au
   ticker gelé. Le texte reste lisible en permanence — seule la lumière bouge. */
function lightUp() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".station").forEach((s) => s.classList.add("is-lit"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-lit"); }),
    { threshold: 0.35, rootMargin: "0px 0px -12% 0px" }
  );
  document.querySelectorAll(".station").forEach((s) => io.observe(s));
}

/* ------------------------------ BOOT ------------------------------ */
function boot() {
  renderVisite();
  renderCode();
  renderLineage();
  renderInfos();

  window.BC.reveal(document);
  window.BC.magnetic(document);
  window.BC.spotlight(".phero", ".phero__spot");
  window.BC.touchLife();   // mobile : postes/valeurs/sœurs s'animent au passage
  lightUp();

  const start = () => window.BC.refresh();
  window.addEventListener("load", start);
  setTimeout(start, 500);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
