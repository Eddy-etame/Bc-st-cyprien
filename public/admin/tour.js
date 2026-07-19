/* =====================================================================
   LE VESTIAIRE — les visites guidées.

   Le moteur assombrit tout l'écran SAUF la cible : quatre panneaux autour
   d'un trou. La cible reste cliquable, le reste est bloqué — impossible de
   se perdre. Deux natures d'étape :
     · info   → un bouton « Compris » fait avancer ;
     · action → AUCUN bouton : l'utilisateur fait le geste demandé (clic,
                saisie) et la visite avance toute seule.
   C'est la différence entre expliquer et faire faire. Ici on fait faire.

   `runFlow(steps)` exécute n'importe quel parcours : la grande visite du
   premier login comme les six assistants de l'accueil.
   ===================================================================== */

const TOUR_KEY = "bcsc:tour:v1";
let FLOW = null;

const tel = (t, a = {}, ...kids) => {
  const n = document.createElement(t);
  for (const k in a) {
    if (a[k] == null) continue;
    if (k === "class") n.className = a[k];
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), a[k]);
    else n.setAttribute(k, a[k]);
  }
  for (const c of kids) if (c != null) n.append(c.nodeType ? c : document.createTextNode(c));
  return n;
};

/* ---------- le moteur ---------- */
function runFlow(steps, opts = {}) {
  if (!steps || !steps.length) return;
  endFlow();
  const blockers = [0, 1, 2, 3].map(() => { const d = tel("div", { class: "tour-block" }); document.body.append(d); return d; });
  const spot = tel("div", { class: "tour-spot" });
  const card = tel("div", { class: "tour-card", role: "dialog", "aria-live": "polite" });
  document.body.append(spot, card);
  FLOW = { steps, i: 0, spot, card, blockers, opts, off: null };
  addEventListener("resize", placeFlow);
  addEventListener("scroll", placeFlow, true);
  document.addEventListener("keydown", flowKey);
  showStep();
}
function endFlow() {
  if (!FLOW) return;
  FLOW.off?.();
  FLOW.spot.remove(); FLOW.card.remove(); FLOW.blockers.forEach((b) => b.remove());
  removeEventListener("resize", placeFlow);
  removeEventListener("scroll", placeFlow, true);
  document.removeEventListener("keydown", flowKey);
  const done = FLOW.opts.onEnd; FLOW = null; done?.();
}
function flowKey(e) { if (e.key === "Escape") endFlow(); }
function nextStep() {
  FLOW.off?.(); FLOW.off = null;
  if (FLOW.i >= FLOW.steps.length - 1) return endFlow();
  FLOW.i++; showStep();
}
const targetOf = (step) => (step.sel ? document.querySelector(step.sel) : null);

function showStep() {
  const step = FLOW.steps[FLOW.i];
  step.do?.(); // prépare l'écran (changer de section, etc.)

  const { card } = FLOW;
  card.innerHTML = "";
  card.append(tel("h3", {}, step.t), tel("p", {}, step.b));
  const acts = tel("div", { class: "acts" });

  if (step.advanceOn) {
    card.append(tel("span", { class: "tour-hint" }, step.hint || "À toi de jouer"));
    acts.append(tel("button", { class: "tour-skip", type: "button", onclick: nextStep }, "Passer cette étape"));
    const h = (e) => {
      if (!e.target.closest(step.advanceOn.sel)) return;
      FLOW.off?.(); FLOW.off = null;
      setTimeout(nextStep, step.advanceOn.delay ?? 420); // on laisse l'écran réagir au geste
    };
    document.addEventListener(step.advanceOn.ev, h, true);
    FLOW.off = () => document.removeEventListener(step.advanceOn.ev, h, true);
  } else {
    acts.append(tel("button", { class: "tour-skip", type: "button", onclick: endFlow }, "Quitter"));
    acts.append(tel("button", { class: "btn btn--light sm", type: "button", onclick: nextStep },
      FLOW.i >= FLOW.steps.length - 1 ? "Terminer" : (step.ok || "Compris")));
  }
  card.append(tel("div", { class: "foot" },
    tel("span", { class: "dots" }, `${FLOW.i + 1} / ${FLOW.steps.length}`), acts));

  targetOf(step)?.scrollIntoView({ block: "center" });
  placeFlow();
  placeFlow();                      // 2e passe SYNCHRONE : la carte a maintenant
                                    // ses vraies dimensions, on peut la recadrer
  requestAnimationFrame(placeFlow); // 3e passe, en bonus (polices, images)
  card.querySelector("button")?.focus();
}

