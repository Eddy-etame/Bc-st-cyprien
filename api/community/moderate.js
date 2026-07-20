/* =====================================================================
   POST /api/community/moderate — le geste du staff (staff uniquement).
     { id, type, action: "approve" | "reject" }
   · approve → on pose "approved" et on retire "pending" : le média rejoint
               le mur public à la prochaine lecture.
   · reject  → on détruit le média chez Cloudinary. C'est définitif, et c'est
               voulu : un refus doit vraiment faire disparaître le fichier.
   ===================================================================== */
import { allowCors, readBody, isAdmin } from "../_lib/util.js";
import { ready, tag, destroy } from "../_lib/cloudinary.js";

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isAdmin(req)) return res.status(401).json({ error: "Unauthorized" });
  if (!ready()) return res.status(503).json({ error: "CLOUDINARY_URL n'est pas configurée sur le serveur." });

  const { id, action, type } = readBody(req);
  if (!id) return res.status(400).json({ error: "Média manquant." });
  const resourceType = type === "video" ? "video" : "image";

  try {
    if (action === "approve") {
      await tag("add", "approved", [id], resourceType);
      await tag("remove", "pending", [id], resourceType);
      return res.status(200).json({ ok: true, id, statut: "approuve" });
    }
    if (action === "reject") {
      await destroy(id, resourceType);
      return res.status(200).json({ ok: true, id, statut: "supprime" });
    }
    return res.status(400).json({ error: "Action inconnue." });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
