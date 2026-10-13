import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const routes = ["", "la-salle", "activites", "coachs", "galerie", "plannings", "tarifs", "contact"];
const htmlFor = (route) => readFileSync(join(root, "dist", route, "index.html"), "utf8");
const textOf = (html) => html
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&[a-z0-9#]+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();

test("les huit pages indexables ont un H1, une canonique et du JSON-LD valide", () => {
  for (const route of routes) {
    const html = htmlFor(route);
    const h1 = html.match(/<h1\b/gi) || [];
    assert.equal(h1.length, 1, `/${route}/ doit contenir exactement un H1`);
    const expected = `https://club-boxe-toulouse.com/${route ? `${route}/` : ""}`;
    assert.match(html, new RegExp(`<link[^>]+rel="canonical"[^>]+href="${expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "i"));

    const blocks = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    assert.ok(blocks.length >= 1, `/${route}/ doit exposer du JSON-LD`);
    for (const [, raw] of blocks) assert.doesNotThrow(() => JSON.parse(raw), `JSON-LD invalide sur /${route}/`);
  }
});

test("la FAQ visible de /contact/ et son FAQPage disent exactement la même chose", () => {
  /* aeo-geo : FAQ visible ⇔ FAQPage, même nombre d'items, même texte. Le
     balisage n'est jamais une promesse que la page ne tient pas. */
  const html = htmlFor("contact");
  const ld = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap(([, raw]) => JSON.parse(raw)["@graph"] || [JSON.parse(raw)]);
  const faq = ld.find((n) => n["@type"] === "FAQPage");
  assert.ok(faq, "/contact/ doit exposer un FAQPage");
  const visible = [...html.matchAll(/<summary>([\s\S]*?)<\/summary>/g)].map(([, q]) => textOf(q));
  const balise = faq.mainEntity.map((q) => textOf(q.name));
  assert.deepEqual(balise, visible, "FAQPage et FAQ visible divergent");
  const page = textOf(html);
  for (const q of faq.mainEntity) {
    assert.ok(page.includes(textOf(q.acceptedAnswer.text).slice(0, 60)), `réponse absente de la page : ${q.name}`);
  }
});

test("aucune SpeakableSpecification", () => {
  assert.doesNotMatch(routes.map(htmlFor).join("\n"), /SpeakableSpecification/);
});

test("la page Activités décrit chaque image informative", () => {
  const html = htmlFor("activites");
  const images = [...html.matchAll(/<img\b[^>]*\balt=(['"])(.*?)\1[^>]*>/gi)];
  assert.ok(images.length >= 13, "inventaire image Activités incomplet");
  const empty = images.filter(([, , alt]) => !alt.trim());
  assert.equal(empty.length, 0, `${empty.length} image(s) informative(s) sans alt`);
});

test("Coachs et Contact livrent une réponse utile dans le HTML initial", () => {
  const coaches = textOf(htmlFor("coachs"));
  const contact = textOf(htmlFor("contact"));
  assert.match(coaches, /Quel coach pour quelle discipline/i);
  assert.match(coaches, /aucun encadrant n’est nommé/i);
  assert.ok(coaches.split(/\s+/).length >= 180, "page Coachs encore trop mince");
  assert.match(contact, /Venir sans deviner/i);
  assert.match(contact, /Gants et matériel sont prêtés/i);
  assert.doesNotMatch(contact, /Confirme le créneau/i, "pas de vente négative sur la première séance");
  assert.ok(contact.split(/\s+/).length >= 230, "page Contact encore trop mince");
});

test("aucune note Google (ordre d’Eddy du 08/10/2026) — ni affichée, ni balisée, ni récitée", () => {
  const files = [
    ...routes.map((route) => join(root, "dist", route, "index.html")),
    join(root, "dist", "llms.txt"),
    join(root, "dist", "llms-full.txt"),
    join(root, "dist", "ai.txt"),
  ];
  const joined = files.map((file) => readFileSync(file, "utf8")).join("\n");
  assert.doesNotMatch(joined, /aggregateRating|ratingValue|\b[1-5],[0-9] ?\/ ?5\b|\b\d+ avis\b|2026-08-06/i);
});

test("le sitemap porte exactement les pages indexables du site, et des images locales uniques qui existent", () => {
  const xml = readFileSync(join(root, "dist", "sitemap.xml"), "utf8");
  const locs = [...xml.matchAll(/<url>\s*<loc>https:\/\/club-boxe-toulouse\.com(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
  const images = [...xml.matchAll(/<image:loc>https:\/\/club-boxe-toulouse\.com(\/[^<]+)<\/image:loc>/g)].map((m) => m[1]);
  /* 13/10/2026 : le site a grandi (pages de discipline, mentions légales). Plus de compte en dur :
     chaque page de dist qui se laisse indexer est au plan, et le plan ne contient rien d'autre. */
  const indexables = [];
  const parcours = (dir, base) => {
    for (const nom of readdirSync(dir, { withFileTypes: true })) {
      if (nom.isDirectory()) parcours(join(dir, nom.name), `${base}${nom.name}/`);
      else if (nom.name === "index.html") {
        const html = readFileSync(join(dir, nom.name), "utf8");
        if (!/<meta name="robots" content="[^"]*noindex/i.test(html)) indexables.push(base);
      }
    }
  };
  parcours(join(root, "dist"), "/");
  assert.deepEqual([...locs].sort(), indexables.sort(), "le plan du site et les pages indexables ne coïncident pas");
  assert.ok(locs.length >= 8);
  assert.ok(images.length >= 20);
  assert.equal(new Set(images).size, images.length, "le sitemap répète encore des images entre pages");
  for (const image of images) {
    assert.ok(existsSync(join(root, "dist", image)), `image de sitemap absente : ${image}`);
  }
});

test("robots.txt autorise précisément MCP tout en gardant les autres API privées", () => {
  const robots = readFileSync(join(root, "dist", "robots.txt"), "utf8");
  assert.ok((robots.match(/^Allow: \/api\/mcp$/gm) || []).length >= 3);
  assert.ok((robots.match(/^Disallow: \/api\/$/gm) || []).length >= 3);
});


test("chaque page indexable a SA vignette de partage, qui existe, et aucune n’est partagée", async () => {
  /* Règle d'Eddy : jamais deux vignettes identiques. Les pages de discipline
     ont leur carte (cartes-disciplines.py), les autres la leur (cartes-pages.py). */
  const pages = readdirSync(join(root, "dist", "activites"), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `activites/${d.name}`);
  const vues = new Map();
  for (const route of [...routes, "mentions-legales", ...pages]) {
    const html = htmlFor(route);
    if (/<meta name="robots" content="noindex/i.test(html)) continue;
    const og = (html.match(/<meta property="og:image" content="([^"]+)"/) || [])[1];
    assert.ok(og, `/${route}/ n’a pas de og:image`);
    assert.equal((html.match(/<meta name="twitter:image" content="([^"]+)"/) || [])[1], og, `/${route}/ : twitter:image ≠ og:image`);
    assert.ok(/<meta property="og:image:alt" content="[^"]{20,}"/.test(html), `/${route}/ : og:image:alt manquant`);
    const fichier = og.replace("https://club-boxe-toulouse.com", "").replace(/\?.*$/, "");
    assert.ok(existsSync(join(root, "public", fichier)), `/${route}/ : ${fichier} n’existe pas`);
    assert.ok(!vues.has(fichier), `/${route}/ et /${vues.get(fichier)}/ partagent ${fichier}`);
    vues.set(fichier, route);
  }
});

test("les prix et les nombres écrits sur les vignettes sont ceux de data.js", async () => {
  /* Une vignette est une image : si l'offre change, rien ne la met à jour.
     Le test échoue tant qu'elle n'est pas refaite (python scripts/cartes-pages.py). */
  const { PROMOS, TARIFS, SCHEDULE } = await import(pathToFileURL(join(root, "public", "assets", "js", "data.js")).href);
  const prix = new Set(JSON.stringify({ PROMOS, TARIFS }).match(/\d+(?:,\d+)?€/g));
  const cartes = JSON.parse(readFileSync(join(root, "src", "cartes-pages.json"), "utf8")).pages;
  const disciplines = JSON.parse(readFileSync(join(root, "src", "disciplines-pages.json"), "utf8")).pages;
  const textes = [...Object.values(cartes), ...Object.values(disciplines)].flatMap((c) => [c.og.titre, ...c.og.faits]);
  for (const t of textes) {
    for (const p of t.match(/\d+(?:,\d+)?€/g) || []) assert.ok(prix.has(p), `vignette « ${t} » : ${p} n’est plus un prix de data.js`);
    const n = t.match(/^(\d+) créneaux/);
    if (n) assert.equal(+n[1], SCHEDULE.length, `vignette « ${t} » : le planning compte ${SCHEDULE.length} créneaux`);
  }
});
