"""SAINT-CYPRIEN · scripts/produits-images.py — les photos du matériel (13/10/2026)

Eddy, 13/10 : « these products should have their images. the images matter even more
than the text. » Les cartes « Le matériel du cours » montrent la photo de la fiche
box-plus (la boutique du club), copiée ICI : aucune image chargée depuis un autre
domaine.

Les photos du fournisseur arrivent sur des fonds différents (blanc pur, gris de
studio, dégradé) : posées telles quelles, chaque carte dessine son propre
rectangle. Le script retire le fond (rembg, modèle u2net en cache local, rien
n'est téléchargé hors des photos), recadre chaque objet à la même échelle et le
pose sur la même ligne de sol. La scène (lumière, sol, ombre qui s'écrase quand
l'objet se soulève) est dessinée en CSS : une seule pour tout le catalogue.

Deux modes, détectés seuls :
  pose   l'objet est entier : recadré sur sa silhouette, ramené à 78 % du carré,
         posé sur la ligne de sol à 88 % de la hauteur ;
  cadre  le sujet touche un bord (le débardeur porté) : il reste ancré à ce bord,
         sans sol ni ombre — un torse « debout sur une ombre » serait pire.

Lancé à la main quand le catalogue change (pas au build : Vercel n'a ni rembg ni
le modèle) :  python scripts/produits-images.py
Sorties : public/assets/img/sc/produits/<slug>-360.webp et -720.webp (transparents)
          src/produits-images.json (mode, luminance, source, date du relevé)
Contrôle : une planche dans .research/ (non versionné) à regarder AVANT de publier.
"""
import io
import json
import os
import sys
import urllib.request
from datetime import date

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SORTIE = os.path.join(ROOT, "public", "assets", "img", "sc", "produits")
MANIFESTE = os.path.join(ROOT, "src", "produits-images.json")
PLANCHE = os.path.join(ROOT, ".research", "planche-produits.png")
TAILLES = (720, 360)
BOITE = 0.78   # part du carré occupée par l'objet posé
SOL = 0.88     # ligne de sol, en fraction de la hauteur

# slug de la fiche box-plus → photo principale de la fiche (relevé du 12/10/2026)
PHOTOS = {
    "gants-boxe-blade-noir-blanc": "https://boutique.boxingcenter.fr/img/materiel/rentree/blade/blade-nb-01.jpg",
    "gants-ergo-90-mbg301k14": "https://boutique.boxingcenter.fr/img/materiel/rentree/ergo/ergo-01.jpg",
    "gants-sparring-mbgan010n14-16oz": "https://boutique.boxingcenter.fr/img/materiel/rentree/sparring/sparring-01.jpg",
    "bandes-4m-mb120bt": "https://boutique.boxingcenter.fr/img/materiel/rentree/bandes/bandes-4m-01.jpg",
    "bandes-2m50-mb120t": "https://boutique.boxingcenter.fr/img/materiel/rentree/bandes/bandes-250-01.jpg",
    "protege-dents-adulte-mbpro458srt": "https://boutique.boxingcenter.fr/img/materiel/rentree/dents/dents-adulte-01.jpg",
    "gants-boxe-enfant-one": "https://boutique.boxingcenter.fr/img/materiel/rentree/one/one-official.jpg",
    "ensemble-enfants-short-debardeur": "https://boutique.boxingcenter.fr/img/materiel/rentree/ensemble/ensemble-cadre.jpg",
    "debardeur-entrainement-metal-boxe-training-tank": "https://boutique.boxingcenter.fr/img/materiel/rentree/debardeur/debardeur-cadre-01.jpg",
    "protege-dents-enfants-mb459jrw": "https://boutique.boxingcenter.fr/img/materiel/rentree/dents/dents-enfant-01.png",
    "protege-tibias-pieds-coton-mb153wm": "https://boutique.boxingcenter.fr/img/materiel/rentree/tibias/tibias-blanc-01.jpg",
}


