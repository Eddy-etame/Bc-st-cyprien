/* =====================================================================
   GET /api/community/items — le mur public.
   Ne sort QUE les médias tagués "approved" : rien n’arrive ici sans qu’un
   membre du staff l’ait ouvert et validé dans le vestiaire. Si Cloudinary
   n’est pas branché ou ne répond pas, on renvoie une liste vide et la page
   affiche son état « rien encore » — la galerie ne casse jamais.
   ===================================================================== */
import { allowCors } from "../_lib/util.js";
import { ready, FOLDER, LIMITS, search, publicItem } from "../_lib/cloudinary.js";

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!ready()) return res.status(200).json({ items: [], branche: false });

  try {
    const r = await search(`folder:${FOLDER} AND tags=approved`, { max: 48, sort: "desc" });
    const items = (r.resources || [])
      .map(publicItem)
      // Dernier filet : une vidéo plus longue que la règle ne s’affiche pas,
      // même si elle a été approuvée par erreur.
      .filter((it) => it.type !== "video" || !it.duree || it.duree <= LIMITS.maxDureeSec + 1);
    res.status(200).json({ items, branche: true });
  } catch {
    res.status(200).json({ items: [], branche: true });
  }
}
