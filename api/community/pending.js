/* =====================================================================
   GET /api/community/pending — la file de modération (staff uniquement).
   Le vestiaire lit ici tout ce qui attend un regard humain : tag "pending",
   le plus ancien en premier (on ne laisse personne attendre indéfiniment).

   LE COUP D'ŒIL AUTOMATIQUE (facultatif) : si une clé de vision est présente
   dans l'environnement (GEMINI_API_KEY), chaque IMAGE en attente reçoit un
   avis « probablement hors sujet » — un INDICE pour le staff, jamais une
   sentence : on ne supprime pas le souvenir de quelqu'un sur l'avis d'une
   machine. Sans clé, la file fonctionne exactement pareil, simplement sans
   l'indice. C'est la dégradation honnête : moins d'aide, jamais moins de
   sécurité — puisque rien n'est publiable sans validation humaine.
   ===================================================================== */
import { allowCors, isAdmin } from "../_lib/util.js";
import { ready, FOLDER, search, publicItem } from "../_lib/cloudinary.js";

const MODELE = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/** Renvoie true si l'image est manifestement hors sujet — ou null si on ne sait pas. */
async function avisVision(item) {
  const cle = process.env.GEMINI_API_KEY;
  if (!cle || item.type !== "image") return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const img = await fetch(item.src, { signal: ctrl.signal });
    if (!img.ok) { clearTimeout(t); return null; }
    const b64 = Buffer.from(await img.arrayBuffer()).toString("base64");
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODELE}:generateContent?key=${cle}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Cette image a-t-elle un rapport avec une salle de sport de combat (boxe, thaï, grappling, cross-training, matériel, membres, coachs, locaux) ? Réponds UNIQUEMENT par OUI ou NON." },
              { inline_data: { mime_type: img.headers.get("content-type") || "image/jpeg", data: b64 } },
            ],
          }],
          generationConfig: { maxOutputTokens: 5, temperature: 0 },
        }),
      }
    );
    clearTimeout(t);
    if (!r.ok) return null;
    const j = await r.json();
    const txt = (j?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim().toUpperCase();
    if (txt.startsWith("NON")) return true;
    if (txt.startsWith("OUI")) return false;
    return null;
  } catch {
    return null; // pas de clé, pas de réseau, pas de réponse : on ne conclut rien
  }
}

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  if (!ready()) return res.status(200).json({ items: [], branche: false });

  try {
    const r = await search(`folder:${FOLDER} AND tags=pending`, { max: 60, sort: "asc" });
    const items = (r.resources || []).map(publicItem);
    // L'avis de vision, en parallèle et plafonné : la file doit rester rapide.
    const avis = await Promise.all(items.slice(0, 12).map(avisVision));
    avis.forEach((a, i) => { if (a !== null) items[i].horsSujet = a; });
    res.status(200).json({ items, branche: true, vision: Boolean(process.env.GEMINI_API_KEY) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
