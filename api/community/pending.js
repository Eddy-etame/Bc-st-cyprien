/* =====================================================================
   GET /api/community/pending — la file de modération (staff uniquement).
   Le vestiaire lit ici tout ce qui attend un regard humain : tag "pending",
   le plus ancien en premier (on ne laisse personne attendre indéfiniment).

   LE COUP D'ŒIL AUTOMATIQUE (facultatif) : si une clé de vision est présente
   dans l’environnement (le POOL GEMINI_API_KEY*, le même que l’assistant —
   les clés sont numérotées, on les ramasse toutes), chaque IMAGE reçoit un
   avis « probablement hors sujet » — un INDICE pour le staff, jamais une
   sentence : on ne supprime pas le souvenir de quelqu’un sur l’avis d’une
   machine. Sans clé, la file fonctionne exactement pareil, simplement sans
   l’indice. C’est la dégradation honnête : moins d’aide, jamais moins de
   sécurité — puisque rien n’est publiable sans validation humaine.
   ===================================================================== */
import { allowCors, isAdmin, geminiKeys } from "../_lib/util.js";
import { ready, FOLDER, search, adminItem } from "../_lib/cloudinary.js";

const MODELE = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const QUESTION =
  "Réponds par un seul mot. Cette image est-elle une vraie photographie en rapport avec une salle de sport de combat (boxe, thaï, grappling, cross-training, matériel, membres, coachs, locaux) ? " +
  "Réponds OUI si c’est le cas. Réponds NON si c’est autre chose : capture d’écran, mème, publicité, document, ou contenu choquant ou sexuel.";

/** Renvoie true si l’image est manifestement hors sujet — ou null si on ne sait pas. */
async function avisVision(item, cles) {
  if (!cles.length || item.type !== "image") return null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const img = await fetch(item.src, { signal: ctrl.signal });
    if (!img.ok) return null;
    const b64 = Buffer.from(await img.arrayBuffer()).toString("base64");
    const corps = JSON.stringify({
      contents: [{
        parts: [
          { text: QUESTION },
          { inline_data: { mime_type: img.headers.get("content-type") || "image/jpeg", data: b64 } },
        ],
      }],
      generationConfig: { maxOutputTokens: 5, temperature: 0 },
    });
    /* On saute les clés mortes exactement comme l’assistant : un quota épuisé
       sur la première clé ne doit pas éteindre le pré-tri de toute la file. */
    for (const cle of cles) {
      try {
        const r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${MODELE}:generateContent?key=${cle}`,
          { method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl.signal, body: corps }
        );
        if (!r.ok) continue;
        const j = await r.json();
        const txt = (j?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim().toUpperCase();
        if (txt.startsWith("NON")) return true;
        if (txt.startsWith("OUI")) return false;
        return null;
      } catch { /* clé suivante */ }
    }
    return null;
  } catch {
    return null; // pas de clé, pas de réseau, pas de réponse : on ne conclut rien
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  if (!ready()) return res.status(200).json({ items: [], branche: false });

  try {
    const r = await search(`folder:${FOLDER} AND tags=pending`, { max: 60, sort: "asc" });
    const items = (r.resources || []).map(adminItem);
    // L’avis de vision, en parallèle et plafonné : la file doit rester rapide.
    const cles = geminiKeys();
    const avis = await Promise.all(items.slice(0, 12).map((it) => avisVision(it, cles)));
    avis.forEach((a, i) => { if (a !== null) items[i].horsSujet = a; });
    res.status(200).json({ items, branche: true, vision: cles.length > 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
