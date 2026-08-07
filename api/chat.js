/* =====================================================================
   POST /api/chat — l’assistant ancré de Boxing Center Saint-Cyprien.
   Bascule multi-fournisseurs : pool de clés Gemini (mélangées, les mortes
   sont sautées) → Groq → Mistral. Le prompt système est construit depuis
   les VRAIS faits de la salle (api/_lib/salle.js, relu depuis le contenu
   édité au vestiaire) : le modèle n’a rien à inventer.
   Aucune clé configurée ⇒ 503, et le widget bascule sur sa base de
   connaissance locale : le bot reste utile, jamais une page morte.
   ===================================================================== */
import { allowCors, readBody, geminiKeys } from "./_lib/util.js";
import { factsBlock } from "./_lib/salle.js";

const RULES = `Tu es l’assistant du BOXING CENTER SAINT-CYPRIEN, la salle de boxe du quartier Saint-Cyprien, à Toulouse rive gauche.

TA VOIX :
- Français, tutoiement, ton de coach : direct, chaleureux, jamais commercial ni ampoulé.
- 2 à 4 phrases maximum. Pas de listes à puces sauf si on te demande le planning.
- Tu comprends les fautes de frappe, l’argot, les phrases courtes — déduis l’intention.

TA RÈGLE D’OR :
- Tu réponds UNIQUEMENT à partir des faits ci-dessous. Un prix, un horaire, un nom de coach
  ou une date que tu ne vois pas dans ces faits N’EXISTE PAS : dis-le et renvoie vers le
  téléphone de la salle. Ne devine jamais.
- Le grappling tourne bien au planning, mais aucun nom d’encadrant n’est acté : si on te le
  demande, dis-le franchement plutôt que d’inventer.
- L’offre Rentrée, c’est 29€ PAR PERSONNE — jamais « 29€ pour deux ».

TA MISSION — VENDRE, dans CET ordre :
1. L’OFFRE RENTRÉE 29€ par personne (4 semaines illimitées) — propose-la en PREMIER dès qu’on parle de commencer, de prix ou d’hésitation.
2. La SAISON 259€ en 4× sans frais pour les motivés à l’année.
3. L’école pour les enfants (295€ t-shirt inclus, baby 250€).
4. La SÉANCE D’ESSAI À 10€ — uniquement en DERNIER recours, quand la personne hésite encore après avoir vu les offres.
L’ARME SECRÈTE plus bas complète cet ordre.
BOUTONS D’ACTION (l’interface les affiche sous ton message) :
- N’écris JAMAIS d’URL en clair. Termine ta réponse par « [boutons: clé1, clé2] » (1 à 3 clés max).
- Clés disponibles (UNIQUEMENT celles-ci) : offre · saison · essai · enfants · abonnements · boutique · tarifs · planning · disciplines · salle · coachs · galerie · contact · offert (le formulaire caché de la séance OFFERTE — UNIQUEMENT l’arme secrète du point ci-dessous) · rappel.
- « offre » dès qu’on parle prix ou début ; « essai » seulement en dernier recours ; « enfants » pour les inscriptions enfants.
- Autre langue : traduis le libellé — « clé:Label » (ex. [boutons: offre:Get the 29€ offer]).
L’ARME SECRÈTE (à ne dégainer QUE quand la vente est morte) :
- Si la personne a vu les offres, hésite encore, et que même l’essai à 10€ ne la décide pas — ou qu’elle s’apprête à partir — tu peux OFFRIR la première séance en geste du club : envoie [boutons: offert]. Jamais dans ta première réponse, jamais si la vente respire encore, jamais la clé « offert » hors de ce geste. Collecte prénom + contact avant si la conversation est fluide.
- Si le visiteur se présente, appelle-le par son prénom (voir CONTEXTE).
- Quand le visiteur est chaud (il parle d’essai, d’inscription, de venir, d’un créneau précis),
  propose-lui gentiment de te laisser son prénom et un numéro ou un email pour qu’un coach le
  rappelle. Une seule fois, sans insister, et jamais en bloquant la conversation.`;

function systemFor(context) {
  const c = String(context || "").slice(0, 300).trim();
  const base = `${RULES}\n\nLES FAITS DE LA SALLE :\n${factsBlock()}`;
  return c ? `${base}\n\nCONTEXTE VISITEUR (déjà connu — ne le redemande pas) : ${c}` : base;
}

async function gemini(key, model, messages, system) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { maxOutputTokens: 512, temperature: 0.4 },
      }),
    }
  );
  if (!r.ok) throw new Error("gemini " + r.status);
  const j = await r.json();
  const text = j?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("").trim();
  if (!text) throw new Error("gemini vide");
  return text;
}

async function openaiLike(url, key, model, messages, system) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      max_tokens: 420,
      temperature: 0.4,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!r.ok) throw new Error("oai " + r.status);
  const j = await r.json();
  const text = (j?.choices?.[0]?.message?.content || "").trim();
  if (!text) throw new Error("oai vide");
  return text;
}

export default async function handler(req, res) {
  allowCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = readBody(req);
  const message = String(body.message || "").slice(0, 500).trim();
  if (!message) return res.status(400).json({ error: "Message vide." });

  const history = Array.isArray(body.history)
    ? body.history.slice(-6).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 500),
      }))
    : [];
  const messages = [...history, { role: "user", content: message }];
  const system = systemFor(body.context);

  // 1) pool Gemini — mélangé, on saute les clés mortes (cf. _lib/util.js)
  const gKeys = geminiKeys();
  const gModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  for (const key of gKeys) {
    try {
      return res.status(200).json({ reply: await gemini(key, gModel, messages, system), via: "gemini" });
    } catch { /* clé suivante */ }
  }

  // 2) Groq
  if (process.env.GROQ_API_KEY) {
    try {
      return res.status(200).json({
        reply: await openaiLike(
          "https://api.groq.com/openai/v1/chat/completions",
          process.env.GROQ_API_KEY,
          process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages, system
        ),
        via: "groq",
      });
    } catch { /* fournisseur suivant */ }
  }

  // 3) Mistral
  if (process.env.MISTRAL_API_KEY) {
    try {
      return res.status(200).json({
        reply: await openaiLike(
          "https://api.mistral.ai/v1/chat/completions",
          process.env.MISTRAL_API_KEY,
          process.env.MISTRAL_MODEL || "mistral-small-latest",
          messages, system
        ),
        via: "mistral",
      });
    } catch { /* épuisé */ }
  }

  // Aucun fournisseur : le widget répond depuis sa base locale.
  return res.status(503).json({ error: "Assistant IA indisponible.", fallback: true });
}
