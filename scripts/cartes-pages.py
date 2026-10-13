# -*- coding: utf-8 -*-
"""SAINT-CYPRIEN · les vignettes de partage des autres pages (13/10/2026)

Les pages de discipline ont chacune leur carte (scripts/cartes-disciplines.py).
Les neuf autres pages indexées partageaient encore /assets/img/og.jpg, et
/seance-offerte/ n'en avait aucune : un lien vers le planning ou les tarifs
arrivait dans WhatsApp avec la photo de l'accueil. Règle d'Eddy : jamais deux
vignettes identiques, une carte composée pour chaque page.

Même gabarit, mêmes lettres, même filet bleu que les cartes des disciplines (le
module est réutilisé tel quel) ; le texte et la photo de chaque carte viennent
de src/cartes-pages.json, et une photo ne sert jamais deux cartes — ni ici, ni
parmi les cartes des disciplines.

Usage (quand un texte ou une photo change) :
    python scripts/cartes-pages.py
Sortie : public/assets/img/og/pages/<clé>.jpg (versionnées). Après une
régénération, monter ?v= de la carte dans la page concernée.
"""
import importlib.util
import io
import json
import os
import subprocess
import sys
import tempfile

ICI = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("cartes_disciplines", os.path.join(ICI, "cartes-disciplines.py"))
cd = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cd)

RACINE = cd.RACINE
SORTIE = os.path.join(RACINE, "public", "assets", "img", "og", "pages")


def main():
    pages = json.load(io.open(os.path.join(RACINE, "src", "cartes-pages.json"), encoding="utf-8"))["pages"]
    disciplines = json.load(io.open(os.path.join(RACINE, "src", "disciplines-pages.json"), encoding="utf-8"))["pages"]
    vues = {p["photo"]["src"] for p in disciplines.values()}
    titres = {p["og"]["titre"] for p in disciplines.values()}
    os.makedirs(SORTIE, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="cartes-pages-")
    composer = os.path.join(tmp, "composer.cjs")
    io.open(composer, "w", encoding="utf-8").write(cd.COMPOSER)
    for cle, p in pages.items():
        if p["photo"] in vues:
            sys.exit(f"{cle} : la photo {p['photo']} sert déjà une autre carte")
        if p["og"]["titre"] in titres:
            sys.exit(f"{cle} : le titre « {p['og']['titre']} » est déjà celui d'une autre carte")
        vues.add(p["photo"])
        titres.add(p["og"]["titre"])
        photo = os.path.join(RACINE, "public", p["photo"].lstrip("/"))
        svg = os.path.join(tmp, f"{cle}.svg")
        io.open(svg, "w", encoding="utf-8").write(cd.carte(p["og"]))
        sortie = os.path.join(SORTIE, f"{cle}.jpg")
        r = subprocess.run(["node", composer, RACINE, photo, svg, sortie, str(p.get("pos", 45))], capture_output=True, text=True, encoding="utf-8")
        print(f"  {cle:<18} {(r.stdout or r.stderr).strip()}")
        if r.returncode:
            sys.exit(1)


if __name__ == "__main__":
    main()
