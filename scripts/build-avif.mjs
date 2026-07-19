/* =====================================================================
   AVIF — mais seulement quand l'AVIF gagne VRAIMENT.

   L'idée reçue « AVIF < WebP » est fausse ici : les photos de la salle
   sont déjà des WebP serrés. Mesuré sur les 21 fichiers de /assets/img/,
   à qualité visuellement identique (PSNR >= 42 dB face au WebP livré),
   l'AVIF est PLUS LOURD sur 12 d'entre eux. Convertir en aveugle aurait
   alourdi le site tout en croyant l'alléger.

   Ce script fait donc la seule chose honnête : pour chaque WebP il cherche
   la qualité AVIF la plus basse qui tient encore PSNR >= 42 dB, et il
   n'écrit le .avif QUE s'il économise plus de SEUIL octets. Sinon il
   supprime un éventuel .avif périmé. La liste des gagnants est ensuite
   recopiée dans data.js entre deux marqueurs : le rendu sert alors un
   <picture> avec <source type="image/avif">, et le WebP reste le filet —
   un navigateur sans AVIF ne voit aucune différence.

   Lancé par `npm run prebuild`. Sans sharp, il ne casse rien : il sort en
   silence et le site reste en WebP.
   ===================================================================== */
import fs from "node:fs";
import path from "node:path";

const RACINE = path.resolve(process.argv[2] || process.cwd());
const IMG = path.join(RACINE, "public/assets/img");
const DATA = path.join(RACINE, "public/assets/js/data.js");
const PSNR_MIN = 42;      // dB — au-delà, l'œil ne distingue plus les deux
const SEUIL = 4096;       // octets : en dessous, une requête de plus ne vaut pas le gain
const DEBUT = "/* AVIF:DEBUT */";
const FIN = "/* AVIF:FIN */";

let sharp;
try { sharp = (await import("sharp")).default; }
catch { console.log("[avif] sharp indisponible — on garde le WebP tel quel."); process.exit(0); }

/** Écart mesuré entre deux encodages du même cliché, en dB. */
async function psnr(refBuf, testBuf) {
  const a = await sharp(refBuf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(testBuf).removeAlpha().raw().toBuffer();
  let se = 0;
  for (let i = 0; i < a.data.length; i++) { const d = a.data[i] - b[i]; se += d * d; }
  const mse = se / a.data.length;
  return mse === 0 ? 99 : 10 * Math.log10(65025 / mse);
}

function* webps(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* webps(p);
    else if (e.name.endsWith(".webp")) yield p;
  }
}

/* Le poster pleine résolution ne s'AFFICHE jamais : il n'est qu'au bout d'un
   href « ouvrir en grand ». Un href ne sait pas négocier le format — pas de
   <picture>, donc pas de filet — et il fait foi pour le club. On le laisse en
   WebP, lisible par tout ce qui existe, et on ne fabrique pas un AVIF qui ne
   serait servi à personne tout en pesant dans le déploiement. */
const HORS_RENDU = new Set(["planning-2026.webp"]);

/* --- LA MÉMOIRE DES VERDICTS -----------------------------------------
   Sonder une image, c'est encoder sept AVIF et décoder chaque fois deux
   images entières : ~30 s par cliché. Les GAGNANTS se reconnaissaient déjà
   à leur .avif sur le disque, mais les PERDANTS étaient re-sondés à chaque
   build — mesuré, sept minutes de prébuild pour reconfirmer que thai.webp
   est déjà optimal. Sur Vercel, ça se paie à chaque déploiement.
   On note donc le verdict à côté de la taille du fichier : tant que le WebP
   n'a pas changé d'un octet, la réponse d'hier vaut encore. Ce fichier est
   versionné exprès — c'est lui qui rend le build du déploiement rapide. */
const MEMOIRE = path.join(RACINE, "scripts/avif.verdicts.json");
let verdicts = {};
try { verdicts = JSON.parse(fs.readFileSync(MEMOIRE, "utf8")); } catch { verdicts = {}; }
const neufs = {};

