# -*- coding: utf-8 -*-
"""SAINT-CYPRIEN · les vignettes de partage des pages de discipline (13/10/2026)

POURQUOI. Les dix pages du site partageaient la même vignette (og.jpg) : un lien
vers la boxe thaï ou vers l'école des enfants arrivait dans WhatsApp avec la même
photo que l'accueil. Règle d'Eddy : une vignette par page, composée pour elle.

CE QUE FAIT CE SCRIPT. Pour chaque page de src/disciplines-pages.json, une carte
1200 x 630 :
  · la photo d'en-tête de la page (jamais celle d'une autre carte), cadrée sur
    le même point que l'en-tête (`photo.pos`) ;
  · un voile qui descend vers le noir du site, pour que le texte tienne ;
  · le titre en Space Grotesk 700 — les vraies lettres du site, lues dans
    public/fonts/ (la police variable est fixée à 700) et converties en
    chemins SVG : même rendu sur toutes les machines ;
  · le sur-titre et les trois faits en IBM Plex Mono, la signature du club,
    et le filet bleu du ring (#2360a0) en pied.
Le texte vient du champ `og` de chaque page ; rien n'est tapé ici.

Usage (une fois, quand un texte `og` ou une photo d'en-tête change) :
    python scripts/cartes-disciplines.py
Les JPEG sortent dans public/assets/img/og/activites/<slug>.jpg et sont
versionnés : le build ne les refait pas (Vercel n'a ni Python ni ces polices
converties). Après une régénération, monter ?v= dans [discipline].astro.
Dépendances locales : fontTools + brotli (Python), sharp (node_modules).
"""
import io
import json
import os
import subprocess
import sys
import tempfile

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

sys.stdout.reconfigure(encoding="utf-8")
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SORTIE = os.path.join(RACINE, "public", "assets", "img", "og", "activites")
L, H = 1200, 630
NOIR, ENCRE, BLEU_CLAIR, BLEU = "#0a0b0e", "#f7f5f9", "#c3d5e8", "#2360a0"
CLUB = "BOXING CENTER · SAINT-CYPRIEN"


class Police:
    """Du texte en chemins SVG, avec les glyphes et le crénage du site."""

    def __init__(self, chemin, graisse=None):
        f = TTFont(chemin)
        if graisse and "fvar" in f:
            f = instancer.instantiateVariableFont(f, {"wght": graisse})
        self.f = f
        self.glyphes = f.getGlyphSet()
        self.cmap = f.getBestCmap()
        self.upem = f["head"].unitsPerEm
        self.paires, self.classes = self._crenage()

    def _crenage(self):
        paires, classes = {}, []
        if "GPOS" not in self.f:
            return paires, classes
        for lookup in getattr(self.f["GPOS"].table.LookupList, "Lookup", []) or []:
            sous = list(lookup.SubTable)
            if lookup.LookupType == 9:  # extension
                sous = [s.ExtSubTable for s in sous]
            for st in sous:
                if getattr(st, "LookupType", 2) != 2 and lookup.LookupType != 9:
                    continue
                if getattr(st, "Format", None) == 1 and getattr(st, "PairSet", None):
                    for g1, ps in zip(st.Coverage.glyphs, st.PairSet):
                        for rec in ps.PairValueRecord:
                            v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 else 0
                            if v:
                                paires[(g1, rec.SecondGlyph)] = v
                elif getattr(st, "Format", None) == 2:
                    classes.append((set(st.Coverage.glyphs), st.ClassDef1.classDefs, st.ClassDef2.classDefs, st.Class1Record))
        return paires, classes

    def kern(self, a, b):
        if (a, b) in self.paires:
            return self.paires[(a, b)]
        for couverture, c1, c2, recs in self.classes:
            if a in couverture:
                r = recs[c1.get(a, 0)].Class2Record[c2.get(b, 0)]
                v = getattr(r.Value1, "XAdvance", 0) if r.Value1 else 0
                if v:
                    return v
        return 0

    def _course(self, txt, taille, inter):
        e = taille / self.upem
        x, prec = 0.0, None
        for ch in txt:
            g = self.cmap.get(ord(ch))
            if g is None:
                # Un caractère absent de la police (la flèche « → » en IBM Plex
                # Mono latin) sortait en blanc sans prévenir : on refuse.
                raise ValueError(f"« {ch} » (U+{ord(ch):04X}) n'existe pas dans la police : réécris « {txt} »")
            if prec is not None:
                x += self.kern(prec, g) * e
            yield g, x
            x += self.glyphes[g].width * e + taille * inter
            prec = g
        yield None, x

    def mesure(self, txt, taille, inter=0.0):
        return list(self._course(txt, taille, inter))[-1][1]

    def chemin(self, txt, x, y, taille, inter=0.0):
        e = taille / self.upem
        d = []
        for g, dx in self._course(txt, taille, inter):
            if g is None:
                continue
            pen = SVGPathPen(self.glyphes)
            self.glyphes[g].draw(pen)
            trace = pen.getCommands()
            if trace:
                d.append(f'<g transform="translate({x + dx:.2f} {y:.2f}) scale({e:.6f} {-e:.6f})"><path d="{trace}"/></g>')
        return "".join(d)


