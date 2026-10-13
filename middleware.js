/* Canonicalisation avant le système de fichiers statiques de Vercel.
   Elle ferme le doublon bc-st-cyprien.vercel.app que les seules règles
   vercel.json ne redirigent pas encore sur le déploiement public. */
export const config = {
  matcher: ["/((?!api/|assets/|fonts/|admin|.*\\.[a-zA-Z0-9]+$).*)"],
};

const HOTE_CANONIQUE = "club-boxe-toulouse.com";
const HOTE_TECHNIQUE = "bc-st-cyprien.vercel.app";

function cheminCanonique(chemin) {
  return chemin === "/" || chemin.endsWith("/") ? chemin : chemin + "/";
}

function redirection(url, technique = false) {
  return new Response(null, {
    status: 308,
    headers: {
      Location: url.toString(),
      "Cache-Control": "public, max-age=0, must-revalidate",
      ...(technique ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
    },
  });
}

export default function middleware(request) {
  const url = new URL(request.url);

  if (url.hostname === HOTE_TECHNIQUE || url.hostname === `www.${HOTE_CANONIQUE}`) {
    const technique = url.hostname === HOTE_TECHNIQUE;
    url.hostname = HOTE_CANONIQUE;
    url.protocol = "https:";
    url.port = "";
    url.pathname = cheminCanonique(url.pathname);
    return redirection(url, technique);
  }

  if (url.hostname === HOTE_CANONIQUE && url.pathname !== cheminCanonique(url.pathname)) {
    url.pathname = cheminCanonique(url.pathname);
    return redirection(url);
  }
}
