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

/* ---------------------------------------------------------------------
   L'INVENTAIRE DES PHOTOS — pourquoi il vaut la peine d'être écrit.

   Les visuels du site sont posés en fonds CSS et en grilles rendues par le
   JavaScript. Google Images n'indexe que ce qu'il VOIT dans le HTML : une
   photo en `background-image` ne rapporte pas un clic. Le sitemap d'images
   est la seule déclaration qui les rattrape — mais il n'en portait qu'UNE
   par page, et six pages sur neuf montraient la même.

   Chaque photo reçoit donc son titre et sa légende, écrits avec les mots
   de Saint-Cyprien : les 1 200 m² d'un seul tenant, la rive gauche, la rue
   Sainte-Lucie. Recopier la légende d'une salle sœur ferait du contenu
   dupliqué pour le moteur — et une phrase fausse pour le lecteur.

   Une seule taille déclarée par visuel : `planning-2026-1600` et
   `planning-2026-800` sont la même affiche, en concurrence l'une de
   l'autre si on les déclarait toutes les deux.
   --------------------------------------------------------------------- */
const CLUB = "Boxing Center Saint-Cyprien";
const I = {
  salle:     ["/assets/img/sc/salle-1.webp", `Le plateau de 1 200 m² d'un seul tenant — ${CLUB}`, "La salle du Boxing Center Saint-Cyprien vue depuis la porte : les sacs, le ring et la cage au fond, sur un seul niveau."],
  anglaise:  ["/assets/img/sc/anglaise-header.webp", `Boxe anglaise, le noble art — ${CLUB}`, "Cours de boxe anglaise au Boxing Center Saint-Cyprien, rive gauche de Toulouse."],
  anglaise2: ["/assets/img/sc/anglaise.webp", `Sur le ring en boxe anglaise — ${CLUB}`, "Travail au ring pendant un cours de boxe anglaise, 11 rue Sainte-Lucie à Toulouse."],
  thai:      ["/assets/img/sc/thai.webp", `Boxe thaï — ${CLUB}`, "Cours de boxe thaï au Boxing Center Saint-Cyprien : coudes, genoux, tibias."],
  thai1:     ["/assets/img/sc/thai-1.webp", `Travail aux pattes d'ours en boxe thaï — ${CLUB}`, "Séance de boxe thaï aux pattes d'ours dans la salle de Saint-Cyprien."],
  thai2:     ["/assets/img/sc/thai-2.webp", `Clinch et genoux en boxe thaï — ${CLUB}`, "Boxe thaï au Boxing Center Saint-Cyprien, tous niveaux, débutants inclus."],
  grappling: ["/assets/img/sc/grappling.webp", `Grappling au sol — ${CLUB}`, "Cours de grappling sur les tatamis du Boxing Center Saint-Cyprien."],
  cross:     ["/assets/img/sc/cross.webp", `Cross training — ${CLUB}`, "Cours de cross training au Boxing Center Saint-Cyprien, rive gauche."],
  hyrox:     ["/assets/img/sc/hyrox.webp", `Préparation Hyrox — ${CLUB}`, "Préparation Hyrox au Boxing Center Saint-Cyprien : course, force, endurance."],
  lady:      ["/assets/img/sc/lady.webp", `Lady Boxing, le cours 100 % femmes — ${CLUB}`, "Le cours Lady Boxing du Boxing Center Saint-Cyprien, réservé aux femmes."],
  lady2:     ["/assets/img/sc/lady-2.webp", `Frappe au sac en Lady Boxing — ${CLUB}`, "Séance Lady Boxing au Boxing Center Saint-Cyprien, 11 rue Sainte-Lucie."],
  educative: ["/assets/img/sc/educative.webp", `Boxe éducative pour les enfants — ${CLUB}`, "La boxe éducative du Boxing Center Saint-Cyprien : apprendre à boxer sans prendre de coups."],
  educative1:["/assets/img/sc/educative-1.webp", `L'école de boxe des enfants — ${CLUB}`, "Cours de boxe éducative encadré au Boxing Center Saint-Cyprien."],
  muscu:     ["/assets/img/sc/muscu.webp", `L'espace musculation — ${CLUB}`, "L'espace musculation du Boxing Center Saint-Cyprien, compris dans l'abonnement."],
  training:  ["/assets/img/sc/training.webp", `Travail technique aux pattes d'ours — ${CLUB}`, "Le coach corrige la garde pendant un entraînement au Boxing Center Saint-Cyprien."],
  niveaux:   ["/assets/img/sc/tous-niveaux.webp", `Tous les niveaux sur le même plateau — ${CLUB}`, "Débutants et confirmés s'entraînent ensemble au Boxing Center Saint-Cyprien."],
  dadi:      ["/assets/img/sc/coach-dadi.webp", `Coach Dadi — ${CLUB}`, "Dadi encadre les cours du Boxing Center Saint-Cyprien, rive gauche de Toulouse."],
  planning:  ["/assets/img/sc/planning-2026-1600.webp", `Planning officiel des cours — ${CLUB}`, "Le planning 2026 des cours du Boxing Center Saint-Cyprien, 11 rue Sainte-Lucie."],
};

