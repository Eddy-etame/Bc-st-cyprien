/* =====================================================================
   Helpers partagés des fonctions serverless (Vercel) — Saint-Cyprien.
   Zéro dépendance npm : uniquement fetch + crypto natifs.
   ===================================================================== */
import { createHash, timingSafeEqual } from "crypto";

export function allowCors(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
}

/** Comparaison à temps constant du mot de passe staff (jamais dans le front). */
export function isAdmin(req) {
  if (!process.env.ADMIN_TOKEN) return false;
  const given = createHash("sha256").update(String(req.headers["x-admin-token"] || "")).digest();
  const good = createHash("sha256").update(process.env.ADMIN_TOKEN).digest();
  return timingSafeEqual(given, good);
}

/** Corps de requête, que Vercel l'ait parsé ou non. */
export function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") { try { return JSON.parse(req.body || "{}"); } catch { return {}; } }
  return req.body;
}

/* ------------------------------------------------------------------ *
 *  STOCKAGE DES LEADS — Upstash Redis via son API REST (fetch simple,
 *  aucune dépendance, palier gratuit). Configuré par deux variables :
 *  UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 *  Non configuré ⇒ `kvReady()` est faux et l'appelant le dit honnêtement.
 * ------------------------------------------------------------------ */
const KV_URL = () => (process.env.UPSTASH_REDIS_REST_URL || "").replace(/\/$/, "");
const KV_TOKEN = () => process.env.UPSTASH_REDIS_REST_TOKEN || "";
export const kvReady = () => Boolean(KV_URL() && KV_TOKEN());

/** Exécute une commande Redis (tableau d'arguments) via l'API REST. */
export async function kv(cmd) {
  if (!kvReady()) throw new Error("kv non configuré");
  const r = await fetch(KV_URL(), {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN()}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error("kv " + r.status);
  const j = await r.json();
  return j.result;
}

export const LEADS_KEY = "bcsc:leads";
