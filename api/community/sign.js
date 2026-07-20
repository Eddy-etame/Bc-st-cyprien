/* =====================================================================
   POST /api/community/sign — le portier de la galerie du club.

   Il ne voit JAMAIS le fichier : les fonctions Vercel plafonnent à 4,5 Mo de
   corps de requête, et une vidéo de club en fait dix fois plus. Le navigateur
   envoie donc le média DIRECTEMENT à Cloudinary — mais uniquement avec les
   paramètres signés ici. C'est ce qui rend les règles inviolables : changer
   le dossier, retirer le tag "pending" ou enlever la coupe à 15 s casse la
   signature, et Cloudinary refuse l'envoi.

   Ce qu'il vérifie avant de signer :
     1. le prénom (obligatoire, passé au filtre à injures) ;
     2. un moyen de rappel : e-mail OU téléphone, au moins un des deux ;
     3. le type réel annoncé (image/* ou video/*) et le poids ;
     4. la durée annoncée pour une vidéo (le navigateur l'a mesurée) ;
     5. le nombre d'envois déjà faits depuis cette IP.

   Ce qu'il impose dans la signature :
     · folder  = le dossier de CETTE salle ;
     · tags    = "pending" — rien n'est publiable en sortant d'ici ;
     · transformation = "du_15" sur les vidéos : Cloudinary coupe à 15 s au
       moment d'enregistrer. Une vidéo trop longue ne peut donc pas exister
       dans le dossier, même si le navigateur a menti sur sa durée.
   ===================================================================== */
import { allowCors, readBody, cleanName, ipOf } from "../_lib/util.js";
import { config, ready, FOLDER, LIMITS, sign, search } from "../_lib/cloudinary.js";

const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const TEL_RE = /^\+?[0-9 ().-]{9,20}$/;

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!ready()) {
    return res.status(503).json({
      error: "Le mur n'est pas encore branché. Reviens dans quelques jours — ou apporte ta photo à l'accueil, on s'en occupe.",
    });
  }

  const b = readBody(req);

  /* 1. Le prénom — obligatoire. On ne publie pas d'anonyme sur le mur du club. */
  const prenom = cleanName(b.prenom, 40);
  if (prenom.value.length < 2) return res.status(400).json({ error: "Donne ton prénom : sur ce mur, on signe ce qu'on poste." });
  if (prenom.bad) return res.status(400).json({ error: "Ce prénom ne passe pas. Mets le vrai, ça ira plus vite." });

  /* 2. Un moyen de rappel — c'est la contrepartie : tu postes, on peut te répondre. */
  const email = String(b.email || "").trim().slice(0, 160);
  const phone = String(b.phone || "").trim().slice(0, 30);
  const emailOk = email ? EMAIL_RE.test(email) : false;
  const phoneOk = phone ? TEL_RE.test(phone) : false;
  if (!emailOk && !phoneOk) {
    return res.status(400).json({ error: "Laisse un e-mail ou un téléphone — c'est comme ça qu'on te prévient quand ta photo passe." });
  }

  /* 3. La légende — facultative, mais elle passe le même filtre. */
  const legende = cleanName(b.legende, 70);
  if (legende.bad) return res.status(400).json({ error: "Cette légende ne passe pas. Reformule et renvoie." });

  /* 4. Le type réel et le poids. `mime` vient du fichier lui-même (File.type),
        pas de l'extension : on refuse un .jpg qui n'est pas une image. */
  const mime = String(b.mime || "").toLowerCase();
  const estVideo = mime.startsWith("video/");
  const estImage = mime.startsWith("image/");
  if (!estVideo && !estImage) {
    return res.status(400).json({ error: "Photo ou vidéo, rien d'autre. Choisis un vrai fichier image ou vidéo." });
  }
  const octets = Number(b.octets || 0);
  const maxMo = estVideo ? LIMITS.maxVideoMo : LIMITS.maxImageMo;
  if (!octets || octets > maxMo * 1024 * 1024) {
    return res.status(400).json({ error: `Trop lourd : ${maxMo} Mo maximum pour ${estVideo ? "une vidéo" : "une photo"}.` });
  }

  /* 5. La durée annoncée. Le navigateur l'a mesurée sur le fichier ; on la
        recoupe ici, et la coupe imposée dans la signature fait le reste. */
  const duree = Number(b.duree || 0);
  if (estVideo && duree > LIMITS.maxDureeSec + 0.5) {
    return res.status(400).json({ error: `${LIMITS.maxDureeSec} secondes maximum. Garde le meilleur passage, il n'en faut pas plus.` });
  }

  /* 6. Le garde-fou par IP — la même main ne remplit pas le mur toute seule. */
  const ip = ipOf(req);
  const fenetreMin = +(process.env.COMMUNITY_RATE_WINDOW_MIN || 15);
  const maxParFenetre = +(process.env.COMMUNITY_RATE_MAX || 4);
  try {
    const depuis = new Date(Date.now() - fenetreMin * 60000).toISOString();
    const r = await search(`folder:${FOLDER} AND context.ip="${ip}" AND uploaded_at>"${depuis}"`, { max: maxParFenetre + 1 });
    const n = r.total_count ?? (r.resources || []).length;
    if (n >= maxParFenetre) {
      return res.status(429).json({ error: `Doucement — ${maxParFenetre} envois par ${fenetreMin} minutes. Reviens tout à l'heure.` });
    }
  } catch {
    /* La recherche est un confort, pas une serrure : si Cloudinary ne répond
       pas, on laisse passer plutôt que de bloquer un membre de bonne foi.
       La modération reste, elle, obligatoire. */
  }

  /* 7. La signature. Tout ce qui compte est DEDANS. */
  const c = config();
  const timestamp = Math.round(Date.now() / 1000);
  const context = `title=${legende.value}|author=${prenom.value}|ip=${ip}`;
  const aSigner = { context, folder: FOLDER, tags: "pending", timestamp };
  if (estVideo) aSigner.transformation = `du_${LIMITS.maxDureeSec}`; // la coupe, scellée
  const signature = sign(aSigner, c.apiSecret);

  return res.status(200).json({
    cloudName: c.cloudName,
    apiKey: c.apiKey,
    resourceType: estVideo ? "video" : "image",
    timestamp,
    folder: FOLDER,
    tags: "pending",
    context,
    transformation: aSigner.transformation || "",
    signature,
  });
}
