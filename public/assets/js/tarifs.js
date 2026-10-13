/* =====================================================================
   SAINT-CYPRIEN · tarifs.js — simple, sans détour.
   Essai en tête → offres de la saison (Duo prioritaire · Saison) → école &
   compléments → conditions → lien vers les avis Google actuels → FAQ argent. Tout depuis
   data.js (PROMOS daté, jamais de prix en dur), tous les CTA → box-plus.
   ===================================================================== */
import { TARIFS, PROMOS, REVIEWS, LINKS, SALLE } from "./data.js?v=31";
import { PRICING_FAQ } from "./data-tarifs.js?v=23";

const $ = (s, r = document) => r.querySelector(s);

/* Essai en tête — carte "lumière" réutilisée de la home */
function renderEssai() {
  const el = $("#essai");
  if (!el) return;
  const e = PROMOS.essai;
  el.innerHTML = `
    <div class="essai__spot" aria-hidden="true"></div>
    <div class="essai__body">
      <span class="eyebrow">La séance d’essai</span>
      <h2 class="display essai__title">Rien de tout ça ?<br><span class="tint">Alors viens voir. Dix euros.</span></h2>
      <p class="lead essai__lead">${e.detail}</p>
    </div>
    <div class="essai__cta">
      <a class="btn btn--primary" data-magnetic href="${e.href}"><span>${e.cta} · ${e.price}</span></a>
      <a class="btn" data-magnetic href="tel:${SALLE.phoneHref}"><span>${SALLE.phone}</span></a>
    </div>`;
}

/* Les deux offres datées — le Duo s’écrit TOUJOURS "29€ par personne".
   13/10/2026 : la carte prioritaire s’allume (tarifs.css) et son prix tombe
   de l’ancien au nouveau quand elle arrive à l’écran. La remise est
   CALCULÉE sur les deux prix de data.js, arrondie vers le bas. Le lecteur
   d’écran lit le prix final (sr-only), jamais le compteur. */
const nombre = (s) => parseFloat(String(s).replace(/[^\d,]/g, "").replace(",", "."));
const remise = (o) => (o.was ? Math.floor(((nombre(o.was) - nombre(o.price)) / nombre(o.was)) * 100) : 0);

function renderPromos() {
  const el = $("#promos");
  if (!el) return;
  const card = (o, flag, cls, tombe) => {
    const m = String(o.price).match(/^(\d+)(,\d+)?/);
    const chiffre = m ? m[1] + (m[2] || "") : o.price;
    const compte = tombe && o.was ? ` data-compte="${nombre(o.price)}" data-depuis="${nombre(o.was)}"` : "";
    return `
    <article class="promo ${cls}">
      <div class="promo__tete">${flag ? `<span class="promo__flag">${flag}</span>` : ""}${remise(o) ? `<span class="promo__remise">−${remise(o)} %</span>` : ""}</div>
      <h3 class="promo__name">${o.name}</h3>
      <div class="promo__price"><span class="sr-only">${o.price}</span><b aria-hidden="true"${compte}>${chiffre}</b><span class="promo__eur" aria-hidden="true">€</span>${o.was ? `<s><span class="sr-only">au lieu de </span>${o.was}</s>` : ""}<small>${o.unit}</small></div>
      <p class="promo__detail">${o.detail}</p>
      <a class="btn btn--primary" data-magnetic href="${o.href}"><span>${o.cta}</span></a>
    </article>`;
  };
  el.innerHTML = card(PROMOS.duo, "Prioritaire", "promo--duo", true) + card(PROMOS.saisonOffer, "", "promo--saison", false);
  prixQuiTombe(el.querySelector(".promo--duo"));
}

/* Le prix qui tombe — même geste que sur les pages de discipline. Sans
   IntersectionObserver ou en mouvement réduit, le prix final reste écrit. */
