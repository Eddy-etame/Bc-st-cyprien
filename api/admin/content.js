/* =====================================================================
   /api/admin/content — le contenu éditable de la salle.
     GET   → le contenu publié (public/content.json) + son sha GitHub
     POST  → valide, commit sur GitHub, déclenche le rebuild Vercel
   Protégé par ADMIN_TOKEN (en-tête x-admin-token) : aucun secret ne vit
   dans le front. Env : ADMIN_TOKEN, GITHUB_TOKEN, GITHUB_REPO,
   GITHUB_BRANCH (défaut main), VERCEL_DEPLOY_HOOK (recommandé).
   ===================================================================== */
import { allowCors, isAdmin, readBody } from "../_lib/util.js";

const REPO = process.env.GITHUB_REPO || "";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const PATH = "public/content.json";
const TOP_KEYS = ["salle", "tarifs", "coaches", "schedule", "promos", "faq"];

function gh(path, init = {}) {
  return fetch(`https://api.github.com/repos/${REPO}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "bcsc-vestiaire",
      ...(init.headers || {}),
    },
  });
}

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!isAdmin(req)) return res.status(401).json({ error: "Mot de passe refusé." });
  if (!process.env.GITHUB_TOKEN || !REPO)
    return res.status(500).json({ error: "GITHUB_TOKEN / GITHUB_REPO non configurés — la publication est impossible." });

  if (req.method === "GET") {
    const r = await gh(`contents/${PATH}?ref=${BRANCH}`);
    if (r.status === 404) return res.status(200).json({ content: {}, sha: null, empty: true });
    if (!r.ok) return res.status(502).json({ error: `Lecture GitHub échouée (${r.status}).` });
    const j = await r.json();
    let content = {};
    try { content = JSON.parse(Buffer.from(j.content, "base64").toString("utf8")); } catch { content = {}; }
    return res.status(200).json({ content, sha: j.sha });
  }

  if (req.method === "POST") {
    const content = readBody(req).content;
    if (!content || typeof content !== "object" || Array.isArray(content))
      return res.status(400).json({ error: "Contenu invalide." });
    if (!TOP_KEYS.some((k) => k in content))
      return res.status(400).json({ error: "Structure de contenu inattendue." });
    const json = JSON.stringify(content, null, 2);
    if (json.length > 300_000) return res.status(413).json({ error: "Contenu trop volumineux." });

    const cur = await gh(`contents/${PATH}?ref=${BRANCH}`);
    const sha = cur.ok ? (await cur.json()).sha : undefined;

    const put = await gh(`contents/${PATH}`, {
      method: "PUT",
      body: JSON.stringify({
        message: "vestiaire : mise à jour du contenu de la salle",
        content: Buffer.from(json + "\n", "utf8").toString("base64"),
        branch: BRANCH,
        sha,
      }),
    });
    if (!put.ok) return res.status(502).json({ error: `Écriture GitHub échouée (${put.status}).` });

    let rebuild = false;
    if (process.env.VERCEL_DEPLOY_HOOK) {
      try { await fetch(process.env.VERCEL_DEPLOY_HOOK, { method: "POST" }); rebuild = true; } catch { /* le commit est passé */ }
    }
    return res.status(200).json({ ok: true, rebuild });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
