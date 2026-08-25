/* =====================================================================
   SAINT-CYPRIEN · scripts/cuire-galerie.mjs — les photos entrent dans le HTML

   LE PROBLÈME, MESURÉ. /galerie/ servait ceci :

       <div id="galerie"></div>

   Zéro balise <img> dans toute la page. La seule page du site dont l'objet
   est de MONTRER la salle ne montrait rien à un robot. Google Images
   n'indexe que ce qu'il lit dans le HTML — seize clichés, aucun déclaré.
   Et les robots des assistants (GPTBot, ClaudeBot, PerplexityBot)
   n'exécutent pas le JavaScript : pour eux, la salle n'avait pas de visage.

   CE QUE FAIT CE SCRIPT. Après le build, il écrit dans la div les MÊMES
   sections que renderGallery() peindra ensuite — le même appel à
   picture(), les mêmes alt écrits dans data-galerie.js, les mêmes zones.
   Le JS fait `root.innerHTML = …` : il réécrit par-dessus à l'identique,
   donc aucun doublon et aucun écart entre le robot et le visiteur.

   Effet de bord assumé : sans JavaScript, la galerie s'affiche.

   Usage : appelé par `npm run postbuild`.
   ===================================================================== */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGE = join(ROOT, "dist", "galerie", "index.html");
const url = (f) => pathToFileURL(join(ROOT, "public", "assets", "js", f)).href;
const { picture } = await import(url("data.js"));
const { GALLERY } = await import(url("data-galerie.js"));

const IMG = "/assets/img/sc/";
const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

let n = -1;
const figure = (s, i) => `<figure class="gitem${s.feat === "wide" ? " gitem--wide" : ""}">
    <button class="gitem__btn" type="button" data-i="${i}" aria-label="Agrandir : ${esc(s.alt)}">
      ${picture(IMG + s.f, `alt="${esc(s.alt)}" loading="lazy" decoding="async"`)}
      <span class="gitem__glow" aria-hidden="true"></span>
      <span class="gitem__zoom" aria-hidden="true">Agrandir</span>
    </button>
    <figcaption class="gitem__cap">${s.cap}</figcaption>
  </figure>`;

const sections = GALLERY.map(
  (z) => `<section class="section gzone" id="zone-${z.id}" aria-label="${z.zone}">
      <div class="wrap">
        <header class="gzone__head" data-reveal>
          <h2 class="gzone__zone">${z.zone}</h2>
          <span class="gzone__spec">${z.spec}</span>
        </header>
        <p class="gzone__lede" data-reveal>${z.lede}</p>
        <div class="ggrid">${z.shots.map((s) => figure(s, ++n)).join("")}</div>
      </div>
    </section>`
).join("");

const html = await readFile(PAGE, "utf8");
const creux = /(<div id="galerie"[^>]*>)\s*(<\/div>)/;
if (!creux.test(html)) {
  console.error("[galerie] la div #galerie n'est plus vide ou a changé de forme — rien de cuit");
  process.exit(1);
}
await writeFile(PAGE, html.replace(creux, `$1${sections}$2`));
console.log(`[galerie] ${n + 1} photos cuites dans /galerie/ (lisibles sans JavaScript)`);