function prixQuiTombe(carte) {
  const n = carte?.querySelector("[data-compte]");
  if (!n || !("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const fin = +n.dataset.compte, debut = +n.dataset.depuis, texteFinal = n.textContent;
  if (!Number.isFinite(fin) || !Number.isFinite(debut)) return;
  const ecrire = (v) => { n.textContent = v.toFixed(2).replace(".", ","); };
  carte.classList.add("promo--pret");
  ecrire(debut);
  const io = new IntersectionObserver((vus) => {
    if (!vus.some((v) => v.isIntersecting)) return;
    io.disconnect();
    carte.classList.add("is-vu");
    const t0 = performance.now();
    const pas = (t) => {
      const k = Math.min(1, (t - t0) / 1300), e = 1 - Math.pow(1 - k, 4);
      if (k < 1) { ecrire(debut + (fin - debut) * e); requestAnimationFrame(pas); } else n.textContent = texteFinal;
    };
    requestAnimationFrame(pas);
  }, { threshold: 0.25 });
  io.observe(carte);
}

/* Une carte tarif — même gabarit pour les classiques et les compléments. */
const carteTarif = (t) => `<article class="tarif">
      <h3 class="tarif__name">${t.name}</h3>
      ${t.price ? `<div class="tarif__price">${t.price}<small> ${t.period}</small></div>` : ""}
      <p class="tarif__feature">${t.feature}</p>
      <ul class="tarif__items">${t.items.map((i) => `<li>${i}</li>`).join("")}</ul>
      <a class="btn ${t.price ? "btn--primary" : ""}" data-magnetic href="${t.href}"><span>${t.cta}</span></a>
    </article>`;

/* Les classiques — le barreau entre la promo et l’école. Aucun prix barré :
   ce n’est pas une offre, c’est le tarif. Si le vestiaire supprime la ligne,
   la section disparaît proprement au lieu d’afficher une grille vide. */
function renderClassiques() {
  const el = $("#classiques");
  if (!el) return;
  const c = TARIFS.find((x) => x.name.toLowerCase().startsWith("les classiques"));
  if (!c) { el.closest("section")?.remove(); return; }
  el.innerHTML = carteTarif(c);
}

/* École (depuis TARIFS) + coachings + matériel (box-plus) */
function renderMore() {
  const el = $("#more");
  if (!el) return;
  const ecole = TARIFS.find((x) => x.name.startsWith("École")) || TARIFS[TARIFS.length - 1];
  const cards = [
    { name: ecole.name, price: ecole.price, period: ecole.period, feature: ecole.feature, items: ecole.items, cta: ecole.cta, href: ecole.href },
    { name: "Coaching privé", feature: "En tête-à-tête, ton geste sous une seule paire d’yeux", items: ["Sur rendez-vous", "On casse un défaut précis", "Avec un coach de la salle"], cta: "Voir les coachings", href: LINKS.coachings },
    { name: "Matériel", feature: "Gants, protections, textile", items: ["Équipe-toi pour durer", "Conseil à la salle", "Boutique en ligne"], cta: "La boutique", href: LINKS.materiel },
  ];
  el.innerHTML = cards.map(carteTarif).join("");
}

/* La source Google reste fraîche ; on ne recopie ni note ni compteur volatil. */
function renderReviews() {
  const el = $("#reviews");
  if (!el) return;
  const r = REVIEWS;
  /* Des avis réels, cités mot pour mot. Ni note, ni compteur, ni étoiles
     (ordre d'Eddy, 08/10/2026) : la preuve, ce sont leurs mots. */
  el.innerHTML = `
    <div class="reviews__bar"><a class="reviews__src" href="${r.url}" target="_blank" rel="noopener noreferrer">${r.source} · ${r.label} ↗</a></div>
    <div class="reviews__grid" data-reveal-group>
      ${r.quotes
        .map(
          (q) => `<blockquote class="review">
        <p class="review__text">« ${q.text} »</p>
        <cite class="review__author">— ${q.author}</cite>
      </blockquote>`
        )
        .join("")}
    </div>`;
}

/* FAQ argent — désamorce les malentendus prix (Duo "par personne", etc.) */
function renderFaq() {
  const el = $("#faq");
  if (!el) return;
  el.innerHTML = PRICING_FAQ.map(
    (f) => `<details><summary>${f.q}</summary><div class="faq__a">${f.a}</div></details>`
  ).join("");
}

/* ------------------------------ BOOT ------------------------------ */
function boot() {
  renderPromos();
  renderClassiques();
  renderMore();
  renderEssai();   // en dernier dans le DOM comme dans l’ordre de vente
  renderReviews();
  renderFaq();

  window.BC.reveal(document);
  window.BC.magnetic(document);
  window.BC.spotlight(".phero", ".phero__spot");
  window.BC.spotlight(".essai", ".essai__spot");
  window.BC.touchLife();   // mobile : promos, tarifs, avis s’animent au passage

  const start = () => window.BC.refresh();
  window.addEventListener("load", start);
  setTimeout(start, 500);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