TITRE = Police(os.path.join(RACINE, "public", "fonts", "space-grotesk-latin.woff2"), 700)
MONO = Police(os.path.join(RACINE, "public", "fonts", "ibm-plex-mono-latin-600.woff2"))


def couper(txt, police, taille, largeur, inter):
    mots, lignes, cur = txt.split(), [], ""
    for m in mots:
        essai = (cur + " " + m).strip()
        if police.mesure(essai, taille, inter) <= largeur or not cur:
            cur = essai
        else:
            lignes.append(cur)
            cur = m
    if cur:
        lignes.append(cur)
    return lignes


def carte(og):
    inter_titre = -0.03
    taille = 74
    lignes = couper(og["titre"], TITRE, taille, L - 170, inter_titre)
    while len(lignes) > 2 and taille > 54:
        taille -= 4
        lignes = couper(og["titre"], TITRE, taille, L - 170, inter_titre)
    pas = taille * 1.04
    y_fin = H - 138
    y0 = y_fin - (len(lignes) - 1) * pas
    corps = [f'<g fill="{ENCRE}">' + "".join(TITRE.chemin(ln, 72, y0 + i * pas, taille, inter_titre) for i, ln in enumerate(lignes)) + "</g>"]
    # sur-titre : le point bleu de l'eyebrow du site, puis la ligne en mono
    y_sur = y0 - taille - 22
    corps.append(f'<circle cx="78" cy="{y_sur - 8:.1f}" r="6" fill="{BLEU_CLAIR}"/>')
    corps.append(f'<g fill="{BLEU_CLAIR}">{MONO.chemin(og["sur"], 98, y_sur, 21, 0.12)}</g>')
    # les faits : trois pastilles
    x, yf = 72, H - 58
    for fait in og["faits"]:
        w = MONO.mesure(fait, 22, 0.02)
        corps.append(f'<rect x="{x - 16:.0f}" y="{yf - 28}" width="{w + 32:.0f}" height="42" rx="21" fill="{NOIR}" fill-opacity=".55" stroke="{ENCRE}" stroke-opacity=".38"/>')
        corps.append(f'<g fill="{ENCRE}">{MONO.chemin(fait, x, yf, 22, 0.02)}</g>')
        x += w + 52
    # la signature, sur une plaque sombre
    wc = MONO.mesure(CLUB, 17, 0.16)
    corps.append(f'<rect x="{L - 100 - wc:.0f}" y="46" width="{wc + 52:.0f}" height="38" rx="19" fill="{NOIR}" fill-opacity=".62"/>')
    corps.append(f'<g fill="{ENCRE}">{MONO.chemin(CLUB, L - 74 - wc, 71, 17, 0.16)}</g>')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{L}" height="{H}" viewBox="0 0 {L} {H}">
  <defs>
    <linearGradient id="voile" x1="0" y1="1" x2=".85" y2="0">
      <stop offset="0" stop-color="{NOIR}" stop-opacity=".96"/>
      <stop offset=".45" stop-color="{NOIR}" stop-opacity=".78"/>
      <stop offset=".8" stop-color="#14375c" stop-opacity=".22"/>
      <stop offset="1" stop-color="#14375c" stop-opacity=".05"/>
    </linearGradient>
    <linearGradient id="pied" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{NOIR}" stop-opacity="0"/>
      <stop offset="1" stop-color="{NOIR}" stop-opacity=".9"/>
    </linearGradient>
  </defs>
  <rect width="{L}" height="{H}" fill="url(#voile)"/>
  <rect y="{H - 250}" width="{L}" height="250" fill="url(#pied)"/>
  <rect y="{H - 8}" width="{L}" height="8" fill="{BLEU}"/>
  {"".join(corps)}
