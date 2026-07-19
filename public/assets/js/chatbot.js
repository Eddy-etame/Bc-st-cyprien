/* =====================================================================
   L'ASSISTANT — Boxing Center Saint-Cyprien.

   Philosophie (≠ formulaire) : le bot se présente, demande ton prénom,
   puis RÉPOND. L'IA (/api/chat, ancrée sur les faits de la salle) rend la
   conversation humaine pendant que le widget capte AU VOL les coordonnées
   que le visiteur donne de lui-même — prénom, email, téléphone. Dès qu'on
   a un prénom ET un moyen de rappel, le contact part vers /api/lead.
   On n'interroge jamais de force : une seule relance douce, puis silence.

   AMÉLIORATION PROGRESSIVE : la pastille du HTML reste un vrai lien tel:.
   Ce module la REMPLACE par un bouton qui ouvre le panneau. Script mort ou
   bloqué ⇒ la pastille d'origine appelle la salle. Rien ne régresse.
   ===================================================================== */
import { QUICKS, fallbackAnswer, GENERIC } from "./chatbot-kb.js";
import { SALLE } from "./data.js?v=11";

/* ---------------------------- constantes -------------------------- */
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
/* numéro FR : +33 ou 0, puis 9 chiffres groupés librement */
const PHONE_RE = /(?:\+33|0)\s?[1-9](?:[\s.\-]?\d{2}){4}/;
/* déclencheurs SPÉCIFIQUES d'un prénom — pas de « c'est » nu, qui capterait
   « c'est ouvert » ou « c'est combien » */
const NAME_RE = /(?:je m['’ ]?appelle|moi c['’ ]?est|mon nom est|mon pr[ée]nom (?:est|c['’ ]?est)|je me nomme|ici c['’ ]?est)\s+([a-zà-öø-ÿ][a-zà-öø-ÿ'’-]+)/i;
const STOP_NAMES = /^(bonjour|salut|coucou|hello|hey|merci|oui|non|ok|d['’]accord|bien|super|cool|pas|ouvert|ferm[ée]?|combien|quoi|rien|voir|bof|peut|je|tu|le|la|les|un|une|des)$/i;

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const delay = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
const titleCase = (s) => s.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

function sessionId() {
  const key = "bcsc-chat-session";
  try {
    let id = sessionStorage.getItem(key);
    if (!id) { id = (crypto.randomUUID?.() || String(Date.now())); sessionStorage.setItem(key, id); }
    return id;
  } catch { return String(Date.now()); }
}

/* ------------------------------- API ------------------------------ */
async function askAi(message, history, context) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, context }),
  });
  if (!res.ok) throw new Error("IA indisponible");
  const data = await res.json();
  if (!data.reply) throw new Error("IA vide");
  return data.reply;
}

async function submitLead(payload) {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "st-cyprien", ...payload }),
  });
  if (!res.ok) throw new Error("Envoi refusé");
  return res.json().catch(() => ({}));
}