/* le projecteur, les quatre panneaux sombres et la carte */
function placeFlow() {
  if (!FLOW) return;
  const target = targetOf(FLOW.steps[FLOW.i]);
  const { spot, card, blockers: [top, bottom, left, right] } = FLOW;
  const put = (b, x, y, w, h) => Object.assign(b.style, { left: x + "px", top: y + "px", width: Math.max(0, w) + "px", height: Math.max(0, h) + "px" });
  const cw = card.offsetWidth || 360, ch = card.offsetHeight || 210;

  if (target) {
    const r = target.getBoundingClientRect(), p = 8;
    const hl = r.left - p, ht = r.top - p, hw = r.width + 2 * p, hh = r.height + 2 * p;
    /* DEAD-MAN : le projecteur part de width/height 0 et grandit par une
       transition CSS. Si le compositeur est gelé (onglet en arrière-plan,
       machine chargée), la transition ne démarre jamais : l'écran reste noir
       avec une carte et AUCUN halo — la visite a l'air cassée. On coupe donc
       la transition pour la PREMIÈRE mise en taille, puis on la rend.
       Mesuré : sans ça, largeur rendue = 0 alors que style.width = 409px. */
    const premierPlacement = !spot.dataset.placed;
    if (premierPlacement) { spot.style.transition = "none"; spot.dataset.placed = "1"; }
    Object.assign(spot.style, { opacity: 1, left: hl + "px", top: ht + "px", width: hw + "px", height: hh + "px" });
    if (premierPlacement) { void spot.offsetWidth; spot.style.transition = ""; }
    put(top, 0, 0, innerWidth, ht);
    put(bottom, 0, ht + hh, innerWidth, innerHeight - (ht + hh));
    put(left, 0, ht, hl, hh);
    put(right, hl + hw, ht, innerWidth - (hl + hw), hh);
    /* La carte ne doit JAMAIS recouvrir le trou qu'elle désigne : sinon on
       demande à l'utilisateur de cliquer un bouton qu'on vient de cacher.
       Mesuré avant correction : carte en y=12..201 pour une cible en y=154.
       On essaie donc quatre côtés dans l'ordre, et on garde le premier qui
       tient à l'écran SANS chevaucher la zone éclairée. */
    /* PETIT ÉCRAN : sous ~560×480, une carte flottante de 360×190 ne peut
       mathématiquement PAS éviter une cible en haut à gauche — mesuré : sur
       403×307, les quatre côtés chevauchent. On la fait alors coulisser en
       bas, sur toute la largeur, et on remonte la cible au-dessus d'elle.
       Une carte qui cache le bouton qu'elle désigne est une visite cassée. */
    const petitEcran = innerWidth < 560 || innerHeight < 480;
    card.classList.toggle("tour-card--sheet", petitEcran);
    if (petitEcran) {
      const hauteurCarte = card.offsetHeight || 190;
      const plafond = innerHeight - hauteurCarte - 24; // le bas de la zone utile
      if (r.bottom > plafond) window.scrollBy(0, Math.ceil(r.bottom - plafond + 12));
      return; // la position de la carte est tenue par le CSS (.tour-card--sheet)
    }

    const G = 16;
    const chevauche = (x, y) => !(x + cw < hl || x > hl + hw || y + ch < ht || y > ht + hh);
    const dansLeCadre = (x, y) => x >= 12 && y >= 12 && x + cw <= innerWidth - 12 && y + ch <= innerHeight - 12;
    const bornerX = (x) => Math.min(Math.max(12, x), Math.max(12, innerWidth - cw - 12));
    const bornerY = (y) => Math.min(Math.max(12, y), Math.max(12, innerHeight - ch - 12));
    const cotes = [
      [bornerX(r.left), ht + hh + G],          // dessous
      [bornerX(r.left), ht - ch - G],          // dessus
      [hl + hw + G, bornerY(r.top)],           // à droite
      [hl - cw - G, bornerY(r.top)],           // à gauche
    ];
    let pos = cotes.find(([x, y]) => dansLeCadre(x, y) && !chevauche(x, y))
           || cotes.find(([x, y]) => !chevauche(bornerX(x), bornerY(y)))?.map((v, i) => (i ? bornerY(v) : bornerX(v)))
           || [bornerX(r.left), bornerY(ht + hh + G)];
    Object.assign(card.style, { left: pos[0] + "px", top: pos[1] + "px" });
  } else {
    Object.assign(spot.style, { opacity: 0, width: "0px", height: "0px" });
    put(top, 0, 0, innerWidth, innerHeight); put(bottom, 0, 0, 0, 0); put(left, 0, 0, 0, 0); put(right, 0, 0, 0, 0);
    Object.assign(card.style, { top: Math.max(12, (innerHeight - ch) / 2) + "px", left: Math.max(12, (innerWidth - cw) / 2) + "px" });
  }
}

