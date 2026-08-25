import fs from "fs";

const F = "src/pages/activites/index.astro";
let s = fs.readFileSync(F, "utf8");
const EOL = s.includes("\r\n") ? "\r\n" : "\n";

/* LES ACTIVITÉS — la liste officielle de la page Saint-Cyprien de
   boxingcenter.fr, dans l'ordre où elle y figure. Rien d'ajouté :
   ni MMA, ni grappling, ni savate — ils sont au réseau, pas ici. */
const ACT = [
  ["Boxe Anglaise", "anglaise",
   "Les bases, la technique, et on progresse à son rythme.", "Loisir et compétition"],
  ["Boxe Thaï / K1", "thai",
   "Pieds et poings. La discipline la plus complète de la salle.", "Loisir et compétition"],
  ["Kick Boxing", "k1-coup-pied",
   "Poings et jambes, sur un rythme soutenu.", "Tous niveaux"],
  ["Open Sparring", "k1-duo",
   "Mettre les gants dans un cadre encadré, quand on se sent prêt.", "Sur créneau dédié"],
  ["PAOS", "anglaise-header",
   "Le travail aux pattes d’ours : précision, vitesse, coordination.", "Cours collectif"],
  ["Boxing Lady", "lady",
   "Des séances entre femmes, sans opposition.", "100 % féminin"],
  ["Baby Boxe", "educative",
   "La découverte de la boxe pour les plus jeunes.", "Le samedi"],
  ["Boxe éducative", "tous-niveaux",
   "Enfants, ados, et un créneau pour ceux qui visent la compétition.", "Mercredi et samedi"],
  ["Boxing Camp", "cross-groupe",
   "Boxe et condition physique dans la même séance.", "Tous niveaux"],
  ["Cross Training", "cross-circuit",
   "Un entraînement complet : force, cardio, mobilité.", "Tous niveaux"],
  ["Hyrox", "hyrox",
   "Le format Hyrox, débutant ou confirmé, à son rythme.", "Mixte"],
];

const carte = ([nom, img, texte, tag]) => [
  `          <li class="acard">`,
  `            <figure class="ph ph--3x2 ph--zoom acard__ph">`,
  `              <img src="/assets/img/sc/${img}.webp" alt="" loading="lazy" decoding="async" />`,
  `            </figure>`,
  `            <div class="acard__body">`,
  `              <h3 class="acard__t">${nom}</h3>`,
  `              <p class="acard__d">${texte}</p>`,
  `              <span class="acard__tag">${tag}</span>`,
  `            </div>`,
  `          </li>`,
].join(EOL);

const LIBRE = [
  ["Musculation", "Machines, cages et charges libres."],
  ["Cardio", "Tapis de course, vélos elliptiques."],
  ["Cross Training", "Matériel dédié et matériel olympique."],
  ["Entraînement personnel", "Vous venez travailler seul, à votre heure."],
];

const EQUIP = [
  "Sacs de frappe", "Espace tatamis", "Ring",
  "Machines de musculation", "Cages", "Charges libres",
  "Matériel Cross Training", "Matériel olympique", "Machines cardio",
];

