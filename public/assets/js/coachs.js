/* =====================================================================
   SAINT-CYPRIEN · coachs.js — un pilier, trois spécialistes, une case
   assumée.
   Dadi d'abord, GRAND, avec sa vraie photo (coach-dadi.webp) et le spotlight
   qui suit le curseur. Les autres (Tawee, Hicham, Victor G) = tuiles
   silhouette-showroom (initiale chrome), JAMAIS de stock — roster.json fait
   foi. Le faisceau passe d'un coach à l'autre (interval, pause au survol).

   Ajouts : LA SEMAINE COACH PAR COACH (les vrais créneaux, dérivés de
   SCHEDULE — zéro saisie parallèle, donc zéro dérive avec /plannings/), LE
   TAPIS SANS NOM (l'état voulu du grappling, écrit et daté par personne) et
   LA MÉTHODE (trois règles vérifiables, pas de biographie inventée).
   ===================================================================== */
import { COACHES, SCHEDULE, DAYS, LINKS, SALLE, COACH_TBD, COACH_TBD_SHORT, COACH_TBD_WHY, picture } from "./data.js?v=19";
import { ENCADREMENT } from "./data-coachs.js?v=19";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const dayOrder = Object.fromEntries(DAYS.map((d, i) => [d.k, i]));
const dayLong = Object.fromEntries(DAYS.map((d) => [d.k, d.long]));

/* La semaine réelle d'un coach, reconstruite depuis SCHEDULE (le poster).
   On ne recopie rien à la main : si le planning bouge, cette page bouge. */
function slotsOf(name) {
  return SCHEDULE.filter((s) => s.coach === name).sort(
    (a, b) => dayOrder[a.day] - dayOrder[b.day] || a.time.localeCompare(b.time)
  );
}

/* LE PILIER — le coach au visage prouvé (Dadi). Photo réelle sous son spot,
   disciplines tirées de son rôle (aucune donnée inventée). */
function renderLead() {
  const el = $("#coachlead");
  if (!el) return;
  const c = COACHES.find((x) => x.img) || COACHES[0];
  const chips = c.role.split("·").map((s) => `<li>${s.trim()}</li>`).join("");
  const n = slotsOf(c.name).length;
  el.innerHTML = `
    <div class="coachlead__spot" aria-hidden="true"></div>
    <div class="coachlead__media">
      ${picture(c.img, `alt="${esc(c.alt || "")}" loading="eager" fetchpriority="high" decoding="async"`)}
    </div>
    <div class="coachlead__body">
      <span class="coachlead__tag">${c.tag}</span>
      <h2 class="display coachlead__name">${c.name}</h2>
      <p class="coachlead__role">${c.role}</p>
      <p class="coachlead__note">${c.note}</p>
      <ul class="coachlead__chips" aria-label="Ce que ${c.name} encadre">${chips}</ul>
      <p class="coachlead__count"><b>${n}</b> créneaux par semaine à son nom sur le planning officiel — du Baby Boxe du samedi après-midi au cours d'anglaise de 20h.</p>
      <div class="coachlead__cta">
        <a class="btn btn--primary" data-magnetic href="${LINKS.essai}"><span>S'entraîner avec ${c.name} · 10€</span></a>
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
      const n = slotsOf(c.name).length;
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
          <span class="rostercard__count">${n} créneau${n > 1 ? "x" : ""} / semaine</span>
        </div>
      </article>`;
    })
    .join("");
}

/* ------------------------------------------------------------------ *
 * LA SEMAINE, COACH PAR COACH — l'onglet ouvre les VRAIS créneaux du
 * coach (jour, heure, discipline, niveau), tirés de SCHEDULE. C'est la
 * réponse à la seule question qu'on se pose vraiment sur cette page :
 * « qui je vais avoir en face, et quand ». Clavier : flèches + Home/End.
 * ------------------------------------------------------------------ */