def telecharger(url: str) -> Image.Image:
    req = urllib.request.Request(url, headers={"User-Agent": "BoxingCenterSaintCyprien/1.0 (site du club)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return Image.open(io.BytesIO(r.read())).convert("RGB")


def nettoyer_alpha(a: np.ndarray) -> np.ndarray:
    """Le voile laissé par le fond tombe à zéro, le plein devient plein, le bord s'adoucit d'un pixel."""
    a = np.clip((a.astype(np.float32) - 30.0) * (255.0 / (232.0 - 30.0)), 0, 255).astype(np.uint8)
    return np.asarray(Image.fromarray(a).filter(ImageFilter.GaussianBlur(0.6)))


def elaguer(a: np.ndarray, cadre: bool) -> np.ndarray:
    """Retire les fragments (poussière, bout de décor) ; garde une paire entière (deux gants, deux bandes)."""
    import cv2

    n, labels, stats, _ = cv2.connectedComponentsWithStats((a > 60).astype(np.uint8), connectivity=8)
    if n <= 2:
        return a
    h, w = a.shape
    aires = stats[1:, cv2.CC_STAT_AREA]
    principal = int(aires.max())
    garder = np.zeros(n, dtype=bool)
    for i in range(1, n):
        aire = int(stats[i, cv2.CC_STAT_AREA])
        x, y, bw, bh = (int(stats[i, k]) for k in (cv2.CC_STAT_LEFT, cv2.CC_STAT_TOP, cv2.CC_STAT_WIDTH, cv2.CC_STAT_HEIGHT))
        au_bord = x <= 2 or y <= 2 or x + bw >= w - 2 or y + bh >= h - 2
        garder[i] = aire == principal or (aire >= 0.25 * principal if (cadre and au_bord) else aire >= 0.015 * principal)
    masque = cv2.dilate(garder[labels].astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    out = a.copy()
    out[~masque] = 0
    return out


def part_gardee(rgb: np.ndarray, a: np.ndarray):
    """Sur un fond uni, part des pixels « produit » que la découpe a gardés (None si le fond n'est pas uni)."""
    bord = np.concatenate([rgb[:6].reshape(-1, 3), rgb[-6:].reshape(-1, 3), rgb[:, :6].reshape(-1, 3), rgb[:, -6:].reshape(-1, 3)]).astype(np.float32)
    if bord.std(axis=0).max() > 9:
        return None
    fond = np.median(bord, axis=0)
    visible = np.abs(rgb.astype(np.float32) - fond).max(axis=2) > 30
    if visible.sum() < 600:
        return None
    return float(((a > 128) & visible).sum() / visible.sum())


def mesurer(rgba: np.ndarray):
    a = rgba[..., 3]
    plein = a > 128
    if plein.sum() < 400:
        return None
    ys, xs = np.where(a > 24)
    bords = {
        "haut": (a[:3] > 128).mean() > 0.06,
        "bas": (a[-3:] > 128).mean() > 0.06,
        "gauche": (a[:, :3] > 128).mean() > 0.06,
        "droite": (a[:, -3:] > 128).mean() > 0.06,
    }
    rgb = rgba[..., :3][plein].astype(np.float32)
    lum = float((0.2126 * rgb[:, 0] + 0.7152 * rgb[:, 1] + 0.0722 * rgb[:, 2]).mean() / 255)
    return {
        "bbox": (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1),
        "bords": [k for k, v in bords.items() if v],
        "lum": round(lum, 3),
        "couverture": float(plein.mean()),
    }


def composer(img: Image.Image, info, taille: int) -> Image.Image:
    toile = Image.new("RGBA", (taille, taille), (0, 0, 0, 0))
    if info["bords"]:
        w, h = img.size
        k = taille / max(w, h)
        im = img.resize((max(1, round(w * k)), max(1, round(h * k))), Image.LANCZOS)
        x = (taille - im.width) // 2
        y = taille - im.height if "bas" in info["bords"] else 0 if "haut" in info["bords"] else (taille - im.height) // 2
        toile.alpha_composite(im, (x, y))
        return toile
    objet = img.crop(info["bbox"])
    k = min(taille * BOITE / objet.width, taille * BOITE / objet.height)
    im = objet.resize((max(1, round(objet.width * k)), max(1, round(objet.height * k))), Image.LANCZOS)
    toile.alpha_composite(im, ((taille - im.width) // 2, max(0, round(taille * SOL) - im.height)))
    return toile


def sans_lisere(img: Image.Image) -> Image.Image:
    """Le bord recule d'un pixel puis s'adoucit : plus de halo blanc du studio sur la scène teintée."""
    r, g, b, a = img.split()
    return Image.merge("RGBA", (r, g, b, a.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))))


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    os.environ.setdefault("OMP_NUM_THREADS", "4")
    from rembg import new_session, remove

    os.makedirs(SORTIE, exist_ok=True)
    session = new_session("u2net")
    manifeste, ecartes = {}, []
    for slug, url in PHOTOS.items():
        src = telecharger(url)
        out = np.asarray(remove(src, session=session, post_process_mask=True)).copy()
        out[..., 3] = nettoyer_alpha(out[..., 3])
        premier = mesurer(out)
        if not premier:
            ecartes.append((slug, "sujet introuvable"))
            continue
        out[..., 3] = elaguer(out[..., 3], cadre=bool(premier["bords"]))
        part = part_gardee(np.asarray(src), out[..., 3])
        if part is not None and part < 0.62:
            ecartes.append((slug, f"découpe incomplète ({part:.0%} du produit gardé)"))
            continue
        info = mesurer(out)
        if not info or info["couverture"] > 0.93:
            ecartes.append((slug, "fond non séparé"))
            continue
        grand = sans_lisere(composer(Image.fromarray(out), info, TAILLES[0]))
        for t in TAILLES:
            (grand if t == TAILLES[0] else grand.resize((t, t), Image.LANCZOS)).save(
                os.path.join(SORTIE, f"{slug}-{t}.webp"), "WEBP", quality=84, method=4)
        manifeste[slug] = {"mode": "cadre" if info["bords"] else "pose", "lum": info["lum"], "source": url, "releve": "2026-10-12"}
        print(f"✓ {slug} · {manifeste[slug]['mode']} · lum {info['lum']}", flush=True)

    json.dump({"genere": date.today().isoformat(), "produits": dict(sorted(manifeste.items()))},
              open(MANIFESTE, "w", encoding="utf-8", newline="\n"), ensure_ascii=False, indent=1)

    # Planche de contrôle : chaque découpe sur la scène claire et sur la scène sombre.
    T = 240
    ids = sorted(manifeste)
    planche = Image.new("RGB", (len(ids) * T, 2 * T), (0, 0, 0))
    for i, slug in enumerate(ids):
        im = Image.open(os.path.join(SORTIE, f"{slug}-360.webp")).convert("RGBA").resize((T, T), Image.LANCZOS)
        for row, fond in enumerate(((236, 240, 246, 255), (20, 22, 28, 255))):
            tuile = Image.new("RGBA", (T, T), fond)
            tuile.alpha_composite(im)
            planche.paste(tuile.convert("RGB"), (i * T, row * T))
    os.makedirs(os.path.dirname(PLANCHE), exist_ok=True)
    planche.save(PLANCHE)
    print(json.dumps({"detourees": len(manifeste), "ecartees": ecartes, "planche": PLANCHE}, ensure_ascii=False))
    return 1 if ecartes else 0


if __name__ == "__main__":
    sys.exit(main())
