/* =====================================================================
   PRÉ-BUILD — le sitemap se date tout seul.

   Avant, <lastmod> était écrit à la main dans public/sitemap.xml : au
   premier contenu publié depuis le vestiaire, la date mentait. Une date
   en dur dans un fichier inerte est une copie périssable — interdit.

   Ici, chaque URL est datée par le DERNIER COMMIT qui a touché ses
   sources réelles (la page .astro, ses données, sa feuille, son script).
   Pas de dépôt git accessible ⇒ on retombe sur la date de modification
   du fichier. Le sitemap ne peut donc plus vieillir tout seul.

   Usage : node scripts/build-sitemap.mjs
   ===================================================================== */
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const ROOT = process.cwd();
const SITE = "https://bc-st-cyprien.vercel.app";
const OUT = path.join(ROOT, "public/sitemap.xml");

/* Le contenu éditorial du sitemap reste écrit à la main — les titres
   d'images sont de la copie, pas des données. Seule la DATE est calculée. */
const COMMON = ["public/assets/js/data.js", "public/content.json", "public/assets/js/site.js"];

const PAGES = [
  {
    loc: "/", src: ["src/pages/index.astro", "public/assets/js/home.js", "public/assets/css/home.css"],
    changefreq: "weekly", priority: "1.0",
    img: "/assets/img/sc/salle-1.webp",
    title: "La salle Boxing Center Saint-Cyprien — 1 200 m² rive gauche, Toulouse",
  },
  {
    loc: "/premiere-seance/", src: ["src/pages/premiere-seance/index.astro", "public/assets/js/premiere-seance.js", "public/assets/css/premiere-seance.css"],
    changefreq: "monthly", priority: "0.9",
    img: "/assets/img/sc/salle-1.webp",
    title: "Le plateau vu depuis la porte — ta première séance au Boxing Center Saint-Cyprien",
  },
  {
    loc: "/la-salle/", src: ["src/pages/la-salle/index.astro", "public/assets/js/la-salle.js"],
    changefreq: "monthly", priority: "0.8",
    img: "/assets/img/sc/salle-1.webp",
    title: "Le plateau de 1 200 m² sur un seul niveau — Boxing Center Saint-Cyprien",
  },
  {
    loc: "/activites/", src: ["src/pages/activites/index.astro", "public/assets/js/activites.js"],
    changefreq: "monthly", priority: "0.8",
    img: "/assets/img/sc/anglaise-header.webp",
    title: "Boxe anglaise à Boxing Center Saint-Cyprien — le noble art",
  },
  {
    loc: "/coachs/", src: ["src/pages/coachs/index.astro", "public/assets/js/coachs.js"],
    changefreq: "monthly", priority: "0.8",
    img: "/assets/img/sc/coach-dadi.webp",
    title: "Coach Dadi — Boxing Center Saint-Cyprien, rive gauche",
  },
  {
    loc: "/galerie/", src: ["src/pages/galerie/index.astro", "public/assets/js/galerie.js"],
    changefreq: "monthly", priority: "0.8",
    img: "/assets/img/sc/salle-1.webp",
    title: "Le plateau vu depuis la porte : sacs, ring et cage au fond — Boxing Center Saint-Cyprien",
  },
  {
    loc: "/plannings/", src: ["src/pages/plannings/index.astro", "public/assets/js/plannings.js"],
    changefreq: "weekly", priority: "0.8",
    img: "/assets/img/sc/planning-2026-1600.webp",
    title: "Planning officiel des cours — Boxing Center Saint-Cyprien",
  },
  {
    loc: "/tarifs/", src: ["src/pages/tarifs/index.astro", "public/assets/js/tarifs.js"],
    changefreq: "monthly", priority: "0.8",
    img: "/assets/img/sc/salle-1.webp",
    title: "Les offres de Boxing Center Saint-Cyprien — essai, duo, saison",
  },
  {
    loc: "/contact/", src: ["src/pages/contact/index.astro", "public/assets/js/contact.js"],
    changefreq: "monthly", priority: "0.8",
    img: "/assets/img/sc/salle-1.webp",
    title: "Boxing Center Saint-Cyprien — 11 rue Sainte-Lucie, Toulouse rive gauche",
  },
];

/** Date ISO (AAAA-MM-JJ) du dernier commit touchant l'un de ces fichiers. */
function lastmod(files) {
  let best = 0;
  for (const f of files) {
    const abs = path.join(ROOT, f);
    if (!fs.existsSync(abs)) continue;
    let stamp = 0;
    try {
      const out = execFileSync("git", ["log", "-1", "--format=%ct", "--", f], {
        cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      if (out) stamp = Number(out) * 1000;
    } catch { /* pas de git : on prendra le mtime */ }
    if (!stamp) stamp = fs.statSync(abs).mtimeMs;
    if (stamp > best) best = stamp;
  }
  return new Date(best || Date.now()).toISOString().slice(0, 10);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const body = PAGES.map((p) => `  <url>
    <loc>${SITE}${p.loc}</loc>
    <lastmod>${lastmod([...p.src, ...COMMON])}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <image:image>
      <image:loc>${SITE}${p.img}</image:loc>
      <image:title>${esc(p.title)}</image:title>
    </image:image>
  </url>`).join("\n");

fs.writeFileSync(OUT, `<?xml version="1.0" encoding="UTF-8"?>
<!-- Généré par scripts/build-sitemap.mjs — ne pas éditer à la main.
     <lastmod> vient du dernier commit qui a touché les sources de chaque page. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`);

console.log(`sitemap.xml : ${PAGES.length} URL datées depuis git`);
