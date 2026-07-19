/* =====================================================================
   PRÉ-BUILD — le contenu du vestiaire entre dans le site.

   Le backoffice écrit public/content.json (commit GitHub → rebuild Vercel).
   Ce script le transforme en module ES statique
   (public/assets/js/content-overrides.js) que data.js importe.

   POURQUOI un module et pas un fetch : data.js est lu de façon synchrone
   par toutes les pages. Un fetch au démarrage retarderait le premier rendu
   de chaque page — la perf ne doit que monter, jamais descendre. Ici, le
   coût à l'exécution est nul : le fichier est déjà dans le bundle.
   Aucun contenu publié ⇒ un module vide, et data.js garde ses valeurs.
   ===================================================================== */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public/content.json");
const OUT = path.join(ROOT, "public/assets/js/content-overrides.js");

/* Seules ces clés peuvent être surchargées : le vestiaire ne peut pas
   réécrire le site entier par accident. */
const ALLOWED = ["salle", "tarifs", "coaches", "schedule", "promos", "faq"];

let data = {};
try {
  const raw = JSON.parse(fs.readFileSync(SRC, "utf8"));
  for (const k of ALLOWED) if (raw && raw[k] != null) data[k] = raw[k];
} catch {
  data = {}; // pas de contenu publié (ou illisible) : les valeurs de data.js font foi
}

const body = `/* GÉNÉRÉ AUTOMATIQUEMENT par scripts/apply-content.mjs — ne pas éditer.
   Source : public/content.json (écrit par le backoffice « Le vestiaire »).
   Regénéré à chaque build : publier au vestiaire = redéployer. */
export const OVERRIDES = ${JSON.stringify(data, null, 2)};
`;

const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
if (prev !== body) fs.writeFileSync(OUT, body);
const n = Object.keys(data).length;
console.log(`[contenu] ${n ? `${n} bloc(s) surchargé(s) : ${Object.keys(data).join(", ")}` : "aucune surcharge — data.js fait foi"}`);
