# Boxing Center Saint-Cyprien

Site vitrine de la salle Boxing Center Saint-Cyprien (11 rue Sainte-Lucie, 31300 Toulouse — rive gauche), construit avec [Astro](https://astro.build). Les pages reprennent la maquette validée : HTML, CSS et JavaScript sont servis tels quels.

## Commandes

```bash
npm install      # installer les dépendances
npm run dev      # serveur de développement (http://localhost:4321)
npm run build    # pré-build du contenu + build de production dans dist/
npm run preview  # prévisualiser le build
```

Pour vérifier le site **avec les fonctions serverless** (assistant, capture de contacts, backoffice) sans déployer :

```bash
npm run build
ADMIN_TOKEN="un-mot-de-passe" node scripts/serve-with-api.mjs 6901 .
```

Ce serveur sert `dist/` et exécute les **vrais** handlers de `api/` — il n'ajoute que la fine couche que Vercel fournit en production (`req.body` parsé, `res.status().json()`).

## Structure

- `src/pages/` — les pages (accueil, la salle, activités, coachs, galerie, planning, tarifs, contact, 404)
- `public/assets/` — CSS, JavaScript et images
- `public/assets/js/data.js` — **la source de vérité du contenu** (adresse, disciplines, planning, coachs, offres)
- `public/admin/` — le backoffice « Le vestiaire » (hors routage Astro)
- `api/` — les fonctions serverless Vercel
- `scripts/apply-content.mjs` — pré-build : injecte le contenu publié au vestiaire dans le site

---

## L'assistant (chatbot)

La pastille en bas à droite est un vrai dialogue. Elle reste un lien `tel:` dans le HTML ; le module `public/assets/js/chatbot.js` la **remplace** par un bouton qui ouvre le panneau. Script bloqué ⇒ la pastille appelle la salle : rien ne régresse.

**Ce qu'il fait**

1. Il se présente et demande le prénom.
2. Il répond via `POST /api/chat` — prompt système **ancré** sur les faits réels de la salle (`api/_lib/salle.js`), avec consigne explicite de ne jamais inventer un prix, un horaire ou un nom de coach.
3. Il capte **au fil de la conversation** le prénom (« je m'appelle X », « moi c'est X », ou un mot simple juste après avoir demandé le prénom), l'e-mail et le téléphone français.
4. Dès qu'il a un moyen de rappel, il envoie le contact à `POST /api/lead`. Une signature anti-doublon empêche d'envoyer deux fois le même état.
5. Une seule relance douce, après deux échanges sans coordonnées. Puis plus rien.

**Sans aucune clé IA**, `/api/chat` répond 503 et le widget bascule sur sa base de connaissance locale (`chatbot-kb.js`) : réponses ancrées sur les vrais faits, jamais une bulle vide.

**Accessibilité** : `role="dialog"` + `aria-modal`, focus piégé, Échap ferme et rend le focus à la pastille, `aria-live="polite"` sur le fil, `prefers-reduced-motion` respecté.

## Où vont les contacts ?

`api/lead.js` a trois voies, toutes optionnelles et cumulables. **Aucune configurée ⇒ la fonction répond quand même 200 et journalise le contact** : le parcours visiteur ne casse jamais.

| Voie | Variables d'environnement | Effet |
|---|---|---|
| **Carnet** (recommandé) | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Les contacts sont stockés et **relus dans le vestiaire** (section « Les contacts »). Upstash a un palier gratuit et s'appelle en REST — aucune dépendance npm. |
| **E-mail** | `RESEND_API_KEY`, `LEAD_EMAIL_TO` (défaut `boxingcenter31@gmail.com`), `LEAD_EMAIL_FROM` | Une notification par contact. |
| **Webhook** | `LEAD_WEBHOOK_URL` | POST JSON brut (Zapier, Make, CRM…). |

## Le backoffice « Le vestiaire » — `/admin/`

Protégé par `ADMIN_TOKEN` **côté serveur uniquement** : le mot de passe voyage dans l'en-tête `x-admin-token` et n'est gardé que le temps de l'onglet. Aucun secret dans le front.

Le staff y règle les coordonnées, les tarifs, les coachs et le planning, et consulte les contacts. Une visite guidée se lance au premier login, et six assistants pas à pas couvrent les tâches courantes.

**Comment le contenu arrive sur le site** — sans jamais ralentir le rendu :

1. « Publier » envoie le contenu à `POST /api/admin/content`, qui **commit `public/content.json`** sur GitHub.
2. Le hook de déploiement relance Vercel.
3. Au build, `scripts/apply-content.mjs` transforme ce JSON en module ES statique (`content-overrides.js`).
4. `data.js` le fusionne à la fin de son évaluation. Coût à l'exécution : **nul** — pas de `fetch` au démarrage, donc pas un millième de seconde de retard au premier rendu.

Deux champs sont **recalculés** si le staff les oublie : l'adresse complète et le lien `tel:`. Un numéro affiché qui ne correspond pas au numéro composé est un piège — `site.js` réaligne d'ailleurs *tous* les liens `tel:` de la page sur `SALLE`.

### Variables d'environnement (Vercel)

| Variable | Rôle | Sans elle |
|---|---|---|
| `ADMIN_TOKEN` | mot de passe du vestiaire | le backoffice refuse tout le monde |
| `GITHUB_TOKEN`, `GITHUB_REPO` | écriture de `public/content.json` | on peut tout préparer, pas publier (le vestiaire le dit en clair) |
| `GITHUB_BRANCH` | branche cible (défaut `main`) | — |
| `VERCEL_DEPLOY_HOOK` | relance le déploiement après publication | la publication attend le prochain déploiement |
| `GEMINI_API_KEY*`, `GROQ_API_KEY`, `MISTRAL_API_KEY` | les fournisseurs IA, essayés dans cet ordre | l'assistant répond depuis sa base locale |
| `UPSTASH_REDIS_REST_*` | le carnet de contacts | les contacts partent par e-mail / webhook, ou sont journalisés |
| `RESEND_API_KEY`, `LEAD_EMAIL_TO` | notification par e-mail | — |
| `LEAD_WEBHOOK_URL` | relais vers un CRM | — |

Plusieurs clés Gemini sont acceptées (`GEMINI_API_KEY`, `GEMINI_API_KEY_2`, …) : elles sont mélangées à chaque appel et les clés mortes sont sautées.

## Maillage de marque (SEO)

Les liens vers le réseau propriétaire sont **volontairement en `follow`** (`target="_blank" rel="noopener"`, sans `nofollow`) : c'est du jus de marque qu'on donne exprès.

- **Nav** (≥1180px) et **menu** : le groupe + la boutique.
- **Pied de page**, sur les 8 pages : colonne « Le réseau », colonne « Suivre », et la ligne des quatre salles sœurs rendue depuis `NETWORK`.
- **JSON-LD** : `subOrganization` (les quatre sœurs) sur l'`Organization`, `isPartOf` + `parentOrganization` sur la salle. Les `@id` existants n'ont pas bougé.

## Déploiement

Importer le repo dans Vercel — Astro est détecté automatiquement, et le dossier `api/` est servi comme fonctions serverless à côté du build statique.

`vercel.json` porte les en-têtes de sécurité (HSTS, CSP, X-Frame-Options…), le `Cache-Control` par type d'asset (polices immuables un an, images 30 jours avec `stale-while-revalidate`, CSS/JS une semaine) et le `X-Robots-Tag: noindex` sur `/admin/` et `/api/`.
