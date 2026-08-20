/* =====================================================================
   SAINT-CYPRIEN · scripts/cuire-pages.mjs — le texte entre dans le HTML

   LE PROBLÈME, MESURÉ EN LIGNE (20/08/2026). Les pages servaient beaucoup
   de HTML et presque aucun contenu :

       page          html servi   texte une fois les <script> retirés
       /coachs         24 632 o     1 606 o
       /plannings      31 567 o     1 883 o
       /tarifs         25 196 o     2 076 o
       /activites      24 100 o     1 462 o

   Autrement dit : entre 85 et 95 % de ce que lit un visiteur n'existait
   que dans le JavaScript. Google finit par exécuter le JS, avec retard et
   dans la limite d'un budget ; les robots des assistants — GPTBot,
   ClaudeBot, PerplexityBot — ne l'exécutent pas du tout. Les coachs, les
   créneaux, les tarifs et les disciplines étaient donc invisibles pour
   exactement les moteurs que l'on cherche à séduire.

   CE QUE FAIT CE SCRIPT. Après le build, il écrit dans les creux le même
   contenu que le JS peindra ensuite, tiré des MÊMES fichiers de données.
   Le balisage est volontairement sobre (h2/h3/p/dl) plutôt qu'une copie
   du rendu riche : c'est le TEXTE qui doit être lisible, et une copie
   fidèle du markup dériverait au premier changement de style. Chaque
   module fait `el.innerHTML = …` au chargement : le visiteur voit le
   rendu complet, à l'identique, et rien n'apparaît deux fois.

   Effet de bord assumé : sans JavaScript, les pages restent lisibles.

   GARDE-FOU. Si un creux n'est plus vide ou a changé de nom, le script
   s'arrête en erreur au lieu de cuire à côté — on veut le savoir tout de
   suite, pas découvrir six mois plus tard que la page était vide.

   Usage : appelé par `npm run postbuild`, après cuire-galerie.mjs.
   ===================================================================== */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const url = (f) => pathToFileURL(join(ROOT, "public", "assets", "js", f)).href;
const { COACHES, SCHEDULE, DAYS, DISCIPLINES, FAQ } = await import(url("data.js"));
const { ENCADREMENT } = await import(url("data-coachs.js"));
const { ECOLE_LEVELS, PARCOURS } = await import(url("data-activites.js"));
const { PRICING_FAQ } = await import(url("data-tarifs.js"));

const e = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ------------------------------------------------------------------ */
/* /coachs — qui encadre, et à quelle heure on le trouve               */
/* ------------------------------------------------------------------ */
const coachlead = ENCADREMENT.map(
  (c) => `<section><h3>${e(c.t)}</h3><p>${e(c.d)}</p></section>`
).join("");

const roster = COACHES.map((c) => {
  const slots = SCHEDULE.filter((s) => s.coach === c.name);
  const liste = slots.length
    ? `<ul>${slots
        .map((s) => `<li>${e(s.day)} ${e(s.time)} — ${e(s.name)}${s.lvl ? ` (${e(s.lvl)})` : ""}</li>`)
        .join("")}</ul>`
    : "";
  return `<article><h3>${e(c.name)}</h3><p><b>${e(c.role)}</b>${c.tag ? ` · ${e(c.tag)}` : ""}</p>${
    c.note ? `<p>${e(c.note)}</p>` : ""
  }${liste}</article>`;
}).join("");

/* ------------------------------------------------------------------ */
/* /activites — les disciplines, l'école, et par quoi commencer        */
/* ------------------------------------------------------------------ */
const catalogue =
  DISCIPLINES.map(
    (d) => `<article><h3>${e(d.name)}</h3><p><b>${e(d.tag)}</b>${
      d.coach ? ` · encadré par ${e(d.coach)}` : ""
    }</p><p>${e(d.desc)}</p><p>${e(d.jours)}${d.niveau ? ` · ${e(d.niveau)}` : ""}</p></article>`
  ).join("") +
  `<section><h3>L'école, par âge</h3>${ECOLE_LEVELS.map(
    (l) => `<article><h4>${e(l.name)} — ${e(l.age)}</h4><p>${e(l.jours)}</p><p>${e(l.d)}</p></article>`
  ).join("")}</section>` +
  `<section><h3>Par où commencer</h3>${PARCOURS.map(
    (p) => `<article><h4>${e(p.want)}</h4><p>${e(p.why)}</p></article>`
  ).join("")}</section>`;

/* ------------------------------------------------------------------ */
/* /plannings — la semaine, jour par jour                              */
/* ------------------------------------------------------------------ */
const grid = DAYS.map((d) => {
  const cours = SCHEDULE.filter((s) => s.day === d.k);
  if (!cours.length) return "";
  return `<section><h3>${e(d.long)}</h3><ul>${cours
    .map(
      (s) =>
        `<li>${e(s.time)} — ${e(s.name)}${s.lvl ? ` · ${e(s.lvl)}` : ""}${
          s.coach ? ` · ${e(s.coach)}` : ""
        }</li>`
    )
    .join("")}</ul></section>`;
}).join("");

/* ------------------------------------------------------------------ */
/* /tarifs — les questions d'argent, répondues                         */
/* ------------------------------------------------------------------ */
const faq = [...PRICING_FAQ, ...FAQ]
  .map((f) => `<section><h3>${e(f.q)}</h3><p>${e(f.a)}</p></section>`)
  .join("");

/* ------------------------------------------------------------------ */
const FOURNEES = [
  ["coachs", "coachlead", coachlead, ENCADREMENT.length + " reperes"],
  ["coachs", "roster", roster, COACHES.length + " coachs"],
  ["activites", "catalogue", catalogue, DISCIPLINES.length + " disciplines"],
  ["plannings", "grid", grid, SCHEDULE.length + " creneaux"],
  ["tarifs", "faq", faq, PRICING_FAQ.length + FAQ.length + " questions"],
];

const pages = new Map();
for (const [page, id, contenu, quoi] of FOURNEES) {
  const f = join(ROOT, "dist", page, "index.html");
  if (!pages.has(f)) pages.set(f, await readFile(f, "utf8"));
  const creux = new RegExp(`(<(?:div|section|ul|ol)[^>]*\\s+id="${id}"[^>]*>)\\s*(</(?:div|section|ul|ol)>)`);
  const html = pages.get(f);
  if (!creux.test(html)) {
    console.error(`[pages] #${id} de /${page}/ n'est plus vide ou a change de forme — rien de cuit`);
    process.exit(1);
  }
  pages.set(f, html.replace(creux, `$1${contenu}$2`));
  console.log(`[pages] /${page}/ #${id} : ${quoi}`);
}
for (const [f, html] of pages) await writeFile(f, html);
console.log("[pages] contenu cuit — les 4 pages sont lisibles sans JavaScript");
