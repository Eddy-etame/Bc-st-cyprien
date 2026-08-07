/* =====================================================================
   LE MUR DU CLUB — la galerie participative de Saint-Cyprien.

   Ce module ne descend PAS au premier rendu : galerie.js ne l’appelle que
   lorsque la section approche du cadre (cf. la fin de galerie.js). Et le
   formulaire, lui, n’est chargé qu’au clic sur « Déposer » — c’est un
   troisième fichier, community-form.js. Le CSS suit la même discipline :
   community.css est injecté par ce module, pas par le <head> de la page.
   Résultat : un visiteur qui vient regarder les photos de la salle ne
   télécharge ni le mur, ni sa feuille de style, ni le formulaire tant qu’il
   ne les demande pas.

   Chaîne complète : le navigateur demande une signature à /api/community/sign,
   envoie le fichier DIRECTEMENT à Cloudinary avec cette signature (tag
   "pending"), et le staff approuve depuis le vestiaire. Seul "approved"
   s’affiche ici.
   ===================================================================== */

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* -------------------------------------------------------------------- *
 *  LA FEUILLE DU MUR — elle descend ICI, jamais dans le <head> de la page.
 *  C’est la moitié CSS de la règle : /galerie/ au premier rendu ne demande
 *  ni community.js ni community.css. On ATTEND qu’elle soit posée avant de
 *  peindre quoi que ce soit — une vignette qui apparaît nue puis se rhabille,
 *  c’est une régression, même d’un dixième de seconde. Le garde-temps de
 *  2 s est là pour qu’un réseau qui traîne retarde le mur sans jamais
 *  l’empêcher : au pire il s’habille un instant plus tard.
 * -------------------------------------------------------------------- */
let stylesPromis = null;
function chargerStyles() {
  if (stylesPromis) return stylesPromis;
  const href = "/assets/css/community.css?v=22";
  if (document.querySelector(`link[href^="/assets/css/community.css"]`)) return (stylesPromis = Promise.resolve());
  stylesPromis = new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = resolve;
    document.head.appendChild(link);
    setTimeout(resolve, 2000);
  });
  return stylesPromis;
}

/* Les états « vides » sont ÉCRITS : un mur sans photo doit avoir l’air d’un
   mur qui attend, jamais d’une page cassée. */
function vide(grid, texte) {
  grid.innerHTML = `<p class="club__empty">${texte}</p>`;
}

async function peindreMur(grid) {
  grid.innerHTML = `<div class="club__skel"></div><div class="club__skel"></div><div class="club__skel"></div>`;
  let data;
  try {
    const r = await fetch("/api/community/items");
    if (!r.ok) throw new Error();
    data = await r.json();
  } catch {
    vide(grid, "Le mur ne répond pas pour l’instant. Reviens tout à l’heure — il n’a pas bougé.");
    return;
  }

  const items = data.items || [];
  if (!items.length) {
    vide(grid, data.branche === false
      ? "Le mur ouvre très bientôt. En attendant, montre ta photo à l’accueil, on la mettra dessus."
      : "Personne n’a encore posté. Sois le premier — la place est libre.");
    return;
  }

  /* preload="none" + loading="lazy" : rien ne se télécharge tant que la
     vignette n’entre pas dans le cadre. Le mur peut grossir sans peser. */
  grid.innerHTML = items.map((it) => {
    const signature = `${esc(it.legende || "Le club")}${it.auteur ? ` · ${esc(it.auteur)}` : ""}`;
    const media = it.type === "video"
      ? `<video src="${esc(it.src)}" poster="${esc(it.poster)}" muted loop playsinline preload="none" aria-label="${signature}"></video>
         <span class="club__play" aria-hidden="true">▶</span>`
      : `<img src="${esc(it.src)}" alt="${signature}" loading="lazy" decoding="async" />`;
    return `<figure class="club__item club__item--${it.type}">
      ${media}
      <figcaption class="club__cap">${signature}</figcaption>
    </figure>`;
  }).join("");

  /* Les vidéos ne se lancent qu’une fois visibles, et s’arrêtent en sortant :
     six clips qui tournent en fond, c’est une batterie vidée pour rien. */
  const vids = grid.querySelectorAll("video");
  if (vids.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) { if (v.preload === "none") v.preload = "metadata"; }
        else v.pause();
      });
    }, { threshold: 0.15, rootMargin: "80px" });
    vids.forEach((v) => {
      io.observe(v);
      const fig = v.closest(".club__item");
      fig.addEventListener("pointerenter", () => { v.preload = "auto"; v.play().catch(() => {}); });
      fig.addEventListener("pointerleave", () => v.pause());
    });
  }
}

export async function initCommunity() {
  const root = document.getElementById("club");
  if (!root) return;
  const grid = root.querySelector("#club-grid");
  const ouvrir = root.querySelector("#club-open");
  if (!grid) return;

  await chargerStyles();
  peindreMur(grid);

  /* LE FORMULAIRE — troisième chargement paresseux : il n’existe qu’au clic. */
  if (ouvrir) {
    let charge = false;
    ouvrir.addEventListener("click", async () => {
      if (charge) return;
      charge = true;
      ouvrir.disabled = true;
      const libelle = ouvrir.querySelector("span");
      const avant = libelle.textContent;
      libelle.textContent = "Un instant…";
      try {
        const mod = await import("/assets/js/community-form.js?v=22");
        mod.monterFormulaire(root, () => peindreMur(grid));
        ouvrir.remove();
      } catch {
        charge = false;
        ouvrir.disabled = false;
        libelle.textContent = avant;
        const st = root.querySelector("#club-status");
        if (st) { st.textContent = "Le formulaire n’a pas voulu descendre. Recharge la page et retente."; st.dataset.kind = "err"; }
      }
    });
  }
}
