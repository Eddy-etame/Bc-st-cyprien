/* =====================================================================
   GET /api/admin/leads — les contacts laissés à l'assistant.
   Lit la liste Upstash écrite par /api/lead. Stockage non configuré ⇒ 200
   avec { configured:false } : le vestiaire affiche un état honnête (« le
   carnet n'est pas encore branché »), jamais une page en erreur.
   ===================================================================== */
import { allowCors, isAdmin, kv, kvReady, LEADS_KEY } from "../_lib/util.js";

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!isAdmin(req)) return res.status(401).json({ error: "Mot de passe refusé." });
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  if (!kvReady()) return res.status(200).json({ configured: false, leads: [] });

  try {
    const raw = await kv(["LRANGE", LEADS_KEY, 0, 199]);
    const leads = (raw || [])
      .map((s) => { try { return JSON.parse(s); } catch { return null; } })
      .filter(Boolean);
    return res.status(200).json({ configured: true, leads });
  } catch (e) {
    return res.status(502).json({ error: "Lecture du carnet impossible : " + e.message });
  }
}