/* ------------------------------ WIDGET ---------------------------- */
export function initChatbot() {
  if (document.getElementById("scchat")) return;
  const pill = document.querySelector("a.chatbot");
  if (!pill) return; // pas de point d'accroche sur cette page

  /* la feuille du widget : chargée par JS, donc jamais bloquante au rendu */
  if (!document.getElementById("scchat-css")) {
    const link = document.createElement("link");
    link.id = "scchat-css"; link.rel = "stylesheet"; link.href = "/assets/css/chatbot.css?v=1";
    document.head.appendChild(link);
  }

  const sid = sessionId();
  const profile = { prenom: "", nom: "", email: "", phone: "", salle: "Saint-Cyprien" };
  const aiHistory = [];
  const messages = [];
  let opened = false, typing = false, exchanges = 0;
  let nudged = false;      // la relance douce a-t-elle déjà été faite ?
  let expectName = false;  // le bot vient de demander le prénom
  let leadSig = "";        // signature du dernier lead envoyé (anti-doublon)
  let callbackAsked = false;

  /* --- la pastille devient un vrai bouton (le lien tel: était le repli) --- */
  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = pill.className;
  launcher.id = "scchat-launcher";
  launcher.innerHTML = pill.innerHTML;
  launcher.setAttribute("aria-haspopup", "dialog");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "scchat-panel");
  launcher.setAttribute("aria-label", "Ouvrir l'assistant du Boxing Center Saint-Cyprien");
  const label = launcher.querySelector(".chatbot__label");
  if (label) label.innerHTML = "Une question&nbsp;? On te répond";
  pill.replaceWith(launcher);

  /* ------------------------------ le panneau ------------------------------ */
  const root = document.createElement("div");
  root.id = "scchat";
  root.className = "scchat";
  root.innerHTML = `
    <section class="scchat__panel" id="scchat-panel" role="dialog" aria-modal="true"
             aria-labelledby="scchat-title" hidden>
      <header class="scchat__head">
        <span class="scchat__beam" aria-hidden="true"></span>
        <div class="scchat__ident">
          <span class="scchat__kicker">Boxing Center · rive gauche</span>
          <strong id="scchat-title">L'assistant de Saint-Cyprien</strong>
        </div>
        <button type="button" class="scchat__close" id="scchat-close" aria-label="Fermer l'assistant">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
          </svg>
        </button>
      </header>
      <div class="scchat__body">
        <div class="scchat__messages" id="scchat-messages" role="log" aria-live="polite" aria-atomic="false"></div>
      </div>
      <div class="scchat__foot">
        <div class="scchat__chips" id="scchat-chips" hidden></div>
        <form class="scchat__form" id="scchat-form">
          <label class="sr-only" for="scchat-input">Ton message</label>
          <input class="scchat__input" id="scchat-input" type="text" autocomplete="off"
                 placeholder="Écris ta question…" maxlength="500" />
          <button class="scchat__send" type="submit" aria-label="Envoyer le message">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 12h14M14 6l6 6-6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>
        <a class="scchat__tel" href="tel:${SALLE.phoneHref}">Ou appelle la salle · ${SALLE.phone}</a>
      </div>
    </section>`;
  document.body.appendChild(root);

  const panel = root.querySelector("#scchat-panel");
  const closeBtn = root.querySelector("#scchat-close");
  const messagesEl = root.querySelector("#scchat-messages");
  const chipsEl = root.querySelector("#scchat-chips");
  const form = root.querySelector("#scchat-form");
  const input = root.querySelector("#scchat-input");

  /* ------------------------------ rendu ------------------------------ */
  const esc = (s) => String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/\n/g, "<br>");

  function render() {
    messagesEl.innerHTML = messages
      .map((m) => `<div class="scchat__msg scchat__msg--${m.role}"><div class="scchat__bubble">${esc(m.text)}</div></div>`)
      .join("");
    if (typing) {
      messagesEl.insertAdjacentHTML("beforeend",
        `<div class="scchat__msg scchat__msg--bot scchat__msg--typing"><div class="scchat__bubble">
           <span class="scchat__dots" aria-label="L'assistant écrit"><i></i><i></i><i></i></span>
         </div></div>`);
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  async function botSay(text, pause = 550) {
    typing = true; render();
    await delay(pause);
    typing = false;
    messages.push({ role: "bot", text });
    render();
  }
  const userSay = (text) => { messages.push({ role: "user", text }); render(); };

  function showChips() {
    chipsEl.innerHTML =
      QUICKS.slice(0, 5).map((q) => `<button type="button" data-q="${esc(q.q)}">${esc(q.label)}</button>`).join("") +
      `<button type="button" class="scchat__chip--cta" data-callback>Être rappelé</button>`;
    chipsEl.hidden = false;
  }
  const hideChips = () => { chipsEl.hidden = true; chipsEl.innerHTML = ""; };

  /* ------------------- capture des coordonnées au fil de l'eau ------------------- */
  function contextString() {
    const bits = [];
    if (profile.prenom) bits.push(`Prénom : ${profile.prenom}`);
    if (profile.email) bits.push("Email déjà donné");
    if (profile.phone) bits.push("Téléphone déjà donné");
    return bits.join(". ");
  }

  /** Envoie le contact — seulement s'il est joignable, et jamais deux fois pareil. */
  function maybeSubmitLead(event) {
    if (!profile.email && !profile.phone) return false;
    const sig = JSON.stringify(profile);
    if (sig === leadSig) return false;
    leadSig = sig;
    const payload = {
      event, sessionId: sid,
      prenom: profile.prenom, nom: profile.nom,
      name: [profile.prenom, profile.nom].filter(Boolean).join(" ").trim(),
      email: profile.email, phone: profile.phone, salle: profile.salle,
    };
    window.__scchatLastLead = payload; // témoin vérifiable sur le rendu
    submitLead(payload).catch(() => { /* silencieux : ne bloque jamais la conversation */ });
    return true;
  }

  /** Extrait prénom / email / téléphone du message. true si du neuf a été capté. */
  function extract(text) {
    let found = false;
    const email = text.match(EMAIL_RE);
    if (email && !profile.email) { profile.email = email[0]; found = true; }
    const phone = text.match(PHONE_RE);
    if (phone && !profile.phone) { profile.phone = phone[0].replace(/\s+/g, " ").trim(); found = true; }
    if (!profile.prenom) {
      const m = text.match(NAME_RE);
      let name = m && m[1] ? m[1].trim() : "";
      // le bot vient de demander le prénom : un mot simple suffit
      if (!name && expectName) {
        const w = text.trim().split(/\s+/)[0];
        if (w && !EMAIL_RE.test(w) && !/\d/.test(w) && !STOP_NAMES.test(w)) name = w;
      }
      if (name && !STOP_NAMES.test(name)) { profile.prenom = titleCase(name.split(/\s+/)[0]); found = true; }
    }
    expectName = false;
    return found;
  }

  /* ------------------------------ conversation ------------------------------ */
  async function answer(text) {
    const avaitPrenom = Boolean(profile.prenom);
    const avaitContact = Boolean(profile.email || profile.phone);
    const gotNew = extract(text);
    const gotName = !avaitPrenom && Boolean(profile.prenom);
    const gotContact = !avaitContact && Boolean(profile.email || profile.phone);
    if (gotNew) maybeSubmitLead(callbackAsked ? "callback_request" : "lead_collected");

    hideChips();
    let reply = null;
    try {
      reply = await askAi(text, aiHistory.slice(-6), contextString());
    } catch {
      /* Pas d'IA (aucune clé configurée, réseau coupé) : on compose depuis la
         base locale. L'IA sait accuser réception d'un prénom ou d'un numéro ;
         la base, non — c'est donc ICI qu'on le fait, sinon le bot répond une
         généralité à quelqu'un qui vient de taper son téléphone, et il a l'air
         de ne pas avoir écouté. */
      const kb = fallbackAnswer(text);
      const bits = [];
      if (gotName) bits.push(`Enchanté, ${profile.prenom} !`);
      if (kb) bits.push(kb);
      // rien de reconnu ET rien de neuf à saluer : la phrase de dernier recours
      if (!bits.length && !gotContact) bits.push(GENERIC);
      reply = bits.join(" ") || null;
    }

    if (reply) {
      aiHistory.push({ role: "user", content: text }, { role: "assistant", content: reply });
      await botSay(reply);
      exchanges++;
    }

    if (gotContact) {
      // On accuse TOUJOURS réception d'un moyen de rappel — pas seulement après
      // un « être rappelé ». C'est le moment où le visiteur se demande si ça
      // a servi à quelque chose.
      const suite = callbackAsked
        ? "un coach te rappelle très vite."
        : "si tu veux qu'on te cale un créneau, un coach te rappelle.";
      callbackAsked = false;
      await botSay(`C'est noté${profile.prenom ? `, ${profile.prenom}` : ""} — ${suite}`, 450);
    } else if (!nudged && exchanges >= 2 && !profile.email && !profile.phone) {
      nudged = true;
      await botSay("Au fait — si tu veux qu'un coach te rappelle ou te cale un créneau, laisse-moi un numéro ou un email quand tu veux. Sans pression.", 450);
    }
    showChips();
  }

  async function startCallback() {
    callbackAsked = true;
    hideChips();
    if (profile.email || profile.phone) {
      maybeSubmitLead("callback_request");
      await botSay(`C'est parti${profile.prenom ? `, ${profile.prenom}` : ""} — je transmets, un coach te rappelle. Autre chose en attendant ?`);
      callbackAsked = false;
      showChips();
      return;
    }
    expectName = !profile.prenom;
    await botSay(profile.prenom
      ? `Volontiers ${profile.prenom} : laisse-moi un numéro ou un email, et un coach te rappelle.`
      : "Volontiers. Dis-moi ton prénom et un numéro (ou un email), et un coach te rappelle.");
    input.placeholder = "Ton prénom et ton numéro…";
  }

  /* ------------------------------ ouverture ------------------------------ */
  const FOCUSABLE = 'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

  function trapFocus(e) {
    if (e.key !== "Tab" || panel.hidden) return;
    const els = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  async function openPanel() {
    panel.hidden = false;
    root.classList.add("is-open");
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", "Fermer l'assistant du Boxing Center Saint-Cyprien");
    input.focus();
    if (!opened) {
      opened = true;
      expectName = true;
      await botSay("Salut, je suis l'assistant de Boxing Center Saint-Cyprien — 1 200 m² rive gauche, à 4 minutes du métro A. Comment tu t'appelles ?", 700);
      showChips();
    }
  }
  function closePanel() {
    panel.hidden = true;
    root.classList.remove("is-open");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", "Ouvrir l'assistant du Boxing Center Saint-Cyprien");
    // le focus revient sur la pastille — c'est d'elle qu'on est parti
    launcher.focus();
  }

  /* ------------------------------ événements ------------------------------ */
  launcher.addEventListener("click", () => (root.classList.contains("is-open") ? closePanel() : openPanel()));
  closeBtn.addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) { e.stopPropagation(); closePanel(); }
    else trapFocus(e);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || typing) return;
    input.value = "";
    userSay(text);
    await answer(text);
  });

  chipsEl.addEventListener("click", async (e) => {
    const cb = e.target.closest("button[data-callback]");
    if (cb) { await startCallback(); return; }
    const q = e.target.closest("button[data-q]");
    if (q) { const text = q.dataset.q; userSay(text); await answer(text); }
  });

  /* Poignée de test / de preuve : rejouer une conversation SUR LE RENDU. */
  window.__scchat = {
    open: openPanel, close: closePanel,
    say: async (t) => { userSay(t); await answer(t); },
    callback: startCallback,
    profile, messages,
    get lastLead() { return window.__scchatLastLead || null; },
  };
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initChatbot);
else initChatbot();