/* ---------- la grande visite (premier login) ---------- */
const FLOW_MAIN = [
  { sel: null, t: "Bienvenue dans le vestiaire", ok: "C'est parti",
    b: "Ici tu changes ce que les visiteurs lisent : coordonnées, tarifs, coachs, planning. Aucune compétence technique n'est demandée — et c'est TOI qui pilotes cette visite : tu vas faire les gestes toi-même." },
  { sel: '#nav .navbtn[data-k="tarifs"]', t: "1 · Le menu",
    b: "Chaque bouton du menu ouvre une partie du site. À toi : clique sur « Tarifs ».",
    hint: "Clique sur « Tarifs »", advanceOn: { ev: "click", sel: '#nav .navbtn[data-k="tarifs"]' } },
  { sel: "#pane .field", t: "2 · Modifier, c'est écrire",
    b: "Un texte se change en écrivant dans sa case, comme dans un document. Essaie : ajoute une lettre quelque part. Personne ne verra rien, promis.",
    hint: "Écris dans une case", advanceOn: { ev: "input", sel: "#pane input, #pane textarea" } },
  { sel: "#status", t: "3 · Rien n'est en ligne",
    b: "Tu vois « Modifications non publiées » ? Tes essais sont gardés dans ce navigateur, mais le vrai site n'a pas bougé d'un pixel." },
  { sel: "#reload", t: "4 · Se raviser",
    b: "« Annuler tout » jette tes essais et ramène exactement ce qui est en ligne. Rien n'est jamais irréversible avant la publication." },
  { sel: "#publish", t: "5 · Publier",
    b: "Quand tout te convient : « Publier ». Le site se met à jour tout seul, compte environ une minute. (Pas maintenant — on est en visite.)" },
  { sel: '#nav .navbtn[data-k="leads"]', t: "6 · Les contacts",
    b: "L'assistant du site discute avec les visiteurs et récupère les prénoms et numéros de ceux qui sont intéressés. Ils atterrissent tous ici." },
  { sel: '#nav .navbtn[data-k="dashboard"]', t: "Besoin d'être guidé ?",
    b: "L'Accueil propose un assistant pas à pas pour chaque tâche courante. Bon entraînement." },
];

function startTour() {
  runFlow(FLOW_MAIN, { onEnd: () => { try { localStorage.setItem(TOUR_KEY, "1"); } catch { /* rien */ } } });
}

