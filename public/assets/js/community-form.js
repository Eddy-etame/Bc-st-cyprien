/* =====================================================================
   LE DÉPÔT — le formulaire du mur du club, chargé UNIQUEMENT au clic.

   Il refuse avant d’envoyer. Chaque refus dit ce qui ne va pas et ce qu’il
   faut faire — jamais « erreur ». Les mêmes règles sont rejouées par le
   serveur (api/community/sign.js) : ici c’est du confort, là-bas c’est la
   serrure. Ce qui est vérifié au navigateur :

     · prénom obligatoire, filtre à injures ;
     · e-mail OU téléphone obligatoire (c’est aussi la prise de contact) ;
     · type RÉEL du fichier (File.type), pas l’extension ;
     · poids ;
     · durée ≤ 15 s, mesurée sur le fichier ;
     · pour une image : DÉCODAGE effectif — un fichier qui se dit image mais
       qui ne se décode pas est refusé sur place.

   L’envoi part directement chez Cloudinary (le fichier ne traverse jamais
   Vercel). Une fois accepté, les coordonnées rejoignent LE CARNET EXISTANT
   via /api/lead avec event="upload_contributor" — pas un second système.
   ===================================================================== */

const LIM = { imageMo: 12, videoMo: 80, dureeSec: 15 };
const EMAIL_RE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
const TEL_RE = /^\+?[0-9 ().-]{9,20}$/;

const INJURES = [
  "merde", "putain", "connard", "connasse", "salope", "encule", "pute", "bite", "couille", "nique",
  "ntm", "pd", "pede", "tapette", "bougnoule", "negro", "negre", "youpin", "salaud", "batard",
  "fuck", "shit", "bitch", "cunt", "nigger", "faggot", "whore", "rape", "nazi", "kys", "porn", "sex",
];
function grossier(s) {
  const n = String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ");
  if (/(.)\1{6,}/.test(n)) return true;
  if (/https?:|www\.|\.[a-z]{2,}\/?/i.test(s)) return true;
  return INJURES.some((w) => new RegExp(`\\b${w}`, "i").test(n));
}

/** La durée réelle d’une vidéo, lue dans ses métadonnées. */
function dureeVideo(file) {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => { const d = v.duration; URL.revokeObjectURL(v.src); resolve(d); };
    v.onerror = () => { URL.revokeObjectURL(v.src); reject(new Error("illisible")); };
    v.src = URL.createObjectURL(file);
  });
}

/** Le décodage d’une image : la seule preuve qu’un fichier EST une image. */
async function estVraimentUneImage(file) {
  try {
    if ("createImageBitmap" in window) {
      const bmp = await createImageBitmap(file);
      const ok = bmp.width > 0 && bmp.height > 0;
      bmp.close?.();
      return ok;
    }
    return await new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(img.src); resolve(img.naturalWidth > 0); };
      img.onerror = () => { URL.revokeObjectURL(img.src); resolve(false); };
      img.src = URL.createObjectURL(file);
    });
  } catch { return false; }
}

function dire(el, msg, kind) { el.textContent = msg; el.dataset.kind = kind; }