const MAIN = [
  `    <main id="main">`,
  ``,
  `      <!-- ============================ HERO ========================= -->`,
  `      <header class="phero" aria-label="Nos activités">`,
  `        <div class="phero__spot" aria-hidden="true"></div>`,
  `        <div class="wrap">`,
  `          <nav class="crumbs" aria-label="Fil d’Ariane">`,
  `            <a href="/">Accueil</a> <span aria-hidden="true">/</span> <span aria-current="page">Activités</span>`,
  `          </nav>`,
  `          <h1 class="display">Nos activités</h1>`,
  `          <p class="lead">Boxe, entraînement et préparation physique : choisissez ce qui vous correspond.</p>`,
  `          <p class="phero__note">Vous débutez ? Aucun problème. Dites-le au coach du créneau, il vous prend en charge. Les gants sont prêtés.</p>`,
  `        </div>`,
  `      </header>`,
  ``,
  `      <!-- ======================= LA GRILLE ========================= -->`,
  `      <section class="section" aria-label="Les cours encadrés">`,
  `        <div class="wrap">`,
  `          <span class="eyebrow" data-reveal>Les cours encadrés</span>`,
  `          <ul class="agrid" data-reveal-group>`,
  ACT.map(carte).join(EOL),
  `          </ul>`,
  `        </div>`,
  `      </section>`,
  ``,
  `      <!-- ==================== L'ACCÈS LIBRE ======================== -->`,
  `      <section class="section band-light" aria-label="Les espaces en accès libre">`,
  `        <div class="wrap">`,
  `          <span class="eyebrow" data-reveal>Sans cours, sans réservation</span>`,
  `          <h2 class="display alibre__t" data-reveal>Vous préférez vous entraîner librement ?</h2>`,
  `          <p class="alibre__l" data-reveal>Les espaces sont ouverts en accès libre, 7 jours sur 7.</p>`,
  `          <ul class="alibre" data-reveal-group>`,
  LIBRE.map(([n, d]) => [
    `            <li>`,
    `              <b>${n}</b>`,
    `              <span>${d}</span>`,
    `            </li>`,
  ].join(EOL)).join(EOL),
  `          </ul>`,
  `        </div>`,
  `      </section>`,
  ``,
  `      <!-- ==================== LES ÉQUIPEMENTS ====================== -->`,
  `      <section class="section" style="padding-top:0" aria-label="Les équipements">`,
  `        <div class="wrap">`,
  `          <div class="ph-split" data-reveal>`,
  `            <figure class="ph ph--4x3 ph--zoom">`,
  `              <img src="/assets/img/sc/plateau-large.webp" alt="Le plateau : sacs suspendus, tapis et ring" loading="lazy" decoding="async" />`,
  `            </figure>`,
  `            <div class="ph-split__txt">`,
  `              <h2 class="display">Un espace pensé pour votre entraînement</h2>`,
  `              <ul class="equip">`,
  EQUIP.map((e) => `                <li>${e}</li>`).join(EOL),
  `              </ul>`,
  `            </div>`,
  `          </div>`,
  `        </div>`,
  `      </section>`,
  ``,
  `      <!-- ======================== LE GONG ========================== -->`,
  `      <section class="gong" aria-label="Faire un essai">`,
  `        <div class="gong__inner">`,
  `          <span class="eyebrow">11 rue Sainte-Lucie</span>`,
  `          <h2 class="display">Vous ne savez pas par où commencer ?</h2>`,
  `          <p class="lead">Venez découvrir la salle et échangez avec l’équipe. On vous orientera vers le bon créneau.</p>`,
  `          <div class="gong__cta">`,
  `            <a class="btn btn--primary" href="https://boutique.boxingcenter.fr/seance-essai"><span>Faire un essai</span></a>`,
  `            <a class="btn" href="/plannings/"><span>Voir le planning</span></a>`,
  `          </div>`,
  `        </div>`,
  `      </section>`,
  ``,
  `    </main>`,
].join(EOL);

const i = s.indexOf("    <main id=\"main\">");
const j = s.indexOf("</main>");
if (i < 0 || j < 0) { console.log("MAIN INTROUVABLE"); process.exit(1); }
s = s.slice(0, i) + MAIN + s.slice(j + "</main>".length);

/* La page ne rend plus rien en JavaScript : le script de l'ancienne
   version ecrivait dans des conteneurs qui n'existent plus, et une
   ecriture sur null aurait tue le module (le meme piege que sur
   l'accueil). Il part avec la page qu'il servait. */
s = s.replace(/\s*<script is:inline type="module" src="\/assets\/js\/activites\.js\?v=22"><\/script>/, "");

/* metadonnees alignees sur la nouvelle page */
s = s.replace(/<title>[^<]*<\/title>/, "<title>Nos activités | Boxing Center Saint-Cyprien</title>");
s = s.replace(/(<meta name="description" content=")[^"]*(")/,
  `$1Boxe anglaise, thaï/K1, kick boxing, PAOS, Boxing Lady, école enfants, Boxing Camp, cross training et Hyrox à Toulouse Saint-Cyprien. Musculation et cardio en accès libre 7 j/7.$2`);

fs.writeFileSync(F, s, "utf8");
console.log(`page /activites/ reecrite — ${ACT.length} activites, ${LIBRE.length} espaces libres, ${EQUIP.length} equipements`);
console.log("script activites.js decable");
