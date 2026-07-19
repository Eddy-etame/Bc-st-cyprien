/* =====================================================================
   Serveur de vérification local — sert dist/ ET exécute les VRAIES
   fonctions de api/ (on ne teste pas un mannequin : ce sont les handlers
   qui partiront sur Vercel). On ne rajoute que la fine couche que Vercel
   fournit en production : req.body parsé et res.status().json().

   Usage : node scripts/serve-with-api.mjs [port]
   ===================================================================== */
import http from "http";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

/* racine du depot passee en argument (le serveur peut etre lance depuis
   n'importe ou) : dist/ et api/ sont resolus a partir d'elle. */
const PORT = Number(process.argv[2] || 6901);
const ROOT = path.resolve(process.argv[3] || process.cwd());
const DIST = path.join(ROOT, "dist");
const API = path.join(ROOT, "api");

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".avif": "image/avif", ".png": "image/png", ".jpg": "image/jpeg",
  ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml",
};

/** La couche Vercel : res.status(n).json(o) / .send(s) / .end(). */
function vercelRes(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { res.setHeader("Content-Type", "application/json; charset=utf-8"); res.end(JSON.stringify(obj)); return res; };
  res.send = (s) => { res.end(s); return res; };
  return res;
}

async function readBodyRaw(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks).toString("utf8");
}

/* ------------------------------------------------------------------ *
 *  FAUX UPSTASH (verification locale uniquement).
 *  api/lead.js et api/admin/leads.js parlent a Upstash par son API REST.
 *  On implemente ICI le strict minimum de ce contrat (LPUSH / LTRIM /
 *  LRANGE) en memoire, sur la meme route. Consequence : les VRAIS handlers
 *  tournent sans une ligne de changement, et on prouve toute la chaine
 *  capture -> stockage -> lecture au vestiaire. Seul le fournisseur est
 *  simule, jamais notre code.
 * ------------------------------------------------------------------ */
const FAKE_KV = new Map();
function fakeUpstash(cmd) {
  const [op, key, ...rest] = cmd;
  const list = FAKE_KV.get(key) || [];
  switch (String(op).toUpperCase()) {
    case "LPUSH": list.unshift(...rest); FAKE_KV.set(key, list); return list.length;
    case "LTRIM": FAKE_KV.set(key, list.slice(Number(rest[0]), Number(rest[1]) + 1)); return "OK";
    case "LRANGE": {
      const stop = Number(rest[1]);
      return list.slice(Number(rest[0]), stop < 0 ? undefined : stop + 1);
    }
    default: throw new Error("commande non simulee : " + op);
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(url.pathname);

  /* ---- le faux Upstash, sur sa propre route ---- */
  if (pathname === "/__kv") {
    const raw = await readBodyRaw(req);
    try {
      const result = fakeUpstash(JSON.parse(raw));
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ result }));
    } catch (e) { res.statusCode = 400; res.end(JSON.stringify({ error: e.message })); }
    return;
  }

  /* ---- les fonctions serverless ---- */
  if (pathname.startsWith("/api/")) {
    const rel = pathname.slice(5).replace(/\/$/, "");
    const file = path.join(API, rel + ".js");
    if (!fs.existsSync(file)) { res.statusCode = 404; res.end("no such function"); return; }
    try {
      const mod = await import(pathToFileURL(file).href + "?t=" + Date.now());
      const raw = await readBodyRaw(req);
      req.body = raw ? (() => { try { return JSON.parse(raw); } catch { return raw; } })() : undefined;
      req.query = Object.fromEntries(url.searchParams);
      await mod.default(req, vercelRes(res));
    } catch (e) {
      console.error("[api]", pathname, e);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: String(e && e.message) }));
    }
    return;
  }

  /* ---- les fichiers statiques ---- */
  if (pathname.endsWith("/")) pathname += "index.html";
  let file = path.join(DIST, pathname);
  if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const idx = path.join(file, "index.html");
    if (fs.existsSync(idx)) file = idx;
    else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(fs.existsSync(path.join(DIST, "404.html")) ? fs.readFileSync(path.join(DIST, "404.html")) : "404");
      return;
    }
  }
  res.setHeader("Content-Type", MIME[path.extname(file)] || "application/octet-stream");
  // serveur de VÉRIFICATION : jamais de cache, sinon on mesure la version d avant
  res.setHeader("Cache-Control", "no-store");
  res.end(fs.readFileSync(file));
});

server.listen(PORT, () => console.log(`dist + api servis sur http://localhost:${PORT}`));