/* ---------- les assistants de l'accueil : des mains qui guident ---------- */
const FLOWS = {
  editContact: [
    { sel: "#pane .card", t: "Les coordonnées", do: () => renderSection("salle"),
      b: "Téléphone, e-mail, horaires, adresse. Change ce que tu veux dans les cases — ces informations partent d'un coup dans le pied de page de toutes les pages ET dans les réponses de l'assistant.",
      hint: "Modifie une case", advanceOn: { ev: "input", sel: "#pane input, #pane textarea" } },
    { sel: "#status", t: "C'est noté, pas publié",
      b: "Le statut est passé à « Modifications non publiées ». Tant qu'il dit ça, le site en ligne affiche encore l'ancienne version." },
    { sel: "#publish", t: "Mets-le en ligne",
      b: "« Publier », puis compte une minute et rafraîchis le site : le nouveau numéro y est." },
  ],
  editTarif: [
    { sel: "#pane", t: "Les tarifs", do: () => renderSection("tarifs"),
      b: "Chaque carte est une offre de la page Tarifs. Si la liste est vide, c'est normal : le site affiche ce qui a été livré à l'ouverture. Ajoute un tarif seulement si tu veux reprendre la main sur TOUTE la liste." },
    { sel: "#pane .btn", t: "Ajoute une offre",
      b: "Clique sur « + Ajouter un tarif » pour créer une carte, puis remplis le nom et le prix.",
      hint: "Clique sur le bouton", advanceOn: { ev: "click", sel: "#pane .btn" } },
    { sel: "#pane .card", t: "Écris le prix tel quel",
      b: "Le prix s'affiche exactement comme tu l'écris : mets « 259€ », pas « 259 ». Et vérifie-le deux fois — c'est aussi ce que l'assistant annoncera aux visiteurs.",
      hint: "Remplis le prix", advanceOn: { ev: "input", sel: "#pane input" } },
    { sel: "#publish", t: "Publie",
      b: "« Publier » et c'est en ligne dans la minute. « Annuler tout » si tu préfères repartir de zéro." },
  ],
  editCoach: [
    { sel: "#pane", t: "L'équipe", do: () => renderSection("coaches"),
      b: "Les coachs affichés sur la page Coachs et sur l'accueil : nom, ce qu'ils encadrent, une phrase." },
    { sel: "#pane .intro", t: "La règle photo de la maison",
      b: "Une photo n'apparaît sous un nom QUE si la source officielle associe les deux. Si tu n'as pas la bonne photo, laisse le champ vide : le site affiche une tuile prévue pour ça. Ne mets jamais le visage de quelqu'un d'autre." },
    { sel: "#pane .btn", t: "Ajoute un coach",
      b: "Clique sur « + Ajouter un coach », puis remplis au minimum le nom et ce qu'il encadre.",
      hint: "Clique sur le bouton", advanceOn: { ev: "click", sel: "#pane .btn" } },
    { sel: "#publish", t: "Publie quand c'est juste",
      b: "Relis le nom, relis le rôle, puis « Publier »." },
  ],
  editPlanning: [
    { sel: "#pane", t: "La semaine", do: () => renderSection("schedule"),
      b: "Chaque carte est UN créneau : un jour, une heure, un cours, un coach. La page Planning, les filtres et les fiches coachs se construisent toutes seules à partir d'ici." },
    { sel: "#pane .btn", t: "Ajoute un créneau",
      b: "Clique sur « + Ajouter un créneau ». Le jour se choisit dans une liste (Lun, Mar…), l'heure s'écrit comme sur le poster : 18h20.",
      hint: "Clique sur le bouton", advanceOn: { ev: "click", sel: "#pane .btn" } },
    { sel: "#pane .card", t: "Le code discipline compte",
      b: "« Discipline (code) » relie le créneau à sa fiche et à sa photo. Choisis-le dans la liste — un code inventé afficherait un créneau orphelin." },
    { sel: "#publish", t: "Publie ta semaine",
      b: "Vérifie l'heure et le coach, puis « Publier »." },
  ],
  seeLeads: [
    { sel: '#nav .navbtn[data-k="leads"]', t: "Les contacts", do: () => renderSection("leads"),
      b: "Quand un visiteur donne son prénom et son numéro à l'assistant du site, il arrive ici tout seul. Le plus récent en haut." },
    { sel: "#pane", t: "Ce que tu en fais",
      b: "Tu appelles. Ce sont des gens qui ont déjà tapé leur numéro pour qu'on les rappelle : ils t'attendent. Le téléphone et l'e-mail sont cliquables." },
  ],
  howPublish: [
    { sel: "#status", t: "1 · L'état, en haut à droite",
      b: "Il dit toujours la vérité : « À jour » quand le site en ligne et ton écran disent la même chose, « Modifications non publiées » dès que tu changes quelque chose." },
    { sel: "#reload", t: "2 · Annuler tout",
      b: "Jette tes modifications et recharge exactement ce qui est en ligne. Utile quand on s'est perdu." },
    { sel: "#publish", t: "3 · Publier",
      b: "Enregistre tes modifications et relance la mise en ligne du site. Compte environ une minute, puis rafraîchis le site pour voir le résultat." },
    { sel: null, t: "4 · Et si ça rate ?",
      b: "Le message d'état te dit exactement ce qui n'a pas marché, en français. Rien n'est perdu : tes modifications restent dans ce navigateur tant qu'elles ne sont pas publiées." },
  ],
};