const gagnants = [];
for (const f of webps(IMG)) {
  if (HORS_RENDU.has(path.basename(f))) {
    const orphelin = f.replace(/\.webp$/, ".avif");
    if (fs.existsSync(orphelin)) fs.unlinkSync(orphelin);
    console.log(`[avif] ${path.basename(f).padEnd(24)} jamais rendu en <img> — pas d'AVIF`);
    continue;
  }
  const avifPath = f.replace(/\.webp$/, ".avif");
  const src = fs.readFileSync(f);
  const cle = path.relative(IMG, f).split(path.sep).join("/");
  const vu = verdicts[cle];
  if (vu && vu.octets === src.length) {
    if (vu.verdict === "avif" && fs.existsSync(avifPath)) { gagnants.push(f); neufs[cle] = vu; continue; }
    if (vu.verdict === "webp") {
      if (fs.existsSync(avifPath)) fs.unlinkSync(avifPath);
      neufs[cle] = vu; continue;
    }
  }
  let best = null;
  for (const quality of [40, 45, 50, 55, 60, 65, 70]) {
    const buf = await sharp(src).avif({ quality, effort: 9, chromaSubsampling: "4:4:4" }).toBuffer();
    if (await psnr(src, buf) >= PSNR_MIN) { best = { quality, buf }; break; }
  }
  const gain = best ? src.length - best.buf.length : -1;
  if (best && gain > SEUIL) {
    fs.writeFileSync(avifPath, best.buf);
    gagnants.push(f);
    neufs[cle] = { octets: src.length, verdict: "avif", q: best.quality };
    console.log(`[avif] ${path.basename(f).padEnd(24)} q${best.quality}  −${(gain / 1024).toFixed(1)} Ko`);
  } else {
    if (fs.existsSync(avifPath)) fs.unlinkSync(avifPath);
    neufs[cle] = { octets: src.length, verdict: "webp" };
    console.log(`[avif] ${path.basename(f).padEnd(24)} l'AVIF ne gagne rien — on reste en WebP`);
  }
}
/* On trie en RECONSTRUISANT l'objet. Passer la liste des clés en 2e argument
   de JSON.stringify n'est pas un tri mais un filtre de propriétés : appliqué
   à toute la profondeur, il vidait chaque verdict de son octets/verdict et le
   cache ne pouvait plus jamais correspondre. */
const ordonnes = Object.fromEntries(Object.keys(neufs).sort().map((k) => [k, neufs[k]]));
fs.writeFileSync(MEMOIRE, JSON.stringify(ordonnes, null, 2) + "\n");

/* --- on recopie la liste dans data.js, entre marqueurs --- */
const liste = gagnants
  .map((f) => "/" + path.relative(path.join(RACINE, "public"), f).split(path.sep).join("/"))
  .sort();
const bloc = `${DEBUT}\n  ${liste.map((u) => JSON.stringify(u)).join(",\n  ")},\n  ${FIN}`;
let data = fs.readFileSync(DATA, "utf8");
const i = data.indexOf(DEBUT), j = data.indexOf(FIN);
if (i < 0 || j < 0) { console.error("[avif] marqueurs AVIF:DEBUT/FIN absents de data.js"); process.exit(1); }
data = data.slice(0, i) + bloc + data.slice(j + FIN.length);
fs.writeFileSync(DATA, data);
const eco = gagnants.reduce((s, f) => s + fs.statSync(f).size - fs.statSync(f.replace(/\.webp$/, ".avif")).size, 0);
console.log(`[avif] ${gagnants.length} image(s) servies en AVIF — ${(eco / 1024).toFixed(1)} Ko de moins, WebP conservé en filet.`);

/* --- FILET DEAD-MAN --------------------------------------------------
   Un <source type="image/avif"> écrit à la main dans une page pointe un
   fichier que ce script décide de produire ou non. Si la décision change
   (photo remplacée, seuil non atteint), le navigateur qui lit l'AVIF
   téléchargerait un 404 et n'afficherait RIEN : le WebP dessous ne le
   rattrape pas. On casse donc le build plutôt que de livrer un trou. */
const pages = fs.readdirSync(path.join(RACINE, "src/pages"), { recursive: true })
  .filter((f) => String(f).endsWith(".astro"))
  .map((f) => fs.readFileSync(path.join(RACINE, "src/pages", String(f)), "utf8"))
  .join("\n");
const attendus = [...new Set([...pages.matchAll(/\/assets\/img\/[^\s"',]+\.avif/g)].map((m) => m[0]))];
const manquants = attendus.filter((u) => !fs.existsSync(path.join(RACINE, "public", u)));
if (manquants.length) {
  console.error("[avif] ARRÊT — ces .avif sont cités dans une page mais n'ont pas été produits :\n  " + manquants.join("\n  "));
  process.exit(1);
}