const PAGES = [
  {
    loc: "/", src: ["src/pages/index.astro", "public/assets/js/home.js", "public/assets/css/home.css"],
    changefreq: "weekly", priority: "1.0",
    imgs: [I.salle, I.anglaise, I.thai, I.niveaux],
  },
  {
    loc: "/premiere-seance/", src: ["src/pages/premiere-seance/index.astro", "public/assets/js/premiere-seance.js", "public/assets/css/premiere-seance.css"],
    changefreq: "monthly", priority: "0.9",
    imgs: [I.salle, I.training, I.niveaux],
  },
  {
    loc: "/la-salle/", src: ["src/pages/la-salle/index.astro", "public/assets/js/la-salle.js"],
    changefreq: "monthly", priority: "0.8",
    imgs: [I.salle, I.muscu, I.anglaise2],
  },
  {
    loc: "/activites/", src: ["src/pages/activites/index.astro", "public/assets/js/activites.js"],
    changefreq: "monthly", priority: "0.8",
    imgs: [I.anglaise, I.thai, I.grappling, I.cross, I.hyrox, I.lady, I.educative, I.muscu],
  },
  {
    loc: "/coachs/", src: ["src/pages/coachs/index.astro", "public/assets/js/coachs.js"],
    changefreq: "monthly", priority: "0.8",
    imgs: [I.dadi, I.training],
  },
  {
    loc: "/galerie/", src: ["src/pages/galerie/index.astro", "public/assets/js/galerie.js"],
    changefreq: "monthly", priority: "0.8",
    imgs: [I.salle, I.anglaise2, I.thai1, I.thai2, I.lady2, I.educative1, I.cross, I.grappling, I.niveaux, I.training],
  },
  {
    loc: "/plannings/", src: ["src/pages/plannings/index.astro", "public/assets/js/plannings.js"],
    changefreq: "weekly", priority: "0.8",
    imgs: [I.planning],
  },
  {
    loc: "/tarifs/", src: ["src/pages/tarifs/index.astro", "public/assets/js/tarifs.js"],
    changefreq: "monthly", priority: "0.8",
    imgs: [I.salle, I.muscu],
  },
  {
    loc: "/contact/", src: ["src/pages/contact/index.astro", "public/assets/js/contact.js"],
    changefreq: "monthly", priority: "0.8",
    imgs: [I.salle],
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
${p.imgs.map(([src, titre, legende]) => `    <image:image>
      <image:loc>${SITE}${src}</image:loc>
      <image:title>${esc(titre)}</image:title>
      <image:caption>${esc(legende)}</image:caption>
    </image:image>`).join("\n")}
  </url>`).join("\n");

fs.writeFileSync(OUT, `<?xml version="1.0" encoding="UTF-8"?>
<!-- Généré par scripts/build-sitemap.mjs — ne pas éditer à la main.
     <lastmod> vient du dernier commit qui a touché les sources de chaque page. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`);

const photos = PAGES.reduce((n, p) => n + p.imgs.length, 0);
console.log(`sitemap.xml : ${PAGES.length} URL datées depuis git · ${photos} images déclarées`);
