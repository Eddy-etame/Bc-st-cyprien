# Boxing Center Saint-Cyprien

Site vitrine de la salle Boxing Center Saint-Cyprien (Toulouse, rive gauche), construit avec [Astro](https://astro.build). Les pages reprennent la maquette validée à l'identique : HTML, CSS et JavaScript sont servis tels quels, sans transformation.

## Commandes

```bash
npm install      # installer les dépendances
npm run dev      # serveur de développement (http://localhost:4321)
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
```

## Structure

- `src/pages/` — les pages du site (accueil, activités, coachs, contact, galerie, la salle, plannings, tarifs, 404)
- `public/assets/` — CSS, JavaScript et images, copiés au byte près depuis la maquette
- `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt` — fichiers SEO

## Déploiement

Importer le repo dans Vercel — le framework Astro est détecté automatiquement, aucune configuration supplémentaire n'est nécessaire.

Le fichier `vercel.json` porte les en-têtes de sécurité (HSTS, CSP, X-Frame-Options, etc.) ; ils sont appliqués par Vercel au moment du déploiement.