export function monterFormulaire(root, surSucces) {
  const slot = root.querySelector("#club-form-slot");
  if (!slot || slot.querySelector("form")) return;

  slot.insertAdjacentHTML("beforeend", `
    <form class="club__form" id="club-form" novalidate>
      <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden" />
      <p class="club__formlede">Une photo ou une vidéo de <b>15 secondes maximum</b>, prise ici. On la regarde, et si elle est bonne elle passe sur le mur.</p>
      <div class="club__row">
        <label class="club__field">
          <span>Ton prénom <i>obligatoire</i></span>
          <input type="text" name="prenom" autocomplete="given-name" maxlength="40" required />
        </label>
        <label class="club__field">
          <span>Légende <i>facultatif</i></span>
          <input type="text" name="legende" maxlength="70" placeholder="Ex. Sparring du jeudi soir" />
        </label>
      </div>
      <p class="club__note">Laisse au moins un moyen de te joindre — c’est comme ça qu’on te prévient quand ta photo passe.</p>
      <div class="club__row">
        <label class="club__field">
          <span>E-mail</span>
          <input type="email" name="email" autocomplete="email" maxlength="160" inputmode="email" />
        </label>
        <label class="club__field">
          <span>Téléphone</span>
          <input type="tel" name="phone" autocomplete="tel" maxlength="30" inputmode="tel" />
        </label>
      </div>
      <label class="club__file">
        <input type="file" name="media" accept="image/*,video/*" required />
        <span class="club__filebtn">Choisir ma photo ou ma vidéo</span>
        <span class="club__filename" id="club-filename">Aucun fichier choisi</span>
      </label>
      <p class="club__hint">Photo ${LIM.imageMo} Mo max · vidéo ${LIM.videoMo} Mo et ${LIM.dureeSec} s max · rien n’est publié avant d’être validé par le staff.</p>
      <div class="club__bar" aria-hidden="true"><i></i></div>
      <div class="club__actions">
        <button class="btn btn--primary" type="submit"><span>Envoyer au staff</span></button>
      </div>
      <p class="club__status" id="club-status" role="status" aria-live="polite"></p>
    </form>`);

  const form = slot.querySelector("#club-form");
  const status = slot.querySelector("#club-status");
  const fileInput = form.querySelector('input[name="media"]');
  const fileName = slot.querySelector("#club-filename");
  const bar = form.querySelector(".club__bar > i");
  const submit = form.querySelector('button[type="submit"]');

  fileInput.addEventListener("change", () => {
    const f = fileInput.files?.[0];
    fileName.textContent = f ? f.name : "Aucun fichier choisi";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const v = (n) => (form.querySelector(`[name="${n}"]`)?.value || "").trim();
    const prenom = v("prenom"), legende = v("legende"), email = v("email"), phone = v("phone");

    if (prenom.length < 2) return dire(status, "Donne ton prénom : sur ce mur, on signe ce qu’on poste.", "err");
    if (grossier(prenom)) return dire(status, "Ce prénom ne passe pas. Mets le vrai, ça ira plus vite.", "err");
    if (legende && grossier(legende)) return dire(status, "Cette légende ne passe pas. Reformule et renvoie.", "err");
    if (email && !EMAIL_RE.test(email)) return dire(status, "Cet e-mail a l’air incomplet. Vérifie-le.", "err");
    if (phone && !TEL_RE.test(phone)) return dire(status, "Ce numéro a l’air incomplet. Vérifie-le.", "err");
    if (!email && !phone) return dire(status, "Laisse un e-mail ou un téléphone — sans ça, on ne peut pas te répondre.", "err");

    const file = fileInput.files?.[0];
    if (!file) return dire(status, "Choisis d’abord une photo ou une vidéo.", "err");

    const estVideo = file.type.startsWith("video/");
    const estImage = file.type.startsWith("image/");
    if (!estVideo && !estImage) return dire(status, "Photo ou vidéo, rien d’autre. Choisis un vrai fichier image ou vidéo.", "err");

    const maxMo = estVideo ? LIM.videoMo : LIM.imageMo;
    if (file.size > maxMo * 1024 * 1024) return dire(status, `Trop lourd : ${maxMo} Mo maximum pour ${estVideo ? "une vidéo" : "une photo"}.`, "err");

    let duree = 0;
    dire(status, "On vérifie le fichier…", "info");
    if (estVideo) {
      try { duree = await dureeVideo(file); }
      catch { return dire(status, "Cette vidéo ne se lit pas. Réenregistre-la et retente.", "err"); }
      if (duree > LIM.dureeSec + 0.5) {
        return dire(status, `${LIM.dureeSec} secondes maximum — la tienne en fait ${Math.round(duree)}. Garde le meilleur passage.`, "err");
      }
    } else if (!(await estVraimentUneImage(file))) {
      return dire(status, "Ce fichier se dit image mais ne s’ouvre pas comme une image. Choisis-en un autre.", "err");
    }

    submit.disabled = true;
    dire(status, "Préparation de l’envoi…", "info");

    let s;
    try {
      /* 0) le defi anti-bot : emis par le serveur, resolu ici en un clin d'oeil */
      const powRes = await fetch("/api/community/sign").then((r) => r.json()).catch(() => null);
      let powNonce = "";
      if (powRes && powRes.challenge) {
        const shaHex = async (x) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(x)))].map((v) => v.toString(16).padStart(2, "0")).join("");
        const prefix = "0".repeat(powRes.difficulty || 4);
        for (let n = 0; ; n++) {
          if ((await shaHex(`${powRes.challenge}:${n}`)).startsWith(prefix)) { powNonce = String(n); break; }
          if (n % 2000 === 1999) await new Promise((r) => setTimeout(r));
        }
      }
      const website = (form.querySelector('input[name="website"]') || {}).value || "";
      const r = await fetch("/api/community/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, legende, email, phone, mime: file.type, octets: file.size, duree, website,
          pow: powRes ? { challenge: powRes.challenge, ts: powRes.ts, sig: powRes.sig, nonce: powNonce } : {} }),
      });
      s = await r.json().catch(() => ({}));
      if (!r.ok) { submit.disabled = false; return dire(status, s.error || "Envoi refusé.", "err"); }
    } catch {
      submit.disabled = false;
      return dire(status, "Le serveur ne répond pas. Retente dans un instant.", "err");
    }

    /* Le fichier part DIRECTEMENT chez Cloudinary avec les paramètres signés.
       Retirer un seul d’entre eux casse la signature — donc le dossier, le
       tag "pending" et la coupe à 15 s ne sont pas négociables côté client. */
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", s.apiKey);
    fd.append("timestamp", String(s.timestamp));
    fd.append("folder", s.folder);
    fd.append("tags", s.tags);
    fd.append("context", s.context);
    if (s.transformation) fd.append("transformation", s.transformation);
    fd.append("signature", s.signature);

    dire(status, "Envoi en cours…", "info");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${s.cloudName}/${s.resourceType}/upload`);
    xhr.upload.onprogress = (ev) => {
      if (bar && ev.lengthComputable) bar.style.width = `${Math.round((ev.loaded / ev.total) * 100)}%`;
    };
    xhr.onload = () => {
      submit.disabled = false;
      if (bar) bar.style.width = "0%";
      if (xhr.status >= 200 && xhr.status < 300) {
        dire(status, `Reçu, ${prenom}. Le staff la regarde — si elle passe, elle sera sur le mur.`, "ok");
        /* LA CAPTURE — le même carnet que l’assistant, pas un deuxième. */
        fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "upload_contributor",
            prenom, email, phone,
            salle: "Saint-Cyprien",
            message: `A déposé ${estVideo ? "une vidéo" : "une photo"} sur le mur du club${legende ? ` — « ${legende} »` : ""}.`,
          }),
        }).catch(() => { /* la capture ne doit JAMAIS gâcher un envoi réussi */ });
        form.reset();
        fileName.textContent = "Aucun fichier choisi";
        surSucces?.();
      } else {
        dire(status, "L’envoi a échoué en route. Retente — le fichier est toujours sur ton téléphone.", "err");
      }
    };
    xhr.onerror = () => {
      submit.disabled = false;
      if (bar) bar.style.width = "0%";
      dire(status, "Connexion perdue pendant l’envoi. Retente quand ça remarche.", "err");
    };
    xhr.send(fd);
  });

  form.querySelector('input[name="prenom"]')?.focus();
}