</svg>'''


COMPOSER = r"""
const { createRequire } = require("module");
const fs = require("fs");
const sharp = createRequire(process.argv[2] + "/package.json")("sharp");
const [, , , photo, svg, sortie, posY] = process.argv;
(async () => {
  const meta = await sharp(photo).metadata();
  /* Le cadrage suit celui de l'en-tête : `pos` = "50% 40%" -> la bande
     1200x630 est centrée à 40 % de la hauteur de la photo. */
  const ratio = 1200 / 630;
  let w = meta.width, h = Math.round(meta.width / ratio);
  if (h > meta.height) { h = meta.height; w = Math.round(h * ratio); }
  const top = Math.max(0, Math.min(meta.height - h, Math.round((meta.height - h) * (Number(posY) / 100))));
  const left = Math.round((meta.width - w) / 2);
  const fond = await sharp(photo).extract({ left, top, width: w, height: h }).resize(1200, 630).modulate({ brightness: 1.03 }).toBuffer();
  await sharp(fond).composite([{ input: fs.readFileSync(svg), top: 0, left: 0 }]).jpeg({ quality: 84, mozjpeg: true }).toFile(sortie);
  const m = await sharp(sortie).metadata();
  console.log(`${m.width}x${m.height} ${Math.round(fs.statSync(sortie).size / 1024)} ko`);
})().catch((e) => { console.error(e.message); process.exit(1); });
"""


def main():
    textes = json.load(io.open(os.path.join(RACINE, "src", "disciplines-pages.json"), encoding="utf-8"))["pages"]
    os.makedirs(SORTIE, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="cartes-")
    composer = os.path.join(tmp, "composer.cjs")
    io.open(composer, "w", encoding="utf-8").write(COMPOSER)
    vues = set()
    for cle, p in textes.items():
        photo = os.path.join(RACINE, "public", p["photo"]["src"].lstrip("/"))
        if p["photo"]["src"] in vues:
            sys.exit(f"{cle} : la photo {p['photo']['src']} sert déjà une autre carte")
        vues.add(p["photo"]["src"])
        pos_y = float(str(p["photo"].get("pos", "50% 45%")).split()[1].rstrip("%"))
        svg = os.path.join(tmp, f"{cle}.svg")
        io.open(svg, "w", encoding="utf-8").write(carte(p["og"]))
        sortie = os.path.join(SORTIE, f"{p['slug']}.jpg")
        r = subprocess.run(["node", composer, RACINE, photo, svg, sortie, str(pos_y)], capture_output=True, text=True, encoding="utf-8")
        print(f"  {p['slug']:<22} {(r.stdout or r.stderr).strip()}")
        if r.returncode:
            sys.exit(1)


if __name__ == "__main__":
    main()
