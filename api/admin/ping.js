/* =====================================================================
   GET /api/admin/ping — la seule question posée à la connexion :
   « ce mot de passe est-il le bon ? »

   Elle est volontairement SÉPARÉE de /api/admin/content : sinon un
   GITHUB_TOKEN manquant ferait refuser un mot de passe pourtant correct,
   et le staff chercherait son erreur là où elle n'est pas. La réponse dit
   aussi ce qui est configuré, pour que le vestiaire explique honnêtement
   ce qu'il peut et ne peut pas faire — sans jamais divulguer une valeur.
   ===================================================================== */
import { allowCors, isAdmin, kvReady } from "../_lib/util.js";

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!process.env.ADMIN_TOKEN)
    return res.status(503).json({ error: "Aucun mot de passe staff n'est configuré sur le serveur (variable ADMIN_TOKEN)." });
  if (!isAdmin(req)) return res.status(401).json({ error: "Mot de passe refusé." });

  return res.status(200).json({
    ok: true,
    capacites: {
      publication: Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO),
      redeploiement: Boolean(process.env.VERCEL_DEPLOY_HOOK),
      carnetContacts: kvReady(),
      emailContacts: Boolean(process.env.RESEND_API_KEY),
    },
  });
}
