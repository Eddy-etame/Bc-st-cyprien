/* =====================================================================
   CLOUDINARY, EN NATIF — stockage + transcodage + base (par tags) + modération
   de la galerie participative. Même fournisseur et même grammaire que Portet
   (dossier, tags "pending"/"approved", contexte), mais SANS le paquet npm :
   les fonctions de ce dépôt tiennent la règle « zéro dépendance, fetch et
   crypto natifs ». Tout ce dont on a besoin tient en trois primitives :

     · sign()        — la signature SHA-1 que Cloudinary attend (paramètres
                       triés, `k=v` collés par &, puis le secret) ;
     · search()      — l'API d'administration (auth Basic) : c'est NOTRE base
                       de données, interrogée par tags ;
     · tag/destroy() — l'API d'envoi signée : approuver, refuser.

   Configuré par UNE variable : CLOUDINARY_URL
   (cloudinary://<api_key>:<api_secret>@<cloud_name>).
   Non configurée ⇒ ready() est faux et l'appelant le dit honnêtement, sans
   jamais casser la page publique.
   ===================================================================== */
import { createHash } from "crypto";

/** cloudinary://key:secret@cloud → { cloudName, apiKey, apiSecret } */
function parseUrl() {
  const raw = process.env.CLOUDINARY_URL || "";
  const m = raw.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!m) return null;
  return { apiKey: decodeURIComponent(m[1]), apiSecret: decodeURIComponent(m[2]), cloudName: m[3].trim() };
}

export const config = () => parseUrl();
export const ready = () => Boolean(parseUrl());

/** Le dossier de CETTE salle. Une salle = un dossier, jamais de mélange. */
export const FOLDER = process.env.COMMUNITY_FOLDER || "bc-st-cyprien-community";

/* Les garde-fous. Ils sont ici (et pas dans le front) pour que le serveur
   reste la référence : le navigateur affiche les mêmes chiffres, il ne les
   décide pas. */
export const LIMITS = {
  maxImageMo: +(process.env.COMMUNITY_MAX_IMAGE_MO || 12),
  maxVideoMo: +(process.env.COMMUNITY_MAX_VIDEO_MO || 80),
  maxDureeSec: +(process.env.COMMUNITY_MAX_DUREE_SEC || 15),
};

/** La signature Cloudinary : paramètres triés, `k=v` joints par &, + secret, SHA-1. */
export function sign(params, apiSecret) {
  const base = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== "")
    .sort()
    .map((k) => `${k}=${Array.isArray(params[k]) ? params[k].join(",") : params[k]}`)
    .join("&");
  return createHash("sha1").update(base + apiSecret).digest("hex");
}

const basic = (c) => "Basic " + Buffer.from(`${c.apiKey}:${c.apiSecret}`).toString("base64");

/** L'API d'administration — c'est notre lecture de base (expression = requête). */
export async function search(expression, { max = 60, sort = "desc" } = {}) {
  const c = parseUrl();
  if (!c) throw new Error("CLOUDINARY_URL absente");
  const r = await fetch(`https://api.cloudinary.com/v1_1/${c.cloudName}/resources/search`, {
    method: "POST",
    headers: { Authorization: basic(c), "Content-Type": "application/json" },
    body: JSON.stringify({
      expression,
      sort_by: [{ created_at: sort }],
      max_results: max,
      with_field: ["context", "tags"],
    }),
  });
  if (!r.ok) throw new Error(`Cloudinary search ${r.status}`);
  return r.json();
}

/** Poser / retirer un tag (API d'envoi, signée). */
export async function tag(command, tagName, publicIds, resourceType = "image") {
  const c = parseUrl();
  if (!c) throw new Error("CLOUDINARY_URL absente");
  const timestamp = Math.round(Date.now() / 1000);
  const toSign = { command, public_ids: publicIds, tag: tagName, timestamp };
  const body = new URLSearchParams();
  body.set("command", command);
  body.set("tag", tagName);
  for (const id of publicIds) body.append("public_ids[]", id);
  body.set("timestamp", String(timestamp));
  body.set("api_key", c.apiKey);
  body.set("signature", sign(toSign, c.apiSecret));
  const r = await fetch(`https://api.cloudinary.com/v1_1/${c.cloudName}/${resourceType}/tags`, { method: "POST", body });
  if (!r.ok) throw new Error(`Cloudinary tags ${r.status}`);
  return r.json();
}

/** Supprimer définitivement un média (le refus de modération). */
export async function destroy(publicId, resourceType = "image") {
  const c = parseUrl();
  if (!c) throw new Error("CLOUDINARY_URL absente");
  const timestamp = Math.round(Date.now() / 1000);
  const body = new URLSearchParams();
  body.set("public_id", publicId);
  body.set("timestamp", String(timestamp));
  body.set("api_key", c.apiKey);
  body.set("signature", sign({ public_id: publicId, timestamp }, c.apiSecret));
  const r = await fetch(`https://api.cloudinary.com/v1_1/${c.cloudName}/${resourceType}/destroy`, { method: "POST", body });
  if (!r.ok) throw new Error(`Cloudinary destroy ${r.status}`);
  return r.json();
}

/** L'URL de livraison, transformations comprises (q_auto/f_auto = le poids en moins). */
export function url(publicId, { resourceType = "image", tr = "q_auto,f_auto", ext = "" } = {}) {
  const c = parseUrl();
  if (!c) return "";
  const id = ext ? `${publicId}.${ext}` : publicId;
  return `https://res.cloudinary.com/${c.cloudName}/${resourceType}/upload/${tr}/${id}`;
}

/* ------------------------------------------------------------------ *
 *  LA FORME PUBLIQUE d'un média. Elle ne sort QUE ce que le mur affiche :
 *  le prénom et la légende. Ni l'e-mail, ni le téléphone, ni l'IP du
 *  contributeur ne quittent le serveur — ces trois-là ne vivent que dans
 *  le carnet de contacts, derrière le mot de passe du staff.
 * ------------------------------------------------------------------ */
export function publicItem(r) {
  const ctx = (r.context && (r.context.custom || r.context)) || {};
  const video = r.resource_type === "video";
  return {
    id: r.public_id,
    type: video ? "video" : "image",
    auteur: ctx.author || "",
    legende: ctx.title || "",
    src: url(r.public_id, { resourceType: r.resource_type, tr: video ? "q_auto" : "q_auto,f_auto,w_900,c_limit" }),
    poster: video ? url(r.public_id, { resourceType: "video", tr: "q_auto,f_auto,so_0", ext: "jpg" }) : "",
    largeur: r.width || 0,
    hauteur: r.height || 0,
    duree: r.duration ? Math.round(r.duration * 10) / 10 : 0,
    le: r.created_at,
  };
}
