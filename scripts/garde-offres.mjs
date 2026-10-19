/* =====================================================================
   SAINT-CYPRIEN · scripts/garde-offres.mjs — dernier contrôle du build.

   Deux offres de la boutique et leur page de regroupement se sont
   arrêtées le 19/10/2026 à minuit (les chemins sont dans INTERDITS). Un
   lien vers l'une d'elles dans la sortie du build mènerait à une page
   vide : le build s'arrête plutôt que de le publier.
   Usage : appelé par `npm run postbuild`, après la cuisson des pages.
   ===================================================================== */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = join(process.cwd(), "dist");
const INTERDITS = /\/offre\/29\b|\/offre\/259\b|\/offres-speciales\b|offre-duo|offre-saison/;
const LISIBLES = /\.(html|js|mjs|css|json|txt|xml|webmanifest)$/i;

const fautes = [];
const parcourir = (dir) => {
  for (const nom of readdirSync(dir)) {
    const f = join(dir, nom);
    if (statSync(f).isDirectory()) { parcourir(f); continue; }
    if (!LISIBLES.test(nom)) continue;
    readFileSync(f, "utf8").split("\n").forEach((ligne, i) => {
      const m = ligne.match(INTERDITS);
      if (m) fautes.push(`${relative(DIST, f)}:${i + 1} → ${m[0]}`);
    });
  }
};
parcourir(DIST);

if (fautes.length) {
  console.error(`[offres] ${fautes.length} lien(s) vers une offre arrêtée dans dist :`);
  for (const f of fautes) console.error("  " + f);
  process.exit(1);
}
console.log("[offres] aucun lien vers une offre arrêtée dans dist");
