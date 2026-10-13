/* =====================================================================
   SAINT-CYPRIEN · discipline.js — les pages /activites/<slug>/ (13/10/2026)

   Tout le contenu est déjà dans le HTML (rendu au build depuis data.js) :
   ce module ne peint rien. Il fait deux choses.

   1. Il lance le moteur commun (site.js) : apparitions au défilement,
      lumière sur l'en-tête, vie au toucher.
   2. Il dit QUEL est le prochain cours de la discipline, à l'heure de
      Paris : le jour d'aujourd'hui s'allume, les créneaux passés pâlissent,
      et une ligne annonce « Prochain cours : jeudi à 20h00 ». Comme sur la
      semaine de l'accueil — calculé chez le visiteur, jamais écrit en dur.

   Filet : si site.js n'a pas pu se charger, on retire la classe `fx` pour
   que rien ne reste masqué en attendant une animation qui ne viendra pas.
   ===================================================================== */

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const minutes = (t) => { const m = String(t).match(/(\d{1,2})h(\d{2})/); return m ? +m[1] * 60 + +m[2] : NaN; };

function prochainCours() {
  const live = document.getElementById("dp-live");
  const cols = [...document.querySelectorAll(".dp-jour[data-jour]")];
  if (!live || !cols.length) return;
  let parts;
  try {
    parts = Object.fromEntries(new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris", weekday: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  } catch { return; }
  const aujourdhui = JOURS.indexOf(String(parts.weekday || "").toLowerCase());
  if (aujourdhui < 0) return;
  const maintenant = +parts.hour * 60 + +parts.minute;
  const dire = (li, quand) => `${quand} à ${li.dataset.start} — ${li.querySelector(".dp-cours")?.textContent || ""}`;

  let annonce = "";
  const col = cols.find((c) => +c.dataset.jour === aujourdhui);
  if (col) {
    col.classList.add("is-today");
    let prochain = null;
    col.querySelectorAll("li[data-start]").forEach((li) => {
      if (minutes(li.dataset.start) <= maintenant) li.classList.add("is-past");
      else if (!prochain) prochain = li;
    });
    if (prochain) { prochain.classList.add("is-next"); annonce = dire(prochain, "Prochain cours : aujourd’hui"); }
  }
  if (!annonce) {
    for (let k = 1; k <= 7 && !annonce; k++) {
      const j = (aujourdhui + k) % 7;
      const c = cols.find((x) => +x.dataset.jour === j);
      const li = c && c.querySelector("li[data-start]");
      if (li) annonce = dire(li, `Prochain cours : ${k === 1 ? "demain" : JOURS[j]}`);
    }
  }
  if (annonce) { live.textContent = annonce; live.hidden = false; }
}

/* 3. LE PRIX QUI TOMBE — quand l'offre mise en avant entre à l'écran, son
   chiffre part de l'ancien prix (44,99 → 29) ou de zéro (295) et se pose
   sur le vrai ; le trait rouge barre l'ancien prix juste après. Le prix
   final est DÉJÀ écrit dans le HTML : sans JavaScript, sans
   IntersectionObserver ou en mouvement réduit, rien ne bouge et tout est
   juste. Le lecteur d'écran lit l'aria-label du prix, jamais le compteur. */
function prixQuiTombe() {
  const carte = document.querySelector(".dp-offre");
  const n = carte?.querySelector("[data-compte]");
  if (!n || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const fin = parseFloat(n.dataset.compte);
  const debut = parseFloat(n.dataset.depuis || "0");
  const texteFinal = n.textContent;
  if (!Number.isFinite(fin) || !Number.isFinite(debut)) return;
  const decimales = /,/.test(texteFinal) || !Number.isInteger(debut) ? 2 : 0;
  const ecrire = (v) => { n.textContent = v.toFixed(decimales).replace(".", ","); };
  carte.classList.add("dp-pret");
  ecrire(debut);
  const io = new IntersectionObserver((vus) => {
    if (!vus.some((v) => v.isIntersecting)) return;
    io.disconnect();
    carte.classList.add("is-vu");
    const duree = 1300, t0 = performance.now();
    const pas = (t) => {
      const k = Math.min(1, (t - t0) / duree);
      const e = 1 - Math.pow(1 - k, 4);
      if (k < 1) { ecrire(debut + (fin - debut) * e); requestAnimationFrame(pas); }
      else n.textContent = texteFinal;
    };
    requestAnimationFrame(pas);
  }, { threshold: 0.25 });
  io.observe(carte);
}

function boot() {
  prochainCours();
  prixQuiTombe();
  const BC = window.BC;
  if (!BC) { document.documentElement.classList.remove("fx"); return; }
  BC.reveal(document);
  BC.magnetic(document);
  BC.spotlight(".phero", ".phero__spot");
  BC.touchLife();
  const start = () => BC.refresh();
  window.addEventListener("load", start);
  setTimeout(start, 500);
}

/* site.js est un module chargé AVANT celui-ci : window.BC existe déjà quand
   ce fichier s'exécute. S'il a échoué, le filet ci-dessus rend la page. */
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
