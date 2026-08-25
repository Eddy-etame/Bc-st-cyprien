/* =====================================================================
   SAINT-CYPRIEN · activites.js — le défilement construit la page.
   ---------------------------------------------------------------------
   Un seul rôle : dire QUAND une activité entre en scène. Le mouvement
   lui-même est entièrement en CSS (voir activites.css) — le compositeur
   le joue sans repasser par le fil principal, et `prefers-reduced-motion`
   le coupe sans une ligne de JavaScript.

   TROIS DÉCISIONS QUI COMPTENT :

   1. LE MOUVEMENT EST ARMÉ PAR LE SCRIPT, PAS PAR LE MARKUP.
      Les états de départ sont accrochés à `data-act="on"`, posé ici.
      Si ce fichier ne se charge pas — erreur réseau, JavaScript coupé,
      robot d'indexation — aucun élément n'est masqué et la page reste
      entièrement lisible. Masquer d'abord et révéler ensuite, c'est
      prendre le risque d'une page blanche pour un effet.

   2. ON RELÂCHE APRÈS L'ARRIVÉE.
      `unobserve` dès que l'élément est en place : il ne rejouera jamais
      son entrée en remontant, et l'observateur cesse de le suivre. C'est
      la « stabilité » demandée — entrée, positionnement, plus rien.

   3. LE DÉCLENCHEMENT EST BAS DANS L'ÉCRAN.
      Une marge négative de 12 % en bas : l'activité démarre quand elle
      est franchement entrée, pas au moment où son premier pixel affleure.
      Sinon tout est déjà joué avant qu'on ait eu le temps de regarder.
   ===================================================================== */

const reduit = matchMedia("(prefers-reduced-motion: reduce)").matches;

function scene() {
  const cibles = document.querySelectorAll("[data-act]:not([data-act='on'])");
  if (!cibles.length) return;

  /* Sans IntersectionObserver (ou en mouvement réduit), on ne masque
     rien du tout : la page s'affiche telle quelle. */
  if (!("IntersectionObserver" in window)) return;

  const vu = new IntersectionObserver((entrees, obs) => {
    for (const e of entrees) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("is-in");
      obs.unobserve(e.target);          // arrivé = relâché
    }
  }, { threshold: 0.15, rootMargin: "0px 0px -12% 0px" });

  const armes = [];
  for (const el of cibles) {
    el.dataset.act = "on";              // arme les états de départ
    /* Ce qui est DÉJÀ à l'écran au chargement n'a pas à s'animer :
       on le pose en place tout de suite. Une page qui démarre en
       animant ce que l'on regarde déjà donne l'impression de ramer. */
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * 0.85 && r.bottom > 0) {
      el.classList.add("is-in");
      continue;
    }
    vu.observe(el);
    armes.push(el);
  }

  /* ---- LE FILET ----------------------------------------------------
     Un observateur peut ne jamais tirer : élément dans un conteneur
     transformé, remesure ratée après un changement de mise en page,
     défilement piloté par une librairie. Le résultat est le pire qui
     soit — une section À OPACITÉ ZÉRO qui garde sa hauteur : le
     visiteur voit un grand vide et ne saura jamais qu'il manque
     quelque chose. C'est exactement ce qui est arrivé ici (les
     équipements et le titre du gong).

     On repasse donc derrière, au défilement : tout ce qui est armé,
     entré dans l'écran, et toujours masqué, on le révèle. La liste se
     vide au fur et à mesure, et le balayage s'arrête quand elle est
     vide — pas de veille inutile. */
  if (!armes.length) return;
  let planifie = false;
  const balayer = () => {
    planifie = false;
    for (let i = armes.length - 1; i >= 0; i--) {
      const el = armes[i];
      if (el.classList.contains("is-in")) { armes.splice(i, 1); continue; }
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.92 && r.bottom > 0) {
        el.classList.add("is-in");
        vu.unobserve(el);
        armes.splice(i, 1);
      }
    }
    if (!armes.length) removeEventListener("scroll", surDefilement);
  };
  const surDefilement = () => {
    if (planifie) return;
    planifie = true;
    requestAnimationFrame(balayer);
  };
  addEventListener("scroll", surDefilement, { passive: true });
}

if (reduit) {
  /* mouvement réduit : on n'arme rien, tout est visible d'emblée */
} else if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scene);
} else {
  scene();
}