function renderSemaine() {
  const tabs = $("#semaine-tabs");
  const panel = $("#semaine-panel");
  if (!tabs || !panel) return;

  const named = COACHES.map((c) => ({ ...c, slots: slotsOf(c.name) })).filter((c) => c.slots.length);
  if (!named.length) return;

  tabs.innerHTML = named
    .map(
      (c, i) => `<button class="wtab${i === 0 ? " is-on" : ""}" type="button" role="tab"
        id="wtab-${slug(c.name)}" aria-selected="${i === 0}" aria-controls="semaine-panel"
        tabindex="${i === 0 ? 0 : -1}" data-i="${i}">
        <span class="wtab__name">${c.name}</span>
        <span class="wtab__n">${c.slots.length}</span>
      </button>`
    )
    .join("");

  const sheet = (c) => {
    // regroupé par jour pour se lire comme une semaine, pas comme une liste
    const byDay = DAYS.map((d) => ({ d, rows: c.slots.filter((s) => s.day === d.k) })).filter((g) => g.rows.length);
    return `
      <div class="wsheet__head">
        <h3 class="wsheet__name">${c.name}</h3>
        <p class="wsheet__role">${c.role}</p>
        <span class="wsheet__count">${c.slots.length} créneaux · ${byDay.length} jours</span>
      </div>
      <div class="wsheet__days">
        ${byDay
          .map(
            (g) => `<div class="wday">
              <span class="wday__k">${g.d.long}</span>
              <ul class="wday__list">
                ${g.rows
                  .map(
                    (s) => `<li class="wslot">
                      <span class="wslot__t">${s.time}</span>
                      <span class="wslot__b"><b>${s.name}</b><i>${s.lvl}</i></span>
                    </li>`
                  )
                  .join("")}
              </ul>
            </div>`
          )
          .join("")}
      </div>
      <div class="wsheet__cta">
        <a class="btn btn--primary" data-magnetic href="${LINKS.essai}"><span>Réserver un de ces créneaux · 10€</span></a>
        <a class="btn" data-magnetic href="/plannings/"><span>La grille complète</span></a>
      </div>`;
  };

  let curr = 0;
  panel.innerHTML = sheet(named[0]);
  panel.setAttribute("aria-labelledby", `wtab-${slug(named[0].name)}`);

  const select = (i) => {
    if (i === curr) return;
    curr = i;
    const c = named[i];
    [...tabs.children].forEach((b, k) => {
      b.classList.toggle("is-on", k === i);
      b.setAttribute("aria-selected", String(k === i));
      b.setAttribute("tabindex", k === i ? "0" : "-1");
    });
    panel.setAttribute("aria-labelledby", `wtab-${slug(c.name)}`);
    panel.classList.add("is-swapping");
    setTimeout(() => {
      panel.innerHTML = sheet(c);
      window.BC.magnetic(panel);
      panel.classList.remove("is-swapping");
    }, 150);
  };

  tabs.addEventListener("click", (e) => {
    const b = e.target.closest(".wtab");
    if (b) select(+b.dataset.i);
  });
  tabs.addEventListener("keydown", (e) => {
    const last = named.length - 1;
    let next = null;
    if (e.key === "ArrowRight") next = curr === last ? 0 : curr + 1;
    else if (e.key === "ArrowLeft") next = curr === 0 ? last : curr - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabs.children[next].focus();
  });
}

/* ------------------------------------------------------------------ *
 * LE TAPIS SANS NOM — le grappling tourne mardi et jeudi, le poster ne
 * porte aucun encadrant. On ne bricole pas un nom, on ne cache pas la
 * ligne : on l'écrit, on dit pourquoi, on donne le téléphone. L'état a
 * l'air voulu parce qu'il l'est.
 * ------------------------------------------------------------------ */
function renderTbd() {
  const el = $("#tbd");
  if (!el) return;
  const slots = SCHEDULE.filter((s) => s.coach === COACH_TBD);
  if (!slots.length) { el.closest("section")?.setAttribute("hidden", ""); return; }
  el.innerHTML = `
    <div class="tbdcard__mark" aria-hidden="true"><span>?</span></div>
    <div class="tbdcard__body">
      <span class="tbdcard__tag">${COACH_TBD_SHORT}</span>
      <h3 class="tbdcard__t">Le tapis tourne. Le nom, pas encore.</h3>
      <p class="tbdcard__d">${COACH_TBD_WHY}</p>
      <ul class="tbdcard__slots" aria-label="Les créneaux de grappling">
        ${slots.map((s) => `<li><b>${dayLong[s.day] || s.day}</b><span>${s.time}</span><i>${s.lvl}</i></li>`).join("")}
      </ul>
      <div class="tbdcard__cta">
        <a class="btn" data-magnetic href="tel:${SALLE.phoneHref}"><span>Savoir qui encadre · ${SALLE.phone}</span></a>
        <a class="btn" data-magnetic href="/activites/#grappling"><span>Le grappling en détail</span></a>
      </div>
    </div>`;
}

/* LA MÉTHODE — trois règles vérifiables (ENCADREMENT), aucune biographie. */
function renderMethode() {
  const el = $("#methode");
  if (!el) return;
  el.innerHTML = ENCADREMENT.map(
    (r) => `<article class="mrule">
      <span class="mrule__n">${r.n}</span>
      <h3 class="mrule__t">${r.t}</h3>
      <p class="mrule__d">${r.d}</p>
    </article>`
  ).join("");
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
  renderSemaine();
  renderTbd();
  renderMethode();

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
